from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from django.db.models import Count
from django.utils import timezone
from .models import Favorite, Report, SearchLog, Listing, Profile, ListingImage
from .serializers import (
    FavoriteSerializer, ListingSerializer, ProfileSerializer,
    RegisterSerializer, ListingImageSerializer, SearchLogSerializer
)
from .embeddings import generate_embedding, suggest_category
from pgvector.django import CosineDistance
import hmac
import hashlib
import time
import uuid
import os


@api_view(['POST'])
@permission_classes([AllowAny])
def category_suggestion(request):
    text = request.data.get('text', '').strip()
    if not text:
        return Response({"error": "No text provided"}, status=400)

    category = suggest_category(text)
    return Response({"suggested_category": category})


@api_view(['GET'])
def semantic_search(request):
    query = request.GET.get('q', '').strip()
    if not query:
        return Response({"results": []})

    now = timezone.now()
    query_vector = generate_embedding(query)

    results = (
        Listing.objects
        .filter(status='active')
        .exclude(embedding__isnull=True)
        .exclude(seller__profile__is_seller=True, seller__profile__subscription_status='expired')
        .exclude(seller__profile__is_seller=True, seller__profile__subscription_status='trial', seller__profile__trial_ends_at__lte=now)
        .annotate(distance=CosineDistance('embedding', query_vector))
        .order_by('distance')[:20]
    )

    results_count = len(results)
    # Log every search
    user = request.user if request.user.is_authenticated else None
    SearchLog.objects.create(
        user=user,
        query=query,
        results_count=results_count
    )

    serializer = ListingSerializer(results, many=True)
    return Response({"results": serializer.data})


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "Account created successfully", "username": user.username},
            status=status.HTTP_201_CREATED
        )


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        now = timezone.now()
        # Allow seller to manage (delete/update) any of their own listings regardless of status
        if getattr(self, 'action', None) in ['destroy', 'update', 'partial_update']:
            if self.request.user.is_authenticated:
                return Listing.objects.filter(seller=self.request.user)
            return Listing.objects.none()

        return (
            Listing.objects
            .filter(status='active')
            .exclude(seller__profile__is_seller=True, seller__profile__subscription_status='expired')
            .exclude(seller__profile__is_seller=True, seller__profile__subscription_status='trial', seller__profile__trial_ends_at__lte=now)
            .order_by('-created_at')
        )

    def perform_create(self, serializer):
        profile = getattr(self.request.user, 'profile', None)
        if not profile or not profile.is_seller:
            raise PermissionDenied("Only registered sellers can post listings.")
        profile.enforce_subscription()
        if not profile.can_post_listings:
            raise PermissionDenied(
                "Your 14-day free trial has expired. Please subscribe to continue posting listings."
            )
        serializer.save(seller=self.request.user)

    def perform_destroy(self, instance):
        if instance.seller != self.request.user:
            raise PermissionDenied("You can only delete your own listings.")
        instance.delete()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Returns current user info with their role answered directly from the database:
    - Admin: Django is_staff (created only via createsuperuser)
    - Seller: profile.is_seller is True
    - Customer: all other users
    """
    user = request.user
    profile = getattr(user, 'profile', None)

    if user.is_staff:
        role = 'admin'
    elif profile and profile.is_seller:
        role = 'seller'
    else:
        role = 'customer'

    if profile and profile.is_seller:
        profile.enforce_subscription()

    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': role,
        'is_staff': user.is_staff,
        'is_seller': profile.is_seller if profile else False,
    }

    if profile:
        profile_data = ProfileSerializer(profile).data
        data['profile'] = profile_data
        data['phone_number'] = profile.phone_number
        data['university'] = profile.university
        data['hall_residence'] = profile.hall_residence
        data['faculty'] = profile.faculty
        data['year_of_study'] = profile.year_of_study
        data['is_verified'] = profile.is_verified
        data['trial_ends_at'] = profile.trial_ends_at
        data['subscription_status'] = profile.subscription_status
        data['is_trial_active'] = profile.is_trial_active
        data['is_subscription_active'] = profile.is_subscription_active
        data['is_expired'] = profile.is_expired
        data['can_post_listings'] = profile.can_post_listings
        data['days_remaining'] = profile.days_remaining
    else:
        data['profile'] = None

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats_view(request):
    """
    Admin-only endpoint returning analytics dashboard statistics.
    Requires Django is_staff (IsAdminUser). Customers and sellers receive 403 Forbidden.
    """
    total_users = User.objects.count()
    admin_users = User.objects.filter(is_staff=True).count()
    sellers = Profile.objects.filter(is_seller=True).count()
    customers = User.objects.filter(is_staff=False).exclude(profile__is_seller=True).count()

    active_subscriptions = Profile.objects.filter(is_seller=True, subscription_status='active').count()
    trial_sellers = Profile.objects.filter(is_seller=True, subscription_status='trial').count()
    expired_sellers = Profile.objects.filter(is_seller=True, subscription_status='expired').count()

    total_listings = Listing.objects.count()
    active_listings = Listing.objects.filter(status='active').count()
    sold_listings = Listing.objects.filter(status='sold').count()
    hidden_listings = Listing.objects.filter(status='hidden').count()

    categories_breakdown = list(
        Listing.objects.values('category')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    total_searches = SearchLog.objects.count()
    top_queries = list(
        SearchLog.objects.values('query')
        .annotate(count=Count('id'))
        .order_by('-count')[:10]
    )
    recent_searches = list(
        SearchLog.objects.order_by('-created_at')
        .values('id', 'query', 'results_count', 'created_at', 'user__username')[:20]
    )

    total_reports = Report.objects.count()
    pending_reports = Report.objects.filter(status='pending').count()

    return Response({
        "users": {
            "total": total_users,
            "admins": admin_users,
            "sellers": sellers,
            "customers": customers,
        },
        "subscriptions": {
            "active": active_subscriptions,
            "trial": trial_sellers,
            "expired": expired_sellers,
        },
        "listings": {
            "total": total_listings,
            "active": active_listings,
            "sold": sold_listings,
            "hidden": hidden_listings,
            "by_category": categories_breakdown,
        },
        "searches": {
            "total": total_searches,
            "top_queries": top_queries,
            "recent": recent_searches,
        },
        "reports": {
            "total": total_reports,
            "pending": pending_reports,
        }
    })


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        return me_view(request._request)


class ListingImageViewSet(viewsets.ModelViewSet):
    queryset = ListingImage.objects.all()
    serializer_class = ListingImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        listing = serializer.validated_data['listing']
        if listing.seller != self.request.user:
            raise PermissionDenied("You can only add images to your own listings.")
        serializer.save()


@api_view(['GET'])
def imagekit_auth(request):
    private_key = os.environ.get('IMAGEKIT_PRIVATE_KEY', '')
    token = str(uuid.uuid4())
    expire = int(time.time()) + 2400  # 40 minutes from now

    signature = hmac.new(
        key=private_key.encode('utf-8'),
        msg=(token + str(expire)).encode('utf-8'),
        digestmod=hashlib.sha1
    ).hexdigest()

    return Response({
        "token": token,
        "expire": expire,
        "signature": signature,
    })

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_listings(request):
    listings = Listing.objects.filter(seller=request.user).order_by('-created_at')
    serializer = ListingSerializer(listings, many=True)
    return Response(serializer.data)
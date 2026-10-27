from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ListingViewSet, ProfileViewSet, RegisterView, semantic_search,
    ListingImageViewSet, imagekit_auth, category_suggestion,
    FavoriteViewSet, my_listings, me_view, admin_stats_view,
)

router = DefaultRouter()
router.register(r'listings', ListingViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'listing-images', ListingImageViewSet)
router.register(r'favorites', FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('me/', me_view, name='me'),
    path('admin/stats/', admin_stats_view, name='admin_stats'),
    path('register/', RegisterView.as_view(), name='register'),
    path('search/', semantic_search, name='semantic_search'),
    path('imagekit-auth/', imagekit_auth, name='imagekit_auth'),
    path('suggest-category/', category_suggestion, name='category_suggestion'),
    path('my-listings/', my_listings, name='my_listings'),
] + router.urls
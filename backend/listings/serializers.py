from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Listing, ListingImage, Profile, Favorite, Report, SearchLog


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image_url', 'sort_order']


class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    seller_username = serializers.ReadOnlyField(source='seller.username')
    seller_phone = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'category', 'condition',
            'price', 'hall_location', 'seller_username', 'seller_phone',
            'status', 'created_at', 'images'
        ]
        read_only_fields = ['id', 'seller', 'status', 'created_at']

    def get_seller_phone(self, obj):
        profile = getattr(obj.seller, 'profile', None)
        return profile.phone_number if profile else None


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    days_remaining = serializers.ReadOnlyField()
    is_trial_active = serializers.ReadOnlyField()
    is_subscription_active = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    can_post_listings = serializers.ReadOnlyField()

    class Meta:
        model = Profile
        fields = [
            'id', 'username', 'email', 'phone_number', 'university',
            'hall_residence', 'faculty', 'year_of_study', 'is_seller',
            'is_verified', 'trial_ends_at', 'subscription_status',
            'days_remaining', 'is_trial_active', 'is_subscription_active',
            'is_expired', 'can_post_listings'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    is_seller = serializers.BooleanField(default=False)
    hall_residence = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'phone_number', 'is_seller', 'hall_residence']

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number', '')
        is_seller = validated_data.pop('is_seller', False)
        hall_residence = validated_data.pop('hall_residence', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

        Profile.objects.create(
            user=user,
            email=user.email,
            phone_number=phone_number,
            is_seller=is_seller,
            hall_residence=hall_residence
        )

        return user


class FavoriteSerializer(serializers.ModelSerializer):
    listing_detail = ListingSerializer(source='listing', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'listing', 'listing_detail', 'created_at']
        read_only_fields = ['id', 'created_at']


class SearchLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchLog
        fields = ['id', 'query', 'results_count', 'created_at']

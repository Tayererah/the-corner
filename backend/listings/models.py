from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from pgvector.django import VectorField


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    university = models.CharField(max_length=120, blank=True)
    hall_residence = models.CharField(max_length=100, blank=True)
    faculty = models.CharField(max_length=100, blank=True)
    year_of_study = models.PositiveSmallIntegerField(null=True, blank=True)
    is_seller = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    subscription_status = models.CharField(
        max_length=20,
        choices=[('trial', 'Trial'), ('active', 'Active'), ('expired', 'Expired')],
        default='trial'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        from datetime import timedelta
        if self.is_seller and not self.trial_ends_at and self.subscription_status == 'trial':
            self.trial_ends_at = timezone.now() + timedelta(days=14)
        super().save(*args, **kwargs)

    @property
    def is_trial_active(self):
        if not self.is_seller:
            return False
        return self.subscription_status == 'trial' and bool(self.trial_ends_at and self.trial_ends_at > timezone.now())

    @property
    def is_subscription_active(self):
        return self.subscription_status == 'active'

    @property
    def is_expired(self):
        if not self.is_seller:
            return False
        if self.subscription_status == 'expired':
            return True
        if self.subscription_status == 'trial' and self.trial_ends_at and self.trial_ends_at <= timezone.now():
            return True
        return False

    @property
    def can_post_listings(self):
        if not self.is_seller:
            return False
        return self.is_subscription_active or self.is_trial_active

    @property
    def days_remaining(self):
        if not self.is_seller:
            return None
        if self.subscription_status == 'active':
            return None
        if self.trial_ends_at:
            delta = self.trial_ends_at - timezone.now()
            return max(0, delta.days)
        return 0

    def enforce_subscription(self):
        """
        Enforces trial expiration:
        - Applied to sellers only.
        - If trial period has ended without payment, marks profile as 'expired'
          and hides all active listings.
        - If subscription is 'active', restores previously hidden listings.
        """
        if not self.is_seller:
            return {'status': 'exempt', 'changes': 0}

        now = timezone.now()
        if self.subscription_status == 'trial' and self.trial_ends_at and self.trial_ends_at <= now:
            self.subscription_status = 'expired'
            self.save(update_fields=['subscription_status'])
            hidden_count = self.user.listings.filter(status='active').update(
                status='hidden',
                hidden_reason='Trial expired'
            )
            return {'status': 'expired', 'listings_hidden': hidden_count}

        if self.subscription_status == 'active':
            restored_count = self.user.listings.filter(
                status='hidden',
                hidden_reason='Trial expired'
            ).update(
                status='active',
                hidden_reason=''
            )
            return {'status': 'active', 'listings_restored': restored_count}

        return {'status': self.subscription_status, 'changes': 0}


class Listing(models.Model):
    CONDITION_CHOICES = [
    ('new', 'Brand New'),
    ('like_new', 'Like New'),
    ('good', 'Good'),
    ('fair', 'Fair'),
    ('service', 'Service'),
]
    
    STATUS_CHOICES = [('active', 'Active'), ('sold', 'Sold'), ('hidden', 'Hidden'), ('removed', 'Removed')]

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    hall_location = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    hidden_reason = models.CharField(max_length=100, blank=True)
    embedding = VectorField(dimensions=384, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        from .embeddings import generate_embedding
        text = f"{self.title} {self.description} {self.category}"
        self.embedding = generate_embedding(text)
        super().save(*args, **kwargs)


class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    sort_order = models.PositiveSmallIntegerField(default=0)


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')


class Report(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    reason = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('reviewed', 'Reviewed'), ('action_taken', 'Action Taken')],
        default='pending'
    )       
    created_at = models.DateTimeField(auto_now_add=True)


class SearchLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='search_logs')
    query = models.CharField(max_length=255)
    results_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.query} ({self.results_count} results)"

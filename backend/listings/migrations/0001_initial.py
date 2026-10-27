from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import pgvector.django


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('listings', '0000_enable_pgvector'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, unique=True)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True, unique=True)),
                ('university', models.CharField(blank=True, max_length=120)),
                ('hall_residence', models.CharField(blank=True, max_length=100)),
                ('faculty', models.CharField(blank=True, max_length=100)),
                ('year_of_study', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('is_seller', models.BooleanField(default=False)),
                ('is_verified', models.BooleanField(default=False)),
                ('trial_ends_at', models.DateTimeField(blank=True, null=True)),
                ('subscription_status', models.CharField(
                    choices=[('trial', 'Trial'), ('active', 'Active'), ('expired', 'Expired')],
                    default='trial', max_length=20
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='auth.user')),
            ],
        ),
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('category', models.CharField(max_length=50)),
                ('condition', models.CharField(
                    choices=[
                        ('new', 'Brand New'), ('like_new', 'Like New'), ('good', 'Good'),
                        ('fair', 'Fair'), ('service', 'Service')
                    ], max_length=20
                )),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('hall_location', models.CharField(blank=True, max_length=100)),
                ('status', models.CharField(
                    choices=[
                        ('active', 'Active'), ('sold', 'Sold'), ('hidden', 'Hidden'), ('removed', 'Removed')
                    ], default='active', max_length=10
                )),
                ('hidden_reason', models.CharField(blank=True, max_length=100)),
                ('embedding', pgvector.django.VectorField(blank=True, dimensions=384, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('seller', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='listings', to='auth.user'
                )),
            ],
        ),
        migrations.CreateModel(
            name='ListingImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_url', models.URLField()),
                ('sort_order', models.PositiveSmallIntegerField(default=0)),
                ('listing', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='images', to='listings.listing'
                )),
            ],
        ),
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.user')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='listings.listing')),
            ],
            options={
                'unique_together': {('user', 'listing')},
            },
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.CharField(max_length=255)),
                ('status', models.CharField(
                    choices=[
                        ('pending', 'Pending'), ('reviewed', 'Reviewed'), ('action_taken', 'Action Taken')
                    ], default='pending', max_length=20
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('reporter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.user')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='listings.listing')),
            ],
        ),
        migrations.CreateModel(
            name='SearchLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(max_length=255)),
                ('results_count', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(
                    blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL,
                    related_name='search_logs', to='auth.user'
                )),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]

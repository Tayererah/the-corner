from django.db import migrations


class Migration(migrations.Migration):
    """Enable pgvector extension — must run before any model migration."""

    dependencies = []

    operations = [
        migrations.RunSQL(
            sql="CREATE EXTENSION IF NOT EXISTS vector;",
            reverse_sql="DROP EXTENSION IF EXISTS vector;",
        )
    ]

# Generated by Django 5.1 on 2024-09-21 08:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Mymusic',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('album', models.CharField(max_length=255)),
                ('artist', models.CharField(max_length=50)),
                ('release', models.DateField(blank=True, null=True)),
                ('date', models.DateField(blank=True, null=True)),
                ('asset', models.PositiveIntegerField(blank=True, null=True)),
                ('image', models.URLField(blank=True, null=True)),
                ('memo', models.TextField(blank=True, null=True)),
                ('spotifylink', models.URLField(blank=True, null=True)),
                ('applelink', models.URLField(blank=True, null=True)),
                ('co_artist', models.CharField(blank=True, max_length=255, null=True)),
                ('is_fav', models.BooleanField(default=False)),
                ('href', models.URLField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mymusic_set', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

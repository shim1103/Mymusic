# Generated by Django 5.1 on 2024-09-16 03:09

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotifyapi', '0010_alter_spotifytoken_token_expiry'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='token_expiry',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 16, 4, 9, 20, 887446, tzinfo=datetime.timezone.utc)),
        ),
    ]

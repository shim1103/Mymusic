# Generated by Django 5.1 on 2024-09-21 08:10

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotifyapi', '0022_alter_spotifytoken_token_expiry'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='token_expiry',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 21, 9, 10, 0, 179236, tzinfo=datetime.timezone.utc)),
        ),
    ]

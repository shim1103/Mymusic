from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import models

class CustomUser(AbstractUser):
    username_validator = ASCIIUsernameValidator()
    username = models.EmailField(unique=True, validators=[username_validator])
    tell = models.CharField(max_length=15)

    USERNAME_FIELD ='username'
    REQUIRED_FIELDS=[]


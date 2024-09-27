from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from account.models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('tell',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('tell',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)

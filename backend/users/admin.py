from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User

    # Поля, отображаемые в списке
    list_display = (
        "id",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "is_active",
        "is_staff",
    )
    list_display_links = ("id", "email")
    list_filter = ("is_active", "is_staff", "is_superuser", "groups")
    search_fields = ("email", "first_name", "last_name", "phone_number")
    ordering = ("email",)

    # Поля в деталях пользователя
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {"fields": ("first_name", "last_name", "phone_number", "username", "photo")},
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    # Поля при создании нового пользователя через админку
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "phone_number",
                    "is_staff",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    filter_horizontal = (
        "groups",
        "user_permissions",
    )

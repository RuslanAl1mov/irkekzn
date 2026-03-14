from django.contrib import admin

from simple_history.admin import SimpleHistoryAdmin
from .models import Shop, Size


@admin.register(Shop)
class ShopAdmin(SimpleHistoryAdmin):
    """
    Админка для Shop с поддержкой истории изменений
    """

    list_display = ["id", "name", "city", "phone_first", "is_main_office"]
    search_fields = ["name", "city", "address", "phone_first"]
    list_filter = ["is_main_office", "city"]
    list_display_links = ["id", "name"]

    # Настройки для истории
    history_list_display = ["history_user", "history_date"]

    fieldsets = [
        ("Основное", {"fields": ["name", "email", "is_main_office"]}),
        ("Телефоны", {"fields": ["phone_first", "phone_second", "phone_third"]}),
        (
            "Соцсети",
            {
                "fields": [
                    "telegram_link",
                    "telegram_name",
                    "vk_link",
                    "vk_name",
                    "instagram_link",
                    "instagram_name",
                ]
            },
        ),
        ("Адрес", {"fields": ["city", "address", "map_location"]}),
    ]


@admin.register(Size)
class SizeAdmin(SimpleHistoryAdmin):
    """
    Админка для Size с поддержкой истории изменений
    """

    list_display = [
        "id",
        "russian",
        "international",
        "european",
        "chest_circumference",
        "waist_circumference",
        "hip_circumference",
        "order"
    ]
    search_fields = [
        "russian",
        "international",
        "european",
        "chest_circumference",
        "waist_circumference",
        "hip_circumference",
        "order"
    ]
    list_filter = [
        "russian",
        "international",
        "european",
        "chest_circumference",
        "waist_circumference",
        "hip_circumference",
        "order"
    ]
    list_display_links = ["id", "russian"]

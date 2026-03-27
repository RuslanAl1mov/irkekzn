from django.contrib import admin

from simple_history.admin import SimpleHistoryAdmin
from .models import Shop, Size, ColorPalette, Settings


@admin.register(Settings)
class SettingsAdmin(SimpleHistoryAdmin):
    """
    Админка для Settings с поддержкой истории изменений
    """

    list_display = [
        "id",
        "set_custom_product_card_settings",
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
        "date_updated",
    ]
    search_fields = [
        "set_custom_product_card_settings",
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
    ]
    list_filter = [
        "set_custom_product_card_settings",
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
    ]
    list_display_links = ["id"]
    
    list_editable = [
        "set_custom_product_card_settings",
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
    ]


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
        "order",
    ]
    search_fields = [
        "russian",
        "international",
        "european",
        "chest_circumference",
        "waist_circumference",
        "hip_circumference",
        "order",
    ]
    list_filter = [
        "russian",
        "international",
        "european",
        "chest_circumference",
        "waist_circumference",
        "hip_circumference",
        "order",
    ]
    list_display_links = ["id", "russian"]


@admin.register(ColorPalette)
class ColorPaletteAdmin(SimpleHistoryAdmin):
    """
    Админка для ColorPalette с поддержкой истории изменений
    """

    list_display = ["id", "name", "hex", "is_active"]
    search_fields = ["name", "hex"]
    list_filter = ["is_active"]
    list_display_links = ["id", "name"]

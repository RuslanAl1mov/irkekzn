from django.contrib import admin
from django import forms
from django.utils.html import format_html

from simple_history.admin import SimpleHistoryAdmin
from .models import (
    Shop,
    Size,
    ColorPalette,
    Settings,
    ProductCategory,
    ProductCategoryCover,
    ProductCard,
)


@admin.register(Settings)
class SettingsAdmin(SimpleHistoryAdmin):
    """
    Админка для Settings с поддержкой истории изменений
    """

    list_display = [
        "id",
        "set_global_product_card_settings",
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
        "date_updated",
    ]
    search_fields = [
        "set_global_product_card_settings",
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
    ]
    list_filter = [
        "set_global_product_card_settings",
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
    ]
    list_display_links = ["id"]

    list_editable = [
        "set_global_product_card_settings",
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


@admin.register(ProductCategoryCover)
class ProductCategoryCoverAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "preview",
        "category",
        "creator",
        "is_active",
        "date_created",
    )
    list_display_links = ("id",)
    list_filter = ("is_active", "date_created", "creator")
    search_fields = (
        "category__name",
        "creator__email",
        "creator__first_name",
        "creator__last_name",
    )
    autocomplete_fields = ("category", "creator")
    readonly_fields = ("date_created", "preview")
    ordering = ("-date_created",)

    fieldsets = (
        (
            "Основное",
            {"fields": ("category", "image", "preview", "creator", "is_active")},
        ),
        ("Системная информация", {"fields": ("date_created",)}),
    )

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height: 150px; border-radius: 6px;" />',
                obj.image.url,
            )
        return "—"

    preview.short_description = "Превью"


@admin.register(ProductCategory)
class ProductCategoryAdmin(SimpleHistoryAdmin):
    """
    Админка для ProductCategory
    """

    list_display = ("id", "name", "parent", "is_active", "creator", "date_created")
    list_display_links = ("id", "name")
    list_filter = ("is_active", "parent", "creator", "date_created")
    search_fields = ("name", "description", "creator__username")
    readonly_fields = ("date_created", "creator")
    ordering = ("name",)
    list_per_page = 50

    def save_model(self, request, obj, form, change):
        """Автоматическое заполнение поля creator при создании"""
        if not change:
            obj.creator = request.user
        super().save_model(request, obj, form, change)


class ProductCardAdminForm(forms.ModelForm):
    class Meta:
        model = ProductCard
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        settings_obj = Settings.objects.first()

        if settings_obj and not settings_obj.set_global_product_card_settings:
            self.fields["is_all_products_same_name"].disabled = True
            self.fields["is_all_products_same_price"].disabled = True
            self.fields["is_all_products_same_description"].disabled = True
            self.fields["is_all_products_same_model"].disabled = True


@admin.register(ProductCard)
class ProductCardAdmin(admin.ModelAdmin):
    form = ProductCardAdminForm

    list_display = (
        "id",
        "get_categories",
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
        "date_created",
        "creator",
        "is_active",
    )
    list_display_links = ("id", "get_categories")
    list_filter = (
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
        "is_active",
        "date_created",
        "creator",
    )
    list_editable = (
        "is_all_products_same_name",
        "is_all_products_same_price",
        "is_all_products_same_description",
        "is_all_products_same_model",
        "is_active",
    )
    search_fields = (
        "id",
        "categories__name",
        "creator__email",
        "creator__first_name",
        "creator__last_name",
    )
    filter_horizontal = ("categories",)
    autocomplete_fields = ("creator",)
    readonly_fields = ("date_created",)
    ordering = ("-date_created",)

    def get_categories(self, obj):
        return ", ".join(obj.categories.values_list("name", flat=True)) or "—"

    get_categories.short_description = "Категории"

    def save_model(self, request, obj, form, change):
        if not change:
            obj.creator = request.user
        super().save_model(request, obj, form, change)

    def get_changelist_form(self, request, **kwargs):
        kwargs["form"] = ProductCardAdminForm
        return super().get_changelist_form(request, **kwargs)

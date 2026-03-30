from django_filters import rest_framework as filters
from users.models import User
from .models import Shop, ColorPalette, Product
import logging

logger = logging.getLogger(__name__)


class UsersListFilter(filters.FilterSet):
    date_joined = filters.DateFromToRangeFilter(
        field_name="date_joined", label="Дата регистрации"
    )
    date_archived = filters.DateFromToRangeFilter(
        field_name="date_archived", label="Дата архивации"
    )

    class Meta:
        model = User
        fields = [
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
            "date_archived",
        ]


class ShopListFilter(filters.FilterSet):
    is_active = filters.BooleanFilter(field_name="is_active", label="Активен")
    is_main_office = filters.BooleanFilter(field_name="is_main_office", label="Главный офис")

    class Meta:
        model = Shop
        fields = ["is_active", "is_main_office"]


class ColorPaletteListFilter(filters.FilterSet):
    is_active = filters.BooleanFilter(field_name="is_active", label="Активен")

    class Meta:
        model = ColorPalette
        fields = ["is_active"]


class ProductListFilter(filters.FilterSet):
    product_card = filters.NumberFilter(field_name="product_card_id", label="Карточка товара")
    is_active = filters.BooleanFilter(field_name="is_active", label="Активен")

    class Meta:
        model = Product
        fields = ["product_card", "is_active"]
from django_filters import rest_framework as filters
from users.models import User
from .models import (
    Shop,
    ColorPalette,
    ProductCategory,
    Product,
    ProductStock,
)
import logging

logger = logging.getLogger(__name__)


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


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
    is_main_office = filters.BooleanFilter(
        field_name="is_main_office", label="Главный офис"
    )

    class Meta:
        model = Shop
        fields = ["is_active", "is_main_office"]


class ColorPaletteListFilter(filters.FilterSet):
    is_active = filters.BooleanFilter(field_name="is_active", label="Активен")

    class Meta:
        model = ColorPalette
        fields = ["is_active"]


class ProductCategoryListFilter(filters.FilterSet):
    parent = NumberInFilter(
        field_name="parent", lookup_expr="in", label="Родительская категория"
    )
    date_created = filters.DateFromToRangeFilter(
        field_name="date_created", label="Дата создания"
    )
    is_active = filters.BooleanFilter(field_name="is_active", label="Активен")

    class Meta:
        model = ProductCategory
        fields = ["parent", "date_created", "is_active"]


class ProductListFilter(filters.FilterSet):
    product_card = NumberInFilter(
        field_name="product_card_id", lookup_expr="in", label="Карточка товара"
    )
    category = NumberInFilter(
        field_name="product_card__categories",
        lookup_expr="in",
        label="Категория",
    )
    is_active = filters.BooleanFilter(field_name="is_active", label="Активен")

    class Meta:
        model = Product
        fields = ["product_card", "category", "is_active"]


class ProductStockListFilter(filters.FilterSet):
    product = NumberInFilter(field_name="product_id", lookup_expr="in", label="Товар")
    product_card = NumberInFilter(field_name="product_card", label="Карточка товара")
    size = NumberInFilter(field_name="size", label="Размер")
    shop = NumberInFilter(field_name="shop", label="Магазин")
    category = NumberInFilter(
        field_name="product__product_card__categories",
        lookup_expr="in",
        label="Категория",
    )

    class Meta:
        model = ProductStock
        fields = ["product", "product_card", "size", "shop", "category"]

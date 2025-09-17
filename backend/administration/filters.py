from django_filters import rest_framework as filters
from django.db.models.functions import Coalesce

from marketplace.models import Product, ProductTag, ProductCategory


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    """Позволяет передавать ?param=1,2,3 для числовых полей."""
    pass


class CharInFilter(filters.BaseInFilter, filters.CharFilter):
    """То же самое для строковых полей (slug и др.)."""
    pass


class ProductFilter(filters.FilterSet):
    category = NumberInFilter(field_name="categories__id", lookup_expr="in")
    category_slug = CharInFilter(field_name="categories__slug", lookup_expr="in")
    tag = NumberInFilter(field_name="tags__id", lookup_expr="in")
    tag_slug = CharInFilter(field_name="tags__slug", lookup_expr="in")
    date_created = filters.DateFromToRangeFilter(field_name="date_created__date")
    # фильтры по цене «от–до»
    price_min = filters.NumberFilter(method="filter_actual_price", label="Цена от")
    price_max = filters.NumberFilter(method="filter_actual_price", label="Цена до")

    class Meta:
        model  = Product
        fields = [
            "category",
            "category_slug",
            "tag",
            "tag_slug",
            "date_created",
            "price_min",
            "price_max"
        ]

    def filter_actual_price(self, queryset, name, value):
        # сначала аннотируем «реальную» цену
        qs = queryset.annotate(actual_price=Coalesce("sale_price", "price"))
        # в зависимости от имени фильтра применяем gte или lte
        lookup = "gte" if name == "price_min" else "lte"
        return qs.filter(**{f"actual_price__{lookup}": value})


class ProductCategoryFilter(filters.FilterSet):
    date_created = filters.DateFromToRangeFilter(field_name="date_created__date")

    class Meta:
        model = ProductCategory
        fields = ["date_created"]
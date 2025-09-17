from datetime import date, timedelta
from django.db.models import Subquery, OuterRef, Count
from django.utils.dateparse import parse_date
from rest_framework import generics, status, filters, parsers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import FullDjangoModelPermissions, DjangoListModelPermissions

from services.models import CallRequest
from marketplace.models import (
    ProductCategory,
    ProductTag, 
    Product, 
    MeasurementType,
    MeasurementUnit)

from .serializers import (
    ProductCategorySerializer,
    ProductCategoryCreateSerializer,
    ProductCategoryUpdateSerializer,
    
    ProductTagSerializer,
    
    ProductSerializer,
    ProductCreateSerializer,
    ProductUpdateSerializer,
    MeasurementTypeSerializer,
    MeasurementUnitSerializer
)

from .pagination import (
    ProductPagination,
    ProductTagPagination,
    ProductCategoryPagination,
)
from .filters import ProductFilter, ProductCategoryFilter


class DashboardView(generics.GenericAPIView):
    """
    GET - /api/v1/administration/dashboard/

    Информация для дэшборда

    Обязательные параметры:
    - date_after - дата от которой начинается пересчет данных

    Не обязательные параметры:
    - date_before - дата окончания промежутка времени
    """

    permission_classes = [IsAuthenticated]

    def _calculate_growth(self, current_value, base_value):
        """Вычисляет процент роста (или падения)."""
        if current_value == 0 and base_value == 0:
            return 0.0
        else:
            result = (
                ((current_value - base_value) / base_value) * 100
                if base_value
                else 100.0
            )
            return round(result, 1)

    def get(self, request, *args, **kwargs):
        date_after_str = request.query_params.get("date_after")
        date_before_str = request.query_params.get("date_before")

        if not date_after_str:
            return Response(
                {"detail": "Параметр date_after обязателен (YYYY-MM-DD)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        date_after: date | None = parse_date(date_after_str)
        if not date_after:
            return Response(
                {"detail": "Некорректный формат date_after (ожидается YYYY-MM-DD)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        date_before: date | None = (
            parse_date(date_before_str) if date_before_str else date_after
        )
        if not date_before:
            return Response(
                {"detail": "Некорректный формат date_before (ожидается YYYY-MM-DD)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # защита от перепутанных дат
        if date_before < date_after:
            date_after, date_before = date_before, date_after
            

        days_span = (date_before - date_after).days
        prev_end = date_after - timedelta(days=1)
        prev_start = prev_end - timedelta(days=days_span)

        date_filter = {
            "date_created__date__gte": date_after,
            "date_created__date__lte": date_before,
        }
        prev_date_filter = {
            "date_created__date__gte": prev_start,
            "date_created__date__lte": prev_end,
        }

        products_total = Product.objects.filter(**date_filter).count()
        products_prev_total = Product.objects.filter(**prev_date_filter).count()
        products_diff = self._calculate_growth(products_total, products_prev_total)

        categories_total = ProductCategory.objects.filter(**date_filter).count()
        categories_prev_total = ProductCategory.objects.filter(**prev_date_filter).count()
        categories_diff = self._calculate_growth(categories_total, categories_prev_total)

        callrequests_total = CallRequest.objects.filter(**date_filter).count()
        callrequests_prev_total = CallRequest.objects.filter(**prev_date_filter).count()
        callrequests_diff = self._calculate_growth(callrequests_total, callrequests_prev_total)

        data = {
            "date_after": date_after,
            "date_before": date_before,
            "products": {
                "total": products_total,
                "prev": products_prev_total,
                "diff": products_diff,
            },
            "categories": {
                "total": categories_total,
                "prev": categories_prev_total,
                "diff": categories_diff,
            },
            "call_requests": {
                "total": callrequests_total,
                "curr": callrequests_prev_total,
                "diff": callrequests_diff,
            },
        }
        return Response(data)


class ProductCategoryListView(generics.ListAPIView):
    """
    GET - api/v1/administration/product-categories/

    Список категорий товаров
    
    Фильтрация:
    - date_created_after - Дата создания от yyyy-MM-DD
    - date_created_before - Дата создания до yyyy-MM-DD
    """
    serializer_class = ProductCategorySerializer
    permission_classes = [IsAuthenticated, DjangoListModelPermissions]

    queryset = ProductCategory.objects.all().annotate(products_count=Count('product', distinct=True))

    pagination_class = ProductCategoryPagination
    filterset_class = ProductCategoryFilter
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    search_fields = ["id", "name"]
    ordering_fields = ["id", "name", "products_count", "is_actual", "date_created"]
    ordering = ["-id"]


class ProductCategoryCreateView(generics.CreateAPIView):
    """
    POST /api/v1/administration/product-categories/create/
    
    Создание новой категории товара.
    Тело запроса — multipart/form-data:
      • name        — строка
      • photo       — файл изображения
      • cover       — файл изображения (опционально)
      • description — текст (опционально)
      • is_actual   — булево (опционально)
    Ответ: сериализованный объект созданной категории.
    """
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategoryCreateSerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    
class ProductCategoryUpdateView(generics.UpdateAPIView):
    """
    PATCH /api/v1/administration/product-categories/<int:pk>/edit/

    Обновление существующей категории товара.
    Принимает multipart/form-data: имя, файлы photo/cover, описание, флаг is_actual.
    """
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategoryUpdateSerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    http_method_names = ['patch']
    
    
class ProductCategoryRetrieveView(generics.RetrieveAPIView):
    """
    GET - /api/v1/administration/product-categories/<int:pk>/
    
    Детальная информация о категории продукта
    """

    queryset = ProductCategory.objects.all().annotate(products_count=Count('product', distinct=True))
    serializer_class = ProductCategorySerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    

class ProductCategoryDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/v1/administration/product-categories/<int:pk>/delete/

    Удаляет категорию товара, только если к ней не привязаны товары.
    """
    queryset = ProductCategory.objects.all()
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    lookup_field = 'pk'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.product_set.exists():
            return Response(
                {'detail': 'Нельзя удалить категорию, пока к ней привязаны товары.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


class ProductTagListView(generics.ListAPIView):
    """
    GET /api/v1/administration/product-tags/

    Фильтрация:
    - category - по ID категории (массив)
    - category_slug - по slug категории (массив)

    Поиск:
    - ?search=<текст>   (ищет по id и name)

    Ordering:
    - ?ordering=name           (по имени тега)
    - ?ordering=-name          (обратный)
    - ?ordering=category__name (по имени категории)
      По умолчанию: category__name ASC, name ASC
    """

    queryset = ProductTag.objects.all().annotate(
        products_count=Count("product", distinct=True),
        categories_count=Count("product__categories", distinct=True),
    )
    serializer_class = ProductTagSerializer
    permission_classes = [IsAuthenticated, DjangoListModelPermissions]

    pagination_class = ProductTagPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = ["id", "name"]
    ordering_fields = ["id", "name", "products_count", "categories_count", "is_actual"]
    ordering = ["name"]


class ProductTagRetrieveView(generics.RetrieveAPIView):
    """
    GET /api/v1/administration/product-tags/<int:pk>/

    Детальная информация о теге товара.
    Возвращает также:
      • products_count    — количество товаров с этим тегом
      • categories_count  — количество уникальных категорий этих товаров
    """
    queryset = ProductTag.objects.all().annotate(
        products_count=Count("product", distinct=True),
        categories_count=Count("product__categories", distinct=True),
    )
    serializer_class = ProductTagSerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    

class ProductTagCreateView(generics.CreateAPIView):
    """
    POST /api/v1/administration/product-tags/create/

    Создаёт новый тег товара.
    Тело: form-data или x-www-form-urlencoded
      • name       — строка (обязательно)
      • is_actual  — булево (опц., по умолчанию True)
    Ответ: сериализованный объект созданного тега.
    """
    queryset = ProductTag.objects.all()
    serializer_class = ProductTagSerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    parser_classes = [parsers.FormParser, parsers.MultiPartParser]


class ProductTagUpdateView(generics.UpdateAPIView):
    """
    PATCH /api/v1/administration/product-tags/<int:pk>/update/

    Частичное обновление существующего тега.
    Тело: form-data / x-www-form-urlencoded
      • name       — строка
      • is_actual  — булево
    """
    queryset = ProductTag.objects.all()
    serializer_class = ProductTagSerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    parser_classes = [parsers.FormParser, parsers.MultiPartParser]
    http_method_names = ["patch"]


class ProductTagDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/v1/administration/product-tags/<int:pk>/delete/

    Удаляет тег. Запрещено, если тег привязан к товарам.
    """
    queryset = ProductTag.objects.all()
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    lookup_field = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.product_set.exists():
            return Response(
                {"detail": "Нельзя удалить тег, пока он привязан к товарам."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)
    

class ProductListView(generics.ListAPIView):
    """
    GET - api/v1/administration/products/

    Список товаров
    
    Фильтрация:
    - category - Категория по ID (массив)
    - category_slug - Категория по slug'у (массив)
    - date_created_after - Дата создани от yyyy-MM-DD
    - date_created_before - Дата создани до yyyy-MM-DD
    """
    
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, DjangoListModelPermissions]
    pagination_class = ProductPagination
    filterset_class = ProductFilter

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    search_fields = ["name", "sku"]
    ordering_fields = "__all__"
    ordering = ["-id"]

    def get_queryset(self):
        qs = Product.objects.all().prefetch_related("categories", "tags")

        # Подзапрос: первая категория по алфавиту
        first_cat_sub = (
            ProductCategory.objects.filter(product=OuterRef("pk"))
            .order_by("name")
            .values("name")[:1]
        )
        return qs.annotate(first_category=Subquery(first_cat_sub))


class ProductRetrieveView(generics.RetrieveAPIView):
    """
    GET - api/v1/administration/products/<int:pk>/
    
    Детальная информация о продукте
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]


class ProductCreateView(generics.CreateAPIView):
    """
    POST /api/v1/administration/products/

    Тело запроса — multipart/form-data.
    Все поля, кроме `photos`, передаются как обычные поля формы
    (массивы — перечислением, например `category_ids=1&category_ids=2`).

    Ответ: JSON с данными созданного продукта.
    """
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]

    # принимаем файлы
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]


class ProductUpdateView(generics.UpdateAPIView):
    """
    PATCH  /api/v1/administration/products/<int:pk>/

    Обновление товара:
      • любые поля из ProductUpdateSerializer можно присылать частично;
      • category_ids / tag_ids — CSV или ?param=1&param=2;
      • photos — список новых изображений (добавляются в конец).
    """

    queryset = Product.objects.all()
    serializer_class = ProductUpdateSerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    
    # разрешаем только PATCH
    http_method_names = ["patch"]


class ProductDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/v1/administration/products/<int:pk>/

    Удаляет указанный продукт.
    """
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    lookup_field = "pk"
    

class MeasurementTypeListView(generics.ListAPIView):
    """
    GET /api/v1/administration/measurement-types/
    Возвращает список всех типов измерений.
    Поддерживается поиск по id и name, и сортировка.
    """
    queryset = MeasurementType.objects.all()
    serializer_class = MeasurementTypeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["id", "name"]
    ordering_fields = ["id", "name"]
    ordering = ["-id"]


class MeasurementUnitListView(generics.ListAPIView):
    """
    GET /api/v1/administration/measurement-units/
    Возвращает список всех единиц измерения.
    Поддерживается поиск по id и name, и сортировка.
    """
    queryset = MeasurementUnit.objects.all()
    serializer_class = MeasurementUnitSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["id", "name"]
    ordering_fields = ["id", "name"]
    ordering = ["-id"]

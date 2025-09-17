from rest_framework import generics, status, filters
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import ensure_csrf_cookie
from django_filters.rest_framework import DjangoFilterBackend


from .models import (
    ProductCategory,
    ProductTag,
    Product,
)

from .serializers import (
    ProductCategorySerializer,
    ProductTagSerializer,
    ProductSerializer,
)

from .pagination import (
    ProductCategoryPagination, 
    ProductTagPagination,
    ProductPagination
    )

from .filters import ProductFilter


# ------------------------------------------------------------------------------ #
#                            Установка CSRF-cookie                             #
# ------------------------------------------------------------------------------ #
@api_view(["GET"])
@ensure_csrf_cookie
def csrf_cookie_view(request):
    """
    GET DOMAIN/api/v1/auth/csrf-cookie/

    Устанавливает CSRF-cookie в браузере. Может использоваться для защиты запросов,
    где требуется CSRF-токен.
    """
    return Response({"detail": "CSRF cookie set"}, status=status.HTTP_200_OK)


# ============ MarketplaceIndexPage ============


class IndexPageView(generics.ListAPIView):
    """
    GET — список последних 15 добавленных продуктов (без пагинации)
    """

    serializer_class = ProductSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Product.objects.filter(is_actual=True).order_by("-id")[:15]


# ============ ProductCategory ============


class ProductCategoryListView(generics.ListAPIView):
    """
    GET - список всех категорий
    """

    queryset = ProductCategory.objects.filter(is_actual=True)
    serializer_class = ProductCategorySerializer
    pagination_class = ProductCategoryPagination
    authentication_classes = []
    permission_classes = [AllowAny]


class ProductCategoryRetrieveView(generics.RetrieveAPIView):
    """
    GET - информция о категории продукта
    
    Доступна иформация по id и slug
    """
    
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get_object(self):
        key = self.kwargs["key"]
        qs  = self.get_queryset()
        if key.isdigit():
            return get_object_or_404(qs, pk=int(key))
        return get_object_or_404(qs, slug=key)


# ============ Product Tags ============

class ProductTagListView(generics.ListAPIView):
    """
    GET /api/v1/marketplace/product-tags/

    Поиск:
    - ?search=<текст>   (ищет по name)

    Ordering:
    - ?ordering=name           (по имени тега)
    - ?ordering=-name          (обратный)
    """

    queryset = ProductTag.objects.filter(is_actual=True)
    serializer_class = ProductTagSerializer
    permission_classes = [AllowAny]

    pagination_class = ProductTagPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = ["id", "name"]
    ordering_fields = ["name"]
    ordering = ["name"]


# ============ Product ============


class ProductListView(generics.ListAPIView):
    """
    GET /api/v1/marketplace/products/?search=<строка>&category=<slug>&page=<n>&page_size=<m>
    Поиск по name, sku и фильтрация по категориям (id).
    """
    
    queryset = Product.objects.filter(is_actual=True).distinct().order_by('-id')
    serializer_class = ProductSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    pagination_class = ProductPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class  = ProductFilter
    search_fields = ["name", "sku"]


class ProductRetrieveView(generics.RetrieveAPIView):
    """
    GET - детальная информация о продукте
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def get_object(self):
        key = self.kwargs["key"]
        qs  = self.get_queryset()
        if key.isdigit():
            return get_object_or_404(qs, pk=int(key), is_actual=True)
        return get_object_or_404(qs, slug=key, is_actual=True)

from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django_filters.rest_framework import DjangoFilterBackend

from services.mixin.logged_api_views import (
    LoggedUpdateAPIView,
    LoggedCreateAPIView,
    LoggedDestroyAPIView,
)

from core.permissions import IsEmployee, CRUDPermissions, GetListPermissions

from users.models import RequestLog
from users.serializers import (
    GroupSerializer,
    PermissionSerializer,
    UserSerializer,
    EmployeeSerializer,
    EmployeeCreateSerializer,
)
from .pagination import (
    RequestLogsListPagination,
    UsersListPagination,
    ShopsListPagination,
    SizesListPagination,
    ColorPaletteListPagination,
    ProductCategoryListPagination,
    ProductCardListPagination,
    ProductListPagination,
)
from .filters import (
    UsersListFilter,
    ShopListFilter,
    ColorPaletteListFilter,
    ProductListFilter,
)
from .models import (
    Shop,
    Size,
    ColorPalette,
    Settings,
    ProductCategory,
    ProductCategoryCover,
    ProductCard,
    Product,
    ProductImage,
)
from .serializers import (
    ShopSerializer,
    SizeSerializer,
    ColorPaletteSerializer,
    SettingsSerializer,
    RequestLogSerializer,
    ProductCategorySerializer,
    ProductCategoryCoverSerializer,
    ProductImageSerializer,
    ProductCardSerializer,
    ProductSerializer,
)

User = get_user_model()


class GroupListView(generics.ListAPIView):
    """
    api: api/v1/administration/users/groups/
    Представление для:
    - GET: список всех групп
    """

    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    search_fields = (
        "id",
        "name",
        "permissions__name",
    )

    ordering_fields = (
        "id",
        "name",
        "permissions__name",
    )

    ordering = ["name"]


class PermissionListView(generics.ListAPIView):
    """
    api: api/v1/administration/users/permissions/
    Представление для:
    - GET: список всех прав
    """

    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    queryset = Permission.objects.select_related("content_type").all()
    serializer_class = PermissionSerializer

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    search_fields = (
        "id",
        "name",
        "codename",
        "content_type__app_label",
        "content_type__model",
    )

    ordering_fields = (
        "id",
        "name",
        "codename",
        "content_type__app_label",
        "content_type__model",
    )

    ordering = ["content_type__app_label", "codename"]


# Логи пользователей
class UserLogsListView(generics.ListAPIView):
    """
    api: api/v1/administration/users/logs/<int:user_id>/
    Представление для:
    - GET: список логов пользователя
    """

    queryset = RequestLog.objects.select_related("user").all()
    serializer_class = RequestLogSerializer
    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    pagination_class = RequestLogsListPagination

    def get_queryset(self):
        return self.queryset.filter(user=self.kwargs["user_id"])


# Настройки
class SettingsDetailView(generics.RetrieveAPIView):
    """
    api: api/v1/administration/settings/<int:pk>/
    Представление для:
    - GET: получение информации о настройке
    """

    queryset = Settings.objects.filter(id=1)
    serializer_class = SettingsSerializer
    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]

    def get_object(self):
        """
        Всегда возвращаем настройки с id=1.
        Если их нет - создаем автоматически.
        """
        settings, created = Settings.objects.get_or_create(id=1)
        return settings


class SettingsUpdateView(LoggedUpdateAPIView):
    """
    api: api/v1/administration/settings/<int:pk>/update/
    Представление для:
    - PUT: обновление информации о настройке
    - PATCH: обновление информации о настройке
    """

    queryset = Settings.objects.filter(id=1)
    serializer_class = SettingsSerializer
    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]

    def get_object(self):
        """
        Всегда возвращаем настройки с id=1.
        Если их нет - создаем автоматически.
        """
        settings, created = Settings.objects.get_or_create(id=1)
        return settings


# Пользователи
class UsersListView(generics.ListAPIView):
    """
    api: api/v1/administration/users/
    Представление для:
    - GET: список всех пользователей
    """

    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = UsersListPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    filterset_class = UsersListFilter
    search_fields = (
        "id",
        "first_name",
        "last_name",
        "phone_number",
        "email",
        "username",
    )
    ordering_fields = (
        "id",
        "first_name",
        "last_name",
        "phone_number",
        "email",
        "username",
        "is_active",
        "is_staff",
        "date_joined",
        "last_login",
        "language",
    )

    ordering = ["-id"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Сохраняем доп статистику в request для пагинатора
        request.stats = {
            "total_count": queryset.count(),
            "inactive_count": queryset.filter(is_active=False).count(),
        }

        # Стандартная пагинация
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserDetailView(generics.RetrieveAPIView):
    """
    api: api/v1/administration/users/<int:pk>/
    Представление для:
    - GET: получение информации о сотруднике
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()

    def get_serializer_class(self):
        user = self.get_object()
        return EmployeeSerializer if user.is_staff else UserSerializer


class EmployeeUpdateView(LoggedUpdateAPIView):
    """
    api: api/v1/administration/users/employee/update/<int:pk>/
    Представление для:
    - PUT: обновление информации о сотруднике
    - PATCH: обновление информации о сотруднике
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()
    serializer_class = EmployeeSerializer


class EmployeeCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/users/employee/create/
    Представление для:
    - POST: создание нового сотрудника
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()
    serializer_class = EmployeeCreateSerializer


# Магазины
class ShopListView(generics.ListAPIView):
    """
    api: api/v1/administration/shops/
    Представление для:
    - GET: список всех магазинов
    """

    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    pagination_class = ShopsListPagination

    # Фильтрация, поиск и сортировка
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ShopListFilter
    filterset_fields = ["is_main_office"]
    search_fields = [
        "name",
        "address",
        "city",
        "phone_first",
        "phone_second",
        "phone_third",
        "email",
    ]

    ordering_fields = ["name", "city"]
    ordering = ["-is_main_office", "-id"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Сохраняем доп статистику в request для пагинатора
        request.stats = {
            "total_count": queryset.count(),
            "inactive_count": queryset.filter(is_active=False).count(),
        }

        # Стандартная пагинация
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ShopCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/shops/create/
    Представление для:
    - POST: создание нового магазина
    """

    # permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class ShopUpdateView(LoggedUpdateAPIView):
    """
    api: api/v1/administration/shops/<int:pk>/update/
    Представление для:
    - PUT: обновление информации о магазине
    - PATCH: обновление информации о магазине
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class ShopDetailView(generics.RetrieveAPIView):
    """
    api: api/v1/administration/shops/<int:pk>/
    Представление для:
    - GET: получение информации о магазине
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class ShopDeleteView(LoggedDestroyAPIView):
    """
    api: api/v1/administration/shops/<int:pk>/delete/
    Представление для:
    - DELETE: удаление магазина
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Запрет на удаление главного офиса
        if instance.is_main_office:
            return Response(
                {
                    "detail": "Нельзя удалить главный офис. Сначала назначьте другой магазин главным."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# Размеры
class SizeListView(generics.ListAPIView):
    """
    api: api/v1/administration/sizes/
    Представление для:
    - GET: список всех размеров
    """

    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    pagination_class = SizesListPagination

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = [
        "russian",
        "international",
        "european",
        "chest_circumference",
        "waist_circumference",
        "hip_circumference",
    ]
    ordering_fields = [
        "order",
        "russian",
        "international",
        "european",
        "chest_circumference",
        "waist_circumference",
        "hip_circumference",
    ]
    ordering = ["order"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        request.stats = {
            "total_count": queryset.count(),
        }

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class SizeDetailView(generics.RetrieveAPIView):
    """
    api: api/v1/administration/sizes/<int:pk>/
    Представление для:
    - GET: получение информации о размере
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Size.objects.all()
    serializer_class = SizeSerializer


class SizeUpdateView(LoggedUpdateAPIView):
    """
    api: api/v1/administration/sizes/<int:pk>/update/
    Представление для:
    - PUT: обновление информации о размере
    - PATCH: обновление информации о размере
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Size.objects.all()
    serializer_class = SizeSerializer


class SizeCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/sizes/create/
    Представление для:
    - POST: создание нового размера
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Size.objects.all()
    serializer_class = SizeSerializer


class SizeDeleteView(LoggedDestroyAPIView):
    """
    api: api/v1/administration/sizes/<int:pk>/delete/
    Представление для:
    - DELETE: удаление размера
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Size.objects.all()
    serializer_class = SizeSerializer


# Цвета палитры
class ColorPaletteListView(generics.ListAPIView):
    """
    api: api/v1/administration/color-palettes/
    Представление для:
    - GET: список всех цветов палитры
    """

    queryset = ColorPalette.objects.all()
    serializer_class = ColorPaletteSerializer
    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    pagination_class = ColorPaletteListPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ColorPaletteListFilter
    search_fields = ["name", "hex"]
    ordering_fields = ["name", "hex", "is_active"]
    ordering = ["-id"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Сохраняем доп статистику в request для пагинатора
        request.stats = {
            "total_count": queryset.count(),
            "inactive_count": queryset.filter(is_active=False).count(),
        }

        # Стандартная пагинация
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ColorPaletteCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/color-palettes/create/
    Представление для:
    - POST: создание нового цвета палитры
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ColorPalette.objects.all()
    serializer_class = ColorPaletteSerializer


class ColorPaletteUpdateView(LoggedUpdateAPIView):
    """
    api: api/v1/administration/color-palettes/<int:pk>/update/
    Представление для:
    - PUT: обновление информации о цвете палитры
    - PATCH: обновление информации о цвете палитры
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ColorPalette.objects.all()
    serializer_class = ColorPaletteSerializer


class ColorPaletteDeleteView(LoggedDestroyAPIView):
    """
    api: api/v1/administration/color-palettes/<int:pk>/delete/
    Представление для:
    - DELETE: удаление цвета палитры
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ColorPalette.objects.all()
    serializer_class = ColorPaletteSerializer


# Категории товаров
class ProductCategoryCoverCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/product-categories/covers/create/
    Представление для:
    - POST: создание новой обложки категории товаров
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCategoryCover.objects.all()
    serializer_class = ProductCategoryCoverSerializer


class ProductCategoryListView(generics.ListAPIView):
    """
    api: api/v1/administration/product-categories/
    Представление для:
    - GET: список всех категорий товаров
    """

    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    pagination_class = ProductCategoryListPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Сохраняем доп статистику в request для пагинатора
        request.stats = {
            "total_count": queryset.count(),
            "inactive_count": queryset.filter(is_active=False).count(),
        }

        # Стандартная пагинация
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProductCategoryDetailView(generics.RetrieveAPIView):
    """
    api: api/v1/administration/product-categories/<int:pk>/
    Представление для:
    - GET: получение информации о категории товаров
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class ProductCategoryCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/product-categories/create/
    Представление для:
    - POST: создание новой категории товаров
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class ProductCategoryUpdateView(LoggedUpdateAPIView):
    """
    api: api/v1/administration/product-categories/<int:pk>/update/
    Представление для:
    - PUT: обновление информации о категории товаров
    - PATCH: обновление информации о категории товаров
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class ProductCategoryDeleteView(LoggedDestroyAPIView):
    """
    api: api/v1/administration/product-categories/<int:pk>/delete/
    Представление для:
    - DELETE: удаление категории товаров
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


# Карточки товаров
class ProductCardListView(generics.ListAPIView):
    """
    api: api/v1/administration/product-cards/
    Представление для:
    - GET: список всех карточек товаров
    """

    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    queryset = ProductCard.objects.all()
    serializer_class = ProductCardSerializer
    pagination_class = ProductCardListPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Сохраняем доп статистику в request для пагинатора
        request.stats = {
            "total_count": queryset.count(),
            "inactive_count": queryset.filter(is_active=False).count(),
        }

        # Стандартная пагинация
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProductCardDetailView(generics.RetrieveAPIView):
    """
    api: api/v1/administration/product-cards/<int:pk>/
    Представление для:
    - GET: получение информации о карточке товара
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCard.objects.all()
    serializer_class = ProductCardSerializer


class ProductCardCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/product-cards/create/
    Представление для:
    - POST: создание новой карточки товара
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCard.objects.all()
    serializer_class = ProductCardSerializer


class ProductCardUpdateView(LoggedUpdateAPIView):
    """
    api: api/v1/administration/product-cards/<int:pk>/update/
    Представление для:
    - PUT: обновление информации о карточке товара
    - PATCH: обновление информации о карточке товара
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCard.objects.all()
    serializer_class = ProductCardSerializer


class ProductCardDeleteView(LoggedDestroyAPIView):
    """
    api: api/v1/administration/product-cards/<int:pk>/delete/
    Представление для:
    - DELETE: удаление карточки товара
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductCard.objects.all()
    serializer_class = ProductCardSerializer


# Товары
class ProductImageCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/products/images/create/
    Представление для:
    - POST: создание изображения товара (превью формируется на сервере)
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = ProductImage.objects.select_related("product", "creator").all()
    serializer_class = ProductImageSerializer


class ProductListView(generics.ListAPIView):
    """
    api: api/v1/administration/products/
    Представление для:
    - GET: список товаров
    """

    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    serializer_class = ProductSerializer
    pagination_class = ProductListPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ProductListFilter
    search_fields = [
        "article",
        "name",
        "color_name",
        "description",
    ]
    ordering_fields = [
        "id",
        "article",
        "name",
        "price",
        "sale_price",
        "date_created",
        "is_active",
    ]
    ordering = ["-date_created"]

    def get_queryset(self):
        return Product.objects.select_related("product_card", "creator").all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        request.stats = {
            "total_count": queryset.count(),
            "inactive_count": queryset.filter(is_active=False).count(),
        }
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProductDetailView(generics.RetrieveAPIView):
    """
    api: api/v1/administration/products/<int:pk>/
    Представление для:
    - GET: карточка товара
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.select_related("product_card", "creator").all()


class ProductCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/products/create/
    Представление для:
    - POST: создание товара
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.select_related("product_card", "creator").all()


class ProductUpdateView(LoggedUpdateAPIView):
    """
    api: api/v1/administration/products/<int:pk>/update/
    Представление для:
    - PUT, PATCH: обновление товара
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.select_related("product_card", "creator").all()


class ProductDeleteView(LoggedDestroyAPIView):
    """
    api: api/v1/administration/products/<int:pk>/delete/
    Представление для:
    - DELETE: удаление товара
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.select_related("product_card", "creator").all()

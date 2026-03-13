from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import Group, Permission
from django_filters.rest_framework import DjangoFilterBackend

from services.mixin.logged_api_views import LoggedUpdateAPIView, LoggedCreateAPIView

from core.permissions import IsEmployee, CRUDPermissions, GetListPermissions

from users.models import User
from users.serializers import (
    GroupSerializer,
    PermissionSerializer,
    UserSerializer,
    EmployeeSerializer,
    EmployeeCreateSerializer,
)

from .pagination import UsersListPagination
from .filters import UsersListFilter, ShopListFilter
from .models import Shop
from .serializers import ShopSerializer


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


class ShopListView(generics.ListAPIView):
    """
    api: api/v1/administration/shops/
    Представление для:
    - GET: список всех магазинов
    """

    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]

    # Фильтрация, поиск и сортировка
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    
    filterset_class = UsersListFilter
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
    ordering = ["name"]


class ShopDetailView(generics.RetrieveAPIView):
    """
    api: api/v1/administration/shops/<int:pk>/
    Представление для:
    - GET: получение информации о магазине
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
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
    

class ShopCreateView(LoggedCreateAPIView):
    """
    api: api/v1/administration/shops/create/
    Представление для:
    - POST: создание нового магазина
    """

    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

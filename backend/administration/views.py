from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import Group
from django_filters.rest_framework import DjangoFilterBackend

from services.mixin.logged_api_views import LoggedUpdateAPIView, LoggedCreateAPIView

from core.permissions import IsEmployee, CRUDPermissions, GetListPermissions

from users.models import User
from users.serializers import UserSerializer, EmployeeCreateSerializer
from .serializers import GroupSerializer

from .pagination import UsersListPagination
from .filters import UsersListFilter


class GroupListView(generics.ListAPIView):
    """
    Эндпоинт для получения списка групп (только GET)
    """

    permission_classes = [IsAuthenticated, IsEmployee, GetListPermissions]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class UsersListView(generics.ListAPIView):
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
    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class EmployeeUpdateView(LoggedUpdateAPIView):
    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class EmployeeCreateView(LoggedCreateAPIView):
    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()
    serializer_class = EmployeeCreateSerializer

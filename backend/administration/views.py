from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsEmployee, CRUDPermissions, GetListPermissions

from users.models import User
from users.serializers import UserSerializer, EmployeeCreateSerializer

from .pagination import UsersListPagination
from .filters import UsersListFilter


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
        "language"
    )


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    
class EmployeeUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    

class EmployeeCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsEmployee, CRUDPermissions]
    queryset = User.objects.all()
    serializer_class = EmployeeCreateSerializer

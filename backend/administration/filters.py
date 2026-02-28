
from django_filters import rest_framework as filters

from services.filters import NumberInFilter, ChoiceInFilter

from users.models import User


class UsersListFilter(filters.FilterSet):
    class Meta:
        model = User
        fields = ['is_active', 'is_staff', 'is_superuser', 'date_joined']
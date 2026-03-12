from django_filters import rest_framework as filters
from users.models import User
import logging

logger = logging.getLogger(__name__)

class UsersListFilter(filters.FilterSet):
    date_joined = filters.DateFromToRangeFilter(field_name="date_joined", label="Дата регистрации")
    date_archived = filters.DateFromToRangeFilter(field_name="date_archived", label="Дата архивации")
    
    class Meta:
        model = User
        fields = ['is_active', 'is_staff', 'is_superuser', 'date_joined', 'date_archived']
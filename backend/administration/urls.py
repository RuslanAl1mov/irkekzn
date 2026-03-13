from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    GroupListView,
    PermissionListView,
    UsersListView,
    UserDetailView,
    EmployeeUpdateView,
    EmployeeCreateView,
    ShopListView,
    ShopDetailView,
    ShopUpdateView,
    ShopCreateView,
)


urlpatterns = [
    # Пользователи
    path("users/groups/", GroupListView.as_view(), name="groups-list"),
    path("users/permissions/", PermissionListView.as_view(), name="permissions-list"),
    path("users/", UsersListView.as_view(), name="users-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="users-detail"),
    path("users/<int:pk>/update/", EmployeeUpdateView.as_view(), name="users-update"),
    path("users/employee/create/", EmployeeCreateView.as_view(), name="users-create"),
    
    # Магазины
    path("shops/create/", ShopCreateView.as_view(), name="shops-create"),
    path("shops/", ShopListView.as_view(), name="shops-list"),
    path("shops/<int:pk>/", ShopDetailView.as_view(), name="shops-detail"),
    path("shops/<int:pk>/update/", ShopUpdateView.as_view(), name="shops-update"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

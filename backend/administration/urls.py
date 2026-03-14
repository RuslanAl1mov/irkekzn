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
    # Магазины
    ShopListView,
    ShopDetailView,
    ShopUpdateView,
    ShopCreateView,
    ShopDeleteView,
    # Размеры
    SizeListView,
    SizeUpdateView,
    SizeCreateView,
    SizeDeleteView,
    # Цвета палитры
    ColorPaletteListView,
    ColorPaletteCreateView,
    ColorPaletteUpdateView,
    ColorPaletteDeleteView,
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
    path("shops/<int:pk>/delete/", ShopDeleteView.as_view(), name="shops-delete"),
    
    # Размеры
    path("sizes/create/", SizeCreateView.as_view(), name="sizes-create"),
    path("sizes/", SizeListView.as_view(), name="sizes-list"),
    path("sizes/<int:pk>/update/", SizeUpdateView.as_view(), name="sizes-update"),
    path("sizes/<int:pk>/delete/", SizeDeleteView.as_view(), name="sizes-delete"),
    
    # Цвета палитры
    path("color-palettes/create/", ColorPaletteCreateView.as_view(), name="color-palettes-create"),
    path("color-palettes/", ColorPaletteListView.as_view(), name="color-palettes-list"),
    path("color-palettes/<int:pk>/update/", ColorPaletteUpdateView.as_view(), name="color-palettes-update"),
    path("color-palettes/<int:pk>/delete/", ColorPaletteDeleteView.as_view(), name="color-palettes-delete"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

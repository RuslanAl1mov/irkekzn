from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    UsersListView,
    UserDetailView,
    EmployeeUpdateView,
    EmployeeCreateView
    )


urlpatterns = [
    path("users/", UsersListView.as_view(), name="users-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="users-detail"),
    path("users/<int:pk>/update/", EmployeeUpdateView.as_view(), name="users-update"),
    path("users/employee/create/", EmployeeCreateView.as_view(), name="users-create"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

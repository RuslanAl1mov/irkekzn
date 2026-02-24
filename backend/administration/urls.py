from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    EmployeeLoginView
)

urlpatterns = [
    path("auth/login/", EmployeeLoginView.as_view(), name="employee-login"),    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

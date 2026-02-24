from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    ClientLoginView
)

urlpatterns = [
    path("auth/login/", ClientLoginView.as_view(), name="client-login"),    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import i18n
from django.conf.urls.static import static

from users.views import MeView, RefreshJWTView

urlpatterns = [
    path("i18n/", include("django.conf.urls.i18n")),
    
    # Основные аутентификационные эндпоинты
    path("api/v1/auth/me/", MeView.as_view(), name="me"),
    path("api/v1/auth/token/refresh/", RefreshJWTView.as_view(), name="refresh-token"),
    
    # Эндпоинты приложений
    path("api/v1/marketplace/", include("marketplace.urls")),  # Магазин/Вебсайт
    path("api/v1/administration/", include("administration.urls")),  # Администратор
]

urlpatterns += i18n.i18n_patterns(path("admin/", admin.site.urls))


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

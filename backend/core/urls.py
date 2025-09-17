from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import  i18n
from django.conf.urls.static import static

from dj_rest_auth.views import LogoutView
from dj_rest_auth.jwt_auth import get_refresh_view

from marketplace.views import csrf_cookie_view
from users.views import EmployeeLoginView, ClientLoginView, MeView

from django.contrib.sitemaps.views import index, sitemap
from django.views.decorators.cache import cache_page
from .sitemaps import ProductSitemap, CategorySitemap, StaticSitemap


sitemaps = {
    "static": StaticSitemap,
    "products": ProductSitemap,
    "categories": CategorySitemap,
}

urlpatterns = [
    path("i18n/", include("django.conf.urls.i18n")),

    path("api/v1/auth/employee/login/", EmployeeLoginView.as_view(), name="employee-login"),
    path("api/v1/auth/client/login/", ClientLoginView.as_view(),   name="client-login"),    
    path('api/v1/auth/me/', MeView.as_view(), name='me'),
    path("api/v1/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/v1/auth/token/refresh/", get_refresh_view().as_view(), name="token_refresh"),
    path('api/v1/auth/csrf-cookie/', csrf_cookie_view, name='csrf-cookie'),
    
    path('api/v1/company/', include('company.urls')),  # Компания
    path('api/v1/services/', include('services.urls')),  # Сервисы
    path('api/v1/marketplace/', include('marketplace.urls')),  # Магазин/Вебсайт
    path('api/v1/administration/', include('administration.urls')),  # Кабинет администратора
    
    # Индекс-карта: /sitemap.xml → укажет на /sitemap-products.xml, /sitemap-categories.xml (с пагинацией)
    path("sitemap.xml", cache_page(600)(index), {"sitemaps": sitemaps, "sitemap_url_name": "sitemaps"}),
    path("sitemap-<section>.xml", cache_page(600)(sitemap), {"sitemaps": sitemaps}, name="sitemaps"),

]

urlpatterns += i18n.i18n_patterns(path('admin/', admin.site.urls))


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

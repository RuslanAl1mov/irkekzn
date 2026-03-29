from django.urls import path
from drf_spectacular.views import (
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from .views import ManualSchemaView


urlpatterns = [
    path("manual-schema/", ManualSchemaView.as_view(), name="manual-schema"),
    path(
        "manual-docs/",
        SpectacularSwaggerView.as_view(url_name="manual-schema"),
        name="manual-swagger-ui",
    ),
    path(
        "manual-redoc/",
        SpectacularRedocView.as_view(url_name="manual-schema"),
        name="manual-redoc",
    ),
]

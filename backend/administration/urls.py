from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    DashboardView,
    
    ProductCategoryListView,
    ProductCategoryRetrieveView,
    ProductCategoryCreateView,
    ProductCategoryUpdateView,
    ProductCategoryDeleteView,
    
    ProductTagListView,
    ProductTagRetrieveView,
    ProductTagCreateView,
    ProductTagUpdateView,
    ProductTagDeleteView,
    
    ProductListView,
    ProductRetrieveView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
)


urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    
    path("product-categories/", ProductCategoryListView.as_view(), name="product-category-list"),
    path("product-categories/<int:pk>/", ProductCategoryRetrieveView.as_view(), name="product-category-info"),
    path("product-categories/create/", ProductCategoryCreateView.as_view(), name="product-category-create"),
    path("product-categories/<int:pk>/update/", ProductCategoryUpdateView.as_view(), name="product-category-update"),
    path("product-categories/<int:pk>/delete/", ProductCategoryDeleteView.as_view(), name="product-category-delete"),
    
    path("product-tags/", ProductTagListView.as_view(), name="product-tag-list"),
    path("product-tags/<int:pk>/", ProductTagRetrieveView.as_view(), name="product-tag-info"),
    path("product-tags/create/", ProductTagCreateView.as_view(), name="product-tag-create"),
    path("product-tags/<int:pk>/update/", ProductTagUpdateView.as_view(), name="product-tag-update"),
    path("product-tags/<int:pk>/delete/", ProductTagDeleteView.as_view(), name="product-tag-delete"),
       
    path("products/", ProductListView.as_view(), name="admin-products-list"),
    path("products/<int:pk>/", ProductRetrieveView.as_view(), name="admin-product-info"),
    path("products/create/", ProductCreateView.as_view(), name="admin-create-product"),
    path("products/<int:pk>/update/", ProductUpdateView.as_view(), name="product-update"),
    path("products/<int:pk>/delete/", ProductDeleteView.as_view(), name="product-delete"),
    
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

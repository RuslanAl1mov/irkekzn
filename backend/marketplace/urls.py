from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static

from .views import (    
    # Index page endpoint                
    IndexPageView,
    
    # ProductCategory endpoints
    ProductCategoryListView,
    ProductCategoryRetrieveView,    
    
    # Product endpoints
    ProductListView,
    ProductRetrieveView,
    
    # Product tags endpoints
    ProductTagListView
)

urlpatterns = [
    path('index/', IndexPageView.as_view(), name='index'),
    
    # ProductCategory endpoints
    path('product-categories/', ProductCategoryListView.as_view(), name='product_category_list'),
    re_path(r"^product-categories/(?P<key>[\w-]+)/$", ProductCategoryRetrieveView.as_view(), name="product_category_retrieve"),
    
    # Product endpoints
    path('products/', ProductListView.as_view(), name='product_list'),
    re_path(r"^products/(?P<key>[\w-]+)/$", ProductRetrieveView.as_view(), name="product_retrieve_by_id"),
    
    # ProductTag endpoints
    path('product-tags/', ProductTagListView.as_view(), name='product_tag_list'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

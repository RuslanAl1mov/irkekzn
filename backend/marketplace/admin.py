from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import (
    ProductCategory, 
    ProductTag,
    Product, 
    ProductPhoto,
)

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category_photo", "is_actual", "date_created")
    list_filter = ("is_actual",)
    search_fields = ("name",)

    def category_photo(self, obj):
        if obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" width="100" height="auto" />')
        return "-"
    category_photo.short_description = "Фото категории"



@admin.register(ProductTag)
class ProductTagAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_actual")
    list_filter = ("is_actual",)
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_actual", "date_created")
    list_filter = ("is_actual", )
    search_fields = ("name", )


@admin.register(ProductPhoto)
class ProductPhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "order_number", "is_actual", "photo_thumbnail")
    list_filter = ("product", "is_actual")
    search_fields = ("product__name",)

    def photo_thumbnail(self, obj):
        if obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" width="100" height="auto" />')
        return "-"
    photo_thumbnail.short_description = "Фото товара"
    
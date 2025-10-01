from rest_framework import serializers
from .models import (
    ProductCategory,
    ProductTag,
    Product,
    ProductPhoto,
)


class ProductCategorySerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели ProductCategory
    """
    class Meta:
        model = ProductCategory
        exclude = ['is_actual']


class ProductTagSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели ProductTag
    """

    class Meta:
        model = ProductTag
        exclude = ['is_actual']


class ProductPhotoSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели ProductPhoto
    """
    class Meta:
        model = ProductPhoto
        exclude = ['is_actual']


class ProductSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Product с упорядочиванием фотографий по order_number
    включает всю информацию о категории через вложенный ProductCategorySerializer
    включает всю информацию о тегах через вложенный ProductTagSerializer
    """

    photo = serializers.SerializerMethodField()
    categories = ProductCategorySerializer(many=True, read_only=True)
    tags = ProductTagSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_photo(self, obj):
        qs = obj.productphoto_set.order_by("order_number")
        return ProductPhotoSerializer(qs, many=True, context=self.context).data



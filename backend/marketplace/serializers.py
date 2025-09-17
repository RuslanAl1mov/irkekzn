from rest_framework import serializers
from .models import (
    ProductCategory,
    ProductTag,
    MeasurementType,
    MeasurementUnit,
    ProductParameter,
    Product,
    ProductPhoto,
    ProductParameter
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


class MeasurementTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasurementType
        fields = "__all__"
        
        
class MeasurementUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasurementUnit
        fields = "__all__"


class ProductParameterSerializer(serializers.ModelSerializer):
    """
    Полный сериализатор характеристики товара (ProductParameter).

    Включает все поля модели, кроме `is_actual`, чтобы не
    отдавать служебный флаг актуальности на клиент.
    """
    
    measurement_type = MeasurementTypeSerializer()
    measurement_unit = MeasurementUnitSerializer()
    
    class Meta:
        model = ProductParameter
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Product с упорядочиванием фотографий по order_number
    включает всю информацию о категории через вложенный ProductCategorySerializer
    включает всю информацию о тегах через вложенный ProductTagSerializer
    """

    photo = serializers.SerializerMethodField()
    parameters = serializers.SerializerMethodField()
    categories = ProductCategorySerializer(many=True, read_only=True)
    tags = ProductTagSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_photo(self, obj):
        qs = obj.productphoto_set.order_by("order_number")
        return ProductPhotoSerializer(qs, many=True, context=self.context).data

    def get_parameters(self, obj):
        qs = obj.productparameter_set.all()
        return ProductParameterSerializer(qs, many=True, context=self.context).data


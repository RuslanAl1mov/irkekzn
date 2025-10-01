from django.db import transaction, models
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.mixin.dynamic_fields_mixin import DynamicFieldsModelSerializer
from marketplace.models import (
    ProductCategory,
    ProductTag,
    Product,
    ProductPhoto,
)

from core.utils.fields import (
    CSVListField,
    NullableFloatField,
)

class ProductCategorySerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ProductCategory
    """

    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ProductCategory
        fields = [
            "id",
            "slug",
            "photo",
            "cover",
            "is_actual",
            "date_created",
            "products_count",
            "name",
            "name_ru",
            "name_en",
            "description",
            "description_ru",
            "description_en",
        ]


class ProductCategoryCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания ProductCategory.
    Принимает multipart/form-data:
      • name_ru        — название категории на русском (строка, обязательно)
      • name_en        — название категории на узбекском (строка, обязательно)
      • photo          — главное фото категории (File, обязательно)
      • cover          — обложка страницы (File, опционально)
      • description_ru — описание на русском (строка, опционально)
      • description_en — описание на узбекском (строка, опционально)
      • is_actual      — флаг «показывать в системе» (boolean, опционально)
    """
    name_ru        = serializers.CharField(max_length=250)
    name_en        = serializers.CharField(max_length=250)
    photo          = serializers.ImageField()
    cover          = serializers.ImageField(required=False, allow_null=True)
    description_ru = serializers.CharField(required=False, allow_blank=True)
    description_en = serializers.CharField(required=False, allow_blank=True)
    is_actual      = serializers.BooleanField(default=True)

    class Meta:
        model = ProductCategory
        fields = [
            'name_ru', 'name_en',
            'photo', 'cover',
            'description_ru', 'description_en',
            'is_actual',
        ]

    def validate_name_ru(self, value):
        if ProductCategory.objects.filter(name=value).exists():
            raise ValidationError('Категория с таким названием уже существует.')
        return value

    @transaction.atomic
    def create(self, validated_data):
        # Переносим мультиязычные поля в реальные атрибуты модели
        validated_data['name'] = validated_data.pop('name_ru')
        validated_data['name_en'] = validated_data.pop('name_en')
        if 'description_ru' in validated_data:
            validated_data['description'] = validated_data.pop('description_ru')
        if 'description_en' in validated_data:
            validated_data['description_en'] = validated_data.pop('description_en')
        return super().create(validated_data)



class ProductCategoryUpdateSerializer(serializers.ModelSerializer):
    name_ru        = serializers.CharField(required=False)
    name_en        = serializers.CharField(required=False)
    description_ru = serializers.CharField(required=False, allow_blank=True)
    description_en = serializers.CharField(required=False, allow_blank=True)
    photo          = serializers.ImageField(required=False, allow_null=True)
    cover          = serializers.ImageField(required=False, allow_null=True)
    is_actual      = serializers.BooleanField(required=False)

    class Meta:
        model = ProductCategory
        fields = [
            'name_ru', 'name_en',
            'photo', 'cover',
            'description_ru', 'description_en',
            'is_actual',
        ]

    @transaction.atomic
    def update(self, instance, validated_data):
        # Переводим мультиязычные поля в реальные атрибуты модели
        lang_map = {
            'name_ru':        'name',
            'name_en':        'name_en',          # если в модели есть поле name_en
            'description_ru': 'description',
            'description_en': 'description_en',   # если есть описание на узбекском
        }
        for src, dst in lang_map.items():
            if src in validated_data:
                setattr(instance, dst, validated_data.pop(src))

        # Остальные поля напрямую
        for attr, val in validated_data.items():
            setattr(instance, attr, val)

        instance.save()
        return instance
    

class ProductTagSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ProductTag:
    включает всю информацию о категории через вложенный ProductCategorySerializer
    """
    
    products_count = serializers.IntegerField(read_only=True)
    categories_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ProductTag
        fields = "__all__"


class ProductPhotoSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ProductPhoto
    """

    class Meta:
        model = ProductPhoto
        fields = "__all__"


class ProductSerializer(DynamicFieldsModelSerializer):
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
    

class ProductCreateSerializer(serializers.ModelSerializer):
    # языковые поля
    name_ru = serializers.CharField(max_length=250)
    name_en = serializers.CharField(max_length=250)
    description_short_ru = serializers.CharField(max_length=250, allow_blank=True, required=False)
    description_short_en = serializers.CharField(max_length=250, allow_blank=True, required=False)
    description_ru = serializers.CharField(allow_blank=True, required=False)
    description_en = serializers.CharField(allow_blank=True, required=False)

    # связи
    category_ids = CSVListField(child=serializers.IntegerField(min_value=1), write_only=True)
    tag_ids = CSVListField(child=serializers.IntegerField(min_value=1), write_only=True, allow_empty=True, required=False, default=list)

    # файлы
    photos = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False, allow_empty=True, default=list)


    class Meta:
        model  = Product
        fields = [
            "sku", "price", "sale_price", "is_actual",
            "name_ru", "name_en",
            "description_short_ru", "description_short_en",
            "description_ru", "description_en",
            "category_ids", "tag_ids", "photos",
        ]
        
    def validate_sku(self, value):
        if Product.objects.filter(sku=value).exists():
            raise ValidationError("Артикул уже используется.")
        return value

    def validate_category_ids(self, value):
        # обязательно хотя бы одна категория
        if not value:
            raise ValidationError("Нужно указать хотя бы одну категорию.")
        qs = ProductCategory.objects.filter(id__in=value, is_actual=True)
        if qs.count() != len(set(value)):
            raise ValidationError("Одна или несколько категорий не найдены или неактуальны.")
        return value

    def validate_tag_ids(self, value):
        # обязательно хотя бы один тег
        if not value:
            raise ValidationError("Нужно указать хотя бы один тег.")
        qs = ProductTag.objects.filter(id__in=value, is_actual=True)
        if qs.count() != len(set(value)):
            raise ValidationError("Один или несколько тегов не найдены или неактуальны.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        category_ids = validated_data.pop("category_ids")
        tag_ids = validated_data.pop("tag_ids", [])
        photos = validated_data.pop("photos", [])


        # перенос RU/EN-полей
        validated_data["name"] = validated_data.pop("name_ru")
        validated_data["name_en"] = validated_data.pop("name_en")
        validated_data["description_short"] = validated_data.pop("description_short_ru", "")
        validated_data["description_short_en"] = validated_data.pop("description_short_en", "")
        validated_data["description"] = validated_data.pop("description_ru", "")
        validated_data["description_en"] = validated_data.pop("description_en", "")

        product = Product.objects.create(**validated_data)

        # связи
        product.categories.set(category_ids)
        if tag_ids:
            product.tags.set(tag_ids)

        # фото
        for order, img in enumerate(photos, 1):
            ProductPhoto.objects.create(product=product, photo=img, order_number=order)

        return product



class ProductUpdateSerializer(serializers.ModelSerializer):
    # простые
    sku        = serializers.CharField(max_length=64, required=False)
    price      = NullableFloatField(required=False, allow_null=True)
    sale_price = NullableFloatField(required=False, allow_null=True)
    is_actual  = serializers.BooleanField(required=False)

    # языковые
    name_ru = serializers.CharField(max_length=250, required=False)
    name_en = serializers.CharField(max_length=250, required=False)
    description_short_ru = serializers.CharField(max_length=250, required=False, allow_blank=True)
    description_short_en = serializers.CharField(max_length=250, required=False, allow_blank=True)
    description_ru = serializers.CharField(required=False, allow_blank=True)
    description_en = serializers.CharField(required=False, allow_blank=True)

    # связи / файлы
    category_ids = CSVListField(child=serializers.IntegerField(min_value=1),
                                required=False, allow_empty=False)
    tag_ids = CSVListField(child=serializers.IntegerField(min_value=1),
                           required=False, allow_empty=True, default=list)
    photos = serializers.ListField(child=serializers.ImageField(),
                                   required=False, allow_empty=True, default=list)
    deleted_photo_ids = CSVListField(child=serializers.IntegerField(min_value=1),
                                     required=False, allow_empty=True, default=list)


    class Meta:
        model  = Product
        fields = (
            "sku", "price", "sale_price", "is_actual",
            "name_ru", "name_en",
            "description_short_ru", "description_short_en",
            "description_ru", "description_en",
            "category_ids", "tag_ids",
            "photos", "deleted_photo_ids",
        )
        
    def validate_sku(self, value):
        # при обновлении надо исключить текущий объект из проверки
        qs = Product.objects.filter(sku=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise ValidationError("Артикул уже используется.")
        return value
    
    def validate_category_ids(self, value):
        if not value:
            raise ValidationError("Нужно указать хотя бы одну категорию.")
        qs = ProductCategory.objects.filter(id__in=value, is_actual=True)
        if qs.count() != len(set(value)):
            raise ValidationError("Одна или несколько категорий не найдены или неактуальны.")
        return value

    def validate_tag_ids(self, value):
        if not value:
            raise ValidationError("Нужно указать хотя бы один тег.")
        qs = ProductTag.objects.filter(id__in=value, is_actual=True)
        if qs.count() != len(set(value)):
            raise ValidationError("Один или несколько тегов не найдены или неактуальны.")
        return value

    @transaction.atomic
    def update(self, instance: Product, validated_data):
        category_ids = validated_data.pop("category_ids", None)
        tag_ids = validated_data.pop("tag_ids", None)
        new_photos = validated_data.pop("photos", [])
        deleted_photo_ids = validated_data.pop("deleted_photo_ids", [])

        # price / sale_price
        if "price" in validated_data:
            instance.price = validated_data.pop("price")
        if "sale_price" in validated_data:
            instance.sale_price = validated_data.pop("sale_price")

        # языковые поля
        lang_map = {
            "name_ru": "name",
            "name_en": "name_en",
            "description_short_ru": "description_short",
            "description_short_en": "description_short_en",
            "description_ru": "description",
            "description_en": "description_en",
        }
        for incoming, attr in lang_map.items():
            if incoming in validated_data:
                setattr(instance, attr, validated_data.pop(incoming))

        # остальные
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Many-to-Many
        if category_ids is not None:
            instance.categories.set(category_ids)
        if tag_ids is not None:
            instance.tags.set(tag_ids)

        # удаление фото
        if deleted_photo_ids:
            qs = instance.productphoto_set.filter(id__in=deleted_photo_ids)
            for photo in qs:
                photo.photo.delete(save=False)
            qs.delete()

        # добавление фото
        if new_photos:
            start_order = instance.productphoto_set.aggregate(m=models.Max("order_number"))["m"] or 0
            for shift, img in enumerate(new_photos, 1):
                ProductPhoto.objects.create(
                    product=instance,
                    photo=img,
                    order_number=start_order + shift,
                )

        return instance
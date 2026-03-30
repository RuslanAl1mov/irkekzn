from PIL import Image
from django.db import transaction

from rest_framework import serializers
import django.db.models as models
from users.models import RequestLog
from users.serializers import UserSerializer
from .models import (
    Shop,
    Size,
    ColorPalette,
    Settings,
    ProductCategory,
    Product,
    ProductImage,
    ProductStock,
    ProductCategoryCover,
    ProductCard,
)
from services.validators import phone_number_ru_validator
from services.default_creator import CurrentUserDefault
from services.mixin.dynamic_fields_mixin import DynamicFieldsModelSerializer


class RequestLogSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели RequestLog
    """

    class Meta:
        model = RequestLog
        fields = "__all__"
        read_only_fields = ["id"]


class SettingsSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели Settings
    """

    class Meta:
        model = Settings
        fields = "__all__"
        read_only_fields = ["id"]


class ShopSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для магазина
    """

    class Meta:
        model = Shop
        fields = [
            "id",
            "name",
            "email",
            "phone_first",
            "phone_second",
            "phone_third",
            "telegram_link",
            "telegram_name",
            "vk_link",
            "vk_name",
            "instagram_link",
            "instagram_name",
            "is_main_office",
            "is_active",
            "city",
            "address",
            "map_location",
        ]
        read_only_fields = ["id"]

    def validate_is_main_office(self, value):
        """
        Валидация поля is_main_office
        - При создании: всегда разрешаем (логика в save)
        - При обновлении: запрещаем снимать статус, если нет другого главного
        """
        # Случай 1: СОЗДАНИЕ нового объекта
        if not self.instance:
            return value

        # Случай 2: ОБНОВЛЕНИЕ существующего объекта
        current_is_main = self.instance.is_main_office

        # Если значение не меняется - ок
        if current_is_main == value:
            return value

        # Если пытаемся снять статус главного (был True, стал False)
        if current_is_main and not value:
            other_main_exists = (
                Shop.objects.filter(is_main_office=True)
                .exclude(pk=self.instance.pk)
                .exists()
            )

            if not other_main_exists:
                raise serializers.ValidationError(
                    "Нельзя снять статус главного офиса. "
                    "Сначала назначьте другой магазин главным."
                )

        # Если пытаемся сделать этот магазин главным (был False, стал True)
        # Всегда разрешаем, сброс других произойдет в save()
        return value

    def validate(self, data):
        # Собираем все номера
        phone_fields = ["phone_first", "phone_second", "phone_third"]

        for field in phone_fields:
            if field in data and data[field]:
                # Валидируем и обновляем отформатированный номер (79641234567)
                formatted_phone = phone_number_ru_validator(data[field])
                data[field] = formatted_phone

        # Проверяем, что номера не дублируются
        phones = [data[f] for f in phone_fields if f in data and data[f]]
        if len(phones) != len(set(phones)):
            raise serializers.ValidationError("Телефонные номера не должны повторяться")
        return data


class SizeSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели Size без валидаций
    """

    order = serializers.IntegerField(required=False)

    class Meta:
        model = Size
        fields = "__all__"
        read_only_fields = ["id"]

    def validate(self, attrs):
        # При обновлении проверяем наличие order
        if self.instance and "order" not in attrs:
            raise serializers.ValidationError(
                {"order": "При обновлении размера поле order обязательно"}
            )
        elif self.instance and "order" in attrs:
            if attrs["order"] < 0:
                raise serializers.ValidationError(
                    {"order": "Порядок должен быть больше 0"}
                )
            if (
                Size.objects.filter(order=attrs["order"])
                .exclude(pk=self.instance.pk)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"order": "Порядок должен быть уникальным"}
                )
        return attrs

    def create(self, validated_data):
        max_order = Size.objects.aggregate(models.Max("order"))["order__max"]
        validated_data["order"] = (max_order or 0) + 1
        return super().create(validated_data)


class ColorPaletteSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ColorPalette без валидаций
    """

    class Meta:
        model = ColorPalette
        fields = "__all__"
        read_only_fields = ["id"]

    def validate(self, data):
        """
        Валидация на уровне объекта (если нужно проверить комбинацию полей)
        """
        # Если это обновление, исключаем текущий объект из проверки уникальности
        if self.instance:
            # Проверяем, что name не конфликтует с другими записями
            if (
                ColorPalette.objects.filter(name=data.get("name", self.instance.name))
                .exclude(id=self.instance.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"name": "Цвет с таким названием уже существует"}
                )

            # Проверяем, что hex не конфликтует с другими записями
            if (
                ColorPalette.objects.filter(
                    hex=data.get("hex", self.instance.hex).upper()
                )
                .exclude(id=self.instance.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"hex": "Цвет с таким HEX-кодом уже существует"}
                )

        return data


class ProductCategoryCoverSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ProductCategoryCover
    """

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(),
        write_only=True,
        required=False,
        source="category",
    )
    creator = UserSerializer(
        read_only=True, fields=["id", "first_name", "last_name", "email", "is_active"]
    )
    creator_id = serializers.HiddenField(default=CurrentUserDefault(), source="creator")

    class Meta:
        model = ProductCategoryCover
        fields = [
            "id",
            "category",
            "category_id",
            "image",
            "creator",
            "creator_id",
            "is_active",
            "date_created",
        ]
        read_only_fields = ["id", "date_created", "creator"]

    def validate_image(self, value):
        # Проверка размера файла (10 MB)
        max_size = 10 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Размер изображения не должен превышать 10 MB."
            )

        # Проверка соотношения сторон
        value.seek(0)
        img = Image.open(value)
        width, height = img.size

        if height == 0 or width == 0:
            raise serializers.ValidationError("Некорректное изображение.")

        if not (1.76 <= width / height <= 1.79):
            raise serializers.ValidationError("Изображение должно быть в формате 16:9.")

        value.seek(0)
        return value


class ProductCategorySerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ProductCategory
    """

    creator = UserSerializer(
        read_only=True, fields=["id", "first_name", "last_name", "email", "is_active"]
    )
    creator_id = serializers.HiddenField(default=CurrentUserDefault(), source="creator")
    parent = serializers.SerializerMethodField()
    parent_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(),
        required=False,
        source="parent",
        allow_null=True,
        write_only=True,
    )
    covers = ProductCategoryCoverSerializer(many=True, read_only=True)
    covers_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=ProductCategoryCover.objects.all(),
        source="covers",
        required=True,
    )

    class Meta:
        model = ProductCategory
        fields = [
            "id",
            "name",
            "description",
            "covers",
            "covers_ids",
            "parent",
            "parent_id",
            "is_active",
            "creator",
            "creator_id",
            "date_created",
        ]
        read_only_fields = ["id", "date_created", "creator"]

    def get_parent(self, obj):
        """
        Сериализатор родительской категории
        """
        if obj.parent:
            return {
                "id": obj.parent.id,
                "name": obj.parent.name,
            }
        return None

    def validate_parent_id(self, parent_id):
        """
        Проверяем, что parent_id не привязана уже к другой категории
        """
        if parent_id and self.instance and parent_id.pk == self.instance.pk:
            raise serializers.ValidationError(
                "Родительская категория не может быть привязана к самой себе."
            )
        return parent_id

    def validate_covers_ids(self, covers):
        """
        При создании/обновлении проверяем, что обложка не привязана уже к другой категории
        """
        if len(covers) < 1:
            raise serializers.ValidationError(
                "Необходимо сохранить хотя бы одно изображение."
            )

        for cover in covers:
            if cover.category is not None and (
                not self.instance or cover.category_id != self.instance.id
            ):
                raise serializers.ValidationError(
                    f"Обложка с id={cover.id} уже привязана к другой категории."
                )
        return covers

    def validate(self, attrs):
        """
        Проверяем, что name без parent дает уникальное значение в спика всех name без parent
        Если parent есть, то проверям, что name является уникальным в этой родительской категории
        """
        name = attrs.get("name")
        parent = attrs.get("parent")

        if self.instance:
            name = name if name is not None else self.instance.name
            parent = parent if "parent" in attrs else self.instance.parent

        if name:
            qs = ProductCategory.objects.filter(name=name, parent=parent).exclude(
                id=self.instance.pk if self.instance else None
            )

            if qs.exists():
                if parent is None:
                    raise serializers.ValidationError(
                        {
                            "name": "Категория с таким названием без родительской категории уже существует."
                        }
                    )
                raise serializers.ValidationError(
                    {
                        "name": "Категория с таким названием в этой родительской категории уже существует."
                    }
                )

        return attrs


class ProductCardSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ProductCard
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Проверяем глобавльные настройки системы
        self.global_settings = Settings.objects.first()

        # Если используем глобальные настройки карточки товаров, то скрываем поля настроек карточки товара
        # Берём значения из глобальных настроек системы
        if self.global_settings.set_global_product_card_settings:
            self.fields["is_all_products_same_name"] = serializers.HiddenField(
                default=self.global_settings.is_all_products_same_name
            )
            self.fields["is_all_products_same_price"] = serializers.HiddenField(
                default=self.global_settings.is_all_products_same_price
            )
            self.fields["is_all_products_same_description"] = serializers.HiddenField(
                default=self.global_settings.is_all_products_same_description
            )
            self.fields["is_all_products_same_model"] = serializers.HiddenField(
                default=self.global_settings.is_all_products_same_model
            )

        # Если не используем глобальные настройки карточки товаров,
        # то делаем поля настроек карточки товара обязательными
        if not self.global_settings.set_global_product_card_settings:
            self.fields["is_all_products_same_name"].required = True
            self.fields["is_all_products_same_price"].required = True
            self.fields["is_all_products_same_description"].required = True
            self.fields["is_all_products_same_model"].required = True

            self.fields["name"].required = True
            self.fields["price"].required = True
            self.fields["description"].required = True
            self.fields["model"].required = True

    creator = UserSerializer(
        read_only=True, fields=["id", "first_name", "last_name", "email", "is_active"]
    )
    creator_id = serializers.HiddenField(default=CurrentUserDefault(), source="creator")
    categories = ProductCategorySerializer(many=True, read_only=True)
    categories_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=ProductCategory.objects.all(),
        source="categories",
        required=True,
    )

    name = serializers.CharField(required=False, max_length=255, write_only=True)
    price = serializers.DecimalField(
        required=False, max_digits=10, decimal_places=2, write_only=True
    )
    description = serializers.CharField(required=False, write_only=True)
    model = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = ProductCard
        fields = [
            "id",
            "categories",
            "categories_ids",
            "is_all_products_same_name",
            "is_all_products_same_price",
            "is_all_products_same_description",
            "is_all_products_same_model",
            "name",
            "price",
            "description",
            "model",
            "creator",
            "creator_id",
            "is_active",
            "date_created",
        ]
        read_only_fields = ["id", "date_created", "creator"]


class ProductStockSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ProductStock
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Если сериализатор используется как child где product_id подставляется автоматически,
        # то делаем product_id необязательным
        if self.context.get('is_product_id_known'):
            self.fields['product_id'].required = False
            self.fields['product_id'].allow_null = True
            self.fields['product_id'].default = None
    
    product = serializers.SerializerMethodField()
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        source="product",
        required=True,
    )

    size = SizeSerializer(read_only=True)
    size_id = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(),
        write_only=True,
        source="size",
        required=True,
    )   
    shop = ShopSerializer(read_only=True)
    shop_id = serializers.PrimaryKeyRelatedField(
        queryset=Shop.objects.filter(is_active=True),
        write_only=True,
        source="shop",
        required=True,
    )

    class Meta:
        model = ProductStock
        fields = [
            "id",
            "product",
            "product_id",
            "size",
            "size_id",
            "shop",
            "shop_id",
            "amount",
        ]
        read_only_fields = ["id", "size", "shop"]
        
    def get_product(self, obj):
        return {
            "id": obj.product.id,
            "name": obj.product.name,
            "article": obj.product.article,
            "color_name": obj.product.color_name,
            "is_custom_color": obj.product.is_custom_color,
            "color": obj.product.color,
            "description": obj.product.description,
            "model_params": obj.product.model_params,
            "material_and_care": obj.product.material_and_care,
            "price": obj.product.price,
            "sale_price": obj.product.sale_price,
        }

    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Количество товара не может быть отрицательным."
            )
        return value


class ProductImageSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели ProductImage
    """

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        source="product",
        required=False,
    )
    creator = UserSerializer(
        read_only=True, fields=["id", "first_name", "last_name", "email", "is_active"]
    )
    creator_id = serializers.HiddenField(default=CurrentUserDefault(), source="creator")

    class Meta:
        model = ProductImage
        fields = [
            "id",
            "product",
            "product_id",
            "image",
            "preview",
            "creator",
            "creator_id",
            "is_active",
            "date_created",
        ]
        read_only_fields = ["id", "date_created", "creator", "product", "preview"]

    def validate_image(self, value):
        max_size = 10 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Размер изображения не должен превышать 10 MB."
            )

        value.seek(0)
        img = Image.open(value)
        width, height = img.size

        if width <= 0 or height <= 0:
            raise serializers.ValidationError("Некорректное изображение.")

        ratio = width / height
        target_ratio = 520 / 738
        tolerance = 0.02  # можно 0.01, если нужна строже

        if abs(ratio - target_ratio) > tolerance:
            raise serializers.ValidationError(
                "Изображение должно быть в пропорции, близкой к 520×738."
            )

        value.seek(0)
        return value


class ProductSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели Product
    """

    creator = UserSerializer(
        read_only=True, fields=["id", "first_name", "last_name", "email", "is_active"]
    )
    creator_id = serializers.HiddenField(default=CurrentUserDefault(), source="creator")

    product_card = ProductCardSerializer(read_only=True)
    product_card_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCard.objects.all(),
        write_only=True,
        source="product_card",
        required=True,
    )

    images = ProductImageSerializer(many=True, read_only=True)
    images_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=ProductImage.objects.all(),
        source="images",
        required=True,
    )

    stocks = ProductStockSerializer(many=True, read_only=True, fields=["id", "size", "shop", "amount"])
    stocks_data = serializers.ListField(
        child=ProductStockSerializer(context={"is_product_id_known": True}),
        write_only=True,
        required=True,
    )
    
    class Meta:
        model = Product
        fields = [
            "id",
            "product_card",
            "product_card_id",
            "article",
            "name",
            "color_name",
            "is_custom_color",
            "color",
            "description",
            "model_params",
            "material_and_care",
            "price",
            "sale_price",
            "stocks",
            "stocks_data",
            "images",
            "images_ids",
            "date_created", 
            "is_active",
            "creator",
            "creator_id",
        ]
        read_only_fields = ["id", "date_created", "creator"]
        validators = []

    def validate_article(self, value):
        qs = Product.objects.filter(article=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Товар с таким артикулом уже существует.")
        return value

    def validate_color(self, value):
        if not self.is_custom_color and value is None:
            raise serializers.ValidationError(
                "Цвет не может быть пустым, если вы не устанавливаете пользовательский цвет."
            )
        return value

    def validate_images_ids(self, images):
        """
        При создании/обновлении проверяем, что изображение не привязана уже к другому товару
        """
        if len(images) < 1:
            raise serializers.ValidationError(
                "Необходимо сохранить хотя бы одно изображение."
            )

        for image in images:
            if image.product is not None and (
                not self.instance or image.product_id != self.instance.id
            ):
                raise serializers.ValidationError(
                    f"Изображение с id={image.id} уже привязана к другому товару."
                )
        return images
    
    def validate_stocks_data(self, stocks_data):
        """
        При создании/обновлении проверяем, что остаток не привязан уже к другому товару
        """
        if len(stocks_data) < 1:
            raise serializers.ValidationError("Необходимо указать кол-во оставшихся размеров товара в магазинах.")
        return stocks_data

    def validate(self, attrs):
        product_card = attrs.get("product_card")
        color_name = attrs.get("color_name")
        if self.instance:
            if product_card is None:
                product_card = self.instance.product_card
            if color_name is None:
                color_name = self.instance.color_name
        if product_card is not None and color_name:
            qs = Product.objects.filter(
                product_card=product_card, color_name=color_name
            )
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {
                        "color_name": "Товар с таким названием цвета уже есть у этой карточки."
                    }
                )
        return attrs
    
    def create(self, validated_data):
        stocks_data = validated_data.pop("stocks_data", [])
        images = validated_data.pop("images", [])

        with transaction.atomic():
            product = Product.objects.create(**validated_data)

            if images:
                product.images.set(images)

            stocks_to_create = []
            for item in stocks_data:
                data = {**item}
                data.pop("product", None)
                stocks_to_create.append(ProductStock(product=product, **data))
            ProductStock.objects.bulk_create(stocks_to_create)
        
        return product
    
    def update(self, instance, validated_data):
        stocks_data = validated_data.pop("stocks_data", None)
        images = validated_data.pop("images", None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if images is not None:
                instance.images.set(images)
            
            if stocks_data is not None:
                instance.stocks.all().delete()
                stocks_to_create = []
                for item in stocks_data:
                    data = {**item}
                    data.pop("product", None)
                    stocks_to_create.append(ProductStock(product=instance, **data))
                ProductStock.objects.bulk_create(stocks_to_create)
        
        return instance

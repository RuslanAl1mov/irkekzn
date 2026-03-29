from PIL import Image

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
)
from services.validators import phone_number_ru_validator
from services.default_creator import CurrentUserDefault


class RequestLogSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели RequestLog
    """

    class Meta:
        model = RequestLog
        fields = "__all__"
        read_only_fields = ["id"]


class SettingsSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Settings
    """

    class Meta:
        model = Settings
        fields = "__all__"
        read_only_fields = ["id"]


class ShopSerializer(serializers.ModelSerializer):
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


class SizeSerializer(serializers.ModelSerializer):
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


class SizeUpdateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Size с валидацией
    """

    class Meta:
        model = Size
        fields = "__all__"
        read_only_fields = ["id"]


class ColorPaletteSerializer(serializers.ModelSerializer):
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


class ProductCategoryCoverSerializer(serializers.ModelSerializer):
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
        read_only_fields = ["id"]

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


class ProductCategorySerializer(serializers.ModelSerializer):
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
        write_only=True
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
        read_only_fields = ["id", "creator"]

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

from io import BytesIO
import uuid
from PIL import Image

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile

from simple_history.models import HistoricalRecords


User = get_user_model()


class Settings(models.Model):
    """
    Singleton модель для хранения глобальных настроек.
    Может существовать только одна запись.
    """

    set_global_product_card_settings = models.BooleanField(
        default=True, verbose_name="Использовать общие настройки карточки товаров"
    )

    is_all_products_same_name = models.BooleanField(
        default=False, verbose_name="Все товары имеют одинаковое название"
    )

    is_all_products_same_price = models.BooleanField(
        default=False, verbose_name="Все товары имеют одинаковую цену"
    )

    is_all_products_same_description = models.BooleanField(
        default=False, verbose_name="Все товары имеют одинаковое описание"
    )

    is_all_products_same_model = models.BooleanField(
        default=False, verbose_name="Все товары имеют одинаковую модель"
    )

    # Метаданные
    date_updated = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Настройки"
        verbose_name_plural = "Настройки"
        # Запрещаем создание более одной записи на уровне БД
        constraints = [
            models.CheckConstraint(
                check=models.Q(id__lte=1), name="single_settings_record"
            )
        ]

    def __str__(self):
        return "Глобальные настройки системы"

    @classmethod
    def get_settings(cls):
        """
        Получить настройки. Создает запись по умолчанию, если её нет.
        """
        settings, created = cls.objects.get_or_create(
            defaults={
                "set_global_product_card_settings": True,
                "is_all_products_same_name": False,
                "is_all_products_same_price": False,
                "is_all_products_same_description": False,
                "is_all_products_same_model": False,
            }
        )
        return settings


class Shop(models.Model):
    # Основная информация
    name = models.CharField(verbose_name="Название", max_length=250)
    email = models.EmailField(verbose_name="Email", blank=True, null=True)

    # Контакты
    phone_first = models.CharField(max_length=30, verbose_name="Первый телефон")
    phone_second = models.CharField(
        max_length=30,
        verbose_name="Второй телефон",
        blank=True,
        null=True,
    )
    phone_third = models.CharField(
        max_length=30,
        verbose_name="Третий телефон",
        blank=True,
        null=True,
    )

    # Социальные сети
    telegram_link = models.TextField(
        verbose_name="Telegram ссылка", blank=True, null=True
    )
    telegram_name = models.CharField(
        max_length=250, verbose_name="Telegram имя", blank=True, null=True
    )

    vk_link = models.TextField(verbose_name="VK ссылка", blank=True, null=True)
    vk_name = models.CharField(
        max_length=250, verbose_name="VK имя", blank=True, null=True
    )

    instagram_link = models.TextField(
        verbose_name="Instagram ссылка", blank=True, null=True
    )
    instagram_name = models.CharField(
        max_length=250, verbose_name="Instagram имя", blank=True, null=True
    )

    # Адресная информация
    is_main_office = models.BooleanField(default=False, verbose_name="Главный офис")
    city = models.CharField(max_length=250, verbose_name="Город")
    address = models.TextField(verbose_name="Адрес", unique=True)
    map_location = models.TextField(
        verbose_name="Ссылка на карту",
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен",
        help_text="Если магазин не активен, он не будет отображаться в списке магазинов",
    )

    history = HistoricalRecords(
        related_name="history_shop",
        cascade_delete_history=True,  # При удалении магазина удаляется и его история
    )

    class Meta:
        verbose_name = "Магазин"
        verbose_name_plural = "Магазины"

        permissions = (("view_shop_list", "Can see Shops list"),)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """
        Переопределенный метод save.
        - Если в базе нет ни одного магазина, текущий автоматически становится главным
        - Если текущий магазин становится главным офисом (is_main_office=True),
        то у всех остальных магазинов is_main_office сбрасывается на False
        """
        if not Shop.objects.exists():
            self.is_main_office = True

        elif self.is_main_office:
            Shop.objects.exclude(pk=self.pk).update(is_main_office=False)

        super().save(*args, **kwargs)


class Size(models.Model):
    """
    Модель для хранения размеров одежды
    """

    russian = models.CharField(
        max_length=8, verbose_name="Российский размер", help_text="От 40 до 52"
    )
    international = models.CharField(
        max_length=8,
        verbose_name="Международный размер",
        help_text="Например: XXS, XS, S, M, L, XL, XXL",
    )
    european = models.CharField(
        max_length=8, verbose_name="Европейский размер", help_text="От 34 до 46"
    )
    chest_circumference = models.CharField(
        max_length=8, verbose_name="Обхват груди (см)", help_text="От 80 до 104"
    )
    waist_circumference = models.CharField(
        max_length=8, verbose_name="Обхват талии (см)", help_text="От 60 до 86"
    )
    hip_circumference = models.CharField(
        max_length=8, verbose_name="Обхват бедер (см)", help_text="От 86 до 112"
    )

    order = models.PositiveIntegerField(verbose_name="Порядок", unique=True)

    class Meta:
        verbose_name = "Размер"
        verbose_name_plural = "Размеры"

        permissions = (("view_size_list", "Can see Sizes list"),)

    def __str__(self):
        return f"{self.russian} - {self.international} - {self.european}"


class ColorPalette(models.Model):
    """
    Модель для цветовой палитры
    """

    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Название",
        help_text="Например: Основные цвета, Пастельные тона и т.д.",
    )

    hex = models.CharField(
        max_length=7,  # 7 символов включая #
        verbose_name="HEX код",
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^#([A-Fa-f0-9]{6})$",  # Только 6 символов!
                message="Введите корректный 6-значный HEX-код цвета (например: #FF5733)",
            )
        ],
        help_text="Формат: #RRGGBB (например: #FF5733)",
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен",
        help_text="Отображать ли этот цвет в палитре",
    )

    class Meta:
        verbose_name = "Цвет палитры"
        verbose_name_plural = "Цвета палитры"

        permissions = (("view_colorpalette_list", "Can see ColorPalettes list"),)

    def __str__(self):
        return f"{self.id} ({self.name} - {self.hex})"

    def save(self, *args, **kwargs):
        """
        Автоматическое преобразование HEX-кода к верхнему регистру
        """
        if self.hex:
            # Приводим HEX к верхнему регистру (опционально)
            self.hex = self.hex.upper()
        super().save(*args, **kwargs)


class ProductCategory(models.Model):
    """
    Модель для категорий товаров
    """

    name = models.CharField(max_length=250, verbose_name="Название")
    description = models.TextField(verbose_name="Описание", null=True, blank=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.PROTECT,
        verbose_name="Родительская категория",
        null=True,
        blank=True,
        default=None,
    )

    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    creator = models.ForeignKey(
        User, on_delete=models.PROTECT, verbose_name="Создатель"
    )
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    history = HistoricalRecords(
        related_name="history_product_category",
        cascade_delete_history=True,  # При удалении удаляется история
    )

    class Meta:

        verbose_name = "Категория товара"
        verbose_name_plural = "Категории товаров"

        permissions = (
            ("view_productcategory_list", "Can see Product Categories list"),
        )

    def __str__(self):
        return f"{self.name} (ID: {self.id})"


class ProductCategoryCover(models.Model):
    """
    Картинки категории.
    Одна категория может иметь несколько картинок.
    """

    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.CASCADE,
        related_name="covers",
        verbose_name="Категория",
        null=True,
        blank=True,
        default=None,
    )
    image = models.ImageField(
        upload_to="product_categories/covers/",
        verbose_name="Изображение",
    )
    creator = models.ForeignKey(
        User, on_delete=models.PROTECT, verbose_name="Создатель"
    )

    is_active = models.BooleanField(default=True, verbose_name="Активно")
    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:

        verbose_name = "Обложка категории"
        verbose_name_plural = "Обложки категорий"

        permissions = (
            ("view_productcategorycover_list", "Can see Product Category Covers list"),
        )

    def __str__(self):
        cat = self.category
        if cat is None:
            return f"Обложка #{self.id} (категория не задана)"
        return f"Обложка #{self.id} для категории {cat.name}"

    def _convert_to_webp(self, image_field):
        img = Image.open(image_field)

        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        output = BytesIO()
        img.save(output, format="WEBP", quality=85)

        new_name = f"{uuid.uuid4()}.webp"

        return ContentFile(output.getvalue(), name=new_name)

    def save(self, *args, **kwargs):
        should_convert = False

        if self.image:
            if not self.pk:
                # новый объект
                should_convert = True
            else:
                # проверяем изменился ли файл
                old = type(self).objects.filter(pk=self.pk).only("image").first()
                if old and old.image != self.image:
                    should_convert = True

        if should_convert and not self.image.name.lower().endswith(".webp"):
            self.image = self._convert_to_webp(self.image)

        super().save(*args, **kwargs)


class ProductCard(models.Model):
    """
    Модель для связи между категориями товаров и товарами
    """

    categories = models.ManyToManyField(
        ProductCategory, verbose_name="Категории", related_name="product_cards"
    )
    is_all_products_same_name = models.BooleanField(
        default=True, verbose_name="Все товары имеют одинаковое название"
    )
    is_all_products_same_price = models.BooleanField(
        default=True, verbose_name="Все товары имеют одинаковую цену"
    )
    is_all_products_same_description = models.BooleanField(
        default=True, verbose_name="Все товары имеют одинаковое описание"
    )
    is_all_products_same_model = models.BooleanField(
        default=True, verbose_name="Все товары имеют одинаковую модель"
    )
    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    creator = models.ForeignKey(
        User, on_delete=models.PROTECT, verbose_name="Создатель"
    )
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    history = HistoricalRecords(
        related_name="history_product_card",
        cascade_delete_history=True,
    )

    class Meta:
        verbose_name = "Карточка товара"
        verbose_name_plural = "Карточки товаров"

        permissions = (("view_productcard_list", "Can see Product Cards list"),)

    def __str__(self):
        text = self.categories.values_list("name", flat=True)
        return f"ID: {self.id} ({', '.join(text)})"


class Product(models.Model):
    """
    Модель товара

    Параметры модели в виде {
        "height": 175,
        "chest": 88,
        "waist": 63,
        "hips": 92,
        "unit": "cm",
        "size": "S"
    }
    """

    def validate_model_params(value: dict) -> None:

        required_fields = {
            "height": int,
            "chest": int,
            "waist": int,
            "hips": int,
            "unit": str,
            "size": str,
        }

        for field, field_type in required_fields.items():
            if field not in value:
                raise ValidationError(f"Параметр модели {field} обязательный")

            if not isinstance(value[field], field_type):
                raise ValidationError(
                    f"Параметр модели {field} должен быть {field_type.__name__}"
                )

    product_card = models.ForeignKey(
        ProductCard,
        on_delete=models.PROTECT,
        verbose_name="Карточка товара",
        related_name="products",
    )
    article = models.CharField(max_length=250, verbose_name="Артикул", unique=True)
    name = models.CharField(max_length=250, verbose_name="Название")
    is_custom_color = models.BooleanField(
        default=False, verbose_name="Является ли цвет пользовательским (не из палитры)"
    )
    color_name = models.CharField(max_length=250, verbose_name="Название цвета")
    color = models.ForeignKey(
        ColorPalette,
        on_delete=models.PROTECT,
        verbose_name="Цвет",
        null=True,
        blank=True,
        default=None,
    )
    description = models.TextField(verbose_name="Описание", null=True, blank=True)
    model_params = models.JSONField(
        verbose_name="Параметры модели",
        null=True,
        blank=True,
        validators=[validate_model_params],
    )

    material_and_care = models.TextField(
        verbose_name="Материал и уход", null=True, blank=True
    )

    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    sale_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Цена со скидкой",
        null=True,
        blank=True,
    )

    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    creator = models.ForeignKey(
        User, on_delete=models.PROTECT, verbose_name="Создатель"
    )

    history = HistoricalRecords(
        related_name="history_product",
        cascade_delete_history=True,
    )

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

        constraints = [
            models.UniqueConstraint(
                fields=["product_card", "color_name"], name="unique_product_color"
            )
        ]

        permissions = (("view_product_list", "Can see Products list"),)

    def __str__(self):
        return f"{self.name} - {self.article} ({self.id})"


class ProductImage(models.Model):
    """
    Модель для изображений товара
    """

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Товар",
        null=True,
        blank=True,
        default=None,
    )
    image = models.ImageField(upload_to="products/images/", verbose_name="Изображение")
    preview = models.ImageField(
        upload_to="products/previews/", verbose_name="Превью", null=True, blank=True
    )
    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    creator = models.ForeignKey(
        User, on_delete=models.PROTECT, verbose_name="Создатель"
    )
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    class Meta:
        verbose_name = "Изображение товара"
        verbose_name_plural = "Изображения товаров"

        permissions = (("view_productimage_list", "Can see Product Images list"),)

    def __str__(self):
        pr_article = self.product.article if self.product else ""
        pr_name = self.product.name if self.product else ""
        return f"(ID: {self.id}) Product: {pr_name} - {pr_article}"

    def _convert_to_webp(self, image_field):
        image_field.seek(0)
        img = Image.open(image_field)

        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        output = BytesIO()
        img.save(output, format="WEBP", quality=100)

        return ContentFile(output.getvalue(), name=f"{uuid.uuid4()}.webp")

    def _build_preview_file(self, image_field):
        image_field.seek(0)
        img = Image.open(image_field)

        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        # уменьшение
        max_side = 400
        resample = (
            Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.LANCZOS
        )

        img.thumbnail((max_side, max_side), resample)

        output = BytesIO()
        img.save(
            output,
            format="WEBP",
            quality=75,
            method=6,
            optimize=True,
        )

        return ContentFile(output.getvalue(), name=f"{uuid.uuid4()}.webp")

    def save(self, *args, **kwargs):
        should_convert = False

        if self.image:
            if not self.pk:
                should_convert = True
            else:
                old = type(self).objects.filter(pk=self.pk).only("image").first()
                if old and old.image != self.image:
                    should_convert = True

        if should_convert:
            # сначала создаём preview из оригинала
            preview_file = self._build_preview_file(self.image)

            # потом конвертируем основное изображение
            if not self.image.name.lower().endswith(".webp"):
                self.image = self._convert_to_webp(self.image)

            # сохраняем preview
            self.preview = preview_file

        super().save(*args, **kwargs)


class ProductStock(models.Model):
    """
    Модель для учета остатков товара в магазинах
    """

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="stocks",
        verbose_name="Товар",
    )
    size = models.ForeignKey(Size, on_delete=models.PROTECT, verbose_name="Размер")
    shop = models.ForeignKey(Shop, on_delete=models.PROTECT, verbose_name="Магазин")
    amount = models.IntegerField(verbose_name="Количество", default=0)

    class Meta:
        verbose_name = "Учет товара"
        verbose_name_plural = "Учет товаров"

        constraints = [
            models.UniqueConstraint(
                fields=["product", "size", "shop"],
                name="unique_product_size_shop_stock",
            )
        ]

        permissions = (("view_productstock_list", "Can see Product Stock list"),)

    def __str__(self):
        return f"{self.shop.name} - {self.product.name} - {self.size.european} - {self.amount} ({self.id})"

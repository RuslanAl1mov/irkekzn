import os
from slugify import slugify
from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_delete

from core.services import convert_image_to_webp, remove_file_if_exists


class ProductCategory(models.Model):
    name = models.CharField("Название категории товара", max_length=250, unique=True)
    slug = models.SlugField("URL Slug", max_length=250, unique=True, blank=True)
    photo = models.ImageField("Фото категории (1:1)", upload_to="product_categories/")
    cover = models.ImageField("Обложка страницы (16:9)", upload_to="product_categories/covers/", null=True, blank=True)
    description = models.TextField("Описание категории", blank=True, null=True)
    is_actual = models.BooleanField("Показывать в системе", default=True)
    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Категория товара"
        verbose_name_plural = "Категории товаров"
        
        permissions = [
            ("view_productcategory_list", "Can see product categories list"),
        ]

    def __str__(self):
        return f"(ID: {self.id}) {self.name}"

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)

        try:
            old_obj = self.__class__.objects.get(pk=self.pk)
            old_photo = old_obj.photo
            old_cover = old_obj.cover
        except self.__class__.DoesNotExist:
            old_photo = old_cover = None

        def has_changed(field, old_field):
            return field and (not self.pk or (old_field and field.name != old_field.name))

        photo_changed = has_changed(self.photo, old_photo)
        cover_changed = has_changed(self.cover, old_cover)

        if photo_changed:
            new_file = convert_image_to_webp(self.photo, quality=85)
            if new_file:
                self.photo = new_file

        if cover_changed:
            new_file = convert_image_to_webp(self.cover, quality=85)
            if new_file:
                self.cover = new_file

        super().save(*args, **kwargs)

        for old, new_field_changed in ((old_photo, photo_changed), (old_cover, cover_changed)):
            if (new_field_changed and old and old.name not in (self.photo.name, self.cover.name)):
                remove_file_if_exists(os.path.join(settings.MEDIA_ROOT, old.name))


@receiver(post_delete, sender=ProductCategory)
def delete_files_on_category_delete(sender, instance, **kwargs):
    """Удаляем файлы photo и cover после удаления объекта."""
    for field in ("photo", "cover"):
        f = getattr(instance, field)
        if f:
            f.delete(save=False)


class ProductTag(models.Model):
    name = models.CharField(verbose_name="Название тега товара", max_length=250, unique=True)
    slug = models.SlugField(verbose_name="URL Slug", max_length=250, unique=True, blank=True)
    is_actual = models.BooleanField(verbose_name="Показывать в системе", default=True)

    class Meta:
        verbose_name = "Тег товара"
        verbose_name_plural = "Теги товаров"
    
        permissions = [
            ("view_producttag_list", "Can see product tags list"),
        ]

    def __str__(self):
        return f"(ID: {self.id}){self.name}"

    def save(self, *args, **kwargs):
        # Генерируем slug
        self.slug = slugify(f"{self.name}")
        super().save(*args, **kwargs)


class Product(models.Model):
    name = models.CharField(verbose_name="Название товара", max_length=250)
    slug = models.SlugField(verbose_name="URL Slug", max_length=250, unique=True, blank=True)
    sku = models.CharField(max_length=64, unique=True, verbose_name="Артикул")
    categories = models.ManyToManyField(ProductCategory, verbose_name="Категории продукта", blank=True)
    tags = models.ManyToManyField(ProductTag, verbose_name="Теги продукта", blank=True)
    price = models.FloatField(verbose_name="Цена товара", default=None, null=True, blank=True)
    sale_price = models.FloatField(verbose_name="Цена товара со скидкой", default=None, null=True, blank=True)
    description_short = models.CharField(verbose_name="Короткое описание товара (показывается в карточке товара, 250 символов)", max_length=250, blank=True, null=True)
    description = models.TextField(verbose_name="Описание товара", blank=True, null=True)
    is_actual = models.BooleanField(verbose_name="Показывать в системе", default=True)
    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        
        permissions = [
            ("view_product_list", "Can see products list"),
        ]

    def __str__(self):
        return f"(ID: {self.id}) {self.name}"

    def save(self, *args, **kwargs):
        # Генерируем slug
        self.slug = slugify(f"{self.name} {self.sku}")
        super().save(*args, **kwargs)


class ProductPhoto(models.Model):
    product = models.ForeignKey(Product, verbose_name="Продукт", on_delete=models.CASCADE)
    photo = models.ImageField(verbose_name="Фото товара", upload_to="products/")
    order_number = models.IntegerField(verbose_name="Номер фото по порядку", null=True, blank=True)
    is_actual = models.BooleanField(verbose_name="Показывать в системе", default=True)

    class Meta:
        verbose_name = "Фото товара"
        verbose_name_plural = "Фото товаров"

    def __str__(self):
        return f"{self.product} {self.photo} (ID: {self.id})"

    def save(self, *args, **kwargs):
        """
        При сохранении:
          1) Конвертируем в WebP, если фото новое или изменилось,
          2) Удаляем старый файл после сохранения нового.
        """
        try:
            old_photo = self.__class__.objects.get(pk=self.pk).photo
        except self.__class__.DoesNotExist:
            old_photo = None

        photo_changed = False
        if self.photo:
            if not self.pk or (old_photo and self.photo.name != old_photo.name):
                photo_changed = True
                new_file = convert_image_to_webp(self.photo, quality=85)
                if new_file:
                    self.photo = new_file

        super().save(*args, **kwargs)

        if photo_changed and old_photo and old_photo.name != self.photo.name:
            old_path = os.path.join(settings.MEDIA_ROOT, old_photo.name)
            remove_file_if_exists(old_path)

    def delete(self, *args, **kwargs):
        """
        При удалении объекта - удаляем файл из файловой системы.
        """
        if self.photo:
            self.photo.delete(save=False)  # Удаляем через storage
        super().delete(*args, **kwargs)


@receiver(post_delete, sender=ProductPhoto)
def delete_file_on_photo_delete(sender, instance, **kwargs):
    """После удаления ProductPhoto удаляем связанный файл."""
    if instance.photo:
        instance.photo.delete(save=False)


class MeasurementType(models.Model):
    name = models.CharField(verbose_name="Название параметра", max_length=250, unique=True)

    class Meta:
        verbose_name = "Измерение продукта"
        verbose_name_plural = "Измерения продуктов"

    def __str__(self):
        return f"{self.name} (ID: {self.id})"


class MeasurementUnit(models.Model):
    name = models.CharField(verbose_name="Название (мм, см, м, кг...)", max_length=250, unique=True)

    class Meta:
        verbose_name = "Мера измерения"
        verbose_name_plural = "Меры измерений"

    def __str__(self):
        return f"{self.name} (ID: {self.id})"


class ProductParameter(models.Model):
    product = models.ForeignKey(Product, verbose_name="Продукт", on_delete=models.CASCADE)
    measurement_type = models.ForeignKey(MeasurementType, verbose_name="Параметр продукта", on_delete=models.PROTECT)
    measurement_unit = models.ForeignKey(MeasurementUnit, verbose_name="Мера измерения параметра", on_delete=models.PROTECT)
    value = models.CharField(max_length=250, verbose_name="Значение параметра")
    is_actual = models.BooleanField(verbose_name="Показывать в системе", default=True)

    class Meta:
        verbose_name = "Параметр товара"
        verbose_name_plural = "Параметры товаров"

    def __str__(self):
        return f"{self.product} {self.measurement_type} (ID: {self.id})"

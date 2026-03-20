from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError

from simple_history.models import HistoricalRecords


User = get_user_model()


class Settings(models.Model):
    """
    Singleton модель для хранения глобальных настроек.
    Может существовать только одна запись.
    """

    set_custom_product_settings = models.BooleanField(
        default=True, verbose_name="Использовать кастомные настройки товаров"
    )

    is_all_colors_same_name = models.BooleanField(
        default=False, verbose_name="Все цвета имеют одинаковое название"
    )

    is_all_colors_same_price = models.BooleanField(
        default=False, verbose_name="Все цвета имеют одинаковую цену"
    )

    is_all_colors_same_description = models.BooleanField(
        default=False, verbose_name="Все цвета имеют одинаковое описание"
    )

    is_all_colors_same_model = models.BooleanField(
        default=False, verbose_name="Все цвета имеют одинаковую модель"
    )

    # Метаданные
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

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
                "set_custom_product_settings": True,
                "is_all_colors_same_name": False,
                "is_all_colors_same_price": False,
                "is_all_colors_same_description": False,
                "is_all_colors_same_model": False,
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

    # ПОЛЯ ДЛЯ ИСТОРИИ - ЭТО ЕДИНСТВЕННОЕ, ЧТО НУЖНО ДОБАВИТЬ
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
        return f"{self.id}"


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

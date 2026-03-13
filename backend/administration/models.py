from django.db import models
from django.contrib.auth import get_user_model
from simple_history.models import HistoricalRecords
from simple_history import register

User = get_user_model()


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
    map_location = models.CharField(
        max_length=200,
        verbose_name="Координаты на карте",
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

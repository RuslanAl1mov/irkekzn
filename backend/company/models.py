import os
import re
from django.db import models
from django.conf import settings
from django.db.models.signals import post_delete
from django.dispatch import receiver
from core.services import convert_image_to_webp, remove_file_if_exists


class AboutCompany(models.Model):
    """
    Модель "О компании"
    """
    fullname = models.CharField(verbose_name="Полное наименование компании (ООО ...)", max_length=250)
    shortname = models.CharField(verbose_name="Короткое наименование компании", max_length=250)
    logo = models.ImageField(verbose_name="Логотип компании", upload_to="logo/", null=True, blank=True)
    shortdescription = models.TextField(verbose_name="Короткое описание компании")
    office_address = models.CharField(verbose_name="Адрес главного офиса", max_length=250)
    office_address_map_link = models.TextField(verbose_name="Ссылка на карту адреса главного офиса", blank=True, null=True)
    telegram = models.CharField(verbose_name="Ссылка на Telegram", max_length=100, blank=True, null=True)
    instagram = models.CharField(verbose_name="Ссылка на Instagram", max_length=100, blank=True, null=True)
    facebook = models.CharField(verbose_name="Ссылка на Facebook", max_length=100, blank=True, null=True)
    email = models.CharField(verbose_name="Email поддержки", max_length=100)
    phone_1 = models.CharField(verbose_name="Номер телефона 1 (просто цифры)", max_length=20)
    phone_2 = models.CharField(verbose_name="Номер телефона 2 (просто цифры)", max_length=20, blank=True, null=True)
    phone_3 = models.CharField(verbose_name="Номер телефона 3 (просто цифры)", max_length=20, blank=True, null=True)
    is_actual = models.BooleanField(verbose_name="Данные актуальны", default=True)

    class Meta:
        verbose_name = "Информация о компании"
        verbose_name_plural = "Информация о компании"

    def __str__(self):
        return f"(ID: {self.id}) {self.fullname} ({self.office_address})"

    def save(self, *args, **kwargs):
        # Очищаем телефоны от не-цифр
        self.phone_1 = re.sub(r'\D', '', self.phone_1 or '')
        if self.phone_2:
            self.phone_2 = re.sub(r'\D', '', self.phone_2)
        if self.phone_3:
            self.phone_3 = re.sub(r'\D', '', self.phone_3)

        # Получаем старый логотип
        try:
            old = AboutCompany.objects.get(pk=self.pk)
            old_logo = old.logo
        except AboutCompany.DoesNotExist:
            old_logo = None

        # Проверяем изменение логотипа
        logo_changed = bool(
            self.logo and (not self.pk or (old_logo and self.logo.name != old_logo.name))
        )

        if logo_changed:
            new_logo = convert_image_to_webp(self.logo, quality=85)
            if new_logo:
                self.logo = new_logo

        super().save(*args, **kwargs)

        # Удаляем старый файл, если он отличается от нового
        if logo_changed and old_logo and old_logo.name != self.logo.name:
            old_path = os.path.join(settings.MEDIA_ROOT, old_logo.name)
            remove_file_if_exists(old_path)

        # Сбрасываем is_actual у остальных, если выставлено текущее
        if self.is_actual:
            AboutCompany.objects.exclude(pk=self.pk).update(is_actual=False)


@receiver(post_delete, sender=AboutCompany)
def delete_logo_on_company_delete(sender, instance, **kwargs):
    """После удаления AboutCompany удаляем логотип."""
    if instance.logo:
        instance.logo.delete(save=False)

        

class Market(models.Model):
    """
    Модель для сохранения данных о магазинах компании.
    """
    name = models.CharField(verbose_name="Название магазина", max_length=250)
    address = models.CharField(verbose_name="Адрес магазина", max_length=250)
    telegram = models.CharField(verbose_name="Ссылка на Telegram", max_length=100, blank=True, null=True)
    instagram = models.CharField(verbose_name="Ссылка на Instagram", max_length=100, blank=True, null=True)
    facebook = models.CharField(verbose_name="Ссылка на Facebook", max_length=100, blank=True, null=True)
    phone_1 = models.CharField(verbose_name="Номер телефона 1", max_length=20)
    phone_2 = models.CharField(verbose_name="Номер телефона 2", max_length=20, blank=True, null=True)
    phone_3 = models.CharField(verbose_name="Номер телефона 3", max_length=20, blank=True, null=True)

    class Meta:
        verbose_name = "Магазин"
        verbose_name_plural = "Магазины"

    def __str__(self):
        return f"(ID: {self.id}) {self.name}"
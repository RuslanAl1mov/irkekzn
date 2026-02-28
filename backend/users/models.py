from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager


class User(AbstractUser):
    class Languages(models.TextChoices):
        RU = "ru", "Русский"
        EN = "en", "English"

    first_name = models.CharField(
        verbose_name="Имя", max_length=250, null=True, blank=True
    )
    last_name = models.CharField(
        verbose_name="Фамилия", max_length=250, null=True, blank=True
    )
    email = models.EmailField(verbose_name="Email", null=True, blank=True)
    username = models.CharField(verbose_name="Username", null=True, blank=True)
    phone_number = models.CharField(
        verbose_name="Номер телефона", max_length=30, null=True, blank=True
    )
    photo = models.ImageField(
        upload_to="profile/user_image/",
        verbose_name="Фото",
        null=True,
        blank=True,
        default=None,
    )
    language = models.CharField(
        max_length=10,
        verbose_name="Выбранный язык",
        choices=Languages.choices,
        default=Languages.EN,
    )
    objects: UserManager = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

        constraints = [
            # Для админов: уникальный email среди is_staff=True
            models.UniqueConstraint(
                fields=["email"],
                condition=models.Q(is_staff=True),
                name="unique_email_for_staff",
            ),
            # Для клиентов: уникальный phone_number среди is_staff=False
            models.UniqueConstraint(
                fields=["phone_number"],
                condition=models.Q(is_staff=False),
                name="unique_phone_for_non_staff",
            ),
            # Дополнительно: уникальный phone_number для админов (если нужно)
            models.UniqueConstraint(
                fields=["phone_number"],
                condition=models.Q(is_staff=True),
                name="unique_phone_for_staff",
            ),
        ]

        permissions = (("view_user_list", "Can see Users list"),)

    def save(self, *args, **kwargs):
        if not self.username and self.email:
            self.username = self.email.split("@")[0]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} (ID: {self.id})"

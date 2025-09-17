from django.db import models
from django.db.models import Q, UniqueConstraint
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from .managers import CustomUserManager


class User(AbstractUser):
    class UserType(models.TextChoices):
        EMPLOYEE = "employee", "Сотрудник"
        CLIENT = "client", "Клиент"
    
    email = models.EmailField(verbose_name="Электронная почта", unique=True, blank=True, null=True)
    phone = PhoneNumberField(region="RU", unique=True, blank=True, null=True, help_text="Номер телефона в формате +7 (XXX) XXX XXXX")
    first_name = models.CharField(verbose_name="Имя", max_length=250, blank=True, null=True)
    last_name = models.CharField(verbose_name="Фамилия", max_length=250, blank=True, null=True)
    username = models.CharField(verbose_name="Username", max_length=400, null=True, blank=True)
    photo = models.ImageField(upload_to="profile/user_image/", verbose_name="Фото", null=True, blank=True, default=None)
    role = models.CharField(verbose_name="Тип пользователя", max_length=10, choices=UserType.choices)
        
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]
    
    objects = CustomUserManager()
        
    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        
        constraints = [
            # Сотрудники: email обязателен и уникален среди employee
            UniqueConstraint(
                fields=["email"],
                condition=Q(role="employee") & Q(email__isnull=False),
                name="unique_employee_email"
            ),
            # Клиенты: phone обязателен и уникален среди client
            UniqueConstraint(
                fields=["phone"],
                condition=Q(role="client") & Q(phone__isnull=False),
                name="unique_client_phone"
            ),
        ]

    def __str__(self):
        role = "Сотрудник" if self.role == self.UserType.EMPLOYEE else "Клиент"
        to_show = f"{role} - {self.first_name} {self.last_name}"
        return f"{to_show} (ID: {self.id})"


class Employee(models.Model):
    user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT, related_name="employee")
    
    class Meta:
        verbose_name = 'Сотрудник'
        verbose_name_plural = "Сотрудники"
        
    def __str__(self):
        return str(self.user)


class Client(models.Model):
    user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.PROTECT, related_name="client")
    
    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = "Клиенты"
        
    def __str__(self):
        return str(self.user)
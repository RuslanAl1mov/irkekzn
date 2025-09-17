from django.contrib import admin
from .models import AboutCompany, Market


@admin.register(AboutCompany)
class AboutAdmin(admin.ModelAdmin):
    list_display = (
        "shortname",
        "office_address",
        "email",
        "phone_1",
        "phone_2",
        "phone_3",
        "is_actual",
    )
    search_fields = ("fullname", "shortname", "office_address", "email")
    list_filter = ("is_actual",)
    ordering = ("-is_actual", "fullname")


@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "address")
    search_fields = ("name", "address")
    list_filter = ("name",)
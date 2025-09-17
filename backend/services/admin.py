from django.contrib import admin

from .models import CallRequest


@admin.register(CallRequest)
class CallRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "id", "date_created", "is_checked", "status")
    list_filter = ("is_checked", "status", "date_created")
    search_fields = ("id", "name", "phone", "comment")
    ordering = ("-date_created",)


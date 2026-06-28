from django.contrib import admin

from dropship.models import SupplierConfig


@admin.register(SupplierConfig)
class SupplierConfigAdmin(admin.ModelAdmin):
    list_display = ("name", "default_markup_percent", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "api_url")

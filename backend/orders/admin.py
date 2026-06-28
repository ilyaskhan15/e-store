from django.contrib import admin

from orders.models import DiscountCode, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "size", "quantity", "unit_price", "line_total")
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "shipping_name", "status", "total", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order_number", "shipping_email", "shipping_name")
    inlines = [OrderItemInline]


@admin.register(DiscountCode)
class DiscountCodeAdmin(admin.ModelAdmin):
    list_display = ("code", "discount_type", "value", "uses_count", "max_uses", "is_active")
    list_filter = ("discount_type", "is_active")
    search_fields = ("code",)

import uuid

from django.conf import settings
from django.db import models

from products.models import Product


def generate_order_number():
    return f"ORD-{uuid.uuid4().hex[:10].upper()}"


class DiscountCode(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ("percent", "Percent"),
        ("fixed", "Fixed"),
    ]

    code = models.CharField(max_length=32, unique=True)
    discount_type = models.CharField(max_length=16, choices=DISCOUNT_TYPE_CHOICES)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_uses = models.PositiveIntegerField(default=0)
    uses_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.code


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    order_number = models.CharField(max_length=32, unique=True, default=generate_order_number, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    shipping_name = models.CharField(max_length=120)
    shipping_email = models.EmailField()
    shipping_address = models.CharField(max_length=255)
    shipping_city = models.CharField(max_length=100)
    shipping_country = models.CharField(max_length=100)
    shipping_postal = models.CharField(max_length=20)
    shipping_method = models.CharField(max_length=100, default="Standard Shipping")
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stripe_payment_intent = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    size = models.CharField(max_length=10)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from accounts.serializers import UserSerializer
from orders.models import DiscountCode, Order, OrderItem
from products.models import Product
from products.serializers import ProductListSerializer


class DiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountCode
        fields = ["id", "code", "discount_type", "value", "min_order", "max_uses", "uses_count", "is_active"]


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "size", "quantity", "unit_price", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "user",
            "status",
            "shipping_name",
            "shipping_email",
            "shipping_address",
            "shipping_city",
            "shipping_country",
            "shipping_postal",
            "shipping_method",
            "subtotal",
            "shipping_cost",
            "discount_amount",
            "total",
            "stripe_payment_intent",
            "notes",
            "items",
            "created_at",
            "updated_at",
        ]


class OrderCreateItemSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))
    size = serializers.CharField(max_length=10)
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    shipping_name = serializers.CharField(max_length=120)
    shipping_email = serializers.EmailField()
    shipping_address = serializers.CharField(max_length=255)
    shipping_city = serializers.CharField(max_length=100)
    shipping_country = serializers.CharField(max_length=100)
    shipping_postal = serializers.CharField(max_length=20)
    shipping_method = serializers.CharField(max_length=100, required=False, default="Standard Shipping")
    notes = serializers.CharField(required=False, allow_blank=True)
    discount_code = serializers.CharField(required=False, allow_blank=True)
    items = OrderCreateItemSerializer(many=True)

    def validate(self, attrs):
        if not attrs.get("items"):
            raise serializers.ValidationError({"items": "At least one item is required."})
        for item in attrs["items"]:
            product = item["product"]
            size = item["size"].upper()
            if size not in (product.sizes or {}):
                raise serializers.ValidationError({"items": f"Size {size} is not available for {product.name}."})
            if product.sizes.get(size, 0) < item["quantity"]:
                raise serializers.ValidationError({"items": f"Not enough stock for {product.name} size {size}."})
        return attrs

    def _resolve_discount(self, code, subtotal):
        if not code:
            return Decimal("0.00")
        try:
            discount = DiscountCode.objects.get(code__iexact=code, is_active=True)
        except DiscountCode.DoesNotExist:
            raise serializers.ValidationError({"discount_code": "Invalid discount code."})
        if discount.max_uses and discount.uses_count >= discount.max_uses:
            raise serializers.ValidationError({"discount_code": "Discount code has reached its limit."})
        if subtotal < discount.min_order:
            raise serializers.ValidationError({"discount_code": "Order does not meet minimum amount."})
        if discount.discount_type == "percent":
            return (subtotal * discount.value) / 100
        return min(discount.value, subtotal)

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        discount_code = validated_data.pop("discount_code", "")
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        subtotal = Decimal("0.00")
        item_rows = []

        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]
            size = item_data["size"].upper()
            unit_price = product.sale_price if product.is_on_sale else product.price
            line_total = unit_price * quantity
            subtotal += line_total
            item_rows.append((product, size, quantity, unit_price, line_total))

        discount_amount = self._resolve_discount(discount_code, subtotal)
        shipping_cost = Decimal("0.00") if subtotal >= Decimal("50.00") else Decimal("5.99")
        total = subtotal + shipping_cost - discount_amount

        order = Order.objects.create(
            user=user,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            discount_amount=discount_amount,
            total=max(total, Decimal("0.00")),
            **validated_data,
        )

        for product, size, quantity, unit_price, line_total in item_rows:
            OrderItem.objects.create(
                order=order,
                product=product,
                size=size,
                quantity=quantity,
                unit_price=unit_price,
                line_total=line_total,
            )
            product.sizes[size] = max(product.sizes.get(size, 0) - quantity, 0)
            product.stock = max(product.stock - quantity, 0)
            product.save(update_fields=["sizes", "stock", "updated_at"])

        if discount_code:
            discount = DiscountCode.objects.filter(code__iexact=discount_code).first()
            if discount:
                discount.uses_count += 1
                discount.save(update_fields=["uses_count"])

        return order

    def to_representation(self, instance):
        return OrderSerializer(instance, context=self.context).data

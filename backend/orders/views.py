from decimal import Decimal

from django.db.models import F
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from orders.models import DiscountCode, Order, OrderItem
from orders.serializers import DiscountCodeSerializer, OrderCreateSerializer, OrderSerializer


class DiscountValidationSerializer(OrderCreateSerializer):
    class Meta:
        fields = []


class OrderViewSet(viewsets.ModelViewSet):
    lookup_field = "id"

    def get_queryset(self):
        queryset = Order.objects.select_related("user").prefetch_related("items__product", "items__product__category")
        if self.request.user.is_authenticated and not self.request.user.is_staff:
            return queryset.filter(user=self.request.user)
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return queryset
        return queryset.none()

    def get_serializer_class(self):
        if self.action == "create":
            return OrderCreateSerializer
        return OrderSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order, context={"request": request}).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny], url_path="validate-discount")
    def validate_discount(self, request):
        code = request.data.get("code", "")
        subtotal = Decimal(str(request.data.get("subtotal", "0")))
        try:
            discount = DiscountCode.objects.get(code__iexact=code, is_active=True)
        except DiscountCode.DoesNotExist:
            return Response({"valid": False, "message": "Invalid discount code."}, status=400)
        if discount.max_uses and discount.uses_count >= discount.max_uses:
            return Response({"valid": False, "message": "Discount code has reached its limit."}, status=400)
        if subtotal < discount.min_order:
            return Response({"valid": False, "message": "Minimum order not met."}, status=400)
        if discount.discount_type == "percent":
            amount = (subtotal * discount.value) / 100
        else:
            amount = min(discount.value, subtotal)
        return Response({"valid": True, "discount_amount": amount, "discount": DiscountCodeSerializer(discount).data})


class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("user").prefetch_related("items__product").all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "id"

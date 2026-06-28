from django.db.models import DecimalField, ExpressionWrapper, F, Value
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from products.filters import ProductFilter
from products.models import Category, Product, Review
from products.serializers import (
    CategorySerializer,
    CategoryWriteSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductReviewCreateSerializer,
    ProductWriteSerializer,
    ReviewSerializer,
)


class PriceOrderingFilter(filters.OrderingFilter):
    def get_ordering(self, request, queryset, view):
        ordering = super().get_ordering(request, queryset, view)
        if not ordering:
            return ordering
        return [item.replace("price", "effective_price") if item.lstrip("-") == "price" else item for item in ordering]


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, PriceOrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "national_team", "club_name"]
    ordering_fields = ["price", "name", "created_at"]
    lookup_field = "id"

    def get_queryset(self):
        price_expression = ExpressionWrapper(
            F("base_price") * F("markup_percent") / Value(100),
            output_field=DecimalField(max_digits=10, decimal_places=2),
        )
        return (
            Product.objects.filter(is_active=True)
            .select_related("category")
            .prefetch_related("images", "reviews__user")
            .annotate(effective_price=price_expression)
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def reviews(self, request, id=None):
        product = self.get_object()
        serializer = ProductReviewCreateSerializer(data=request.data, context={"request": request, "product": product})
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=201)


class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("order", "name")
    serializer_class = CategoryWriteSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "slug"


class AdminProductViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "id"

    def get_queryset(self):
        price_expression = ExpressionWrapper(
            F("base_price") * F("markup_percent") / Value(100),
            output_field=DecimalField(max_digits=10, decimal_places=2),
        )
        return (
            Product.objects.all()
            .select_related("category")
            .prefetch_related("images", "reviews__user")
            .annotate(effective_price=price_expression)
        )

    def get_serializer_class(self):
        if self.action in ["list", "retrieve", "create", "update", "partial_update"]:
            return ProductWriteSerializer
        return ProductWriteSerializer


class AdminReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related("product", "user").all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAdminUser]

from rest_framework import serializers

from products.models import Category, Product, ProductImage, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "image", "is_active", "order"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "is_primary", "order"]


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ["id", "user", "rating", "comment", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def get_user(self, obj):
        return {
            "id": obj.user_id,
            "email": obj.user.email,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
        }


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    is_on_sale = serializers.BooleanField(read_only=True)
    discount_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "national_team",
            "club_name",
            "season_year",
            "price",
            "sale_price",
            "is_on_sale",
            "discount_percent",
            "stock",
            "is_featured",
            "primary_image",
        ]

    def get_primary_image(self, obj):
        image = next((item for item in obj.images.all() if item.is_primary), None)
        if image is None:
            image = next(iter(obj.images.all()), None)
        return image.image.url if image else None

    def get_price(self, obj):
        return getattr(obj, "effective_price", obj.price)


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    price = serializers.SerializerMethodField()
    is_on_sale = serializers.BooleanField(read_only=True)
    discount_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "category",
            "national_team",
            "club_name",
            "season_year",
            "base_price",
            "markup_percent",
            "price",
            "sale_price",
            "is_on_sale",
            "discount_percent",
            "stock",
            "is_active",
            "is_featured",
            "sizes",
            "images",
            "reviews",
            "created_at",
            "updated_at",
        ]

    def get_price(self, obj):
        return getattr(obj, "effective_price", obj.price)


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "category",
            "national_team",
            "club_name",
            "season_year",
            "base_price",
            "markup_percent",
            "sale_price",
            "stock",
            "is_active",
            "is_featured",
            "sizes",
        ]


class CategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "image", "is_active", "order"]


class ProductReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["rating", "comment"]

    def create(self, validated_data):
        product = self.context["product"]
        user = self.context["request"].user
        return Review.objects.create(product=product, user=user, **validated_data)

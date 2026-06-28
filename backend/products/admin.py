from django.contrib import admin

from products.models import Category, Product, ProductImage, Review


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ("user", "rating", "comment", "created_at")
    can_delete = False


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "stock", "is_featured", "is_active", "created_at")
    list_filter = ("category", "is_featured", "is_active")
    search_fields = ("name", "slug", "national_team", "club_name")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ReviewInline]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "is_primary", "order")
    list_filter = ("is_primary",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("product__name", "user__email", "comment")

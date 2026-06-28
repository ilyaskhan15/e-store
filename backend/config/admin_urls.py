from django.urls import include, path
from rest_framework.routers import DefaultRouter

from accounts.views import AdminUserViewSet
from orders.views import AdminOrderViewSet
from products.views import AdminCategoryViewSet, AdminProductViewSet, AdminReviewViewSet

router = DefaultRouter()
router.register(r"users", AdminUserViewSet, basename="admin-users")
router.register(r"categories", AdminCategoryViewSet, basename="admin-categories")
router.register(r"products", AdminProductViewSet, basename="admin-products")
router.register(r"orders", AdminOrderViewSet, basename="admin-orders")
router.register(r"reviews", AdminReviewViewSet, basename="admin-reviews")

urlpatterns = [path("", include(router.urls))]

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path


def root_redirect(request):
    return redirect("/api/")

urlpatterns = [
    path("", root_redirect),
    path("api/", include("products.urls")),
    path("api/", include("orders.urls")),
    path("api/auth/", include("accounts.urls")),
    path("api/admin/", include("config.admin_urls")),
    path("admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

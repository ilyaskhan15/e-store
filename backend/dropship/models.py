from django.db import models


class SupplierConfig(models.Model):
    name = models.CharField(max_length=120)
    api_url = models.URLField(blank=True)
    api_key = models.TextField(help_text="Encrypted in production; store securely.")
    default_markup_percent = models.DecimalField(max_digits=5, decimal_places=2, default=150)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

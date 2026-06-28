from rest_framework import serializers

from dropship.models import SupplierConfig


class SupplierConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierConfig
        fields = ["id", "name", "api_url", "api_key", "default_markup_percent", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

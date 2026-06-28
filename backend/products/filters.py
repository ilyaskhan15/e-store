import django_filters
from django.db.models import DecimalField, ExpressionWrapper, F, Q, Value

from products.models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(method="filter_category")
    team = django_filters.CharFilter(method="filter_team")
    min_price = django_filters.NumberFilter(method="filter_min_price")
    max_price = django_filters.NumberFilter(method="filter_max_price")
    size = django_filters.CharFilter(method="filter_size")
    is_featured = django_filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = Product
        fields = ["category", "team", "size", "min_price", "max_price", "is_featured"]

    def filter_category(self, queryset, name, value):
        values = [item.strip() for item in value.split(",") if item.strip()]
        if not values:
            return queryset
        return queryset.filter(category__slug__in=values)

    def filter_team(self, queryset, name, value):
        values = [item.strip() for item in value.split(",") if item.strip()]
        if not values:
            return queryset
        team_query = Q()
        for item in values:
            team_query |= Q(national_team__icontains=item) | Q(club_name__icontains=item)
        return queryset.filter(team_query)

    def filter_size(self, queryset, name, value):
        values = [item.strip() for item in value.split(",") if item.strip()]
        if not values:
            return queryset
        size_query = Q()
        for item in values:
            size_query |= Q(sizes__has_key=item)
        return queryset.filter(size_query)

    def filter_min_price(self, queryset, name, value):
        return queryset.annotate(
            effective_price=ExpressionWrapper(
                F("base_price") * F("markup_percent") / Value(100),
                output_field=DecimalField(max_digits=10, decimal_places=2),
            )
        ).filter(effective_price__gte=value)

    def filter_max_price(self, queryset, name, value):
        return queryset.annotate(
            effective_price=ExpressionWrapper(
                F("base_price") * F("markup_percent") / Value(100),
                output_field=DecimalField(max_digits=10, decimal_places=2),
            )
        ).filter(effective_price__lte=value)

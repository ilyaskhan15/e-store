#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py shell <<'PY'
from django.core.management import call_command
from products.models import Product

if not Product.objects.exists():
    call_command("seed_data")
PY

exec python manage.py runserver 0.0.0.0:8000
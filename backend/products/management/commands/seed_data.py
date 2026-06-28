import random
from decimal import Decimal
from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from PIL import Image, ImageDraw, ImageFont
from django.utils.text import slugify

from orders.models import DiscountCode
from products.models import Category, Product, ProductImage


class Command(BaseCommand):
    help = "Seed sample FIFA kits and t-shirt store data"

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Delete existing product and category data before seeding")

    def _build_image(self, text, color, size=(1200, 1500)):
        image = Image.new("RGB", size, color)
        draw = ImageDraw.Draw(image)
        try:
            font = ImageFont.truetype("DejaVuSans-Bold.ttf", 72)
        except Exception:
            font = ImageFont.load_default()
        text_bbox = draw.textbbox((0, 0), text, font=font)
        x = (size[0] - (text_bbox[2] - text_bbox[0])) // 2
        y = (size[1] - (text_bbox[3] - text_bbox[1])) // 2
        draw.rectangle((40, 40, size[0] - 40, size[1] - 40), outline=(255, 255, 255), width=8)
        draw.text((x, y), text, fill=(255, 255, 255), font=font, align="center")
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        return ContentFile(buffer.getvalue(), name=f"{slugify(text).replace('/', '-')}.png")

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()
            DiscountCode.objects.all().delete()

        categories = [
            ("World Cup Kits", 1),
            ("Club Kits", 2),
            ("Training Jerseys", 3),
            ("Fan T-Shirts", 4),
        ]
        category_map = {}
        for name, order in categories:
            category, _ = Category.objects.update_or_create(
                slug=name.lower().replace(" ", "-"),
                defaults={"name": name, "description": f"Premium {name.lower()} for supporters.", "is_active": True, "order": order},
            )
            category_map[name] = category

        teams = [
            ("Brazil", "yellow", "World Cup Kits"),
            ("Germany", "black", "World Cup Kits"),
            ("Argentina", "sky", "World Cup Kits"),
            ("France", "blue", "World Cup Kits"),
            ("England", "navy", "World Cup Kits"),
            ("Spain", "red", "World Cup Kits"),
            ("Portugal", "crimson", "World Cup Kits"),
            ("Italy", "green", "World Cup Kits"),
            ("Netherlands", "orange", "World Cup Kits"),
            ("Croatia", "red", "World Cup Kits"),
            ("Manchester City", "blue", "Club Kits"),
            ("Real Madrid", "white", "Club Kits"),
            ("Barcelona", "maroon", "Club Kits"),
            ("Bayern Munich", "red", "Club Kits"),
            ("Juventus", "black", "Club Kits"),
            ("PSG", "navy", "Training Jerseys"),
            ("Liverpool", "red", "Training Jerseys"),
            ("Ajax", "white", "Training Jerseys"),
            ("Inter Milan", "black", "Fan T-Shirts"),
            ("Chelsea", "blue", "Fan T-Shirts"),
        ]

        colors = [
            (26, 31, 58),
            (230, 57, 70),
            (232, 197, 71),
            (34, 197, 94),
            (59, 130, 246),
            (249, 115, 22),
        ]

        for index, (name, color_label, category_name) in enumerate(teams):
            slug = name.lower().replace(" ", "-")
            category = category_map[category_name]
            team_field = name if category_name == "World Cup Kits" else ""
            club_field = name if category_name != "World Cup Kits" else ""
            product, _ = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": f"{name} 24/25 Pro Edition",
                    "description": f"Support {name} with a premium drop-ship ready kit made for match day and streetwear.",
                    "category": category,
                    "national_team": team_field,
                    "club_name": club_field,
                    "season_year": "2024/25",
                    "base_price": Decimal("14.99") + Decimal(index),
                    "markup_percent": Decimal("165.00"),
                    "sale_price": Decimal("34.99") if index % 3 == 0 else None,
                    "stock": 80 + index * 3,
                    "is_active": True,
                    "is_featured": index < 8,
                    "sizes": {"S": 10, "M": 8, "L": 7, "XL": 5, "XXL": 3},
                },
            )
            ProductImage.objects.filter(product=product).delete()
            for image_index in range(5):
                image = self._build_image(f"{name}\nKit {image_index + 1}", colors[(index + image_index) % len(colors)])
                ProductImage.objects.create(
                    product=product,
                    image=image,
                    alt_text=f"{name} kit image {image_index + 1}",
                    is_primary=image_index == 0,
                    order=image_index,
                )

        for code, discount_type, value, min_order, max_uses in [
            ("FIFA10", "percent", Decimal("10"), Decimal("50"), 100),
            ("KIT15", "percent", Decimal("15"), Decimal("75"), 50),
            ("WELCOME5", "fixed", Decimal("5"), Decimal("25"), 200),
        ]:
            DiscountCode.objects.update_or_create(
                code=code,
                defaults={
                    "discount_type": discount_type,
                    "value": value,
                    "min_order": min_order,
                    "max_uses": max_uses,
                    "uses_count": 0,
                    "is_active": True,
                },
            )

        User = get_user_model()
        admin_user, created = User.objects.get_or_create(
            email="admin@store.com",
            defaults={"first_name": "Store", "last_name": "Admin", "is_staff": True, "is_superuser": True, "is_active": True},
        )
        if created:
            admin_user.set_password("admin123")
            admin_user.save()
        else:
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.is_active = True
            admin_user.set_password("admin123")
            admin_user.save()

        self.stdout.write(self.style.SUCCESS("Seed data created successfully."))

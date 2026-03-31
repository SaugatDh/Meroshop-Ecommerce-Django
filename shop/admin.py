from django.contrib import admin
from .models import Product, UserProfile, Category


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "user_type", "phone", "created_at"]
    list_filter = ["user_type"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at"]
    search_fields = ["name"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "price", "category", "seller", "quantity", "created_at"]
    list_filter = ["category"]

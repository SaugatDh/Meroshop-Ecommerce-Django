from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    USER_TYPE_CHOICES = [
        ("customer", "Customer"),
        ("admin", "Admin"),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    user_type = models.CharField(
        max_length=10, choices=USER_TYPE_CHOICES, default="customer"
    )
    phone = models.CharField(max_length=20, blank=True, default="")
    image = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.user_type})"


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ["name", "parent"]

    def __str__(self):
        return self.get_full_path()

    def get_full_path(self):
        if self.parent:
            return f"{self.parent.get_full_path()} -> {self.name}"
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    image = models.ImageField(upload_to="products/")
    quantity = models.IntegerField()
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="products", null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="wishlisted_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "product"]

    def __str__(self):
        return f"{self.user.username} - {self.product.title}"


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="in_carts"
    )
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.title} (x{self.quantity})"

    @property
    def total_price(self):
        return self.product.price * self.quantity


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]
    PAYMENT_CHOICES = [
        ("cod", "Cash on Delivery"),
        ("esewa", "eSewa"),
        ("khalti", "Khalti"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_CHOICES, default="cod"
    )
    shipping_address = models.TextField(blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.title} x{self.quantity}"

    @property
    def total_price(self):
        return self.price * self.quantity

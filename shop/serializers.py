from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, UserProfile, Category, Wishlist, CartItem, Order, OrderItem


class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(source="profile.user_type", read_only=True)
    phone = serializers.CharField(source="profile.phone", read_only=True)
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.profile.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.profile.image.url)
            return obj.profile.image.url
        return None

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "user_type",
            "phone",
            "image",
            "date_joined",
        ]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    first_name = serializers.CharField(max_length=150, required=False, default="")
    last_name = serializers.CharField(max_length=150, required=False, default="")

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        UserProfile.objects.create(user=user)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(min_length=6, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return data


class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source="parent.name", read_only=True)
    full_path = serializers.CharField(read_only=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "parent",
            "parent_name",
            "full_path",
            "children",
            "created_at",
        ]

    def get_children(self, obj):
        children = obj.children.all()
        return CategorySerializer(children, many=True).data


class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(
        source="category.get_full_path", read_only=True
    )
    category_id = serializers.IntegerField(source="category.id", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "description",
            "price",
            "discount",
            "category",
            "category_id",
            "category_name",
            "image",
            "image_url",
            "quantity",
            "seller",
            "seller_name",
            "created_at",
        ]
        read_only_fields = ["seller", "created_at"]

    def get_seller_name(self, obj):
        if obj.seller:
            return (
                f"{obj.seller.first_name} {obj.seller.last_name}".strip()
                or obj.seller.username
            )
        return None

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "product", "created_at"]


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "total_price", "created_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price", "total_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "user_name",
            "total_amount",
            "status",
            "payment_method",
            "shipping_address",
            "phone",
            "items",
            "created_at",
            "updated_at",
        ]

    def get_user_name(self, obj):
        if obj.user:
            return (
                f"{obj.user.first_name} {obj.user.last_name}".strip()
                or obj.user.username
            )
        return None


class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(required=False, default="")
    phone = serializers.CharField(required=False, default="")
    payment_method = serializers.ChoiceField(
        choices=["cod", "esewa", "khalti"], default="cod"
    )

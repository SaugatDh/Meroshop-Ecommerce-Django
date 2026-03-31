from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models import Product, Category, Wishlist, CartItem, Order, OrderItem
from .serializers import (
    ProductSerializer,
    UserSerializer,
    RegisterSerializer,
    ChangePasswordSerializer,
    CategorySerializer,
    WishlistSerializer,
    CartItemSerializer,
    OrderSerializer,
    CreateOrderSerializer,
)


def _is_admin(user):
    return (
        user.is_authenticated
        and hasattr(user, "profile")
        and user.profile.user_type == "admin"
    )


# Auth Views
@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username", "")
    password = request.data.get("password", "")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response(UserSerializer(user).data)
    return Response(
        {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out"})


@api_view(["GET"])
def me_view(request):
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    return Response({"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def change_password_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        if not request.user.check_password(
            serializer.validated_data["current_password"]
        ):
            return Response(
                {"current_password": "Incorrect password"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        login(request, request.user)
        return Response({"message": "Password updated successfully"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def update_profile_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    user = request.user
    user.first_name = request.data.get("first_name", user.first_name)
    user.last_name = request.data.get("last_name", user.last_name)
    user.email = request.data.get("email", user.email)
    user.save()
    phone = request.data.get("phone")
    if phone is not None:
        user.profile.phone = phone
        user.profile.save()

    if request.FILES.get("image"):
        user.profile.image = request.FILES.get("image")
        user.profile.save(update_fields=["image"])
    elif request.data.get("image") == "":
        user.profile.image = None
        user.profile.save(update_fields=["image"])

    return Response(UserSerializer(user, context={"request": request}).data)


# Product Views
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


@api_view(["GET"])
def product_detail_view(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )
    return Response(ProductSerializer(product, context={"request": request}).data)


@api_view(["POST"])
def create_product_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    serializer = ProductSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save(seller=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "PATCH"])
def update_product_view(request, pk):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    try:
        product = Product.objects.get(pk=pk, seller=request.user)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )
    serializer = ProductSerializer(
        product, data=request.data, partial=True, context={"request": request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_product_view(request, pk):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    try:
        product = Product.objects.get(pk=pk, seller=request.user)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )
    product.delete()
    return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def my_products_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    products = Product.objects.filter(seller=request.user).order_by("-created_at")
    return Response(
        ProductSerializer(products, many=True, context={"request": request}).data
    )


# Category Views (Admin)
@api_view(["GET"])
def admin_categories_view(request):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )
    # Get root categories (no parent)
    categories = Category.objects.filter(parent__isnull=True).order_by("name")
    return Response(CategorySerializer(categories, many=True).data)


@api_view(["POST"])
def admin_create_category_view(request):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def admin_delete_category_view(request, pk):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(
            {"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND
        )
    category.delete()
    return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def get_categories_tree_view(request):
    """Get all categories as a tree structure for dropdowns"""
    categories = Category.objects.filter(parent__isnull=True).order_by("name")
    return Response(CategorySerializer(categories, many=True).data)


# Wishlist Views (User)
@api_view(["GET"])
def wishlist_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    wishlist = Wishlist.objects.filter(user=request.user).order_by("-created_at")
    return Response(WishlistSerializer(wishlist, many=True).data)


@api_view(["POST"])
def add_to_wishlist_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    product_id = request.data.get("product_id")
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )
    wishlist, created = Wishlist.objects.get_or_create(
        user=request.user, product=product
    )
    return Response(
        {"message": "Added to wishlist" if created else "Already in wishlist"},
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@api_view(["DELETE"])
def remove_from_wishlist_view(request, product_id):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    try:
        wishlist = Wishlist.objects.get(user=request.user, product_id=product_id)
        wishlist.delete()
        return Response(
            {"message": "Removed from wishlist"}, status=status.HTTP_204_NO_CONTENT
        )
    except Wishlist.DoesNotExist:
        return Response({"error": "Not in wishlist"}, status=status.HTTP_404_NOT_FOUND)


# Cart Views (User)
@api_view(["GET"])
def cart_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    cart_items = CartItem.objects.filter(user=request.user).order_by("-created_at")
    return Response(CartItemSerializer(cart_items, many=True).data)


@api_view(["POST"])
def add_to_cart_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )

    cart_item, created = CartItem.objects.get_or_create(
        user=request.user, product=product, defaults={"quantity": quantity}
    )
    if not created:
        cart_item.quantity += int(quantity)
        cart_item.save()
    return Response(
        CartItemSerializer(cart_item).data,
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@api_view(["PUT"])
def update_cart_item_view(request, item_id):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    try:
        cart_item = CartItem.objects.get(pk=item_id, user=request.user)
    except CartItem.DoesNotExist:
        return Response(
            {"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND
        )

    quantity = request.data.get("quantity")
    if quantity:
        if int(quantity) <= 0:
            cart_item.delete()
            return Response(
                {"message": "Removed from cart"}, status=status.HTTP_204_NO_CONTENT
            )
        cart_item.quantity = int(quantity)
        cart_item.save()
    return Response(CartItemSerializer(cart_item).data)


@api_view(["DELETE"])
def remove_from_cart_view(request, item_id):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    try:
        cart_item = CartItem.objects.get(pk=item_id, user=request.user)
        cart_item.delete()
        return Response(
            {"message": "Removed from cart"}, status=status.HTTP_204_NO_CONTENT
        )
    except CartItem.DoesNotExist:
        return Response(
            {"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["DELETE"])
def clear_cart_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    CartItem.objects.filter(user=request.user).delete()
    return Response({"message": "Cart cleared"}, status=status.HTTP_204_NO_CONTENT)


# Admin Dashboard
@api_view(["GET"])
def admin_dashboard_view(request):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )

    from django.contrib.auth.models import User
    from .models import UserProfile

    total_users = User.objects.count()
    total_customers = UserProfile.objects.filter(user_type="customer").count()
    total_admins = UserProfile.objects.filter(user_type="admin").count()
    total_products = Product.objects.count()
    total_categories = Category.objects.count()

    recent_products = Product.objects.select_related("seller", "category").order_by(
        "-created_at"
    )[:10]
    recent_users = User.objects.select_related("profile").order_by("-date_joined")[:10]

    return Response(
        {
            "stats": {
                "total_users": total_users,
                "total_customers": total_customers,
                "total_admins": total_admins,
                "total_products": total_products,
                "total_categories": total_categories,
            },
            "recent_products": ProductSerializer(
                recent_products, many=True, context={"request": request}
            ).data,
            "recent_users": UserSerializer(recent_users, many=True).data,
        }
    )


@api_view(["GET"])
def admin_all_users_view(request):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )
    from django.contrib.auth.models import User

    users = User.objects.select_related("profile").all().order_by("-date_joined")
    return Response(UserSerializer(users, many=True).data)


@api_view(["DELETE"])
def admin_delete_product_view(request, pk):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )
    product.delete()
    return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["DELETE"])
def admin_delete_user_view(request, pk):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )
    from django.contrib.auth.models import User

    try:
        target = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    if target == request.user:
        return Response(
            {"error": "Cannot delete yourself"}, status=status.HTTP_400_BAD_REQUEST
        )
    target.delete()
    return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)


# Order Views
@api_view(["GET"])
def my_orders_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    orders = Order.objects.filter(user=request.user).order_by("-created_at")
    return Response(
        OrderSerializer(orders, many=True, context={"request": request}).data
    )


@api_view(["POST"])
def create_order_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )
    serializer = CreateOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cart_items = CartItem.objects.filter(user=request.user)
    if not cart_items.exists():
        return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

    total_amount = sum(item.product.price * item.quantity for item in cart_items)

    order = Order.objects.create(
        user=request.user,
        total_amount=total_amount,
        shipping_address=serializer.validated_data.get("shipping_address", ""),
        phone=serializer.validated_data.get("phone", request.user.profile.phone or ""),
        payment_method=serializer.validated_data.get("payment_method", "cod"),
    )

    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price,
        )

    cart_items.delete()

    return Response(
        OrderSerializer(order, context={"request": request}).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def admin_orders_view(request):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )
    orders = (
        Order.objects.select_related("user")
        .prefetch_related("items__product")
        .order_by("-created_at")
    )
    return Response(
        OrderSerializer(orders, many=True, context={"request": request}).data
    )


@api_view(["PUT"])
def admin_update_order_status_view(request, pk):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    status_value = request.data.get("status")
    if status_value:
        order.status = status_value
        order.save()

    return Response(OrderSerializer(order, context={"request": request}).data)


@api_view(["GET"])
def admin_dashboard_stats_view(request):
    if not _is_admin(request.user):
        return Response(
            {"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN
        )

    from django.contrib.auth.models import User
    from django.db.models import Sum, Count

    total_users = User.objects.count()
    total_customers = User.objects.filter(profile__user_type="customer").count()
    total_products = Product.objects.count()
    total_categories = Category.objects.count()

    orders = Order.objects.all()
    total_orders = orders.count()
    total_revenue = orders.aggregate(total=Sum("total_amount"))["total"] or 0

    delivered_orders = orders.filter(status="delivered").count()
    processing_orders = orders.filter(
        status__in=["pending", "confirmed", "shipped"]
    ).count()

    return Response(
        {
            "total_users": total_users,
            "total_customers": total_customers,
            "total_products": total_products,
            "total_categories": total_categories,
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "delivered_orders": delivered_orders,
            "processing_orders": processing_orders,
        }
    )

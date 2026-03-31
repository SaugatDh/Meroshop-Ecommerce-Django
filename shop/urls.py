from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("auth/register/", views.register_view, name="register"),
    path("auth/login/", views.login_view, name="login"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/me/", views.me_view, name="me"),
    path("auth/change-password/", views.change_password_view, name="change-password"),
    path("auth/update-profile/", views.update_profile_view, name="update-profile"),
    # Products
    path("products/", views.ProductListView.as_view(), name="product-list"),
    path("products/create/", views.create_product_view, name="product-create"),
    path("products/<int:pk>/", views.product_detail_view, name="product-detail"),
    path("products/<int:pk>/update/", views.update_product_view, name="product-update"),
    path("products/<int:pk>/delete/", views.delete_product_view, name="product-delete"),
    path("my-products/", views.my_products_view, name="my-products"),
    # Admin
    path("admin/dashboard/", views.admin_dashboard_view, name="admin-dashboard"),
    path("admin/users/", views.admin_all_users_view, name="admin-users"),
    path(
        "admin/products/<int:pk>/delete/",
        views.admin_delete_product_view,
        name="admin-delete-product",
    ),
    path(
        "admin/users/<int:pk>/delete/",
        views.admin_delete_user_view,
        name="admin-delete-user",
    ),
    # Categories (Admin only)
    path("admin/categories/", views.admin_categories_view, name="admin-categories"),
    path(
        "admin/categories/create/",
        views.admin_create_category_view,
        name="admin-create-category",
    ),
    path(
        "admin/categories/<int:pk>/delete/",
        views.admin_delete_category_view,
        name="admin-delete-category",
    ),
    # Wishlist
    path("wishlist/", views.wishlist_view, name="wishlist"),
    path("wishlist/add/", views.add_to_wishlist_view, name="add-to-wishlist"),
    path(
        "wishlist/remove/", views.remove_from_wishlist_view, name="remove-from-wishlist"
    ),
    # Cart
    path("cart/", views.cart_view, name="cart"),
    path("cart/add/", views.add_to_cart_view, name="add-to-cart"),
    path(
        "cart/<int:item_id>/update/",
        views.update_cart_item_view,
        name="update-cart-item",
    ),
    path(
        "cart/<int:item_id>/remove/",
        views.remove_from_cart_view,
        name="remove-from-cart",
    ),
    path("cart/clear/", views.clear_cart_view, name="clear-cart"),
    # Orders
    path("orders/", views.my_orders_view, name="my-orders"),
    path("orders/create/", views.create_order_view, name="create-order"),
    # Admin Orders
    path("admin/orders/", views.admin_orders_view, name="admin-orders"),
    path(
        "admin/orders/<int:pk>/",
        views.admin_update_order_status_view,
        name="admin-update-order",
    ),
    path(
        "admin/dashboard-stats/",
        views.admin_dashboard_stats_view,
        name="admin-dashboard-stats",
    ),
]

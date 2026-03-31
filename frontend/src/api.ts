const API_BASE = 'http://localhost:8000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  phone: string;
  image: string | null;
  date_joined: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  parent: number | null;
  parent_name: string | null;
  created_at: string;
  subcategories?: Category[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  discount: string | null;
  category: number | null;
  category_name: string | null;
  image: string;
  image_url: string | null;
  quantity: number;
  seller: number | null;
  seller_name: string | null;
  created_at: string;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      ...options.headers,
    },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export async function getMe(): Promise<User | null> {
  try {
    return await apiFetch('/auth/me/');
  } catch {
    return null;
  }
}

export async function login(username: string, password: string): Promise<User> {
  return apiFetch('/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}): Promise<User> {
  return apiFetch('/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout/', { method: 'POST' });
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<void> {
  return apiFetch('/auth/change-password/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateProfile(data: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  image?: File | null;
}): Promise<User> {
  const formData = new FormData();
  if (data.first_name !== undefined) formData.append('first_name', data.first_name);
  if (data.last_name !== undefined) formData.append('last_name', data.last_name);
  if (data.email !== undefined) formData.append('email', data.email);
  if (data.phone !== undefined) formData.append('phone', data.phone);
  if (data.image) formData.append('image', data.image);
  
  return apiFetch('/auth/update-profile/', {
    method: 'PUT',
    body: formData,
  });
}

export async function getProducts(): Promise<Product[]> {
  return apiFetch('/products/');
}

export async function createProduct(formData: FormData): Promise<Product> {
  return apiFetch('/products/create/', {
    method: 'POST',
    body: formData,
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return apiFetch(`/products/${id}/delete/`, { method: 'DELETE' });
}

export async function getMyProducts(): Promise<Product[]> {
  return apiFetch('/my-products/');
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch('/admin/categories/');
}

export async function createCategory(data: { name: string; description?: string; parent?: number | null }): Promise<Category> {
  return apiFetch('/admin/categories/create/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return apiFetch(`/admin/categories/${id}/delete/`, { method: 'DELETE' });
}

export function getCsrfToken(): string {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : '';
}

export interface AdminDashboard {
  stats: {
    total_users: number;
    total_customers: number;
    total_admins: number;
    total_products: number;
    total_categories: number;
  };
  recent_products: Product[];
  recent_users: User[];
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  return apiFetch('/admin/dashboard/');
}

export async function getAdminAllUsers(): Promise<User[]> {
  return apiFetch('/admin/users/');
}

export async function adminDeleteProduct(id: number): Promise<void> {
  return apiFetch(`/admin/products/${id}/delete/`, { method: 'DELETE' });
}

export async function adminDeleteUser(id: number): Promise<void> {
  return apiFetch(`/admin/users/${id}/delete/`, { method: 'DELETE' });
}

export async function getWishlist(): Promise<Product[]> {
  return apiFetch('/wishlist/');
}

export async function addToWishlist(productId: number): Promise<void> {
  return apiFetch('/wishlist/add/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId }),
  });
}

export async function removeFromWishlist(productId: number): Promise<void> {
  return apiFetch('/wishlist/remove/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId }),
  });
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export async function getCart(): Promise<CartItem[]> {
  return apiFetch('/cart/');
}

export async function addToCart(productId: number, quantity?: number): Promise<void> {
  return apiFetch('/cart/add/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, quantity: quantity || 1 }),
  });
}

export async function updateCartItem(itemId: number, quantity: number): Promise<void> {
  return apiFetch(`/cart/${itemId}/update/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(itemId: number): Promise<void> {
  return apiFetch(`/cart/${itemId}/remove/`, { method: 'POST' });
}

export async function clearCart(): Promise<void> {
  return apiFetch('/cart/clear/', { method: 'POST' });
}

export interface Order {
  id: number;
  user: number;
  user_name: string;
  total_amount: string;
  status: string;
  payment_method: string;
  shipping_address: string;
  phone: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
  total_price: string;
}

export interface DashboardStats {
  total_users: number;
  total_customers: number;
  total_products: number;
  total_categories: number;
  total_orders: number;
  total_revenue: number;
  delivered_orders: number;
  processing_orders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch('/admin/dashboard-stats/');
}

export async function getMyOrders(): Promise<Order[]> {
  return apiFetch('/orders/');
}

export async function createOrder(data: {
  shipping_address?: string;
  phone?: string;
  payment_method?: string;
}): Promise<Order> {
  return apiFetch('/orders/create/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function getAdminOrders(): Promise<Order[]> {
  return apiFetch('/admin/orders/');
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
  return apiFetch(`/admin/orders/${orderId}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
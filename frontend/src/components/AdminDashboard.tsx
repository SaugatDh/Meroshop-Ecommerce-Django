import React, { useState, useEffect } from 'react';
import {
  Users, Package, Shield, Trash2, LogOut,
  BarChart3, ShoppingBag, UserCheck, FolderTree, Plus,
  Edit, Download, ChevronRight, Upload, UserCircle, Menu, X
} from 'lucide-react';
import {
  User as UserType,
  getDashboardStats, DashboardStats,
  getAdminOrders, Order,
  getAdminAllUsers,
  adminDeleteProduct, adminDeleteUser,
  getCategories, createCategory, deleteCategory, Category,
  getProducts, Product, createProduct, updateProfile, changePassword
} from '../api';

interface AdminDashboardProps {
  user: UserType;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

type TabType = 'dashboard' | 'categories' | 'products' | 'orders' | 'profile';
type ProductViewType = 'list' | 'add';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [productView, setProductView] = useState<ProductViewType>('list');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [parentCategory, setParentCategory] = useState<number | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    quantity: '',
    category: ''
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productError, setProductError] = useState('');

  const [profileForm, setProfileForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone || ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(user.image || null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username;

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [sidebarOpen]);

  const navigateTo = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'products') setProductView('list');
    setSidebarOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catsData, prodsData, statsData, ordersData, usersData] = await Promise.all([
        getCategories(),
        getProducts(),
        getDashboardStats(),
        getAdminOrders(),
        getAdminAllUsers(),
      ]);
      setCategories(catsData);
      setProducts(prodsData);
      setStats(statsData);
      setOrders(ordersData);
      setAllUsers(usersData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const result = await getProducts();
      setProducts(result);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load products:', err);
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({
        name: newCategoryName,
        description: newCategoryDesc,
        parent: parentCategory
      });
      setNewCategoryName('');
      setNewCategoryDesc('');
      setParentCategory(null);
      setShowAddCategory(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const handleProductImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      setProductImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError('');
    
    if (!productImage) {
      setProductError('Please select an image');
      return;
    }
    if (!productForm.category) {
      setProductError('Please select a category');
      return;
    }

    setProductSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', productForm.title);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('quantity', productForm.quantity || '1');
      formData.append('image', productImage);
      if (productForm.discount) formData.append('discount', productForm.discount);

      await createProduct(formData);
      
      setProductForm({ title: '', description: '', price: '', discount: '', quantity: '', category: '' });
      setProductImage(null);
      setProductImagePreview(null);
      fetchProducts();
      setProductView('list');
    } catch (err: any) {
      const errors = err.data;
      if (typeof errors === 'object') {
        const msg = Object.entries(errors).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('. ');
        setProductError(msg);
      } else {
        setProductError('Failed to create product');
      }
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSubmitting(true);
    try {
      const updateData: any = {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: profileForm.email,
        phone: profileForm.phone,
        image: profileImage
      };
      await updateProfile(updateData);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      const errors = err.data;
      if (typeof errors === 'object') {
        const msg = Object.entries(errors).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('. ');
        setProfileError(msg);
      } else {
        setProfileError('Failed to update profile');
      }
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminDeleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminDeleteUser(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setPasswordSubmitting(true);
    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      });
      setPasswordSuccess(true);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordForm(false);
      }, 3000);
    } catch (err: any) {
      const errors = err.data;
      if (typeof errors === 'object') {
        const msg = Object.entries(errors).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('. ');
        setPasswordError(msg);
      } else {
        setPasswordError('Failed to change password');
      }
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const rootCategories = categories.filter(c => !c.parent);
  const getSubcategories = (parentId: number) => categories.filter(c => c.parent === parentId);

  const totalRevenue = stats?.total_revenue || 0;
  const totalCustomers = stats?.total_customers || 0;
  const totalProducts = stats?.total_products || 0;
  const totalOrders = stats?.total_orders || 0;
  const deliveredOrders = stats?.delivered_orders || 0;
  const processingOrders = stats?.processing_orders || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      
      {/* Sidebar */}
      <aside className={`fixed h-screen w-64 left-0 top-0 bg-[#fcf9f3] border-r border-[#e3beb9]/20 z-50 transition-transform duration-300 ease-in-out flex flex-col ${
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      } md:translate-x-0 md:sticky md:z-0 md:h-screen`}>
        
        {/* Sidebar Header */}
        <div className="h-[65px] px-6 flex justify-between items-center border-b border-[#e3beb9]/10 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-[10px] text-[#750005] uppercase tracking-[0.2em] font-black">Executive</h2>
            <span className="text-xs text-slate-800 font-bold uppercase tracking-widest">Admin Portal</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 -mr-2 hover:bg-[#750005]/5 rounded-full md:hidden transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'categories', label: 'Categories', icon: FolderTree },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'profile', label: 'My Profile', icon: UserCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id as TabType)}
              className={`flex items-center px-4 py-3 w-full rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-[#750005] text-white shadow-lg shadow-[#750005]/20'
                  : 'text-slate-600 hover:text-[#750005] hover:bg-[#750005]/5'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#750005]'
              }`} />
              <span className="text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#e3beb9]/20 shrink-0">
          <div className="bg-white/50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#750005]/10 flex items-center justify-center text-[#750005] font-bold text-xs">
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{fullName}</p>
              <p className="text-[10px] text-slate-500 uppercase font-medium">System Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 bg-[#fcf9f3]/80 backdrop-blur-md border-b border-[#e3beb9]/10 px-4 h-[65px] flex items-center md:hidden">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 -ml-1 hover:bg-[#e3beb9]/30 rounded-full transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6 text-[#750005]" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full min-h-screen pb-24 md:pb-0">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="p-8 max-w-7xl mx-auto space-y-12">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Operations Overview</h2>
                <p className="text-secondary mt-1">Heritage brand performance and logistics ledger.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white border border-outline-variant/15 text-primary text-sm font-semibold rounded-md shadow-sm hover:bg-slate-50 transition-colors">
                  Export Report
                </button>
                <button className="px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-md shadow-md hover:bg-primary-container transition-all">
                  New Campaign
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShoppingBag className="w-24 h-24" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">Total Revenue</span>
                  <h3 className="text-5xl font-black text-primary font-headline">Rs. {totalRevenue.toFixed(2)}</h3>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-tertiary">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>+12.5% from last period</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-tertiary">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-tertiary/10 rounded-xl">
                    <Users className="w-5 h-5 text-tertiary" />
                  </div>
                  <span className="text-xs font-bold text-tertiary bg-tertiary-fixed px-2 py-1 rounded">Active</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Total Customers</span>
                <h3 className="text-4xl font-extrabold text-on-surface font-headline">{totalCustomers}</h3>
                <p className="text-xs text-secondary mt-4">Growth trajectory stable</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary block">Total Product</span>
                  <h3 className="text-2xl font-bold text-on-surface font-headline">{totalProducts}</h3>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary block">Total Order</span>
                  <h3 className="text-2xl font-bold text-on-surface font-headline">{totalOrders}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:col-span-1">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary block mb-1">Delivered</span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-on-surface font-headline">{deliveredOrders}</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary block mb-1">Processing</span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-on-surface font-headline">{processingOrders}</h3>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-on-surface">Recent Transactional History</h3>
                  <button onClick={() => navigateTo('orders')} className="text-sm font-semibold text-primary hover:underline">View All</button>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">Order ID</th>
                        <th className="px-8 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">Customer</th>
                        <th className="px-8 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">Status</th>
                        <th className="px-8 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-surface-container-high transition-colors">
                          <td className="px-8 py-5 text-sm font-medium text-on-surface">#{order.id}</td>
                          <td className="px-8 py-5 text-sm text-secondary">{order.user_name}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 text-[0.6875rem] font-bold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-tertiary-container text-on-tertiary-container'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-on-surface text-right">Rs. {Number(order.total_amount).toFixed(2)}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-8 py-5 text-sm text-secondary text-center">No orders yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-primary text-on-primary p-8 rounded-xl shadow-xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Inventory Alert</h3>
                    <p className="text-on-primary/80 text-sm mb-6 leading-relaxed">You have {totalProducts} product{totalProducts !== 1 ? 's' : ''} in your catalog. Keep inventory updated.</p>
                    <button className="w-full py-3 bg-white text-primary font-bold text-sm rounded-md shadow-lg group-hover:scale-[1.02] transition-transform">
                      Restock Now
                    </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                    <Package className="w-24 h-24" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Categories</h2>
                <p className="text-secondary mt-1">{categories.length} categories total</p>
              </div>
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            {showAddCategory && (
              <form onSubmit={handleAddCategory} className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/20 space-y-4">
                <h3 className="font-headline font-bold text-lg">Add New Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">Category Name</label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                      placeholder="e.g., Electronics"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">Parent Category (optional)</label>
                    <select
                      value={parentCategory || ''}
                      onChange={(e) => setParentCategory(e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="">None (Root Category)</option>
                      {categories.filter(c => !c.parent).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">Description</label>
                  <textarea
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Category description..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Create Category
                  </button>
                  <button type="button" onClick={() => setShowAddCategory(false)} className="px-6 py-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {rootCategories.length === 0 ? (
                <p className="text-secondary text-sm py-8">No categories yet. Create your first category above.</p>
              ) : (
                rootCategories.map(rootCat => (
                  <div key={rootCat.id} className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden">
                    <div className="p-4 flex justify-between items-center bg-surface-container-lowest">
                      <div className="flex items-center gap-3">
                        <FolderTree className="w-5 h-5 text-primary" />
                        <span className="font-headline font-bold">{rootCat.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(rootCat.id)}
                        className="text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {getSubcategories(rootCat.id).length > 0 && (
                      <div className="p-4 pl-12 space-y-2 border-t border-outline-variant/10">
                        {getSubcategories(rootCat.id).map(subcat => (
                          <div key={subcat.id} className="flex justify-between items-center py-2">
                            <span className="text-secondary">{subcat.name}</span>
                            <button
                              onClick={() => handleDeleteCategory(subcat.id)}
                              className="text-secondary hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add Product Form - nested under Products */}
        {activeTab === 'products' && productView === 'add' && (
          <div className="p-8 md:p-12 lg:p-20 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-bold text-primary mb-6 tracking-widest uppercase">
              <button 
                onClick={() => setProductView('list')}
                className="hover:underline"
              >
                Products
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-secondary">Add Product</span>
            </nav>

            <header className="mb-12">
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Inventory Management</h1>
              <p className="text-on-surface-variant">Create a new entry for your retail catalog with high-fidelity asset management.</p>
            </header>

            {productError && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{productError}</div>
            )}

            <form onSubmit={handleProductSubmit}>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 space-y-8">
                  <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">General Information</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Product Title</label>
                        <input
                          required
                          className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all placeholder:text-slate-400"
                          placeholder="e.g. Premium Leather Weekend Bag"
                          type="text"
                          value={productForm.title}
                          onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Description</label>
                        <textarea
                          required
                          className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all placeholder:text-slate-400 resize-none"
                          placeholder="Detail the features, materials, and unique selling points..."
                          rows={5}
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Pricing & Inventory</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Price (NPR)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">Rs.</span>
                          <input
                            required
                            className="w-full bg-surface-container-low border-none rounded-lg p-4 pl-12 text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all"
                            step="0.01"
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Quantity</label>
                        <input
                          required
                          className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all"
                          type="number"
                          value={productForm.quantity}
                          onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Discount (%)</label>
                        <input
                          className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all"
                          max="100"
                          placeholder="0"
                          type="number"
                          value={productForm.discount}
                          onChange={(e) => setProductForm({...productForm, discount: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Category</label>
                        <select
                          required
                          className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all appearance-none cursor-pointer"
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="xl:col-span-4 space-y-8">
                  <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Product Media</h3>
                    <div 
                      className="aspect-square w-full rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-8 text-center group hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('product-image-input')?.click()}
                    >
                      {productImagePreview ? (
                        <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-on-surface-variant mb-4 group-hover:text-primary transition-colors" />
                          <p className="text-xs font-bold uppercase tracking-tighter text-on-surface mb-1">Upload High-Res Image</p>
                          <p className="text-[0.6875rem] text-on-surface-variant">Click to browse.</p>
                        </>
                      )}
                      <input 
                        id="product-image-input"
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleProductImage}
                      />
                    </div>
                  </section>

                  <div className="flex flex-col gap-3">
                    <button 
                      type="submit"
                      disabled={productSubmitting}
                      className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg shadow-xl shadow-primary/10 hover:bg-primary-container transition-all disabled:opacity-50"
                    >
                      {productSubmitting ? 'Publishing...' : 'Publish Product'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProductView('list')}
                      className="w-full bg-transparent border border-outline-variant/30 text-on-surface font-semibold py-4 rounded-lg hover:bg-surface-container transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && productView === 'list' && (
          <div className="p-8 max-w-7xl mx-auto">
            <section className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">All Products</h2>
                <p className="text-secondary mt-2">Manage your full product catalog.</p>
              </div>
              <button
                onClick={() => setProductView('add')}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-md hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                NEW PRODUCT
              </button>
            </section>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-8 py-4 text-[0.6875rem] font-bold text-secondary uppercase tracking-[0.1em]">ID</th>
                      <th className="px-4 py-4 text-[0.6875rem] font-bold text-secondary uppercase tracking-[0.1em]">Image</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold text-secondary uppercase tracking-[0.1em]">Title</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold text-secondary uppercase tracking-[0.1em]">Category</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold text-secondary uppercase tracking-[0.1em]">Price</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold text-secondary uppercase tracking-[0.1em]">Quantity</th>
                      <th className="px-8 py-4 text-[0.6875rem] font-bold text-secondary uppercase tracking-[0.1em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {products.map((product, index) => (
                      <tr key={product.id} className="group hover:bg-surface-container-high transition-colors">
                        <td className="px-8 py-5 text-sm font-bold text-primary">#{String(index + 1).padStart(3, '0')}</td>
                        <td className="px-4 py-5">
                          <div className="w-12 h-16 bg-surface-container rounded overflow-hidden">
                            {product.image_url ? (
                              <img alt={product.title} className="w-full h-full object-cover" src={product.image_url} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">{product.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[0.6875rem] font-bold rounded-full">
                            {product.category_name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-headline font-bold text-on-surface">Rs. {Number(product.price).toFixed(2)}</td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-medium text-on-surface">{product.quantity}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-secondary hover:text-primary hover:bg-primary-fixed rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-secondary hover:text-error hover:bg-error-container rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-secondary">No products yet. Add your first product above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-8 max-w-7xl mx-auto">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">All Orders</h2>
                <p className="text-secondary text-sm">Managing the global ledger of product transactions.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center px-4 py-2 bg-white border border-outline-variant text-on-surface text-sm font-semibold rounded-md shadow-sm hover:bg-slate-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </section>

            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/10">
                      <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">ID</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">Customer</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary">Items</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary text-right">Total</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary text-center">Payment</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary text-center">Status</th>
                      <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-widest text-secondary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-surface-container-high/30 transition-colors group">
                        <td className="px-6 py-5 text-sm font-semibold text-primary">#{order.id}</td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-bold text-on-surface">{order.user_name}</div>
                          <div className="text-xs text-secondary">{order.phone}</div>
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface">{order.items.length} item(s)</td>
                        <td className="px-6 py-5 text-sm font-bold text-on-surface text-right">Rs. {Number(order.total_amount).toFixed(2)}</td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-[0.6875rem] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {order.payment_method.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <select
                            value={order.status}
                            onChange={async (e) => {
                              try {
                                const updated = await import('../api').then(m => m.updateOrderStatus(order.id, e.target.value));
                                setOrders(orders.map(o => o.id === order.id ? updated : o));
                              } catch (err) {
                                console.error('Failed to update order status:', err);
                              }
                            }}
                            className={`text-[0.6875rem] font-bold px-2 py-1 rounded border-0 cursor-pointer ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <button className="p-1.5 text-secondary hover:text-primary transition-colors" title="View Details">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-sm text-secondary text-center">No orders yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="space-y-4 mb-8">
              <span className="text-[10px] font-headline tracking-widest text-secondary uppercase">Admin Settings</span>
              <h2 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">My Profile</h2>
            </div>

            {profileError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{profileError}</div>
            )}
            {profileSuccess && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">Profile updated successfully!</div>
            )}

            <form onSubmit={handleProfileSubmit} className="bg-surface-container-lowest rounded-xl p-8 space-y-8">
              <div className="flex items-center gap-6 pb-6 border-b border-outline-variant/10">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi20IAH7XFM0eBMPaWhGLRJEjyfl97dhriJR2IKDmYCmEB43aEihAxQuuqtUNCt7clfkDsh7aeCnNvSNJX3iSrkcw4R2jj6m1_9EzT5-XkDhtHz181HogkVldCWmYV7YrhfqCh9lMNy8NIQyk5iMRNnLtzMjy1cPkRWegST4upNny67o7WVrGTQD-gNUzBRSR00H5PTKVyPXiUssDp3pvViF5yMGQugtWu1kHAVzHgwEFSecI9IxjX-jUOFmnOpWAqGauXIdD1SXmF" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold">{fullName}</h3>
                  <p className="text-secondary">Administrator</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">First Name</label>
                  <input 
                    type="text" 
                    value={profileForm.first_name}
                    onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Last Name</label>
                  <input 
                    type="text" 
                    value={profileForm.last_name}
                    onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Email</label>
                  <input 
                    type="email" 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Phone</label>
                  <input 
                    type="tel" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Profile Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleProfileImage}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-bold"
                />
              </div>

              <div className="pt-6 border-t border-outline-variant/10 flex gap-4">
                <button 
                  type="submit"
                  disabled={profileSubmitting}
                  className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:bg-primary-container transition-all disabled:opacity-50"
                >
                  {profileSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="border border-outline-variant px-8 py-3 rounded-lg font-bold hover:bg-surface-container transition-all"
                >
                  {showPasswordForm ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPasswordForm && (
                <div className="pt-6 border-t border-outline-variant/10 space-y-6">
                  <h3 className="text-lg font-headline font-bold">Change Password</h3>
                  
                  {passwordError && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">Password changed successfully!</div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Current Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={passwordSubmitting}
                      className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:bg-primary-container transition-all disabled:opacity-50"
                    >
                      {passwordSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </form>
          </div>
        )}

      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fcf9f3] border-t border-[#e3beb9]/20 px-2 py-2 flex justify-around items-center z-50">
        {[
          { id: 'dashboard', label: 'Dash', icon: BarChart3 },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'orders', label: 'Orders', icon: ShoppingBag },
          { id: 'categories', label: 'Cats', icon: FolderTree },
          { id: 'profile', label: 'Profile', icon: UserCircle },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => navigateTo(item.id as TabType)} 
            className={`flex flex-col items-center p-2 min-w-[56px] transition-colors rounded-lg ${
              activeTab === item.id ? 'text-[#750005]' : 'text-slate-400'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

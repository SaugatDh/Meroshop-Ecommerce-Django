import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { Shop } from './components/Shop';
import { ProductDetail } from './components/ProductDetail';
import { Profile } from './components/Profile';
import { Cart } from './components/Cart';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ChangePasswordComponent } from './components/ChangePassword';
import { AdminDashboard } from './components/AdminDashboard';
import { Wishlist } from './components/Wishlist';
import { getMe, logout as apiLogout, User, Product } from './api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((u) => {
      setUser(u);
      if (u?.user_type === 'admin') {
        setCurrentPage('admin-dashboard');
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedProduct]);

  const handleNavigate = (page: string) => {
    if (user?.user_type === 'admin' && !['admin-dashboard', 'login'].includes(page)) {
      setCurrentPage('admin-dashboard');
      return;
    }
    setCurrentPage(page);
    setSelectedProduct(null);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleLogin = (u: User) => {
    setUser(u);
    if (u.user_type === 'admin') {
      setCurrentPage('admin-dashboard');
    }
  };

  const handleLogout = async () => {
    await apiLogout();
    setUser(null);
    setCurrentPage('home');
  };

  const handleUserUpdate = (u: User) => {
    setUser(u);
  };

  const isAdmin = user?.user_type === 'admin';

  const renderPage = () => {
    if (isAdmin && currentPage !== 'admin-dashboard') {
      return <AdminDashboard user={user!} onLogout={handleLogout} onNavigate={handleNavigate} />;
    }

    if (selectedProduct && currentPage === 'product-detail') {
      return <ProductDetail product={selectedProduct} onBack={() => setCurrentPage('shop')} user={user} />;
    }

    switch (currentPage) {
      case 'admin-dashboard':
        if (!user || user.user_type !== 'admin') {
          return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
        }
        return <AdminDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;

      case 'home':
        return <Home onNavigate={handleNavigate} onProductClick={handleProductClick} user={user} />;

      case 'shop':
        return <Shop onProductClick={handleProductClick} user={user} />;

      case 'profile':
        if (!user) return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
        return <Profile user={user} onNavigate={handleNavigate} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />;

      case 'change-password':
        if (!user) return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
        return <ChangePasswordComponent user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;

      case 'cart':
        return <Cart user={user} onNavigate={handleNavigate} />;

      case 'wishlist':
        if (!user) return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
        return <Wishlist onProductClick={handleProductClick} />;

      case 'login':
        if (user) {
          handleNavigate(user.user_type === 'admin' ? 'admin-dashboard' : 'profile');
          return null;
        }
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;

      case 'register':
        if (user) {
          handleNavigate(user.user_type === 'admin' ? 'admin-dashboard' : 'profile');
          return null;
        }
        return <Register onLogin={handleLogin} onNavigate={handleNavigate} />;

      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-secondary font-headline">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} user={user} onLogout={handleLogout} />
      <div className="flex-grow">
        {renderPage()}
      </div>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
import React from 'react';
import { ShoppingBag, User, Search, LogOut, Shield, Heart } from 'lucide-react';
import { User as UserType } from '../api';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user: UserType | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user, onLogout }) => {
  const isAdmin = user?.user_type === 'admin';

  return (
    <nav className="bg-[#fcf9f3] sticky top-0 z-50 border-b border-[#e3beb9]/15">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <button
            onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'home')}
            className="text-3xl font-bold tracking-tighter text-[#750005] cursor-pointer"
          >
            MeroShop
          </button>
          
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-6 font-headline text-sm tracking-tight">
              <button
                onClick={() => onNavigate('shop')}
                className={`font-medium transition-colors duration-200 cursor-pointer ${currentPage === 'shop' ? 'text-[#750005] font-bold border-b-2 border-[#750005]' : 'text-slate-600 hover:text-[#9e0b0e]'}`}
              >
                Flash Sale
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="text-slate-600 font-medium hover:text-[#9e0b0e] transition-colors duration-200 cursor-pointer"
              >
                Global Collection
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="text-slate-600 font-medium hover:text-[#9e0b0e] transition-colors duration-200 cursor-pointer"
              >
                Digital Goods
              </button>
              <button className="text-slate-600 font-medium hover:text-[#9e0b0e] transition-colors duration-200 cursor-pointer">
                Customer Care
              </button>
            </div>
          )}
          
          {isAdmin && (
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`font-medium transition-colors duration-300 cursor-pointer ${currentPage === 'admin-dashboard' ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
              >
                Dashboard
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <div className="relative hidden lg:block">
              <input
                className="bg-surface-container-low border-none focus:ring-2 focus:ring-[#750005] rounded-lg pl-10 pr-4 py-2 text-sm w-64 transition-all duration-300 outline-none"
                type="text"
                placeholder="Search for heritage..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
            </div>
          )}
          
          <div className="flex items-center gap-4">
            {!isAdmin && user && (
              <>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className={`hover:scale-95 duration-200 ease-in-out cursor-pointer ${currentPage === 'wishlist' ? 'text-[#750005]' : 'text-slate-600'}`}
                  title="Wishlist"
                >
                  <Heart className="w-6 h-6" />
                </button>
                <button
                  onClick={() => onNavigate('cart')}
                  className={`hover:scale-95 duration-200 ease-in-out cursor-pointer relative ${currentPage === 'cart' ? 'text-[#750005]' : 'text-slate-600'}`}
                  title="Cart"
                >
                  <ShoppingBag className="w-6 h-6" />
                </button>
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#750005] flex items-center justify-center text-white">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 hidden md:block">Admin</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate('profile')}
                    className={`hover:scale-95 duration-200 ease-in-out cursor-pointer ${currentPage === 'profile' || currentPage === 'change-password' ? 'text-[#750005]' : 'text-slate-600'}`}
                  >
                    <User className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-slate-600 hover:text-[#750005] transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="text-sm font-bold text-[#750005] border border-[#750005] px-4 py-2 rounded-md hover:bg-[#750005] hover:text-white transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

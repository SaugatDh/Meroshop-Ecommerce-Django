import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Heart, MapPin, Lock, LogOut, Trash2 } from 'lucide-react';
import { User as UserType, updateProfile, getWishlist, removeFromWishlist, addToCart, Product } from '../api';

interface ProfileProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUserUpdate: (user: UserType) => void;
}

type ProfileSection = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'password';

export const Profile: React.FC<ProfileProps> = ({ user, onNavigate, onLogout, onUserUpdate }) => {
  const [activeSection, setActiveSection] = useState<ProfileSection>('profile');
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username;
  const memberYear = user.date_joined ? new Date(user.date_joined).getFullYear() : new Date().getFullYear();

  useEffect(() => {
    if (activeSection === 'wishlist') {
      loadWishlist();
    }
  }, [activeSection]);

  const loadWishlist = () => {
    setWishlistLoading(true);
    getWishlist()
      .then(setWishlistItems)
      .catch(console.error)
      .finally(() => setWishlistLoading(false));
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems(wishlistItems.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId);
      await removeFromWishlist(productId);
      setWishlistItems(wishlistItems.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const startEdit = (field: string, value: string) => {
    setEditing(field);
    setEditValue(value);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const updateData: any = {};
      if (editing === 'name') {
        const parts = editValue.split(' ');
        updateData.first_name = parts[0] || '';
        updateData.last_name = parts.slice(1).join(' ') || '';
      } else if (editing === 'email') {
        updateData.email = editValue;
      } else if (editing === 'phone') {
        updateData.phone = editValue;
      }
      const updated = await updateProfile(updateData);
      onUserUpdate(updated);
      setEditing(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-32 space-y-8">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center">
              <User className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg leading-none">{fullName}</h3>
              <p className="text-secondary text-sm">Member since {memberYear}</p>
            </div>
          </div>
          <nav className="flex flex-col space-y-2">
            <button 
              onClick={() => setActiveSection('profile')}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all cursor-pointer ${
                activeSection === 'profile' 
                  ? 'bg-surface-container-low text-primary font-bold' 
                  : 'text-secondary hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <User className="w-5 h-5" />
              <span>My Profile</span>
            </button>
            <button 
              onClick={() => setActiveSection('orders')}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all cursor-pointer ${
                activeSection === 'orders' 
                  ? 'bg-surface-container-low text-primary font-bold' 
                  : 'text-secondary hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Order History</span>
            </button>
            <button 
              onClick={() => setActiveSection('wishlist')}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all cursor-pointer ${
                activeSection === 'wishlist' 
                  ? 'bg-surface-container-low text-primary font-bold' 
                  : 'text-secondary hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </button>
            <button 
              onClick={() => setActiveSection('addresses')}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all cursor-pointer ${
                activeSection === 'addresses' 
                  ? 'bg-surface-container-low text-primary font-bold' 
                  : 'text-secondary hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Address Book</span>
            </button>
            <button 
              onClick={() => setActiveSection('password')}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all cursor-pointer ${
                activeSection === 'password' 
                  ? 'bg-surface-container-low text-primary font-bold' 
                  : 'text-secondary hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span>Change Password</span>
            </button>
            <div className="pt-6 mt-6 border-t border-outline-variant/20"></div>
            <button 
              onClick={onLogout}
              className="flex items-center space-x-3 py-3 px-4 text-secondary hover:text-primary transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-grow space-y-16">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <>
            <div className="space-y-4">
              <span className="text-label-sm font-headline tracking-widest text-secondary uppercase">Account Overview</span>
              <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Personal Information</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-surface-container-low rounded-lg group transition-all hover:bg-white border border-transparent hover:border-outline-variant/20">
                <div className="flex justify-between items-start">
                  {editing === 'name' ? (
                    <div className="flex-1 mr-4">
                      <p className="text-label-sm text-secondary uppercase tracking-wider mb-2">Full Name</p>
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-white border border-outline-variant/30 rounded px-3 py-2 text-xl font-headline font-bold outline-none focus:border-primary"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-3">
                        <button onClick={saveEdit} disabled={loading} className="text-xs text-primary font-bold cursor-pointer">{loading ? 'Saving...' : 'Save'}</button>
                        <button onClick={() => setEditing(null)} className="text-xs text-secondary cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-label-sm text-secondary uppercase tracking-wider">Full Name</p>
                        <p className="text-xl font-headline font-bold">{fullName}</p>
                      </div>
                      <button onClick={() => startEdit('name', fullName)} className="text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Edit</button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-8 bg-surface-container-low rounded-lg group transition-all hover:bg-white border border-transparent hover:border-outline-variant/20">
                <div className="flex justify-between items-start">
                  {editing === 'email' ? (
                    <div className="flex-1 mr-4">
                      <p className="text-label-sm text-secondary uppercase tracking-wider mb-2">Email Address</p>
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-white border border-outline-variant/30 rounded px-3 py-2 text-xl font-headline font-bold outline-none focus:border-primary"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-3">
                        <button onClick={saveEdit} disabled={loading} className="text-xs text-primary font-bold cursor-pointer">{loading ? 'Saving...' : 'Save'}</button>
                        <button onClick={() => setEditing(null)} className="text-xs text-secondary cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-label-sm text-secondary uppercase tracking-wider">Email Address</p>
                        <p className="text-xl font-headline font-bold">{user.email}</p>
                      </div>
                      <button onClick={() => startEdit('email', user.email || '')} className="text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Edit</button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-8 bg-surface-container-low rounded-lg group transition-all hover:bg-white border border-transparent hover:border-outline-variant/20">
                <div className="flex justify-between items-start">
                  {editing === 'phone' ? (
                    <div className="flex-1 mr-4">
                      <p className="text-label-sm text-secondary uppercase tracking-wider mb-2">Phone Number</p>
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-white border border-outline-variant/30 rounded px-3 py-2 text-xl font-headline font-bold outline-none focus:border-primary"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-3">
                        <button onClick={saveEdit} disabled={loading} className="text-xs text-primary font-bold cursor-pointer">{loading ? 'Saving...' : 'Save'}</button>
                        <button onClick={() => setEditing(null)} className="text-xs text-secondary cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-label-sm text-secondary uppercase tracking-wider">Phone Number</p>
                        <p className="text-xl font-headline font-bold">{user.phone || 'Not set'}</p>
                      </div>
                      <button onClick={() => startEdit('phone', user.phone || '')} className="text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Edit</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Order History Section */}
        {activeSection === 'orders' && (
          <>
            <div className="space-y-4">
              <span className="text-label-sm font-headline tracking-widest text-secondary uppercase">Account Overview</span>
              <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Order History</h1>
            </div>

            <div className="space-y-10">
              <div className="group border-b border-outline-variant/30 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                  <div>
                    <span className="text-xs font-bold font-headline uppercase tracking-widest text-primary mb-1 block">Delivered — Oct 12, 2023</span>
                    <h3 className="font-headline text-2xl font-bold tracking-tight">Order #HN-884021</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-sm font-bold text-primary border-b-2 border-primary pb-0.5 hover:opacity-70 transition-opacity cursor-pointer">Track Shipment</button>
                    <button className="bg-primary text-on-primary px-6 py-2.5 rounded text-sm font-bold hover:bg-primary-container transition-all cursor-pointer">Order Details</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-6 bg-surface-container-lowest p-6 rounded-lg border border-transparent hover:border-outline-variant/30 transition-all duration-300">
                    <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded bg-surface-container">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFBQEdtkizrix9NZGx_77iaJTlK9OF4ZQzCj1Nm7VgTkT-hfqTUFIR3qU4IS0p6cuqTOLEcC7tAARxzvPH90MMcwoFkecxCJ0IbRqt5dcVBXHs3WIEG25pGfTGDLO8Q8zhF2u6LMTrjikBeHAjDgBAXUfUYRHrp-uPi5XcqOz1FV4i-_IrJtiQ-JUokG85vvqxjyH9rh1gMbc0yNJkH5nOkxEN3iZiaaCWN7Lf23RxmbyE6Jn2wH5Ujh5ogvLbEu39M9Is_zGLgRFP" alt="Product" />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-headline font-bold text-lg mb-0.5">Hand-Loomed Pashmina</h4>
                        <p className="text-xs text-secondary font-headline uppercase tracking-wider mb-2">Sunita Shrestha</p>
                      </div>
                      <span className="text-primary font-bold text-lg">NPR 55,800</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center py-12">
                <p className="text-secondary italic">No more orders to display</p>
              </div>
            </div>
          </>
        )}

        {/* Wishlist Section */}
        {activeSection === 'wishlist' && (
          <>
            <div className="space-y-4">
              <span className="text-label-sm font-headline tracking-widest text-secondary uppercase">Account Overview</span>
              <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Wishlist</h1>
            </div>

            {wishlistLoading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-secondary">Loading wishlist...</p>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Heart className="w-16 h-16 text-secondary/20 mb-4" />
                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Your wishlist is empty</h3>
                <p className="text-secondary text-sm">Save products you love by clicking the heart icon</p>
                <button 
                  onClick={() => onNavigate('shop')}
                  className="mt-6 text-primary font-bold border-b-2 border-primary pb-1 hover:opacity-70 transition-opacity"
                >
                  Browse Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlistItems.map((product) => (
                  <div key={product.id} className="group border-b border-outline-variant/30 pb-8">
                    <div className="flex gap-6 bg-surface-container-lowest p-6 rounded-lg border border-transparent hover:border-outline-variant/30 transition-all duration-300 mb-4">
                      <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded bg-surface-container">
                        {product.image_url ? (
                          <img className="w-full h-full object-cover" src={product.image_url} alt={product.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-secondary/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between py-1 flex-grow">
                        <div>
                          <h4 className="font-headline font-bold text-lg mb-0.5 line-clamp-2">{product.title}</h4>
                          <p className="text-xs text-secondary font-headline uppercase tracking-wider mb-2">{product.category_name}</p>
                        </div>
                        <span className="text-primary font-bold text-lg">Rs. {Number(product.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        className="flex-1 bg-primary text-on-primary px-6 py-2.5 rounded text-sm font-bold hover:bg-primary-container transition-all cursor-pointer"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="p-2.5 text-secondary hover:text-error hover:bg-error-container rounded transition-all cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Address Book Section */}
        {activeSection === 'addresses' && (
          <>
            <div className="space-y-4">
              <span className="text-label-sm font-headline tracking-widest text-secondary uppercase">Account Overview</span>
              <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Address Book</h1>
            </div>

            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MapPin className="w-16 h-16 text-secondary/20 mb-4" />
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">No addresses saved</h3>
              <p className="text-secondary text-sm">Add delivery addresses for faster checkout</p>
              <button className="mt-6 bg-primary text-on-primary px-6 py-2.5 rounded text-sm font-bold hover:bg-primary-container transition-all cursor-pointer">
                Add New Address
              </button>
            </div>
          </>
        )}

        {/* Change Password Section */}
        {activeSection === 'password' && (
          <>
            <div className="space-y-4">
              <span className="text-label-sm font-headline tracking-widest text-secondary uppercase">Account Overview</span>
              <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Change Password</h1>
            </div>

            <div className="max-w-xl">
              <div className="p-8 bg-surface-container-low rounded-lg space-y-6">
                <div>
                  <label className="block text-label-sm text-secondary uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-label-sm text-secondary uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-label-sm text-secondary uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                    placeholder="Confirm new password"
                  />
                </div>
                <button className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-bold hover:bg-primary-container transition-all cursor-pointer">
                  Update Password
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

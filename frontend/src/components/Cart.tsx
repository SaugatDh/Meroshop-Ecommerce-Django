import React, { useState, useEffect } from 'react';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { getCart, updateCartItem, removeFromCart, clearCart, createOrder, CartItem as CartItemType, User } from '../api';

interface CartProps {
  user?: User | null;
  onNavigate?: (page: string) => void;
}

export const Cart: React.FC<CartProps> = ({ user, onNavigate }) => {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shipping_address: '',
    phone: user?.phone || '',
    payment_method: 'cod',
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    getCart()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      if (onNavigate) onNavigate('login');
      return;
    }

    setCheckoutLoading(true);
    try {
      await createOrder(checkoutData);
      setItems([]);
      setShowCheckoutForm(false);
      alert('Order placed successfully!');
      if (onNavigate) onNavigate('profile');
    } catch (err) {
      console.error('Failed to checkout:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <p className="text-secondary">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">Shopping Bag</h1>
        <p className="text-secondary font-sans italic">You have {items.length} item{items.length !== 1 ? 's' : ''} in your bag.</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-secondary/20 mb-4" />
          <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Your cart is empty</h3>
          <p className="text-secondary text-sm">Add products from the shop to get started</p>
          {onNavigate && (
            <button 
              onClick={() => onNavigate('shop')}
              className="mt-4 text-primary font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-8"
            >
              Continue Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-8 p-6 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
                <div className="w-full sm:w-40 aspect-square bg-surface-container rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    className="w-full h-full object-cover" 
                    src={item.product.image_url || item.product.image} 
                    referrerPolicy="no-referrer" 
                    alt={item.product.title}
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-headline font-bold tracking-widest text-secondary uppercase mb-1">{item.product.category_name}</p>
                      <h3 className="text-xl font-headline font-bold text-on-surface">{item.product.title}</h3>
                      <p className="text-sm text-secondary mt-1">Seller: {item.product.seller_name}</p>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-secondary hover:text-error transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center border border-outline-variant rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-bold text-sm border-x border-outline-variant">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xl font-headline font-bold text-primary">Rs. {(Number(item.product.price) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center">
              <button 
                onClick={handleClear}
                className="text-secondary hover:text-error text-sm font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
              {onNavigate && (
                <button 
                  onClick={() => onNavigate('shop')}
                  className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:underline decoration-2 underline-offset-8"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Continue Shopping
                </button>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-surface-container-high p-8 rounded-lg sticky top-32 space-y-8">
              <h3 className="text-2xl font-headline font-bold tracking-tight border-b border-outline-variant/20 pb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span className="font-bold text-on-surface">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-primary font-bold uppercase text-xs tracking-widest">Complimentary</span>
                  ) : (
                    <span className="font-bold text-on-surface">Rs. {shipping.toLocaleString()}</span>
                  )}
                </div>
                <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-baseline">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-headline font-extrabold text-primary">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {!showCheckoutForm ? (
                <button 
                  onClick={() => {
                    if (!user) {
                      if (onNavigate) onNavigate('login');
                      return;
                    }
                    setShowCheckoutForm(true);
                  }}
                  className="bg-primary w-full py-4 text-on-primary font-headline font-bold rounded-md shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  Checkout Now
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">Shipping Address</label>
                    <textarea
                      value={checkoutData.shipping_address}
                      onChange={(e) => setCheckoutData({...checkoutData, shipping_address: e.target.value})}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-sm"
                      placeholder="Enter your shipping address..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">Phone</label>
                    <input
                      type="tel"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-sm"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-1">Payment Method</label>
                    <select
                      value={checkoutData.payment_method}
                      onChange={(e) => setCheckoutData({...checkoutData, payment_method: e.target.value})}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-sm"
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="esewa">eSewa</option>
                      <option value="khalti">Khalti</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="flex-1 bg-primary text-on-primary py-3 font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {checkoutLoading ? 'Processing...' : 'Place Order'}
                    </button>
                    <button 
                      onClick={() => setShowCheckoutForm(false)}
                      className="px-4 py-3 border border-outline-variant rounded-md hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

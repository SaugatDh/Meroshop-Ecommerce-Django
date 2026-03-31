import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product, getWishlist, removeFromWishlist, addToCart } from '../api';
import { ProductCard } from './ProductCard';

export const Wishlist: React.FC<{ onProductClick: (product: Product) => void }> = ({ onProductClick }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    getWishlist()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleRemove = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
      setItems(items.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const handleAddToCart = async (productId: number) => {
    setAddingToCart(productId);
    try {
      await addToCart(productId);
      await removeFromWishlist(productId);
      setItems(items.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">Wishlist</h1>
        <p className="text-secondary font-sans italic">
          {loading ? 'Loading...' : `${items.length} product${items.length !== 1 ? 's' : ''} saved`}
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-secondary">Loading wishlist...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-16 h-16 text-secondary/20 mb-4" />
          <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Your wishlist is empty</h3>
          <p className="text-secondary text-sm">Save products you love by clicking the heart icon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
          {items.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} onClick={onProductClick} />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemove(product.id)}
                  className="p-2 bg-surface-container-high rounded-full hover:bg-error/10 hover:text-error transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingToCart === product.id}
                  className="p-2 bg-primary text-on-primary rounded-full hover:bg-primary-container transition-colors disabled:opacity-50"
                  title="Add to cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

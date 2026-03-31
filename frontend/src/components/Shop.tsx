import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, ShoppingBag } from 'lucide-react';
import { Product, getProducts, User, getCategories, getWishlist, getCart, CartItem } from '../api';
import { ProductCard } from './ProductCard';

export const Shop: React.FC<{ onProductClick: (product: Product) => void; user?: User | null }> = ({ onProductClick, user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
    
    if (user) {
      getWishlist().then(items => setWishlistIds(items.map(p => p.id))).catch(console.error);
      getCart().then(items => setCartIds(items.map(i => i.product.id))).catch(console.error);
    }
  }, [user]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const categories = [...new Set(products.map((p) => p.category_name).filter(Boolean))];

  const handleWishlistChange = () => {
    if (user) {
      getWishlist().then(items => setWishlistIds(items.map(p => p.id))).catch(console.error);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs font-headline tracking-widest text-secondary uppercase mb-4">
              <span>Shop</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary font-bold">All Products</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">Shop</h1>
            <p className="text-secondary font-sans italic">
              {loading ? 'Loading...' : `Showing ${sorted.length} product${sorted.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-4 border-b border-outline-variant pb-2">
            <span className="text-xs font-headline uppercase tracking-widest text-secondary">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-semibold cursor-pointer outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
          {categories.length > 0 && (
            <div>
              <h3 className="font-headline font-bold text-lg mb-6 border-b border-outline-variant pb-2">Categories</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded-sm border-secondary text-primary focus:ring-primary w-4 h-4" defaultChecked />
                    <span className="text-sm font-sans text-on-surface group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-headline font-bold text-lg mb-6 border-b border-outline-variant pb-2">Price Range</h3>
            <div className="space-y-4">
              <input className="w-full accent-primary bg-surface-container-high h-1 rounded-full appearance-none cursor-pointer" type="range" min="0" max="1000" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-headline text-secondary">$0</span>
                <span className="text-xs font-headline text-secondary">$1,000</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-secondary">Loading products...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="w-16 h-16 text-secondary/20 mb-4" />
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">No products yet</h3>
              <p className="text-secondary text-sm">Be the first to list a product!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {sorted.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={onProductClick} 
                  user={user}
                  isInWishlist={wishlistIds.includes(product.id)}
                  onWishlistChange={handleWishlistChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

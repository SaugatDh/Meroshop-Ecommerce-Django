import React, { useState, useEffect } from 'react';
import { Heart, User as UserIcon } from 'lucide-react';
import { getProducts, getCategories, addToCart, addToWishlist, Product, Category, User, getCart } from '../api';

interface HomeProps {
  onNavigate: (page: string) => void;
  onProductClick?: (product: Product) => void;
  user?: User | null;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onProductClick, user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCounts, setWishlistCounts] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodsData, catsData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => {
    if (user) {
      getCart().then(items => {
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      }).catch(console.error);
    }
  }, [user]);

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      await addToCart(productId, 1);
      setCartCount(prev => prev + 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('login');
      return;
    }
    try {
      await addToWishlist(productId);
      setWishlistCounts(prev => ({ ...prev, [productId]: true }));
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
    }
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      onNavigate('product-detail');
    }
  };

  const displayProducts = products.slice(0, 6);

  const categoryIcons: Record<string, string> = {
    'Handmade Apparel': 'checkroom',
    'Traditional Decor': 'home_iot_device',
    'Artisan Jewelry': 'diamond',
    'Organic Tea & Spices': 'nutrition',
    'Featured Brands': 'star',
    'Ayurvedic Beauty': 'spa',
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-8">
      <section className="mb-12 relative overflow-hidden rounded-lg group h-[420px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvddlqB-m4FIx9cGrAXqbIIdss_MV5lEnxdUzWZE9zaGWc0jY4aZ7PFjTatxSeYH-IC_l8GIHm0IhizUFxqszfmgCgvt_bOlXCb_cfiiaLxotlB0cQ6_bsIwMO5QuSDH0L3ZHeQeHH4Oj9l8IDlKI_qXFgEJDvIDxN96XCyw2e7jj2SM460DQac5TjgWAwWunyk8YFRBsgOPrrKpE_4ubQJDEGDRurx74QQL7b3w728QxiN_yP4KyUrH4qcvPBeUawGtZgqdMuveuH')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c18]/80 to-transparent"></div>
        </div>
        <div className="relative h-full flex flex-col justify-center px-16 text-on-primary max-w-2xl">
          <span className="font-label text-xs tracking-widest uppercase mb-4 opacity-90">Seasonal Selection</span>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-tight">
            Authentic Nepali Crafts Up to 40% Off
          </h1>
          <p className="font-body text-lg mb-8 text-surface-container-lowest/80 leading-relaxed">
            Discover curated hand-knotted rugs, cashmere shawls, and metalwork from the heart of Kathmandu valley.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('shop')}
              className="crimson-gradient px-8 py-3 rounded-md font-semibold text-sm hover:opacity-90 transition-all editorial-shadow"
            >
              Shop Flash Sale
            </button>
            <button className="bg-surface/10 backdrop-blur-md border border-surface/20 px-8 py-3 rounded-md font-semibold text-sm hover:bg-surface/20 transition-all">
              Explore Collections
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-12 h-1 bg-on-primary rounded-full"></div>
          <div className="w-12 h-1 bg-on-primary/30 rounded-full"></div>
          <div className="w-12 h-1 bg-on-primary/30 rounded-full"></div>
        </div>
      </section>

      <div className="flex gap-10">
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-surface-container-low rounded-lg p-6 sticky top-28">
            <h3 className="font-headline font-bold text-lg mb-6 border-b border-outline-variant/20 pb-2">Categories</h3>
            <ul className="space-y-4 font-body text-sm text-secondary">
              {categories.length > 0 ? categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => onNavigate('shop')}
                    className="flex items-center justify-between group hover:text-primary transition-colors w-full text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">
                        {categoryIcons[cat.name] || 'category'}
                      </span>
                      {cat.name}
                    </span>
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">chevron_right</span>
                  </button>
                </li>
              )) : (
                <>
                  {['Handmade Apparel', 'Traditional Decor', 'Artisan Jewelry', 'Organic Tea & Spices', 'Featured Brands', 'Ayurvedic Beauty'].map((name, i) => (
                    <li key={i}>
                      <button className="flex items-center justify-between group hover:text-primary transition-colors w-full text-left">
                        <span className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-lg">{categoryIcons[name] || 'category'}</span>
                          {name}
                        </span>
                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">chevron_right</span>
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
            <div className="mt-12 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Member Perks</p>
              <p className="text-xs leading-relaxed text-on-surface mb-3">Get free shipping on your first heritage purchase.</p>
              <button 
                onClick={() => onNavigate('register')}
                className="text-xs font-bold text-primary underline"
              >
                Join Club
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-10 flex items-center gap-8 overflow-x-auto pb-4 no-scrollbar grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {['Sherpa Adventure', 'Himalayan Java', 'Dhaka Textiles', 'Kathmandu Crafts', 'Bodhi Bodhi', 'Organic Nepal'].map((brand, i) => (
              <div key={i} className="flex-shrink-0 px-4 py-2 bg-surface-container-high rounded-full text-xs font-bold tracking-tighter uppercase">
                {brand}
              </div>
            ))}
          </div>

          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-headline text-3xl font-extrabold tracking-tight">Today's Picks</h2>
              <p className="text-secondary text-sm">Hand-picked authentic products from local artisans.</p>
            </div>
            <button 
              onClick={() => onNavigate('shop')}
              className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.length > 0 ? displayProducts.map((product) => {
              const price = Number(product.price);
              const discount = product.discount ? Number(product.discount) : 0;
              const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
              
              return (
                <div 
                  key={product.id} 
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface-container-low mb-4 relative">
                    <img 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      src={product.image_url || ''}
                      referrerPolicy="no-referrer"
                    />
                    {discount > 0 && (
                      <div className="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded">
                        -{discount}%
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/90 backdrop-blur-sm">
                      <button 
                        onClick={(e) => handleAddToCart(e, product.id)}
                        className="w-full crimson-gradient text-on-primary py-2 text-xs font-bold rounded"
                      >
                        QUICK ADD
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        {product.seller_name && (
                          <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-200">
                            <div className="w-full h-full flex items-center justify-center text-[8px]">
                              {product.seller_name.charAt(0)}
                            </div>
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">
                          By {product.seller_name || 'Artisan'}
                        </span>
                      </div>
                      <p className="text-primary font-extrabold text-lg">
                        Rs. {discountedPrice.toLocaleString()}
                        {discount > 0 && (
                          <span className="text-secondary text-xs line-through ml-2 font-normal">
                            Rs. {price.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => handleAddToWishlist(e, product.id)}
                      className={`transition-colors ${wishlistCounts[product.id] ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                      <Heart className={`w-5 h-5 ${wishlistCounts[product.id] ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            }) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface-container-low mb-4 relative animate-pulse">
                    <div className="w-full h-full bg-surface-container-high"></div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="h-4 bg-surface-container rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-surface-container rounded w-1/2 mb-2"></div>
                      <div className="h-5 bg-surface-container rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

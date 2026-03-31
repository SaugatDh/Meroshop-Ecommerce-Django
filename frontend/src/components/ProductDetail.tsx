import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, User, Heart } from 'lucide-react';
import { Product, addToCart, addToWishlist, User as UserType } from '../api';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  user?: UserType | null;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, user }) => {
  const imgSrc = product.image_url || '';
  const price = Number(product.price);
  const discount = product.discount ? Number(product.discount) : 0;
  const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!user) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id);
      setShowCartSuccess(true);
      setTimeout(() => setShowCartSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return;
    setAddingToWishlist(true);
    try {
      await addToWishlist(product.id);
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
    } finally {
      setAddingToWishlist(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Shop</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Image */}
        <div className="lg:col-span-7">
          <div className="col-span-2 overflow-hidden rounded-lg bg-surface-container h-[600px] relative">
            {imgSrc ? (
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={imgSrc}
                alt={product.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                <ShoppingBag className="w-24 h-24 text-secondary/20" />
              </div>
            )}
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 flex flex-col space-y-8 sticky top-32 h-fit">
          <div>
            <span className="text-[10px] font-headline font-bold tracking-[0.1em] text-secondary uppercase mb-2 block">{product.category_name}</span>
            <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              {discount > 0 ? (
                <>
                  <span className="text-3xl font-headline font-bold text-green-600">Rs. {discountedPrice.toFixed(2)}</span>
                  <span className="text-xl font-headline font-bold text-red-500 line-through">Rs. {price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-3xl font-headline font-bold text-primary">Rs. {price.toFixed(2)}</span>
              )}
            </div>
            
            {product.seller_name && (
              <div className="flex items-center gap-2 text-secondary">
                <User className="w-4 h-4" />
                <span className="text-sm">by {product.seller_name}</span>
              </div>
            )}
          </div>

          {product.description && (
            <div className="space-y-4">
              <p className="text-secondary leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary">Stock:</span>
              <span className="font-bold text-sm">{product.quantity > 0 ? 'Available' : 'Out of Stock'}</span>
            </div>

            {user && !user.user_type?.includes('admin') && (
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.quantity === 0}
                  className={`flex-1 py-4 font-headline font-bold rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    showCartSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-primary text-white shadow-primary/10 hover:opacity-90'
                  } disabled:opacity-50`}
                >
                  {showCartSuccess ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button 
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist}
                  className="p-4 border-2 border-outline-variant rounded-md hover:border-error hover:text-error transition-colors disabled:opacity-50"
                  title="Add to wishlist"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            )}

            {(!user || user.user_type?.includes('admin')) && product.quantity === 0 && (
              <button disabled className="w-full py-4 bg-gray-400 text-white font-headline font-bold rounded-md shadow-lg cursor-not-allowed">
                Out of Stock
              </button>
            )}

            <div className="flex items-center gap-4 py-4 border-t border-outline-variant/20">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-sm text-secondary">Free shipping on orders over Rs. 500.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
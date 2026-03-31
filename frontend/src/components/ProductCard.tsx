import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, User } from 'lucide-react';
import { Product, addToWishlist, removeFromWishlist, addToCart, User as UserType } from '../api';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  user?: UserType | null;
  isInWishlist?: boolean;
  onWishlistChange?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, user, isInWishlist = false, onWishlistChange }) => {
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const imgSrc = product.image_url || '';
  const price = Number(product.price);
  const discount = product.discount ? Number(product.discount) : 0;
  const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    setLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
      setInWishlist(!inWishlist);
      onWishlistChange?.();
    } catch (err) {
      console.error('Failed to update wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="aspect-[4/5] bg-surface-container rounded-lg overflow-hidden mb-6 relative">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
            <ShoppingBag className="w-12 h-12 text-secondary/30" />
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discount}%
          </div>
        )}

        {user && !user.user_type?.includes('admin') && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={handleWishlistClick}
              disabled={loading}
              className={`w-10 h-10 bg-surface/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm transition-all ${
                inWishlist ? 'text-error opacity-100' : 'text-primary opacity-0 group-hover:opacity-100'
              } hover:scale-110 transition-transform disabled:opacity-50`}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCartClick}
              disabled={addingToCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-50 ${
                showCartSuccess 
                  ? 'bg-green-600 text-white' 
                  : 'bg-primary text-on-primary opacity-0 group-hover:opacity-100'
              }`}
              title="Add to cart"
            >
              {showCartSuccess ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-headline text-[10px] uppercase tracking-widest text-secondary mb-1">{product.category_name}</p>
          <h4 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{product.title}</h4>
          {product.seller_name && (
            <div className="flex items-center gap-1 text-secondary mt-1">
              <User className="w-3 h-3" />
              <span className="text-xs">{product.seller_name}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          {discount > 0 ? (
            <>
              <span className="font-sans font-medium text-green-600 font-bold">Rs. {discountedPrice.toFixed(2)}</span>
              <div>
                <span className="font-sans font-medium text-red-500 line-through text-sm">Rs. {price.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <span className="font-sans font-medium text-primary">Rs. {price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

import React, { useEffect, useState } from 'react';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="flex-grow">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
        {products.map(product => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative overflow-hidden mb-6 aspect-[4/5] bg-surface-container-low">
              <img
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700"
                src={`http://127.0.0.1:8000/static/${product.image}`}
                alt={product.title}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-surface/90 backdrop-blur px-3 py-1 text-[10px] font-label uppercase tracking-widest text-primary font-bold rounded-sm">
                  {product.discount ? 'Special Offer' : product.category}
                </span>
              </div>
              <button className="absolute bottom-4 right-4 bg-surface text-primary p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="material-symbols-outlined">shopping_cart</span>
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-headline font-bold text-xl group-hover:text-primary transition-colors">{product.title}</h4>
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-surface-variant px-2 py-1 rounded-sm">
                  <span className="text-[10px] font-label uppercase tracking-tighter">Handcrafted</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                {product.discount ? (
                  <>
                    <p className="text-2xl font-headline font-extrabold text-on-surface">${product.discount}</p>
                    <p className="text-sm font-headline font-medium text-secondary line-through">${product.price}</p>
                  </>
                ) : (
                  <p className="text-2xl font-headline font-extrabold text-on-surface">${product.price}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

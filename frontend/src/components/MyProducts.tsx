import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ShoppingBag, Package } from 'lucide-react';
import { Product, User, getMyProducts, deleteProduct } from '../api';

interface MyProductsProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const MyProducts: React.FC<MyProductsProps> = ({ user, onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-[10px] font-headline tracking-widest text-secondary uppercase">Seller Hub</span>
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mt-2">My Products</h1>
          <p className="text-secondary mt-2">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} listed`}
          </p>
        </div>
        <button
          onClick={() => onNavigate('add-product')}
          className="crimson-gradient px-6 py-3 text-white font-headline font-bold rounded-md shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-secondary py-10 text-center">Loading your products...</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-low rounded-lg">
          <Package className="w-16 h-16 text-secondary/20 mb-4" />
          <h3 className="font-headline text-xl font-bold text-on-surface mb-2">No products yet</h3>
          <p className="text-secondary text-sm mb-6">Start selling by adding your first product</p>
          <button
            onClick={() => onNavigate('add-product')}
            className="crimson-gradient px-6 py-3 text-white font-headline font-bold rounded-md cursor-pointer"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/10 text-left">
                <th className="p-4 font-headline font-bold text-secondary text-xs uppercase tracking-wider">Product</th>
                <th className="p-4 font-headline font-bold text-secondary text-xs uppercase tracking-wider">Category</th>
                <th className="p-4 font-headline font-bold text-secondary text-xs uppercase tracking-wider">Price</th>
                <th className="p-4 font-headline font-bold text-secondary text-xs uppercase tracking-wider">Stock</th>
                <th className="p-4 font-headline font-bold text-secondary text-xs uppercase tracking-wider">Date</th>
                <th className="p-4 font-headline font-bold text-secondary text-xs uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-outline-variant/5 hover:bg-surface-container transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-surface-container-high overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-secondary/30" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold">{product.title}</p>
                        <p className="text-xs text-secondary truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-secondary">{product.category}</td>
                  <td className="p-4 font-bold text-primary">${Number(product.price).toFixed(2)}</td>
                  <td className="p-4 text-secondary">{product.quantity}</td>
                  <td className="p-4 text-secondary text-xs">{new Date(product.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-secondary hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

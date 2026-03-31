import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { createProduct, getCategories, Category, User } from '../api';

interface AddProductProps {
  user: User;
  onNavigate: (page: string) => void;
  onProductCreated: () => void;
}

export const AddProduct: React.FC<AddProductProps> = ({ user, onNavigate, onProductCreated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    quantity: '1',
    discount: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!imageFile) {
      setError('Please select an image');
      return;
    }
    if (!form.category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('quantity', form.quantity);
      formData.append('image', imageFile);
      if (form.discount) formData.append('discount', form.discount);

      await createProduct(formData);
      setSuccess(true);
      setTimeout(() => onNavigate('my-products'), 1500);
    } catch (err: any) {
      const errors = err.data;
      if (typeof errors === 'object') {
        const msg = Object.entries(errors).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('. ');
        setError(msg);
      } else {
        setError('Failed to create product');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-3xl font-headline font-bold mb-2">Product Created!</h2>
          <p className="text-secondary">Redirecting to your products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-8 max-w-3xl mx-auto">
      <div className="space-y-4 mb-12">
        <span className="text-[10px] font-headline tracking-widest text-secondary uppercase">Sell on MyShop</span>
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Add Product</h1>
        <p className="text-secondary">List your product for sale on the marketplace</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div>
          <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline block mb-3">Product Image</label>
          <div
            className="border-2 border-dashed border-outline-variant/40 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => document.getElementById('image-input')?.click()}
          >
            {preview ? (
              <div className="relative w-48 h-48 mx-auto">
                <img src={preview} className="w-full h-full object-cover rounded-lg" />
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 text-secondary mx-auto" />
                <p className="text-sm text-secondary">Click to upload image</p>
                <p className="text-xs text-secondary/60">PNG, JPG up to 5MB</p>
              </div>
            )}
            <input id="image-input" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Product Title</label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
            placeholder="e.g. Hand-carved Wooden Bowl"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Description</label>
          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 px-4 py-3 transition-all outline-none resize-none"
            placeholder="Describe your product..."
          />
        </div>

        {/* Price + Category row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price}
              onChange={handleChange}
              className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Category</label>
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity + Discount row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Quantity</label>
            <input
              name="quantity"
              type="number"
              min="1"
              required
              value={form.quantity}
              onChange={handleChange}
              className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
              placeholder="1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Discount ($) — optional</label>
            <input
              name="discount"
              type="number"
              step="0.01"
              min="0"
              value={form.discount}
              onChange={handleChange}
              className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="crimson-gradient w-full py-4 text-white font-headline font-bold rounded-md shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </main>
  );
};
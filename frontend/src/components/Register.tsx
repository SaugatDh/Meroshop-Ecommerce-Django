import React, { useState } from 'react';
import { register } from '../api';
import { User } from '../api';

interface RegisterProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onLogin, onNavigate }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      onLogin(user);
      onNavigate('shop');
    } catch (err: any) {
      const errors = err.data;
      if (typeof errors === 'object') {
        const msg = Object.entries(errors).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('. ');
        setError(msg);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-md mx-auto">
      <div className="space-y-4 mb-12">
        <span className="text-[10px] font-headline tracking-widest text-secondary uppercase">Get Started</span>
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Create Account</h1>
        <p className="text-secondary">Join MyShop to buy and sell products</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
              placeholder="First"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
              placeholder="Last"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Username</label>
          <input
            type="text"
            name="username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
            placeholder="Choose a username"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
            placeholder="Minimum 6 characters"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="crimson-gradient w-full py-4 text-white font-headline font-bold rounded-md shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 mt-4"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-secondary text-sm">
        Already have an account?{' '}
        <button onClick={() => onNavigate('login')} className="text-primary font-bold hover:underline cursor-pointer">
          Sign In
        </button>
      </p>
    </main>
  );
};

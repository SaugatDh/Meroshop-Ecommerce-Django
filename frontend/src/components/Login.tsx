import React, { useState } from 'react';
import { login } from '../api';
import { User } from '../api';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      onLogin(user);
      if (user.user_type === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('shop');
      }
    } catch (err: any) {
      setError(err.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-md mx-auto">
      <div className="space-y-4 mb-12">
        <span className="text-[10px] font-headline tracking-widest text-secondary uppercase">Welcome Back</span>
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Sign In</h1>
        <p className="text-secondary">Access your MyShop account</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
            placeholder="Enter your username"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-secondary font-headline">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-0 py-3 transition-all outline-none"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="crimson-gradient w-full py-4 text-white font-headline font-bold rounded-md shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-8 text-center text-secondary text-sm">
        Don't have an account?{' '}
        <button onClick={() => onNavigate('register')} className="text-primary font-bold hover:underline cursor-pointer">
          Create Account
        </button>
      </p>
    </main>
  );
};

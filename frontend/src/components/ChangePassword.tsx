import React, { useState } from 'react';
import { User, CheckCircle2, Circle, Shield } from 'lucide-react';
import { changePassword, User as UserType } from '../api';

interface ChangePasswordProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const ChangePasswordComponent: React.FC<ChangePasswordProps> = ({ user, onNavigate, onLogout }) => {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username;
  const memberYear = user.date_joined ? new Date(user.date_joined).getFullYear() : new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await changePassword(form);
      setSuccess('Password updated successfully');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      if (err.data?.current_password) {
        setError(err.data.current_password);
      } else if (err.data?.confirm_password) {
        setError(err.data.confirm_password);
      } else if (err.data?.new_password) {
        setError(err.data.new_password);
      } else {
        setError('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  const hasMinLength = form.new_password.length >= 8;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.new_password);

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-16">
      {/* Sidebar — same as Profile */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-32 space-y-8">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center">
              <User className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg leading-none">{fullName}</h3>
              <p className="text-secondary text-sm">Member since {memberYear}</p>
            </div>
          </div>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-3 py-3 px-4 text-secondary hover:bg-surface-container-low hover:text-primary transition-all cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span>My Profile</span>
            </button>
            <button className="flex items-center space-x-3 py-3 px-4 text-secondary hover:bg-surface-container-low hover:text-primary transition-all cursor-pointer">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>history</span>
              <span>Order History</span>
            </button>
            <button className="flex items-center space-x-3 py-3 px-4 text-secondary hover:bg-surface-container-low hover:text-primary transition-all cursor-pointer">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>favorite</span>
              <span>Wishlist</span>
            </button>
            <button className="flex items-center space-x-3 py-3 px-4 text-secondary hover:bg-surface-container-low hover:text-primary transition-all cursor-pointer">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>location_on</span>
              <span>Address Book</span>
            </button>
            <button className="flex items-center space-x-3 py-3 px-4 rounded-lg bg-surface-container-low text-primary font-bold transition-all cursor-pointer">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>lock_reset</span>
              <span>Change Password</span>
            </button>
            <div className="pt-6 mt-6 border-t border-outline-variant/20"></div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 py-3 px-4 text-secondary hover:text-primary transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>logout</span>
              <span>Log Out</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-grow space-y-16">
        <div className="space-y-4">
          <span className="text-label-sm font-headline tracking-widest text-secondary uppercase">Security Settings</span>
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Update Security</h1>
          <p className="text-secondary leading-relaxed max-w-xl">Protect your account with a secure, unique password. We recommend a mix of symbols, numbers, and cases.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50/50 border-l-4 border-red-500 flex items-start space-x-3">
            <span className="text-red-500 text-sm mt-0.5">✕</span>
            <div>
              <p className="text-sm font-bold text-red-800">Error</p>
              <p className="text-xs text-red-600 opacity-80">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50/50 border-l-4 border-green-500 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm font-bold text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Password Card */}
          <div className="p-8 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
            <label className="text-label-sm text-secondary uppercase tracking-wider block mb-3">Current Password</label>
            <input
              name="current_password"
              type="password"
              placeholder="••••••••"
              value={form.current_password}
              onChange={handleChange}
              className="w-full bg-white border border-outline-variant/20 rounded px-3 py-2 text-xl font-headline font-bold outline-none focus:border-primary transition-all"
              required
            />
          </div>

          {/* Empty placeholder to fill grid */}
          <div className="p-8 bg-surface-container-high/30 rounded-lg border border-dashed border-outline-variant/20 flex items-center justify-center">
            <div className="flex items-center space-x-3 text-secondary">
              <Shield className="w-5 h-5" />
              <p className="text-sm">Your password is encrypted and secure</p>
            </div>
          </div>

          {/* New Password Card */}
          <div className="p-8 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
            <label className="text-label-sm text-secondary uppercase tracking-wider block mb-3">New Password</label>
            <input
              name="new_password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.new_password}
              onChange={handleChange}
              className="w-full bg-white border border-outline-variant/20 rounded px-3 py-2 text-xl font-headline font-bold outline-none focus:border-primary transition-all"
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password Card */}
          <div className="p-8 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
            <label className="text-label-sm text-secondary uppercase tracking-wider block mb-3">Confirm New Password</label>
            <input
              name="confirm_password"
              type="password"
              placeholder="Repeat new password"
              value={form.confirm_password}
              onChange={handleChange}
              className="w-full bg-white border border-outline-variant/20 rounded px-3 py-2 text-xl font-headline font-bold outline-none focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        {/* Requirements & Submit */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-secondary">
              {hasMinLength ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Circle className="w-3.5 h-3.5 opacity-20" />
              )}
              <span>Minimum 8 characters</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-secondary">
              {hasSpecial ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Circle className="w-3.5 h-3.5 opacity-20" />
              )}
              <span>Includes a special character (@, #, $)</span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="crimson-gradient px-8 py-4 text-white font-headline font-bold rounded-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Updating...' : 'Update Password'}</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="p-8 rounded-lg bg-surface-container-high/50 border border-outline-variant/5">
          <div className="flex items-start space-x-4">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-headline font-bold text-sm mb-1">Account Security Note</h4>
              <p className="text-xs text-secondary leading-relaxed">
                After updating your password, you will remain logged in on this device. All other active sessions on other browsers or devices will be automatically signed out for your protection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

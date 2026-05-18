import React, { useState } from 'react';
import { api } from '../services/api';
import type { AuthResponse } from '../types';

interface LoginProps {
  onLoginSuccess: (token: string, role: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Direct type-safe POST request using our AuthResponse interface
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role);
        onLoginSuccess(response.token, response.user.role);
      }
    } catch (err: unknown) {
      // Explicit type-narrowing to satisfy strict ESLint rules
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid email credentials or connection timeout.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">GigFlow</h1>
          <p className="text-slate-400 text-sm mt-1">Lead Management Portal</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400 text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="aaryan@gigflow.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 py-3 font-semibold text-slate-950 transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.99]"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLogin: (success: boolean) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@neu.edu.ph' && password === 'adminlogin02') {
      onLogin(true);
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-20"
    >
      <div className="bento-card p-10 space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-neu-navy rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-neu-navy/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Vault Access</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Administrative Verification Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@neu.edu.ph"
                className="w-full h-14 pl-12 pr-6 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-neu-navy outline-none font-bold text-slate-800 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access Keyword</label>
            <div className="relative">
              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-6 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-neu-navy outline-none font-bold text-slate-800 transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            className="w-full py-5 bg-neu-navy text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-neu-navy/10 hover:shadow-2xl transition-all active:scale-95"
          >
            Authorize Access
          </button>
        </form>
      </div>
      
      <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-8">
        Secure Tunnel Encrypted • NEU IT Infrastructure
      </p>
    </motion.div>
  );
}

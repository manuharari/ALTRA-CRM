
import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, Settings, Save, X } from 'lucide-react';
import { login } from '../services/authService';
import { User as UserType } from '../types';
import { supabase } from '../src/supabaseClient';

interface LoginViewProps {
  onLogin: (user: UserType) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Manual Config State
  const [manualUrl, setManualUrl] = useState('');
  const [manualKey, setManualKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Attempt Login (Async now)
    const user = await login(identifier, password);
    setLoading(false);

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSaveConfig = () => {
    if (!manualUrl || !manualKey) {
      alert("Please enter both URL and Key");
      return;
    }
    localStorage.setItem('supabase_config', JSON.stringify({ url: manualUrl, key: manualKey }));
    window.location.reload();
  };

  const handleClearConfig = () => {
    localStorage.removeItem('supabase_config');
    window.location.reload();
  };

  const isOnline = !!supabase;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/50 mb-4">
             <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Altra CRM</h1>
          <p className={`mt-2 font-medium ${isOnline ? 'text-green-400' : 'text-slate-400'}`}>
            {isOnline ? '• Cloud Active' : '• Local Offline Mode'}
          </p>
        </div>

        {!showConfig ? (
          <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 space-y-6 relative">
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Username or Email</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-600"
                  placeholder="mharari"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-4 border-t border-slate-800 flex justify-center">
                <button 
                  type="button" 
                  onClick={() => setShowConfig(true)}
                  className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                    <Settings size={12} /> Connection Settings
                </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold flex items-center gap-2"><Settings size={18} /> Cloud Setup</h3>
                <button onClick={() => setShowConfig(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            
            <p className="text-xs text-slate-400">
                Enter your Supabase credentials to enable cloud synchronization. 
                Leave empty to run in Local Mode.
            </p>

            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs text-slate-500">Project URL</label>
                    <input 
                        value={manualUrl} 
                        onChange={e => setManualUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        placeholder="https://xyz.supabase.co"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-500">Anon / Public Key</label>
                    <input 
                        value={manualKey} 
                        onChange={e => setManualKey(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        placeholder="eyJh..."
                    />
                </div>
            </div>

            <div className="flex gap-2">
                {isOnline && (
                    <button 
                        onClick={handleClearConfig}
                        className="flex-1 bg-red-900/30 text-red-400 border border-red-900/50 py-2 rounded-lg text-sm font-medium hover:bg-red-900/50"
                    >
                        Disconnect
                    </button>
                )}
                <button 
                    onClick={handleSaveConfig}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                    <Save size={16} /> Save & Reload
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginView;
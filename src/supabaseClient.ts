
import { createClient } from '@supabase/supabase-js';

// 1. Try Environment Variables (Vite/Netlify)
const envUrl = process.env.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL;
const envKey = process.env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// 2. Try Local Storage (Manual Config)
const localConfig = localStorage.getItem('supabase_config');
let localUrl = '';
let localKey = '';

if (localConfig) {
  try {
    const parsed = JSON.parse(localConfig);
    localUrl = parsed.url;
    localKey = parsed.key;
  } catch (e) {
    console.error('Invalid local config');
  }
}

// 3. Initialize
const finalUrl = envUrl || localUrl;
const finalKey = envKey || localKey;

let supabase: any = null;

if (finalUrl && finalKey && finalUrl.startsWith('http')) {
  try {
    supabase = createClient(finalUrl, finalKey);
    console.log('✅ Supabase Client Initialized');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error);
  }
} else {
  console.log('ℹ️ No Supabase credentials found. App running in Local Mode.');
}

export { supabase };
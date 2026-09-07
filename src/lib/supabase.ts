/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const getSupabaseConfig = () => {
  let url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  let key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem('vkl_supabase_url');
    const storedKey = localStorage.getItem('vkl_supabase_key');
    if (storedUrl) url = storedUrl.trim();
    if (storedKey) key = storedKey.trim();
  }
  return { url, key };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(
    url && 
    key && 
    url.startsWith('https://') && 
    url.includes('.supabase.co') &&
    key.length > 20
  );
};

const { url: configUrl, key: configKey } = getSupabaseConfig();

// Create the Supabase client
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(configUrl, configKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key-12345678901234567890', {
      auth: {
        persistSession: false,
      },
    });

export const SUPABASE_URL = configUrl;
export const SUPABASE_KEY = configKey;


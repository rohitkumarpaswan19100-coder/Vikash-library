import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  KeyRound,
  ShieldCheck, 
  Sparkles,
  Terminal,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSupabaseConfig, isSupabaseConfigured } from '../../lib/supabase';

interface AdminSqlSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSqlSetupModal: React.FC<AdminSqlSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isSupabaseActive } = useAuth();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [projectUrl, setProjectUrl] = useState<string>('');
  const [anonKey, setAnonKey] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setProjectUrl(config.url || 'https://mycfhsqpcrpnnexozgjn.supabase.co');
      setAnonKey(config.key || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('vkl_supabase_url', projectUrl.trim());
      localStorage.setItem('vkl_supabase_key', anonKey.trim());
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        window.location.reload();
      }, 1000);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(projectUrl.trim(), anonKey.trim());
      
      // Test 1: Query profiles
      const { data, error } = await client.from('profiles').select('count', { count: 'exact', head: true });
      if (error) {
        setTestResult({ success: false, message: `Query Error: ${error.message}. Please run the SQL script below in Supabase SQL Editor.` });
      } else {
        setTestResult({ success: true, message: 'Connected successfully to Supabase! Profiles table is accessible.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: `Connection failed: ${err.message || err}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncLocalData = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(projectUrl.trim(), anonKey.trim());
      const localProfiles = JSON.parse(localStorage.getItem('vkl_profiles') || '[]');

      if (localProfiles.length === 0) {
        setTestResult({ success: false, message: 'No local profiles found to sync.' });
        setIsTesting(false);
        return;
      }

      let count = 0;
      for (const p of localProfiles) {
        const { error } = await client.from('profiles').upsert([
          {
            username: p.username,
            full_name: p.full_name,
            gender: p.gender || 'Male',
            age: p.age || 20,
            mobile_number: p.mobile_number,
            email: p.email,
            role: p.role || 'user',
          }
        ], { onConflict: 'email' });
        if (!error) count++;
      }

      setTestResult({
        success: true,
        message: `Successfully synced ${count} profile(s) to Supabase! Refresh your Supabase Table Editor now.`
      });
    } catch (err: any) {
      setTestResult({ success: false, message: `Sync failed: ${err.message || err}` });
    } finally {
      setIsTesting(false);
    }
  };

  const sqlCode = `-- =========================================================
-- VIKASH LIBRARY - SUPABASE DATABASE SCHEMA & FIX SCRIPT
-- Location: Amba, Nabinagar Road, Bihar
-- Total Seats: 130 (Ground: 1-52, First: 53-130)
-- =========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Independent & Auth-compatible)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT,
    age INTEGER,
    mobile_number TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fix foreign key constraint if profiles table was previously bound strictly to auth.users
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. SEATS TABLE (130 Seats)
CREATE TABLE IF NOT EXISTS public.seats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seat_number INTEGER UNIQUE NOT NULL CHECK (seat_number >= 1 AND seat_number <= 130),
    floor TEXT CHECK (floor IN ('ground', 'first')) NOT NULL,
    section TEXT DEFAULT 'Main Study Hall',
    status TEXT CHECK (status IN ('available', 'booked', 'pending', 'blocked')) DEFAULT 'available',
    current_booking_id TEXT,
    current_user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id TEXT UNIQUE NOT NULL,
    user_id UUID,
    user_name TEXT,
    user_mobile TEXT,
    user_email TEXT,
    seat_id UUID,
    seat_number INTEGER NOT NULL,
    floor TEXT CHECK (floor IN ('ground', 'first')) NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    slot_type TEXT DEFAULT 'Monthly (Full Day Access)',
    amount NUMERIC(10, 2) DEFAULT 800.00 NOT NULL,
    payment_method TEXT DEFAULT 'cash' NOT NULL,
    payment_status TEXT DEFAULT 'cash_pending' NOT NULL,
    booking_status TEXT DEFAULT 'pending' NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Reset and recreate clean policies
DROP POLICY IF EXISTS "Public can view seats" ON public.seats;
DROP POLICY IF EXISTS "Admin can update seats" ON public.seats;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users and Admins can update bookings" ON public.bookings;

CREATE POLICY "Public can view seats" ON public.seats FOR SELECT USING (true);
CREATE POLICY "Admin can update seats" ON public.seats FOR ALL USING (true);

CREATE POLICY "Users can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Users can view bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Users can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users and Admins can update bookings" ON public.bookings FOR ALL USING (true);

-- RLS Policies
create policy "Public can view seats" on public.seats for select using (true);
create policy "Admin can update seats" on public.seats for update using (true);

create policy "Users can view profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view bookings" on public.bookings for select using (true);
create policy "Users can insert bookings" on public.bookings for insert with check (true);
create policy "Users and Admins can update bookings" on public.bookings for update using (true);

-- Populate 130 Seats
do $$
begin
    if not exists (select 1 from public.seats limit 1) then
        for i in 1..52 loop
            insert into public.seats (seat_number, floor, section, status)
            values (i, 'ground', 'Ground Floor (Quiet Zone)', 'available');
        end loop;
        for i in 53..130 loop
            insert into public.seats (seat_number, floor, section, status)
            values (i, 'first', 'First Floor (Silent Study Zone)', 'available');
        end loop;
    end if;
end $$;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Supabase SQL Database Setup
              </h3>
              <p className="text-xs text-slate-400">
                PostgreSQL Schema & Seed Script (130 Seats, RLS Policies & Roles)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Status banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            isSupabaseActive
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-indigo-950/60 border-indigo-800 text-indigo-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-bold">
                {isSupabaseActive
                  ? 'Supabase Cloud Database Connected & Active'
                  : 'Running with Local Storage Engine (Enter Supabase Keys below to connect)'}
              </span>
            </div>
            {isSupabaseActive && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-md">
                LIVE SYNC
              </span>
            )}
          </div>

          {/* Quick Connect API Form */}
          <form onSubmit={handleSaveCredentials} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Supabase API Connection Keys</span>
              </div>
              {saveSuccess && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved & Reloading...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Project URL</label>
                <input
                  type="url"
                  placeholder="https://mycfhsqpcrpnnexozgjn.supabase.co"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px] placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Anon / Public API Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px] placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            {testResult && (
              <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                testResult.success ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-400">
                Tip: Get these from <span className="text-cyan-300 font-mono">Supabase ➔ Project Settings ➔ API</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !anonKey}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  type="button"
                  onClick={handleSyncLocalData}
                  disabled={isTesting || !anonKey}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sync Profiles to Supabase</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Connect</span>
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-1.5 text-slate-300">
            <p className="font-bold text-white">How to connect your live Supabase project:</p>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-400">
              <li>Create a free project at <span className="text-amber-300 font-mono">supabase.com</span></li>
              <li>Go to <strong className="text-white">SQL Editor</strong> and paste the schema below</li>
              <li>Click <strong className="text-white">Run</strong> to generate all 130 seats and tables</li>
              <li>Set <code className="text-amber-300 font-mono">VITE_SUPABASE_URL</code> and <code className="text-amber-300 font-mono">VITE_SUPABASE_ANON_KEY</code></li>
            </ol>
          </div>

          {/* SQL Block */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                schema.sql (130 Seats, RLS & Triggers)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
              {sqlCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

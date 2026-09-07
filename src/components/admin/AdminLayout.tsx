import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Banknote, 
  Armchair, 
  CalendarCheck, 
  Users, 
  Settings, 
  FileText, 
  HelpCircle, 
  BarChart3, 
  Database, 
  LogOut, 
  Home, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight,
  Sparkles,
  Search,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onExitAdmin: () => void;
  onOpenSqlModal: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onExitAdmin,
  onOpenSqlModal,
  children,
}) => {
  const { user, logout } = useAuth();
  const { stats, allBookings, settings } = useBooking();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const pendingCashCount = allBookings.filter((b) => b.payment_status === 'cash_pending').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { 
      id: 'cash-payments', 
      label: 'Cash Payment Desk', 
      icon: Banknote,
      badge: pendingCashCount > 0 ? pendingCashCount : undefined,
      badgeColor: 'bg-amber-400 text-slate-950 font-bold',
    },
    { id: 'seats', label: 'Seat Management (130)', icon: Armchair },
    { id: 'bookings', label: 'All Bookings', icon: CalendarCheck },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'settings', label: 'Library & Fees Config', icon: Settings },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'faqs', label: 'FAQ Management', icon: HelpCircle },
    { id: 'reports', label: 'Reports & Revenue', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 flex flex-col md:flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#070714] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span className="font-black text-sm text-white font-sans">
            {settings.library_name} Admin
          </span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#050510] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-mono font-black text-xs text-white tracking-widest uppercase">
                  ADMIN TELEMETRY
                </h2>
                <p className="text-[11px] text-cyan-400 font-semibold">{settings.library_name}</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 font-mono">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span className="font-sans font-medium text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & SQL Script helper */}
        <div className="p-4 border-t border-white/10 space-y-2 font-mono">
          <button
            onClick={onOpenSqlModal}
            className="w-full bg-cyan-950/40 hover:bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Supabase SQL & Setup</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate">{user?.full_name || 'Admin'}</span>
            <button
              onClick={() => logout()}
              className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View Area */}
      <main className="flex-1 min-w-0 bg-[#020205] overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};


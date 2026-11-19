import { ShieldCheck, Menu, X, LogOut, Bell, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/store';
import { useState } from 'react';
import type { Role } from '@/lib/types';

export type PageId =
  | 'dashboard'
  | 'report'
  | 'analysis'
  | 'incidents'
  | 'risk'
  | 'rootcause'
  | 'capa'
  | 'analytics'
  | 'alerts';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  roles: Role[];
}

import {
  LayoutDashboard,
  FilePlus,
  Brain,
  ClipboardList,
  TrendingUp,
  GitBranch,
  CheckSquare,
  BarChart3,
  Siren,
} from 'lucide-react';

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'safety_officer', 'manager'] },
  { id: 'report', label: 'Report Incident', icon: FilePlus, roles: ['employee', 'safety_officer', 'manager'] },
  { id: 'analysis', label: 'AI Analysis', icon: Brain, roles: ['safety_officer', 'manager'] },
  { id: 'incidents', label: 'Incident Management', icon: ClipboardList, roles: ['safety_officer', 'manager'] },
  { id: 'risk', label: 'Risk Prediction', icon: TrendingUp, roles: ['safety_officer', 'manager'] },
  { id: 'rootcause', label: 'Root Cause Analysis', icon: GitBranch, roles: ['safety_officer', 'manager'] },
  { id: 'capa', label: 'CAPA Tracking', icon: CheckSquare, roles: ['safety_officer'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['manager', 'safety_officer'] },
  { id: 'alerts', label: 'Alerts', icon: Siren, roles: ['safety_officer', 'manager'] },
];

const ROLE_LABELS: Record<Role, string> = {
  employee: 'Employee',
  safety_officer: 'Safety Officer',
  manager: 'Manager',
};

const ROLE_COLORS: Record<Role, string> = {
  employee: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  safety_officer: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  manager: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
};

interface LayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const { role, userName, logout, alerts } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = NAV_ITEMS.filter((item) => role && item.roles.includes(role));
  const unackAlerts = alerts.filter((a) => !a.acknowledged).length;

  const currentLabel = NAV_ITEMS.find((i) => i.id === currentPage)?.label ?? 'Dashboard';

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-950 border-r border-slate-800/60">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800/60">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/20">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-lg leading-none">SafeSense</div>
          <div className="text-sky-400 text-xs font-medium tracking-wider">AI SAFETY INTELLIGENCE</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-sky-500/15 text-sky-400 border-l-2 border-sky-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'alerts' && unackAlerts > 0 && (
                <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {unackAlerts}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/60 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/60 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-white text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{userName}</div>
            <div className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold ${ROLE_COLORS[role]}`}>
              {ROLE_LABELS[role]}
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <div className="hidden lg:flex w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebar}
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 animate-slide-in-left">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 hidden sm:inline">SafeSense AI</span>
              <ChevronRight className="h-4 w-4 text-slate-600 hidden sm:inline" />
              <span className="text-white font-semibold">{currentLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('alerts')}
              className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unackAlerts > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center px-1 rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {unackAlerts}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-200 hidden sm:inline">{userName}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

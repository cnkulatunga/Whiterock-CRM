'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';

const NAV_BY_ROLE = {
  super_admin: [
    { id: 'dashboard',       label: 'Dashboard',     icon: 'fa-gauge-high',    href: '/super-admin' },
    { id: 'users',           label: 'Users',         icon: 'fa-users',         href: '/super-admin/user-management' },
    { id: 'leads',           label: 'Leads',         icon: 'fa-magnifying-glass', href: '/leads' },
    { id: 'loan-pipeline',   label: 'Pipeline',      icon: 'fa-diagram-project', href: '/loan-pipeline' },
    { id: 'lenders',         label: 'Lenders',       icon: 'fa-building-columns', href: '/lenders' },
    { id: 'documents',       label: 'Docs',          icon: 'fa-folder-open',   href: '/documents' },
    { id: 'tasks',           label: 'Tasks',         icon: 'fa-list-check',    href: '/tasks' },
    { id: 'reports',         label: 'Reports',       icon: 'fa-chart-bar',     href: '/reports' },
  ],
  tele_agent: [
    { id: 'dashboard',       label: 'Dashboard',     icon: 'fa-gauge-high',    href: '/tele-agent' },
    { id: 'leads',           label: 'Leads',         icon: 'fa-magnifying-glass', href: '/leads' },
    { id: 'tasks',           label: 'Tasks',         icon: 'fa-list-check',    href: '/tasks' },
    { id: 'loan-pipeline',   label: 'Pipeline',      icon: 'fa-diagram-project', href: '/loan-pipeline' },
  ],
  accounts_manager: [
    { id: 'dashboard',       label: 'Dashboard',     icon: 'fa-gauge-high',    href: '/accounts-manager' },
    { id: 'leads',           label: 'Leads',         icon: 'fa-magnifying-glass', href: '/leads' },
    { id: 'loan-pipeline',   label: 'Pipeline',      icon: 'fa-diagram-project', href: '/loan-pipeline' },
    { id: 'lenders',         label: 'Lenders',       icon: 'fa-building-columns', href: '/lenders' },
    { id: 'documents',       label: 'Docs',          icon: 'fa-folder-open',   href: '/documents' },
  ],
  team_lead: [
    { id: 'dashboard',       label: 'Dashboard',     icon: 'fa-gauge-high',    href: '/team-lead' },
    { id: 'leads',           label: 'Leads',         icon: 'fa-magnifying-glass', href: '/leads' },
    { id: 'tasks',           label: 'Tasks',         icon: 'fa-list-check',    href: '/tasks' },
    { id: 'reports',         label: 'Reports',       icon: 'fa-chart-bar',     href: '/reports' },
  ],
};

export default function Sidebar() {
  const pathname  = usePathname();
  const { user, logout } = useAuthStore();
  const navItems  = NAV_BY_ROLE[user?.role] || [];

  return (
    <aside className="w-[70px] bg-navy h-screen flex flex-col items-center py-3 gap-1 border-r border-navy-800 flex-shrink-0 overflow-hidden z-10">

      {/* Logo */}
      <div className="mb-2 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
        <img src="/images/alpha.png" alt="Alpha" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display='none'; }} />
        <i className="fas fa-layer-group text-white text-sm hidden" />
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-navy-800 mb-1" />

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1 w-full items-center px-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-1 p-1.5 rounded-[8px] w-[54px] transition-all duration-200 no-underline',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-muted hover:bg-white/8 hover:text-white'
              )}
            >
              <i className={`fas ${item.icon} text-[14px]`} />
              <span className="text-[7px] font-bold uppercase tracking-[.05em] leading-tight text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-navy-800 my-1" />

      {/* User avatar + logout */}
      <div className="flex flex-col items-center gap-2 pb-1">
        <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-[9px] font-black uppercase">
          {user?.first_name?.[0]}{user?.last_name?.[0]}
        </div>
        <button
          onClick={logout}
          title="Sign out"
          className="w-[54px] flex flex-col items-center gap-1 p-1.5 rounded-[8px] text-muted hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <i className="fas fa-arrow-right-from-bracket text-[14px]" />
          <span className="text-[7px] font-bold uppercase tracking-[.05em]">Logout</span>
        </button>
      </div>
    </aside>
  );
}

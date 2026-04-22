'use client';
import { useAuthStore } from '@/lib/store/authStore';

const ROLE_LABELS = {
  super_admin:      'Super Administrator',
  tele_agent:       'Tele Agent',
  accounts_manager: 'Accounts Manager',
  team_lead:        'Team Lead',
};

const ROLE_COLORS = {
  super_admin:      { bg: '#fef3c7', text: '#d97706' },
  tele_agent:       { bg: '#dbeafe', text: '#2447d7' },
  accounts_manager: { bg: '#dcfce7', text: '#15803d' },
  team_lead:        { bg: '#f3e8ff', text: '#7c3aed' },
};

export default function Header({ title, subtitle }) {
  const { user } = useAuthStore();
  const roleColor = ROLE_COLORS[user?.role] || { bg: '#f1f5f9', text: '#64748b' };

  return (
    <header className="h-[52px] bg-white border-b border-surface-border flex items-center justify-between px-5 flex-shrink-0">
      <div>
        <h1 className="text-[13px] font-black text-navy leading-tight">{title}</h1>
        {subtitle && <p className="text-[9px] text-muted font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-xl bg-surface hover:bg-surface-border flex items-center justify-center transition-colors">
          <i className="fas fa-bell text-[11px] text-subtle" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Role badge */}
        <span
          className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider"
          style={{ background: roleColor.bg, color: roleColor.text }}
        >
          {ROLE_LABELS[user?.role] || user?.role}
        </span>

        {/* User chip */}
        <div className="flex items-center gap-2 bg-surface rounded-xl px-2 py-1">
          <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-[8px] font-black">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-navy leading-tight">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-[8px] text-muted">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

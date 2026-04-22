'use client';
import Header from '@/components/layout/Header';
import { StatCard, PanelCard, PanelHeader } from '@/components/ui/Card';
import { useAuthStore } from '@/lib/store/authStore';

export default function AccountsManagerDashboard() {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title={`Welcome, ${user?.first_name}`} subtitle="Accounts Manager Dashboard" />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-4 gap-4 p-5 pb-0">
          {[
            { label: 'Active Pipelines', icon: 'fa-diagram-project', color: '#2447d7', value: '—' },
            { label: 'Submitted',        icon: 'fa-paper-plane',     color: '#10b981', value: '—' },
            { label: 'Approved',         icon: 'fa-check-circle',    color: '#6366f1', value: '—' },
            { label: 'Settled (MTD)',    icon: 'fa-coins',           color: '#f59e0b', value: '—' },
          ].map((s) => <StatCard key={s.label} {...s} hover />)}
        </div>
        <div className="p-5">
          <PanelCard>
            <PanelHeader title="Loan Pipeline" icon="fa-diagram-project" subtitle="All active loan files" />
            <div className="p-8 text-center text-muted text-[10px]">Pipeline data loads from API</div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}

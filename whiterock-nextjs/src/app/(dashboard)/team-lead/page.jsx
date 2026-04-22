'use client';
import Header from '@/components/layout/Header';
import { StatCard, PanelCard, PanelHeader } from '@/components/ui/Card';
import { useAuthStore } from '@/lib/store/authStore';

export default function TeamLeadDashboard() {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title={`Welcome, ${user?.first_name}`} subtitle="Team Lead Dashboard" />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-4 gap-4 p-5 pb-0">
          {[
            { label: 'Team Leads',     icon: 'fa-magnifying-glass', color: '#2447d7', value: '—' },
            { label: 'Active Today',   icon: 'fa-fire',             color: '#ef4444', value: '—' },
            { label: 'Pending Tasks',  icon: 'fa-list-check',       color: '#f59e0b', value: '—' },
            { label: 'Conversion %',   icon: 'fa-chart-line',       color: '#10b981', value: '—' },
          ].map((s) => <StatCard key={s.label} {...s} hover />)}
        </div>
        <div className="p-5">
          <PanelCard>
            <PanelHeader title="Team Performance" icon="fa-chart-bar" subtitle="This month's stats" />
            <div className="p-8 text-center text-muted text-[10px]">Team data loads from API</div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}

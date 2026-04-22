'use client';
import Header from '@/components/layout/Header';
import { StatCard, PanelCard, PanelHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import { useAuthStore } from '@/lib/store/authStore';

const STATS = [
  { label: 'My Leads',        key: 'my_leads',       icon: 'fa-magnifying-glass', color: '#2447d7' },
  { label: 'Called Today',    key: 'called_today',   icon: 'fa-phone',            color: '#10b981' },
  { label: 'Pending Tasks',   key: 'pending_tasks',  icon: 'fa-list-check',       color: '#f59e0b' },
  { label: 'Settled This Mo.',key: 'settled_month',  icon: 'fa-check-circle',     color: '#6366f1' },
];

export default function TeleAgentDashboard() {
  const { user } = useAuthStore();
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['dashboard', 'tele-stats'],
    queryFn: dashboardApi.getTeleStats,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title={`Welcome, ${user?.first_name}`} subtitle="Tele Agent Dashboard" />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-4 gap-4 p-5 pb-0">
          {STATS.map((s) => (
            <StatCard key={s.key} label={s.label} value={isLoading ? '—' : (stats[s.key] ?? '0')} icon={s.icon} color={s.color} hover />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          {/* Today's call list */}
          <PanelCard>
            <PanelHeader title="Today's Call List" icon="fa-phone" subtitle="Leads to contact" />
            <div className="p-4 text-[10px] text-muted text-center py-12">
              <i className="fas fa-phone text-2xl text-surface-border mb-3 block" />
              Call list will load from API
            </div>
          </PanelCard>

          {/* My tasks */}
          <PanelCard>
            <PanelHeader title="My Tasks" icon="fa-list-check" subtitle="Follow-ups due today" />
            <div className="p-4 text-[10px] text-muted text-center py-12">
              <i className="fas fa-list-check text-2xl text-surface-border mb-3 block" />
              Tasks will load from API
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}

'use client';
import Header from '@/components/layout/Header';
import { PanelCard, PanelHeader, StatCard } from '@/components/ui/Card';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports';

export default function ReportsPage() {
  const { data = {}, isLoading } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: reportsApi.getSummary,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Reporting & Logs" subtitle="Performance analytics and audit trail" />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total Applications', key: 'total_applications', icon: 'fa-file', color: '#2447d7' },
            { label: 'Approval Rate',      key: 'approval_rate',      icon: 'fa-check-circle', color: '#10b981' },
            { label: 'Avg Loan Size',      key: 'avg_loan_size',      icon: 'fa-coins', color: '#f59e0b' },
            { label: 'Total Settled ($)',  key: 'total_settled',      icon: 'fa-chart-line', color: '#6366f1' },
          ].map((s) => (
            <StatCard key={s.key} label={s.label} value={isLoading ? '—' : (data[s.key] ?? '0')} icon={s.icon} color={s.color} hover />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PanelCard>
            <PanelHeader title="Application Logs" icon="fa-list" subtitle="Recent submissions" />
            <div className="p-6 text-center text-muted text-[10px]">
              <i className="fas fa-chart-bar text-3xl text-surface-border mb-3 block" />
              Charts will render from API data
            </div>
          </PanelCard>
          <PanelCard>
            <PanelHeader title="Team Performance" icon="fa-users" subtitle="Per-agent stats" />
            <div className="p-6 text-center text-muted text-[10px]">
              <i className="fas fa-chart-pie text-3xl text-surface-border mb-3 block" />
              Agent breakdown from API
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}

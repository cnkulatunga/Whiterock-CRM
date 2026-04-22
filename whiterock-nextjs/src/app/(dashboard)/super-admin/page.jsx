'use client';
import Header from '@/components/layout/Header';
import { StatCard, PanelCard, PanelHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';

const STATS = [
  { label: 'Total Leads',       key: 'total_leads',      icon: 'fa-magnifying-glass', color: '#2447d7', delta: 12 },
  { label: 'Active Pipelines',  key: 'active_pipelines', icon: 'fa-diagram-project',  color: '#10b981', delta: 8  },
  { label: 'Settled This Month',key: 'settled_month',    icon: 'fa-check-circle',     color: '#6366f1', delta: -3 },
  { label: 'Team Members',      key: 'team_members',     icon: 'fa-users',            color: '#f59e0b', delta: 2  },
];

const ACTIVITY_COLORS = {
  lead_created:  '#2447d7',
  status_change: '#10b981',
  doc_uploaded:  '#f59e0b',
  note_added:    '#6366f1',
  task_done:     '#ec4899',
};

export default function SuperAdminDashboard() {
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });

  const { data: activity = [], isLoading: actLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardApi.getActivity,
  });

  const { data: recentLeads = [] } = useQuery({
    queryKey: ['dashboard', 'recent-leads'],
    queryFn: dashboardApi.getRecentLeads,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Command Center" subtitle="Super Admin Overview" />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* ── Stats strip ── */}
        <div className="grid grid-cols-4 gap-4 p-5 pb-0">
          {STATS.map((s) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={statsLoading ? '—' : (stats[s.key] ?? '0')}
              delta={s.delta}
              icon={s.icon}
              color={s.color}
              hover
            />
          ))}
        </div>

        {/* ── Module grid ── */}
        <div className="grid grid-cols-3 gap-4 p-5">

          {/* Recent leads */}
          <div className="col-span-2">
            <PanelCard className="h-full">
              <PanelHeader
                title="Recent Leads"
                subtitle="Latest pipeline entries"
                icon="fa-magnifying-glass"
                actions={
                  <a href="/leads" className="text-[9px] font-black text-brand uppercase tracking-wider hover:underline">
                    View all <i className="fas fa-arrow-right" />
                  </a>
                }
              />
              <div className="overflow-y-auto custom-scrollbar">
                {recentLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted">
                    <i className="fas fa-inbox text-3xl mb-3 text-surface-border" />
                    <p className="text-[10px] font-semibold">No leads yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-border bg-surface">
                        {['Name','Product','Stage','Loan Amt','Assigned','Status'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[8px] font-black text-subtle uppercase tracking-[.08em]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((lead, i) => (
                        <tr key={lead.id || i} className="border-b border-surface-border last:border-0 hover:bg-surface transition-colors">
                          <td className="px-4 py-2.5 text-[10px] font-bold text-navy">{lead.full_name}</td>
                          <td className="px-4 py-2.5 text-[10px] text-subtle">{lead.product_type}</td>
                          <td className="px-4 py-2.5">
                            <Badge variant={lead.stage === 'settled' ? 'green' : lead.stage === 'declined' ? 'red' : 'blue'}>
                              {lead.stage}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-[10px] font-bold text-navy">
                            ${Number(lead.loan_amount || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-2.5 text-[10px] text-subtle">{lead.assigned_to_name || '—'}</td>
                          <td className="px-4 py-2.5">
                            <Badge variant={lead.status === 'active' ? 'green' : 'gray'}>{lead.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </PanelCard>
          </div>

          {/* Activity feed */}
          <div>
            <PanelCard className="h-full">
              <PanelHeader title="Live Activity" subtitle="Team actions" icon="fa-bolt" />
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {actLoading ? (
                  <div className="flex justify-center pt-8">
                    <span className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : activity.length === 0 ? (
                  <p className="text-[10px] text-muted text-center pt-8">No recent activity</p>
                ) : (
                  <div className="flex flex-col gap-0">
                    {activity.map((item, i) => (
                      <div key={i} className="relative pl-6 pb-5 last:pb-0">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-surface-border" />
                        <div
                          className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ background: ACTIVITY_COLORS[item.type] || '#2447d7' }}
                        />
                        <p className="text-[10px] font-semibold text-navy">{item.description}</p>
                        <p className="text-[8px] text-muted font-medium mt-0.5">{item.actor} · {item.time_ago}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PanelCard>
          </div>

          {/* Quick actions */}
          <div className="col-span-3">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'New Lead',     icon: 'fa-plus',               href: '/leads',            color: '#2447d7' },
                { label: 'Add User',     icon: 'fa-user-plus',          href: '/super-admin/user-management', color: '#10b981' },
                { label: 'New Lender',   icon: 'fa-building-columns',   href: '/lenders',          color: '#6366f1' },
                { label: 'View Reports', icon: 'fa-chart-bar',          href: '/reports',          color: '#f59e0b' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-4 bg-white border border-surface-border rounded-[16px] hover:-translate-y-0.5 hover:shadow-card transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0"
                    style={{ background: action.color }}
                  >
                    <i className={`fas ${action.icon}`} />
                  </div>
                  <span className="text-[11px] font-black text-navy group-hover:text-brand transition-colors">{action.label}</span>
                  <i className="fas fa-chevron-right text-[9px] text-surface-border ml-auto group-hover:text-brand transition-colors" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

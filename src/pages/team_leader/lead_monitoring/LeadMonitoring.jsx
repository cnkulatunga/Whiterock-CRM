import React, { useState, useMemo } from 'react';
import { WORKFLOW_STAGES_LIST, SHARED_INITIAL_USERS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

/* ─── CONSTANTS ─── */
const STAGES = WORKFLOW_STAGES_LIST.filter(s => s !== 'All Stages');
const PAGE_SIZE = 5;

const STAGE_META = {
  'Document Collection':        { color: '#2447d7', bg: '#eef2ff', icon: '📄' },
  'Document Verification Done': { color: '#f59e0b', bg: '#fffbeb', icon: '✓' },
  'Lender Selection':           { color: '#8b5cf6', bg: '#f5f3ff', icon: '🏦' },
  'Final Review':               { color: '#06b6d4', bg: '#ecfeff', icon: '🔍' },
  'Completed':                  { color: '#10b981', bg: '#ecfdf5', icon: '✓' },
  'Rejected':                   { color: '#ef4444', bg: '#fef2f2', icon: '✕' },
};

const AGENT_COLORS = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899','#0ea5e9'];
const agentColorMap = {};
SHARED_INITIAL_USERS.forEach((u, i) => { agentColorMap[u.name] = AGENT_COLORS[i % AGENT_COLORS.length]; });

/* ─── SUB-COMPONENTS ─── */
const StatCard = ({ label, value, sub, subColor, icon, iconBg }) => (
  <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 flex flex-col gap-3 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest">{label}</span>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
        {icon}
      </div>
    </div>
    <div className="text-[2rem] font-extrabold text-[#1a202c] leading-none tracking-tight">{value}</div>
    {sub && (
      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: subColor || '#94a3b8' }}>
        {sub}
      </span>
    )}
  </div>
);

const StageBadge = ({ stage }) => {
  const meta = STAGE_META[stage] || { color: '#64748b', bg: '#f1f5f9' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ color: meta.color, background: meta.bg }}
    >
      <span className="text-[10px]">{meta.icon}</span>
      {stage}
    </span>
  );
};

const ProgressBar = ({ stage, progress }) => {
  const meta = STAGE_META[stage] || { color: '#94a3b8' };
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <span className="text-xs font-bold" style={{ color: meta.color }}>{progress}%</span>
      <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: meta.color }}
        />
      </div>
    </div>
  );
};

const AgentAvatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const color = agentColorMap[name] || '#64748b';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
        style={{ background: color }}
      >
        {initials}
      </div>
      <span className="text-sm font-medium text-[#374151]">{name}</span>
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
const LeadMonitoring = ({ onViewDetails }) => {
  const { leads } = useLeads();
  const [search, setSearch] = useState('');
  const [agentFilter, setAgentFilter] = useState('All Agents');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [page, setPage] = useState(1);

  const agentList = useMemo(() => ['All Agents', ...new Set(leads.map(l => l.agentName).filter(Boolean))], [leads]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter(l => {
      const matchSearch = !q || l.name.toLowerCase().includes(q) || l.leadId.toLowerCase().includes(q) || l.businessName.toLowerCase().includes(q);
      const matchAgent = agentFilter === 'All Agents' || l.agentName === agentFilter;
      const matchStage = stageFilter === 'All Stages' || l.stage === stageFilter;
      return matchSearch && matchAgent && matchStage;
    });
  }, [leads, search, agentFilter, stageFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => ({
    total: leads.length,
    inProgress: leads.filter(l => !['Completed', 'Rejected'].includes(l.stage)).length,
    completed: leads.filter(l => l.stage === 'Completed').length,
    rejected: leads.filter(l => l.stage === 'Rejected').length,
  }), [leads]);

  const handleFilterChange = (setter) => (e) => { setter(e.target.value); setPage(1); };

  return (
    <div className="flex flex-col gap-6 font-['Sora',sans-serif]">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.6rem] font-bold text-[#1a202c] tracking-tight">Lead Monitoring</h1>
          <p className="text-[0.9rem] text-[#718096] font-medium mt-1">
            Real-time pipeline status across{' '}
            <span className="font-semibold text-[#2447d7]">doc collection</span> and{' '}
            <span className="font-semibold text-[#2447d7]">lender processing</span>.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] text-[#374151] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#f8fafc] transition-all shadow-sm whitespace-nowrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
        <StatCard
          label="Total Leads"
          value={stats.total.toLocaleString()}
          sub="+12% This Month"
          subColor="#10b981"
          iconBg="#eef2ff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" width="18" height="18">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          sub="Active Pipeline"
          subColor="#f59e0b"
          iconBg="#fffbeb"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          sub="Closed Deals"
          subColor="#10b981"
          iconBg="#ecfdf5"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" width="18" height="18">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          }
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          sub="Needs Review"
          subColor="#ef4444"
          iconBg="#fef2f2"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" width="18" height="18">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          }
        />
      </div>

      {/* Filters + Table */}
      <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden">

        {/* Filter Bar */}
        <div className="p-5 border-b border-[#f1f5f9] flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2.5 bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2.5 rounded-xl focus-within:border-[#2447d7] focus-within:bg-white transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" width="16" height="16">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Name or lead ID..."
              className="bg-transparent border-none outline-none text-[13px] text-[#4a5568] w-full font-medium placeholder:text-[#cbd5e0]"
              value={search}
              onChange={handleFilterChange(setSearch)}
            />
          </div>

          <div className="flex items-center gap-3 sm:w-full sm:flex-col">
            <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest whitespace-nowrap">Agent</span>
            <div className="relative">
              <select
                className="bg-white border border-[#e2e8f0] pl-3 pr-8 py-2.5 rounded-xl text-[13px] font-bold text-[#4a5568] appearance-none cursor-pointer outline-none hover:border-[#2447d7] transition-all min-w-[150px]"
                value={agentFilter}
                onChange={handleFilterChange(setAgentFilter)}
              >
                {agentList.map(a => <option key={a}>{a}</option>)}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:w-full sm:flex-col">
            <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest whitespace-nowrap">Stage</span>
            <div className="relative">
              <select
                className="bg-white border border-[#e2e8f0] pl-3 pr-8 py-2.5 rounded-xl text-[13px] font-bold text-[#4a5568] appearance-none cursor-pointer outline-none hover:border-[#2447d7] transition-all min-w-[160px]"
                value={stageFilter}
                onChange={handleFilterChange(setStageFilter)}
              >
                {['All Stages', ...STAGES].map(s => <option key={s}>{s}</option>)}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <span className="ml-auto text-sm font-semibold text-[#64748b] whitespace-nowrap">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                {['Lead ID / Client', 'Business Name', 'Agent', 'Progress', 'Stage', ''].map(h => (
                  <th key={h} className="text-left py-3.5 px-5 text-[10px] font-black text-[#a0aec0] uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? paginated.map((lead, i) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#f8fafc] last:border-0 hover:bg-[#fafbff] transition-colors"
                >
                  {/* Lead ID / Client */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-[#2447d7] font-mono tracking-wider">{lead.leadId}</span>
                      <span className="text-[14px] font-bold text-[#1a202c]">{lead.name}</span>
                    </div>
                  </td>

                  {/* Business Name */}
                  <td className="py-4 px-5">
                    {lead.businessName ? (
                      <span className="text-[11px] font-bold text-[#4a5568] uppercase tracking-wider truncate bg-[#f8faff] px-2.5 py-1 rounded-lg border border-[#edf2f7]">
                        {lead.businessName}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#cbd5e0] italic">Personal Lead</span>
                    )}
                  </td>

                  {/* Agent */}
                  <td className="py-4 px-5">
                    <AgentAvatar name={lead.agentName || 'Unknown'} />
                  </td>

                  {/* Progress */}
                  <td className="py-4 px-5">
                    <ProgressBar stage={lead.stage} progress={lead.progress} />
                  </td>

                  {/* Stage */}
                  <td className="py-4 px-5">
                    <StageBadge stage={lead.stage} />
                  </td>

                  {/* Details */}
                  <td className="py-4 px-5">
                    {onViewDetails && (
                      <button
                        onClick={() => onViewDetails(lead)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#2447d7] bg-[#eef2ff] border border-[#c7d2fe] hover:bg-[#e0e7ff] transition-all whitespace-nowrap"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Details
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-[#94a3b8]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                      <span className="text-sm font-medium">No leads match your filters</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-4 border-t border-[#f1f5f9] flex items-center justify-between">
          <span className="text-sm text-[#64748b]">
            Showing{' '}
            <span className="font-semibold text-[#1a202c]">
              {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{' '}
            of <span className="font-semibold text-[#1a202c]">{filtered.length}</span> leads
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="w-8 h-8 rounded-lg text-[12px] font-bold transition-all"
                style={
                  n === page
                    ? { background: '#2447d7', color: '#fff', boxShadow: '0 4px 12px rgba(36,71,215,0.3)' }
                    : { border: '1px solid #e2e8f0', color: '#64748b' }
                }
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeadMonitoring;

'use client';

import React, { useState } from 'react';

type Tab = 'analytics' | 'logs' | 'leads';

// ── Data ──────────────────────────────────────────────────────────────────────

const LOGS = [
  { id: 1, ts: '2026-04-16 13:14:02', user: 'system_admin', role: 'admin',           category: 'Auth',     action: 'Failed Login Attempt', status: 'Audit',       details: 'Five consecutive failed attempts for user: sarah_j. Lockout triggered.' },
  { id: 2, ts: '2026-04-16 13:05:44', user: 'sarah_j',      role: 'tele_agent',      category: 'Lead',     action: 'Update',               status: 'Operational', details: "Changed lead #8452 status from 'Contacted' to 'Processing'" },
  { id: 3, ts: '2026-04-16 12:54:10', user: 'm_thorne',     role: 'account_manager', category: 'Document', action: 'Delete',               status: 'Audit',       details: "Deleted document 'AML_Policy_Old.pdf' from Vault." },
  { id: 4, ts: '2026-04-16 12:22:05', user: 'e_chen',       role: 'tele_agent',      category: 'Auth',     action: 'Login',                status: 'Operational', details: 'Successful authentication via Single Sign-On.' },
  { id: 5, ts: '2026-04-16 11:45:00', user: 'system_admin', role: 'admin',           category: 'System',   action: 'Update',               status: 'Operational', details: 'System configuration updated. SMTP mail handler tweaked.' },
  { id: 6, ts: '2026-04-16 09:30:15', user: 'd_wallace',    role: 'team_leader',     category: 'Lead',     action: 'Create',               status: 'Operational', details: 'Created new lead #8453 (Tom Haverford via direct entry)' },
  { id: 7, ts: '2026-04-15 16:40:22', user: 'sarah_j',      role: 'tele_agent',      category: 'Document', action: 'View',                 status: 'Operational', details: "Viewed and downloaded 'P12_Q4_Summary.pdf' (3.2 MB)" },
  { id: 8, ts: '2026-04-15 14:15:33', user: 'unknown',      role: 'admin',           category: 'System',   action: 'Login',                status: 'Audit',       details: 'Unauthenticated access attempt to internal endpoint /api/v1/users (Blocked)' },
];

const ROLE_LABELS: Record<string, { label: string; style: React.CSSProperties }> = {
  admin:           { label: 'Admin',           style: { background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' } },
  tele_agent:      { label: 'Tele Agent',      style: { background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' } },
  account_manager: { label: 'Account Manager', style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' } },
  team_leader:     { label: 'Team Leader',     style: { background: '#f5f3ff', color: '#4c1d95', border: '1px solid #ddd6fe' } },
};

const PERF_ROLES: Record<string, any> = {
  agent: {
    title: 'Tele Agent Performance', sortLabel: 'Sorted by Total Leads',
    icon: 'fa-headset', iconBg: '#eef2ff', iconColor: '#4338ca',
    headers: ['Rank', 'Agent Name', 'Total Leads', 'Converted', 'Conv. Rate', 'Total Value'],
    data: [
      { rank: 1, name: 'Sarah Jenkins', role: 'Senior Broker',  leads: 458, col3: 142, conv: 31, value: '£54.2M' },
      { rank: 2, name: 'Marcus Thorne', role: 'Broker',         leads: 412, col3: 115, conv: 27, value: '£41.8M' },
      { rank: 3, name: 'Emily Chen',    role: 'Broker',         leads: 389, col3: 102, conv: 26, value: '£36.5M' },
      { rank: 4, name: 'David Wallace', role: 'Junior Broker',  leads: 310, col3: 78,  conv: 25, value: '£29.1M' },
    ],
    barColor: '#6366f1',
  },
  account_manager: {
    title: 'Account Manager Performance', sortLabel: 'Sorted by Total Leads',
    icon: 'fa-user-tie', iconBg: '#ecfdf5', iconColor: '#065f46',
    headers: ['Rank', 'Account Manager', 'Total Leads', 'Active', 'Closed', 'Conv. Rate', 'Total Value'],
    data: [
      { rank: 1, name: 'Rachel Kim',   role: 'Senior AM',       leads: 312, col3: 88,  col4: 224, conv: 34, value: '£42.1M' },
      { rank: 2, name: 'Tom Hadley',   role: 'Account Manager', leads: 278, col3: 71,  col4: 207, conv: 29, value: '£33.6M' },
      { rank: 3, name: 'Nina Patel',   role: 'Account Manager', leads: 245, col3: 60,  col4: 185, conv: 27, value: '£28.4M' },
      { rank: 4, name: 'Chris Mendez', role: 'Junior AM',       leads: 198, col3: 52,  col4: 146, conv: 24, value: '£19.7M' },
    ],
    barColor: '#10b981',
  },
  team_leader: {
    title: 'Team Leader Performance', sortLabel: 'Sorted by Team Value',
    icon: 'fa-people-group', iconBg: '#f5f3ff', iconColor: '#4c1d95',
    headers: ['Rank', 'Team Leader', 'Team Size', 'Team Leads', 'Converted', 'Avg. Rate', 'Team Value'],
    data: [
      { rank: 1, name: 'James Okafor', role: 'Team Lead – East',  leads: 8, col3: 1240, col4: 320, conv: 29, value: '£148.3M' },
      { rank: 2, name: 'Linda Zhao',   role: 'Team Lead – West',  leads: 7, col3: 1085, col4: 271, conv: 27, value: '£124.7M' },
      { rank: 3, name: 'Ben Hartley',  role: 'Team Lead – North', leads: 6, col3: 894,  col4: 214, conv: 24, value: '£98.2M' },
      { rank: 4, name: 'Amara Diallo', role: 'Team Lead – South', leads: 5, col3: 710,  col4: 156, conv: 22, value: '£71.5M' },
    ],
    barColor: '#8b5cf6',
  },
};

const LEADS_DATA = [
  { id: 'AF-028', name: 'Minosh Example', initials: 'ME', business: 'ex ABC',               personnel: 'Sarah White',  personnelTs: '2026-04-09 05:58', stage: 'Completed',       status: 'Warm', amount: '£3,456',      bank: 'Starling', lender: 'NAB' },
  { id: 'AF-027', name: 'ABC',            initials: 'A',  business: 'ABCD',                 personnel: 'Cody Lane',    personnelTs: '2026-04-08 06:13', stage: 'Completed',       status: 'Warm', amount: '£2,345',      bank: '—',        lender: 'Commonwealth Bank' },
  { id: 'AF-026', name: 'Kavi',           initials: 'K',  business: 'no company',           personnel: 'Sarah White',  personnelTs: '2026-04-07 05:32', stage: 'Docs Verified',   status: 'Warm', amount: '£34,567',     bank: '—',        lender: '—' },
  { id: 'AF-029', name: 'Priya',          initials: 'P',  business: 'no company',           personnel: 'Sarah White',  personnelTs: '2026-04-07 05:24', stage: 'Collecting Docs', status: 'Warm', amount: '£456.90',     bank: '—',        lender: '—' },
  { id: 'AF-025', name: 'John',           initials: 'J',  business: 'ex company',           personnel: 'Jane Doe',     personnelTs: '2026-04-07 05:16', stage: 'Docs Verified',   status: 'Warm', amount: '£456.90',     bank: '—',        lender: '—' },
  { id: 'AF-001', name: 'Robert Miller',  initials: 'RM', business: 'Miller Logistics Co.', personnel: 'Cody Lane',    personnelTs: '2026-03-15',       stage: 'Collecting Docs', status: 'Warm', amount: '£250,000',    bank: 'Barclays', lender: '—' },
  { id: 'AF-002', name: 'Alice Huang',    initials: 'AH', business: 'Huang Tech Solutions', personnel: 'Leo Kumar',    personnelTs: '2026-03-16',       stage: 'Docs Verified',   status: 'Warm', amount: '£1,200,000',  bank: 'HSBC',     lender: '—' },
  { id: 'AF-011', name: 'Bruce Wayne',    initials: 'BW', business: 'Wayne Enterprises',    personnel: 'Priya Sharma', personnelTs: '2026-03-19',       stage: 'Collecting Docs', status: 'Warm', amount: '£50,000,000', bank: 'HSBC',     lender: '—' },
  { id: 'AF-003', name: 'David Rivera',   initials: 'DR', business: 'Rivera Designs',       personnel: 'Priya Sharma', personnelTs: '2026-03-14',       stage: 'Selecting Lender',status: 'Warm', amount: '—',           bank: '—',        lender: '—' },
  { id: 'AF-004', name: 'Sarah Connor',   initials: 'SC', business: 'Connor Security Group',personnel: 'Jake Morrison',personnelTs: '2026-03-13',       stage: 'Rejected',        status: 'Warm', amount: '—',           bank: '—',        lender: '—' },
  { id: 'AF-005', name: 'Michael Scott',  initials: 'MS', business: 'Dunder Mifflin',       personnel: 'Leo Kumar',    personnelTs: '2026-03-12',       stage: 'Completed',       status: 'Warm', amount: '£18,500',     bank: 'Barclays', lender: 'ANZ' },
  { id: 'AF-006', name: 'James Carter',   initials: 'JC', business: 'Carter Holdings',      personnel: 'Jane Doe',     personnelTs: '2026-03-10',       stage: 'Collecting Docs', status: 'Warm', amount: '£500,000',    bank: 'HSBC',     lender: '—' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const r = ROLE_LABELS[role] || { label: role, style: { background: '#f1f5f9', color: '#64748b' } };
  return (
    <span style={{ ...r.style, padding: '2px 7px', borderRadius: 4, fontSize: 8, fontWeight: 700, whiteSpace: 'nowrap' as const }}>
      {r.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Audit')
    return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-50 text-red-700 border border-red-100"><i className="fa-solid fa-magnifying-glass text-[7px]"></i>Audit</span>;
  return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"><i className="fa-solid fa-gear text-[7px]"></i>Operational</span>;
}

function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, string> = {
    'Completed':       'bg-green-50 text-green-800 border border-green-200',
    'Docs Verified':   'bg-sky-50 text-sky-800 border border-sky-200',
    'Collecting Docs': 'bg-slate-50 text-slate-600 border border-slate-200',
    'Selecting Lender':'bg-violet-50 text-violet-800 border border-violet-200',
    'Rejected':        'bg-red-50 text-red-700 border border-red-200',
  };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap ${map[stage] || 'bg-slate-50 text-slate-500'}`}>{stage}</span>;
}

function RankLabel({ rank }: { rank: number }) {
  if (rank === 1) return <span className="font-black text-amber-500 text-sm">1</span>;
  if (rank === 2) return <span className="font-black text-slate-400 text-sm">2</span>;
  if (rank === 3) return <span className="font-black text-amber-700 text-sm">3</span>;
  return <span className="font-bold text-slate-300">{rank}</span>;
}

function ConvBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }}></div>
      </div>
      <span className="text-[10px] font-bold text-slate-700">{pct}%</span>
    </div>
  );
}

function initialsStyle(initials: string) {
  const bgs   = ['#e0e7ff','#f0fdf4','#fef9c3','#fce7f3','#f0f9ff','#f5f3ff'];
  const texts = ['#4338ca','#166534','#713f12','#9d174d','#075985','#4c1d95'];
  const idx   = ((initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0)) % bgs.length;
  return { background: bgs[idx], color: texts[idx] };
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  const [perfRole, setPerfRole]   = useState('agent');
  const [perfSearch, setPerfSearch] = useState('');
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [logSearch, setLogSearch]   = useState('');
  const [logRole,   setLogRole]     = useState('');
  const [logAction, setLogAction]   = useState('');
  const [logStatus, setLogStatus]   = useState('');
  const [leadSearch, setLeadSearch] = useState('');

  // ── Filtered data ──
  const cfg = PERF_ROLES[perfRole];
  const filteredPerf = cfg.data.filter((d: any) =>
    !perfSearch || d.name.toLowerCase().includes(perfSearch.toLowerCase()) || d.role.toLowerCase().includes(perfSearch.toLowerCase())
  );

  const filteredLogs = LOGS.filter(d =>
    (!logSearch || d.user.toLowerCase().includes(logSearch.toLowerCase()) || d.action.toLowerCase().includes(logSearch.toLowerCase())) &&
    (!logRole   || d.role === logRole) &&
    (!logAction || d.action === logAction) &&
    (!logStatus || d.status === logStatus)
  );

  const filteredLeads = LEADS_DATA.filter(d =>
    !leadSearch ||
    d.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    d.id.toLowerCase().includes(leadSearch.toLowerCase()) ||
    d.business.toLowerCase().includes(leadSearch.toLowerCase()) ||
    d.personnel.toLowerCase().includes(leadSearch.toLowerCase()) ||
    d.stage.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const hasCol4 = cfg.data[0]?.col4 !== undefined;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#fafafa]">

      {/* ── Top header card ── */}
      <div className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <i className="fa-solid fa-chart-line text-lg"></i>
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight">System Intelligence</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Performance & Operations Audit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Period:</span>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
            <button className="bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all">Apply</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1 bg-slate-50/50">
          {([
            { id: 'analytics', icon: 'fa-chart-bar',    label: 'Analytics' },
            { id: 'logs',      icon: 'fa-shield-halved', label: 'Audit Logs' },
            { id: 'leads',     icon: 'fa-table',         label: 'Lead Intelligence' },
          ] as { id: Tab; icon: string; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === t.id
                  ? 'text-slate-900 border-slate-900'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              <i className={`fa-solid ${t.icon} text-[9px]`}></i>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab: Analytics ── */}
      {activeTab === 'analytics' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Sub-header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: cfg.iconBg, color: cfg.iconColor }}>
                  <i className={`fa-solid ${cfg.icon}`}></i>
                </div>
                <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">{cfg.title}</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">View:</span>
                <select
                  value={perfRole}
                  onChange={e => { setPerfRole(e.target.value); setPerfSearch(''); }}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400"
                >
                  <option value="agent">Tele Agent</option>
                  <option value="account_manager">Account Manager</option>
                  <option value="team_leader">Team Leader</option>
                </select>
                <span className="text-[9px] text-slate-400">
                  <i className="fa-solid fa-sort mr-1"></i>{cfg.sortLabel}
                </span>
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400"></i>
                  <input
                    type="text"
                    value={perfSearch}
                    onChange={e => setPerfSearch(e.target.value)}
                    placeholder="Quick find..."
                    className="bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400 w-36"
                  />
                </div>
                <button className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                  <i className="fa-solid fa-file-csv text-[10px]"></i> CSV
                </button>
                <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all">
                  <i className="fa-solid fa-file-pdf text-[10px]"></i> PDF
                </button>
              </div>
            </div>

            {/* Performance table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {cfg.headers.map((h: string) => (
                      <th key={h} className={`px-4 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-200 ${h === 'Rank' ? 'w-12 text-center' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPerf.length === 0 ? (
                    <tr><td colSpan={cfg.headers.length} className="text-center text-slate-400 py-8 text-[10px]">No results found</td></tr>
                  ) : filteredPerf.map((d: any) => (
                    <tr key={d.rank} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-center"><RankLabel rank={d.rank} /></td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-[11px]">{d.name}</div>
                        <div className="text-[8px] text-slate-400 uppercase tracking-wide mt-0.5">{d.role}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700 text-[11px]">{d.leads}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 text-[11px]">{d.col3}</td>
                      {hasCol4 && <td className="px-4 py-3 font-bold text-indigo-600 text-[11px]">{d.col4}</td>}
                      <td className="px-4 py-3"><ConvBar pct={d.conv} color={cfg.barColor} /></td>
                      <td className="px-4 py-3 font-black text-slate-900 text-[11px]">{d.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Audit Logs ── */}
      {activeTab === 'logs' && (
        <div className="flex-1 overflow-hidden flex flex-col p-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1">
            {/* Filters */}
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 flex-wrap flex-shrink-0">
              <div className="relative flex-1 min-w-[180px]">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400"></i>
                <input
                  type="text"
                  value={logSearch}
                  onChange={e => setLogSearch(e.target.value)}
                  placeholder="Search by user or action..."
                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400"
                />
              </div>
              {[
                { id: 'role',   val: logRole,   set: setLogRole,   opts: [['','All Users'],['admin','Admin'],['tele_agent','Tele Agent'],['account_manager','Account Manager'],['team_leader','Team Leader']] },
                { id: 'action', val: logAction, set: setLogAction, opts: [['','All Actions'],['Login','Login'],['Create','Create'],['Update','Update'],['Delete','Delete'],['View','View']] },
                { id: 'status', val: logStatus, set: setLogStatus, opts: [['','All'],['Audit','Audit'],['Operational','Operational']] },
              ].map(f => (
                <select key={f.id} value={f.val} onChange={e => f.set(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400">
                  {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              ))}
            </div>

            {/* Logs table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10">
                  <tr>
                    {['', 'Timestamp', 'User', 'Role', 'Category', 'Action', 'Status'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(d => (
                    <React.Fragment key={d.id}>
                      <tr
                        className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setExpandedLog(expandedLog === d.id ? null : d.id)}
                      >
                        <td className="px-4 py-3 text-center w-8">
                          <i className={`fa-solid ${expandedLog === d.id ? 'fa-chevron-down' : 'fa-chevron-right'} text-[8px] text-slate-400`}></i>
                        </td>
                        <td className="px-4 py-3 font-mono text-[9px] text-slate-500 whitespace-nowrap">{d.ts}</td>
                        <td className="px-4 py-3 font-bold text-[10px] text-slate-800">@{d.user}</td>
                        <td className="px-4 py-3"><RoleBadge role={d.role} /></td>
                        <td className="px-4 py-3">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-500">{d.category}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-[10px] text-slate-700 max-w-[200px] truncate">{d.action}</td>
                        <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                      </tr>
                      {expandedLog === d.id && (
                        <tr key={`detail-${d.id}`} className="bg-slate-50/80">
                          <td colSpan={7} className="px-6 py-3 border-b-2 border-slate-200">
                            <div style={{ animation: 'slidedown 0.2s ease' }}>
                              <style>{`@keyframes slidedown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Detailed Event Data</span>
                              <p className="text-[10px] font-mono text-slate-800 bg-slate-100 px-3 py-2 rounded border border-slate-200 shadow-inner">{d.details}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Lead Intelligence ── */}
      {activeTab === 'leads' && (
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1">
            {/* Sub-header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-[11px] font-black text-slate-900 tracking-tight">Lead Intelligence</h3>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{filteredLeads.length} records found</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400"></i>
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={e => setLeadSearch(e.target.value)}
                    placeholder="Quick find lead..."
                    className="bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400 w-44"
                  />
                </div>
                <button className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                  <i className="fa-solid fa-file-csv text-[10px]"></i> CSV
                </button>
                <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all">
                  <i className="fa-solid fa-file-pdf text-[10px]"></i> PDF
                </button>
              </div>
            </div>

            {/* Leads table */}
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    {['Lead Entity','Business Name','Personnel Flow','Application Stage','Lead Status','Amount','Bank','Lender Partner'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-200 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(d => (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0" style={initialsStyle(d.initials)}>{d.initials}</div>
                          <div>
                            <div className="font-bold text-slate-900 text-[11px]">{d.name}</div>
                            <div className="text-[8px] text-slate-400 font-mono">#{d.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-3 py-2.5 text-[10px] ${d.business === 'no company' ? 'text-slate-400 italic' : 'text-slate-700 font-medium'}`}>{d.business}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-slate-800 text-[10px]">{d.personnel}</div>
                        <div className="text-[8px] text-slate-400 font-mono mt-0.5">{d.personnelTs}</div>
                      </td>
                      <td className="px-3 py-2.5"><StageBadge stage={d.stage} /></td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block flex-shrink-0"></span>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-bold text-slate-900 text-[11px]">{d.amount}</td>
                      <td className="px-3 py-2.5 text-[10px] text-slate-600">{d.bank}</td>
                      <td className="px-3 py-2.5 font-bold text-[10px] text-slate-800 uppercase tracking-wide">{d.lender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

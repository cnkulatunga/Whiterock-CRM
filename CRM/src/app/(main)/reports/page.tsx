'use client';

import React, { useState, useEffect, useCallback } from 'react';

type Tab = 'analytics' | 'logs' | 'leads';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AgentRow {
    id: string;
    rank: number;
    name: string;
    role: string;
    designation: string;
    total_leads: number;
    converted: number;
    conversion_rate: number;
    total_value: number;
}

interface AuditLog {
    id: string;
    user_name: string;
    user_email: string;
    action: string;
    entity_type: string;
    entity_id: string;
    metadata: Record<string, unknown>;
    timestamp: string;
}

interface Lead {
    id: string;
    name: string;
    company: string;
    status: string;
    priority: string;
    amount: string;
    agent: { id: string; name: string } | null;
    lender: { id: string; name: string } | null;
    company_bank: string;
    companyBank: string;
    created_at: string;
}

// ── Role config (used by Admin/Super Admin role selector) ─────────────────────

const ROLE_OPTIONS = [
    { value: 'Tele Agent',       label: 'Tele Agent',       icon: 'fa-headset',      iconBg: '#eef2ff', iconColor: '#4338ca', barColor: '#6366f1' },
    { value: 'Accounts Manager', label: 'Account Manager',  icon: 'fa-user-tie',     iconBg: '#ecfdf5', iconColor: '#065f46', barColor: '#10b981' },
    { value: 'Team Leader',      label: 'Team Leader',      icon: 'fa-people-group', iconBg: '#f5f3ff', iconColor: '#4c1d95', barColor: '#8b5cf6' },
];

// Fixed config used when role selector is hidden (Team Leader / Accounts Manager)
const TELE_AGENT_CFG = { label: 'Tele Agent', icon: 'fa-headset', iconBg: '#eef2ff', iconColor: '#4338ca', barColor: '#6366f1' };
const TEAM_LEADER_CFG = { label: 'Team',      icon: 'fa-headset', iconBg: '#eef2ff', iconColor: '#4338ca', barColor: '#6366f1' };

// ── Status / stage maps ───────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
    new:        'New',
    collecting: 'Collecting Docs',
    verified:   'Docs Verified',
    lender:     'Selecting Lender',
    approved:   'Approved',
    rejected:   'Rejected',
    completed:  'Completed',
};

const STATUS_CLASS: Record<string, string> = {
    completed:  'bg-green-50 text-green-800 border border-green-200',
    approved:   'bg-emerald-50 text-emerald-800 border border-emerald-200',
    verified:   'bg-sky-50 text-sky-800 border border-sky-200',
    collecting: 'bg-slate-50 text-slate-600 border border-slate-200',
    lender:     'bg-violet-50 text-violet-800 border border-violet-200',
    new:        'bg-amber-50 text-amber-700 border border-amber-200',
    rejected:   'bg-red-50 text-red-700 border border-red-200',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtValue(v: number) {
    if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `£${(v / 1_000).toFixed(1)}K`;
    return v > 0 ? `£${v.toFixed(0)}` : '—';
}

function fmtTs(ts: string) {
    try {
        return new Date(ts).toLocaleString('en-GB', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return ts;
    }
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
                <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color }}></div>
            </div>
            <span className="text-[10px] font-bold text-slate-700">{pct}%</span>
        </div>
    );
}

function StageBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${STATUS_CLASS[status] || 'bg-slate-50 text-slate-500'}`}>
            {STATUS_LABEL[status] || status}
        </span>
    );
}

function initialsStyle(name: string) {
    const bgs   = ['#e0e7ff','#f0fdf4','#fef9c3','#fce7f3','#f0f9ff','#f5f3ff'];
    const texts = ['#4338ca','#166534','#713f12','#9d174d','#075985','#4c1d95'];
    const code  = (name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0);
    const idx   = code % bgs.length;
    return { background: bgs[idx], color: texts[idx] };
}

function initials(name: string) {
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function Spinner() {
    return (
        <div className="flex-1 flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('analytics');

    // Current user role from session
    const [userRole, setUserRole] = useState<string>('');
    useEffect(() => {
        try {
            const s = JSON.parse(sessionStorage.getItem('crm_session') || '{}');
            setUserRole(s.role || '');
        } catch { /* ignore */ }
    }, []);

    const isTeamLeader      = userRole === 'Team Leader';
    const isAccountsManager = userRole === 'Accounts Manager';
    const isSuperAdmin      = userRole === 'Super Admin' || userRole === 'Admin';
    // Show Audit Logs tab only for Super Admin / Admin
    const showLogsTab       = isSuperAdmin;
    // Show role selector only for Super Admin / Admin
    const showRoleSelector  = isSuperAdmin;

    // ── Analytics state ──
    const [perfRole,   setPerfRole]   = useState(ROLE_OPTIONS[0].value);
    const [perfSearch, setPerfSearch] = useState('');
    const [analytics,  setAnalytics]  = useState<AgentRow[]>([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    // ── Audit log state ──
    const [logs,        setLogs]       = useState<AuditLog[]>([]);
    const [logsLoading, setLogsLoading]= useState(false);
    const [expandedLog, setExpandedLog]= useState<string | null>(null);
    const [logSearch,   setLogSearch]  = useState('');
    const [logEntity,   setLogEntity]  = useState('');

    // ── Lead intelligence state ──
    const [leads,       setLeads]       = useState<Lead[]>([]);
    const [leadsLoading,setLeadsLoading]= useState(false);
    const [leadSearch,  setLeadSearch]  = useState('');
    const [leadStatus,  setLeadStatus]  = useState('');

    // ── Fetch analytics ──
    const fetchAnalytics = useCallback(async (role: string) => {
        setAnalyticsLoading(true);
        try {
            let url = '/api/reports/analytics';
            // Team Leader and Accounts Manager: backend auto-scopes, no role param
            if (!isTeamLeader && !isAccountsManager) {
                url += `?role=${encodeURIComponent(role)}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setAnalytics(Array.isArray(data) ? data : []);
        } catch {
            setAnalytics([]);
        } finally {
            setAnalyticsLoading(false);
        }
    }, [isTeamLeader, isAccountsManager]);

    // ── Fetch logs ──
    const fetchLogs = useCallback(async () => {
        setLogsLoading(true);
        try {
            const params = new URLSearchParams();
            if (logEntity) params.set('entity_type', logEntity);
            const res = await fetch(`/api/reports/logs?${params}`);
            const data = await res.json();
            setLogs(Array.isArray(data) ? data : []);
        } catch {
            setLogs([]);
        } finally {
            setLogsLoading(false);
        }
    }, [logEntity]);

    // ── Fetch leads ──
    const fetchLeads = useCallback(async () => {
        setLeadsLoading(true);
        try {
            const params = new URLSearchParams();
            if (leadStatus) params.set('status', leadStatus);
            if (leadSearch) params.set('search', leadSearch);
            const res = await fetch(`/api/reports/leads?${params}`);
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch {
            setLeads([]);
        } finally {
            setLeadsLoading(false);
        }
    }, [leadStatus, leadSearch]);

    // ── Load on tab activate + role/entity change ──
    useEffect(() => {
        if (activeTab === 'analytics') fetchAnalytics(perfRole);
    }, [activeTab, perfRole, fetchAnalytics]);

    useEffect(() => {
        if (activeTab === 'logs') fetchLogs();
    }, [activeTab, logEntity, fetchLogs]);

    useEffect(() => {
        if (activeTab === 'leads') fetchLeads();
    }, [activeTab, leadStatus, fetchLeads]);

    // Debounce lead search
    useEffect(() => {
        if (activeTab !== 'leads') return;
        const t = setTimeout(() => fetchLeads(), 400);
        return () => clearTimeout(t);
    }, [leadSearch]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Derived ──
    const roleCfg = isTeamLeader
        ? TEAM_LEADER_CFG
        : isAccountsManager
        ? TELE_AGENT_CFG
        : (ROLE_OPTIONS.find(r => r.value === perfRole) ?? ROLE_OPTIONS[0]);

    const analyticsHeading = isTeamLeader
        ? 'Team Performance'
        : isAccountsManager
        ? 'Tele Agent Performance'
        : `${(roleCfg as typeof ROLE_OPTIONS[0]).label} Performance`;

    const filteredPerf = analytics.filter(d =>
        !perfSearch ||
        d.name.toLowerCase().includes(perfSearch.toLowerCase()) ||
        d.designation.toLowerCase().includes(perfSearch.toLowerCase())
    );

    const filteredLogs = logs.filter(d =>
        !logSearch ||
        d.user_name.toLowerCase().includes(logSearch.toLowerCase()) ||
        d.user_email.toLowerCase().includes(logSearch.toLowerCase()) ||
        d.action.toLowerCase().includes(logSearch.toLowerCase())
    );

    const entityTypes = Array.from(new Set(logs.map(l => l.entity_type).filter(Boolean)));
    const leadStatusOptions = ['new','collecting','verified','lender','approved','rejected','completed'];

    // Build tabs based on role
    const tabs: { id: Tab; icon: string; label: string }[] = [
        { id: 'analytics', icon: 'fa-chart-bar', label: 'Analytics' },
        ...(showLogsTab ? [{ id: 'logs' as Tab, icon: 'fa-shield-halved', label: 'Audit Logs' }] : []),
        { id: 'leads', icon: 'fa-table', label: 'Lead Intelligence' },
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#fafafa]">

            {/* ── Top header card ── */}
            <div className="bg-white border-b border-slate-200 shrink-0">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <i className="fa-solid fa-chart-line text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-slate-900 tracking-tight">System Intelligence</h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Performance & Operations</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-4 gap-1 bg-slate-50/50">
                    {tabs.map(t => (
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
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: roleCfg.iconBg, color: roleCfg.iconColor }}>
                                    <i className={`fa-solid ${roleCfg.icon}`}></i>
                                </div>
                                <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">{analyticsHeading}</h3>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Role selector — Super Admin / Admin only */}
                                {showRoleSelector && (
                                    <>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">View:</span>
                                        <select
                                            value={perfRole}
                                            onChange={e => { setPerfRole(e.target.value); setPerfSearch(''); }}
                                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400"
                                        >
                                            {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                        </select>
                                    </>
                                )}
                                <span className="text-xs text-slate-400">
                                    <i className="fa-solid fa-sort mr-1"></i>Sorted by Total Leads
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
                            </div>
                        </div>

                        {analyticsLoading ? <Spinner /> : (
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            {['Rank', 'Name', 'Total Leads', 'Converted', 'Conv. Rate', 'Total Value'].map(h => (
                                                <th key={h} className={`px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-200 ${h === 'Rank' ? 'w-12 text-center' : ''}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPerf.length === 0 ? (
                                            <tr><td colSpan={6} className="py-16 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                                                        <i className="fa-solid fa-chart-bar text-lg"></i>
                                                    </div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{perfSearch ? 'No results match' : 'No data yet'}</p>
                                                    <p className="text-xs font-bold text-slate-300">{perfSearch ? 'Try a different name or designation' : 'Activity will appear here once agents are active'}</p>
                                                </div>
                                            </td></tr>
                                        ) : filteredPerf.map(d => (
                                            <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 text-center"><RankLabel rank={d.rank} /></td>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-slate-900 text-[11px]">{d.name}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{d.designation || d.role}</div>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-slate-700 text-[11px]">{d.total_leads}</td>
                                                <td className="px-4 py-3 font-bold text-emerald-600 text-[11px]">{d.converted}</td>
                                                <td className="px-4 py-3"><ConvBar pct={d.conversion_rate} color={roleCfg.barColor} /></td>
                                                <td className="px-4 py-3 font-black text-slate-900 text-[11px]">{fmtValue(d.total_value)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Tab: Audit Logs (Super Admin / Admin only) ── */}
            {activeTab === 'logs' && showLogsTab && (
                <div className="flex-1 overflow-hidden flex flex-col p-4 gap-3">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1">
                        {/* Filters */}
                        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 flex-wrap shrink-0">
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
                            <select
                                value={logEntity}
                                onChange={e => setLogEntity(e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400"
                            >
                                <option value="">All Types</option>
                                {entityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <button
                                onClick={fetchLogs}
                                className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
                            >
                                <i className="fa-solid fa-rotate text-[9px]"></i> Refresh
                            </button>
                        </div>

                        {logsLoading ? <Spinner /> : (
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 z-10">
                                        <tr>
                                            {['', 'Timestamp', 'User', 'Email', 'Entity', 'Action'].map(h => (
                                                <th key={h} className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogs.length === 0 ? (
                                            <tr><td colSpan={6} className="py-16 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                                                        <i className="fa-solid fa-shield-halved text-lg"></i>
                                                    </div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{logSearch || logEntity ? 'No logs match' : 'No audit logs yet'}</p>
                                                    <p className="text-xs font-bold text-slate-300">{logSearch || logEntity ? 'Try clearing your filters' : 'System events will be recorded here automatically'}</p>
                                                </div>
                                            </td></tr>
                                        ) : filteredLogs.map(d => (
                                            <React.Fragment key={d.id}>
                                                <tr
                                                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                                                    onClick={() => setExpandedLog(expandedLog === d.id ? null : d.id)}
                                                >
                                                    <td className="px-4 py-3 text-center w-8">
                                                        <i className={`fa-solid ${expandedLog === d.id ? 'fa-chevron-down' : 'fa-chevron-right'} text-[10px] text-slate-400`}></i>
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{fmtTs(d.timestamp)}</td>
                                                    <td className="px-4 py-3 font-bold text-[10px] text-slate-800">{d.user_name || '—'}</td>
                                                    <td className="px-4 py-3 text-xs text-slate-500">{d.user_email || '—'}</td>
                                                    <td className="px-4 py-3">
                                                        {d.entity_type && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">{d.entity_type}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-[10px] text-slate-700 max-w-[280px] truncate">{d.action}</td>
                                                </tr>
                                                {expandedLog === d.id && (
                                                    <tr key={`detail-${d.id}`} className="bg-slate-50/80">
                                                        <td colSpan={6} className="px-6 py-3 border-b-2 border-slate-200">
                                                            <div style={{ animation: 'slidedown 0.2s ease' }}>
                                                                <style>{`@keyframes slidedown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Event Metadata</span>
                                                                {d.entity_id && (
                                                                    <p className="text-xs text-slate-500 mb-1">Entity ID: <span className="font-mono">{d.entity_id}</span></p>
                                                                )}
                                                                <p className="text-[10px] font-mono text-slate-800 bg-slate-100 px-3 py-2 rounded border border-slate-200 shadow-inner">
                                                                    {Object.keys(d.metadata).length > 0
                                                                        ? JSON.stringify(d.metadata, null, 2)
                                                                        : d.action}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Tab: Lead Intelligence ── */}
            {activeTab === 'leads' && (
                <div className="flex-1 overflow-hidden flex flex-col p-4">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1">
                        {/* Sub-header */}
                        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 flex-wrap gap-3">
                            <div>
                                <h3 className="text-[11px] font-black text-slate-900 tracking-tight">
                                    {isTeamLeader ? 'Team Pipeline' : 'Lead Intelligence'}
                                </h3>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">{leads.length} records</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <select
                                    value={leadStatus}
                                    onChange={e => setLeadStatus(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400"
                                >
                                    <option value="">All Stages</option>
                                    {leadStatusOptions.map(s => (
                                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                                    ))}
                                </select>
                                <div className="relative">
                                    <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400"></i>
                                    <input
                                        type="text"
                                        value={leadSearch}
                                        onChange={e => setLeadSearch(e.target.value)}
                                        placeholder="Search leads..."
                                        className="bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-indigo-400 w-44"
                                    />
                                </div>
                            </div>
                        </div>

                        {leadsLoading ? <Spinner /> : (
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                                    <thead className="sticky top-0 z-10">
                                        <tr>
                                            {['Lead','Business','Agent','Application Stage','Amount','Bank','Lender'].map(h => (
                                                <th key={h} className="px-3 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-200 whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leads.length === 0 ? (
                                            <tr><td colSpan={7} className="py-16 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                                                        <i className="fa-solid fa-table text-lg"></i>
                                                    </div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{leadSearch || leadStatus ? 'No leads match' : 'No leads found'}</p>
                                                    <p className="text-xs font-bold text-slate-300">{leadSearch || leadStatus ? 'Adjust your search or stage filter' : 'Leads will appear here once created'}</p>
                                                </div>
                                            </td></tr>
                                        ) : leads.map(d => (
                                            <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                                                            style={initialsStyle(d.name)}
                                                        >
                                                            {initials(d.name)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-[11px]">{d.name}</div>
                                                            <div className="text-[10px] text-slate-400 font-mono">#{d.id.slice(-6)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`px-3 py-2.5 text-[10px] ${!d.company ? 'text-slate-400 italic' : 'text-slate-700 font-medium'}`}>
                                                    {d.company || 'No company'}
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="font-semibold text-slate-800 text-[10px]">{d.agent?.name || '—'}</div>
                                                </td>
                                                <td className="px-3 py-2.5"><StageBadge status={d.status} /></td>
                                                <td className="px-3 py-2.5 font-bold text-slate-900 text-[11px]">
                                                    {d.amount && d.amount !== '0' ? `£${d.amount}` : '—'}
                                                </td>
                                                <td className="px-3 py-2.5 text-[10px] text-slate-600">{d.companyBank || d.company_bank || '—'}</td>
                                                <td className="px-3 py-2.5 font-bold text-[10px] text-slate-800 uppercase tracking-wide">
                                                    {d.lender?.name || '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

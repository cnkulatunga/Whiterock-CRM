import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { WORKFLOW_STAGES, SHARED_INITIAL_USERS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';
import LeadDetails from '../../tele_agent/leads/LeadDetails';
import { useTasks } from '../../../context/TasksContext';
import UserProfileModal from '../../../components/modals/UserProfileModal';

const STAGE_TO_OP = {
    'Document Collection':        'lead_gather',
    'Document Verification Done': 'doc_collect',
    'Lender Selection':           'lender_select',
    'Completed':                  'closed',
    'Rejected':                   'rejected',
};

/* ── stage badge config ── */
const STAGE_CFG = {
    lead_gather:   { label: 'Lead Gather',    cls: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
    doc_collect:   { label: 'Doc Collection', cls: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
    lender_select: { label: 'Lender Select',  cls: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
    closed:        { label: 'Confirmed',      cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    rejected:      { label: 'Rejected',       cls: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    won:           { label: 'Confirmed',      cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
};

const STAGE_COLORS = {
    lead_gather:   '#6366f1',
    doc_collect:   '#8b5cf6',
    lender_select: '#ec4899',
    closed:        '#10b981',
    won:           '#10b981',
    rejected:      '#ef4444',
};

const getStageColor = (stageId) =>
    STAGE_COLORS[stageId] || WORKFLOW_STAGES.find(s => s.id === stageId)?.color || '#6366f1';

const StagePill = ({ stageId }) => {
    const cfg = STAGE_CFG[stageId] || STAGE_CFG.lead_gather;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
};

const ChevronRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" className="text-slate-300 shrink-0">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);

const OperationalFlow = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { leads, setLeads } = useLeads();    const { tasks, setTasks } = useTasks();
    const location = useLocation();

    const [search, setSearch]           = useState('');
    const [filterStage, setFilterStage] = useState('All');
    const [viewMode, setViewMode]       = useState('table');
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedUser, setSelectedUser]     = useState(null);

    // Auto-switch to grid on mobile
    useEffect(() => {
        const handler = () => {
            if (window.innerWidth <= 1024 && viewMode === 'table') setViewMode('grid');
        };
        handler();
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [viewMode]);

    const openProfile = (name) => {
        if (!name) return;
        const user = SHARED_INITIAL_USERS.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (user) setSelectedUser(user);
    };

    useEffect(() => {
        if (location.state?.selectedLead) {
            setSelectedClient(location.state.selectedLead);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const filteredClients = leads.filter(c => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (c.name || '').toLowerCase().includes(q) ||
            (c.agentName || c.agent || '').toLowerCase().includes(q) ||
            (c.tl || '').toLowerCase().includes(q) ||
            (c.businessName || '').toLowerCase().includes(q);

        const mapped = STAGE_TO_OP[c.stage] || 'lead_gather';
        const matchStage = filterStage === 'All' || mapped === filterStage ||
            (filterStage === 'closed' && (mapped === 'won' || mapped === 'rejected'));

        return matchSearch && matchStage;
    }).sort((a, b) => {
        const ORDER = { Hot: 0, Warm: 1, Cool: 2 };
        return (ORDER[a.leadStatus] ?? 1) - (ORDER[b.leadStatus] ?? 1);
    });

    const card = isDark ? 'bg-[#1a1f3a] border-white/5' : 'bg-white border-slate-100';

    if (selectedClient) {
        return (
            <div className="animate-fadeIn">
                <LeadDetails lead={selectedClient} onBack={() => setSelectedClient(null)} tasks={tasks} setTasks={setTasks} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 font-['Inter',sans-serif] animate-fadeIn">

            {/* ── Pipeline Steps ── */}
            <div className={`rounded-2xl border p-4 sm:p-3 overflow-x-hidden ${card}`}>
                <div className="relative flex justify-between items-start">
                    {/* connector line */}
                    <div className={`absolute top-4 sm:top-3 left-8 sm:left-6 right-8 sm:right-6 h-px ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                    {WORKFLOW_STAGES.map((stage, idx) => {
                        const isActive = filterStage === stage.id;
                        return (
                            <button key={stage.id}
                                onClick={() => setFilterStage(isActive ? 'All' : stage.id)}
                                className="relative flex flex-col items-center gap-1 z-10 group flex-1 focus:outline-none">
                                <div className="w-8 h-8 sm:w-6 sm:h-6 rounded-xl sm:rounded-lg flex items-center justify-center font-bold text-xs sm:text-[10px] transition-all duration-200 shadow-sm"
                                    style={{
                                        background: isActive ? stage.color : (isDark ? '#ffffff08' : '#f8fafc'),
                                        color: isActive ? '#fff' : (isDark ? '#64748b' : '#94a3b8'),
                                        boxShadow: isActive ? `0 4px 14px ${stage.color}50` : 'none',
                                        border: isActive ? 'none' : `1px solid ${isDark ? '#ffffff10' : '#e2e8f0'}`,
                                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                    }}>
                                    {idx + 1}
                                </div>
                                <div className="text-center px-0.5">
                                    <p className="text-[9px] sm:text-[8px] font-bold uppercase tracking-wide leading-tight"
                                        style={{ color: isActive ? stage.color : (isDark ? '#94a3b8' : '#64748b') }}>
                                        {stage.label}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Content ── */}
            {viewMode === 'grid' ? (
                <>
                {/* Grid header with search + toggle */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-slate-400">{filteredClients.length} records</p>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                        <div className="relative flex-1 max-w-[260px] sm:max-w-full">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></div>
                            <input
                                type="text"
                                placeholder="Search lead, agent or TL..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className={`pl-9 pr-4 py-2 rounded-xl text-xs font-medium outline-none border w-full transition-all focus:ring-2 focus:ring-indigo-500/30 ${isDark ? 'bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'}`}
                            />
                        </div>
                        <div className={`flex items-center rounded-xl border p-1 gap-1 shrink-0 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            {[
                                { mode: 'grid',  icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></> },
                                { mode: 'table', icon: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></> },
                            ].map(({ mode, icon }) => (
                                <button key={mode} onClick={() => setViewMode(mode)}
                                    className={`p-2 rounded-lg transition-all ${viewMode === mode ? (isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900') : 'text-slate-400 hover:text-slate-600'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">{icon}</svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-1">
                    {filteredClients.map((client, idx) => {
                        const stageId = STAGE_TO_OP[client.stage] || 'lead_gather';
                        const stageColor = getStageColor(stageId);
                        return (
                            <div key={client.id} className={`rounded-2xl border p-5 flex flex-col gap-4 hover:shadow-md transition-all ${card}`}
                                style={{ animationDelay: `${idx * 40}ms` }}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{client.name}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">#{client.id}{client.businessName ? ` · ${client.businessName}` : ''}</p>
                                    </div>
                                    <StagePill stageId={stageId} />
                                </div>

                                <div className={`rounded-xl p-3 ${isDark ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                                    {(() => {
                                        const role = client.createdByRole || '';
                                        const isAdmin = role.toLowerCase().includes('admin');
                                        const isAM = role.toLowerCase().includes('account');
                                        const isTL = role.toLowerCase().includes('team') || role.toLowerCase().includes('leader');
                                        const agent = client.agentName || client.agent;
                                        const tl = client.tl;
                                        const am = client.manager || client.accountsManager;
                                        const chain = [];
                                        if (isAdmin) {
                                            if (agent) chain.push({ name: agent, label: 'Admin' });
                                        } else if (isAM) {
                                            if (agent) chain.push({ name: agent, label: 'AM' });
                                        } else if (isTL) {
                                            if (agent) chain.push({ name: agent, label: 'TL' });
                                            if (am)    chain.push({ name: am,    label: 'AM' });
                                        } else {
                                            if (agent) chain.push({ name: agent, label: 'Tele Agent' });
                                            if (tl)    chain.push({ name: tl,    label: 'Team Leader' });
                                            if (am)    chain.push({ name: am,    label: 'Accts Manager' });
                                        }
                                        if (chain.length === 0 && agent) chain.push({ name: agent, label: 'Agent' });
                                        return (
                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                {chain.map(({ label, name }, i) => (
                                                    <React.Fragment key={label}>
                                                        {i > 0 && <span className="text-slate-300 self-center text-xs">›</span>}
                                                        <div>
                                                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 whitespace-nowrap">{label}</p>
                                                            <p className={`text-xs font-semibold cursor-pointer hover:text-indigo-500 transition-colors whitespace-nowrap ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
                                                                onClick={() => openProfile(name)}>{name}</p>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Amount + Lead Status row */}
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`text-[13px] font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        {client.loanAmount || '—'}
                                    </span>
                                    {(() => {
                                        const ls = client.leadStatus || 'Warm';
                                        const cfg = {
                                            Hot:  { cls: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20', dot: 'bg-red-500' },
                                            Warm: { cls: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20', dot: 'bg-orange-500' },
                                            Cool: { cls: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', dot: 'bg-blue-500' },
                                        }[ls] || { cls: 'bg-slate-50 text-slate-500 border-slate-100', dot: 'bg-slate-400' };
                                        return (
                                            <div className="relative inline-block" onClick={e => e.stopPropagation()}>
                                                <select
                                                    value={ls}
                                                    onChange={e => setLeads(prev => prev.map(l => l.id === client.id ? { ...l, leadStatus: e.target.value } : l))}
                                                    className={`appearance-none pl-5 pr-6 py-1 rounded-full text-[10px] font-semibold border cursor-pointer outline-none ${cfg.cls}`}
                                                >
                                                    <option value="Hot">Hot</option>
                                                    <option value="Warm">Warm</option>
                                                    <option value="Cool">Cool</option>
                                                </select>
                                                <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${cfg.dot}`} />
                                                <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8"><polyline points="6 9 12 15 18 9"/></svg>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Progress bar */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
                                        <span className="text-xs font-bold" style={{ color: stageColor }}>{client.progress ?? 0}%</span>
                                    </div>
                                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${client.progress ?? 0}%`, background: `linear-gradient(90deg, ${stageColor}, ${stageColor}99)` }} />
                                    </div>
                                </div>

                                <button onClick={() => setSelectedClient(client)}
                                    className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                                    style={{ background: `linear-gradient(135deg, ${stageColor}, ${stageColor}cc)` }}>
                                    Review Details
                                </button>
                            </div>
                        );
                    })}
                </div>
                </>
            ) : (
                <div className={`rounded-2xl border shadow-sm overflow-hidden ${card}`}>
                    {/* Table header with search + toggle */}
                    <div className={`px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        <p className="text-xs text-slate-400">{filteredClients.length} records</p>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                            <div className="relative flex-1 max-w-[260px] sm:max-w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></div>
                                <input
                                    type="text"
                                    placeholder="Search lead, agent or TL..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className={`pl-9 pr-4 py-2 rounded-xl text-xs font-medium outline-none border w-full transition-all focus:ring-2 focus:ring-indigo-500/30 ${isDark ? 'bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'}`}
                                />
                            </div>
                            <div className={`flex items-center rounded-xl border p-1 gap-1 shrink-0 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                                {[
                                    { mode: 'grid',  icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></> },
                                    { mode: 'table', icon: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></> },
                                ].map(({ mode, icon }) => (
                                    <button key={mode} onClick={() => setViewMode(mode)}
                                        className={`p-2 rounded-lg transition-all ${viewMode === mode ? (isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900') : 'text-slate-400 hover:text-slate-600'}`}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">{icon}</svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className={isDark ? 'bg-white/[0.02]' : 'bg-slate-50/70'}>
                                    {['Client', 'Business', 'Personnel Flow', 'Stage', 'Lead Status', 'Amount', 'Progress', 'Action'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                {filteredClients.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">No leads match your filters.</td>
                                    </tr>
                                )}
                                {filteredClients.map((client) => {
                                    const stageId = STAGE_TO_OP[client.stage] || 'lead_gather';
                                    const stageColor = getStageColor(stageId);
                                    return (
                                        <tr key={client.id} className={`transition-colors ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-indigo-50/30'}`}>
                                            {/* Client */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0"
                                                        style={{ background: `${stageColor}20`, color: stageColor }}>
                                                        {(client.name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{client.name}</p>
                                                        <p className="text-[10px] text-slate-400">#{client.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Business */}
                                            <td className="px-4 py-3">
                                                {client.businessName ? (
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                                        {client.businessName}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic">Personal</span>
                                                )}
                                            </td>
                                            {/* Personnel Flow */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {(() => {
                                                        const role = client.createdByRole || '';
                                                        const isAdmin = role.toLowerCase().includes('admin');
                                                        const isAM = role.toLowerCase().includes('account');
                                                        const isTL = role.toLowerCase().includes('team') || role.toLowerCase().includes('leader');

                                                        const agent = client.agentName || client.agent;
                                                        const tl = client.tl;
                                                        const am = client.manager || client.accountsManager;

                                                        // Build chain: only show roles that have a value
                                                        const chain = [];
                                                        if (isAdmin) {
                                                            if (agent) chain.push({ name: agent, label: 'Admin' });
                                                        } else if (isAM) {
                                                            if (agent) chain.push({ name: agent, label: 'AM' });
                                                        } else if (isTL) {
                                                            if (agent) chain.push({ name: agent, label: 'TL' });
                                                            if (am)    chain.push({ name: am,    label: 'AM' });
                                                        } else {
                                                            if (agent) chain.push({ name: agent, label: 'Agent' });
                                                            if (tl)    chain.push({ name: tl,    label: 'TL' });
                                                            if (am)    chain.push({ name: am,    label: 'AM' });
                                                        }
                                                        if (chain.length === 0 && agent) chain.push({ name: agent, label: 'Agent' });

                                                        return chain.map((item, i) => (
                                                            <React.Fragment key={item.label}>
                                                                {i > 0 && <ChevronRight />}
                                                                <div>
                                                                    <p className={`text-[11px] font-medium cursor-pointer hover:text-indigo-500 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
                                                                        onClick={() => openProfile(item.name)}>
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="text-[9px] text-slate-400 uppercase tracking-wide">{item.label}</p>
                                                                </div>
                                                            </React.Fragment>
                                                        ));
                                                    })()}
                                                </div>
                                            </td>
                                            {/* Stage */}
                                            <td className="px-4 py-3"><StagePill stageId={stageId} /></td>
                                            {/* Lead Status */}
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                {(() => {
                                                    const ls = client.leadStatus || 'Warm';
                                                    const cfg = {
                                                        Hot:  { cls: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20', dot: 'bg-red-500' },
                                                        Warm: { cls: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20', dot: 'bg-orange-500' },
                                                        Cool: { cls: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', dot: 'bg-blue-500' },
                                                    }[ls] || { cls: 'bg-slate-50 text-slate-500 border-slate-100', dot: 'bg-slate-400' };
                                                    return (
                                                        <div className="relative inline-block">
                                                            <select
                                                                value={ls}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    setLeads(prev => prev.map(l => l.id === client.id ? { ...l, leadStatus: e.target.value } : l));
                                                                }}
                                                                className={`appearance-none pl-5 pr-6 py-1 rounded-full text-[10px] font-semibold border whitespace-nowrap cursor-pointer outline-none hover:opacity-80 transition-opacity ${cfg.cls}`}
                                                            >
                                                                <option value="Hot">Hot</option>
                                                                <option value="Warm">Warm</option>
                                                                <option value="Cool">Cool</option>
                                                            </select>
                                                            <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${cfg.dot}`} />
                                                            <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8">
                                                                <polyline points="6 9 12 15 18 9"/>
                                                            </svg>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            {/* Amount */}
                                            <td className="px-4 py-3">
                                                <span className={`text-[11px] font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                    {client.loanAmount || '—'}
                                                </span>
                                            </td>
                                            {/* Progress */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-20 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                                        <div className="h-full rounded-full"
                                                            style={{ width: `${client.progress ?? 0}%`, background: stageColor }} />
                                                    </div>
                                                    <span className="text-[11px] font-semibold" style={{ color: stageColor }}>
                                                        {client.progress ?? 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Action */}
                                            <td className="px-4 py-3">
                                                <button onClick={() => setSelectedClient(client)}
                                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all hover:shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {filteredClients.length === 0 && viewMode === 'grid' && (
                <div className={`rounded-2xl border-2 border-dashed p-16 text-center ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" className="mx-auto text-slate-300 mb-3">
                        <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No leads found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or stage filter.</p>
                </div>
            )}

            {selectedUser && (
                <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} onUserClick={u => setSelectedUser(u)} />
            )}
        </div>
    );
};

export default OperationalFlow;

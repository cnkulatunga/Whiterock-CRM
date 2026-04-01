import React, { useState, useMemo } from 'react';
import { WORKFLOW_STAGES_LIST, SHARED_INITIAL_USERS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';
import { useTheme } from '../../../context/ThemeContext';
import { IconDocs, IconAlert, IconCheck } from '../../../components/DocumentManagement/Icons';

const STAGES = WORKFLOW_STAGES_LIST.filter(s => s !== 'All Stages');
const PAGE_SIZE = 5;

const STAGE_META = {
  'Document Collection':        { color: '#2447d7', bg: '#eef2ff', icon: '📄' },
  'Document Verification Done': { color: '#f59e0b', bg: '#fffbeb', icon: '✓' },
  'Lender Selection':           { color: '#8b5cf6', bg: '#f5f3ff', icon: '🏦' },
  'Completed':                  { color: '#10b981', bg: '#ecfdf5', icon: '✅' },
  'Rejected':                   { color: '#ef4444', bg: '#fef2f2', icon: '✕' },
};

const AGENT_COLORS = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899','#0ea5e9'];
const agentColorMap = {};
SHARED_INITIAL_USERS.forEach((u, i) => { agentColorMap[u.name] = AGENT_COLORS[i % AGENT_COLORS.length]; });

// Removed StatCard, StageBadge, ProgressBar, AgentAvatar as they are now integrated directly into LeadMonitoring

/* ─── MAIN COMPONENT ─── */
const LeadMonitoring = ({ onViewDetails }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { leads } = useLeads();
    const [search, setSearch] = useState('');
    const [agentFilter, setAgentFilter] = useState('All Agents');
    const [stageFilter, setStageFilter] = useState('All Stages');
    const [page, setPage] = useState(1);

    const agentList = useMemo(() => ['All Agents', ...new Set(leads.map(l => l.agentName).filter(Boolean))], [leads]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return leads.filter(l => {
            const matchSearch = !q || l.name.toLowerCase().includes(q) || l.leadId.toLowerCase().includes(q) || l.businessName?.toLowerCase().includes(q);
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
        <div className={`flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif] ${isDark ? '' : ''}`}>
            {/* ── KPI Tiles (Dashboard Style) ── */}
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1">
                {[
                    { 
                        label: 'Total Leads', 
                        value: stats.total.toString().padStart(2, '0'), 
                        colorClass: 'text-blue-600 dark:text-blue-400',
                        bgClass: 'bg-white dark:bg-[#1c2340]',
                        borderTop: 'border-t-blue-500',
                        iconBg: 'bg-blue-600 shadow-blue-500/30',
                        icon: <IconDocs width="22" height="22" />, 
                    },
                    { 
                        label: 'In Progress', 
                        value: stats.inProgress.toString().padStart(2, '0'), 
                        colorClass: 'text-orange-600 dark:text-orange-400',
                        bgClass: 'bg-white dark:bg-[#2a1f1a]',
                        borderTop: 'border-t-orange-500',
                        iconBg: 'bg-orange-500 shadow-orange-500/30',
                        icon: <div className="animate-spin-slow"><IconAlert width="22" height="22" /></div>, 
                    },
                    { 
                        label: 'Completed', 
                        value: stats.completed.toString().padStart(2, '0'), 
                        colorClass: 'text-emerald-600 dark:text-emerald-400',
                        bgClass: 'bg-white dark:bg-[#182724]',
                        borderTop: 'border-t-emerald-500',
                        iconBg: 'bg-emerald-500 shadow-emerald-500/30',
                        icon: <IconCheck width="22" height="22" strokeWidth={3} />, 
                    },
                    { 
                        label: 'Rejected', 
                        value: stats.rejected.toString().padStart(2, '0'), 
                        colorClass: 'text-rose-600 dark:text-rose-400',
                        bgClass: 'bg-white dark:bg-[#2d1a1d]',
                        borderTop: 'border-t-rose-500',
                        iconBg: 'bg-rose-500 shadow-rose-500/30',
                        icon: <IconAlert width="22" height="22" />, 
                    },
                ].map((card, i) => (
                    <div
                        key={card.label}
                        className={`rounded-2xl border border-[#edf2f7] dark:border-white/5 border-t-4 ${card.borderTop} p-6 flex flex-col justify-center items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-default text-center ${card.bgClass}`}
                    >
                        <div className={`w-12 h-12 rounded-full ${card.iconBg} text-white flex items-center justify-center mb-1 shadow-lg`}>
                            {card.icon}
                        </div>
                        <div className="flex flex-col gap-0">
                            <h2 className={`text-3xl font-black leading-none ${card.colorClass} tracking-tight`}>
                                {card.value}
                            </h2>
                            <span className={`text-[10px] font-black uppercase tracking-[0.15em] mt-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                {card.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filter Bar ── */}
            <div className={`flex items-center justify-between gap-4 p-5 rounded-2xl ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7]'} border shadow-sm`}>
                <div className="flex items-center gap-4 flex-1 md:flex-col md:items-stretch">
                    <div className={`flex items-center gap-3 px-4 py-3 border rounded-xl w-full max-w-md shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 ${isDark ? 'bg-[#141829] border-[#2c3568]' : 'bg-[#f8f9fa] border-slate-100'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#6b7280' : '#a0aec0'} strokeWidth="2.5" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="SEARCH LEADS, ID, BUSINESS..."
                            className={`bg-transparent border-none outline-none text-[13px] w-full font-bold tracking-tight ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-300'}`}
                            value={search}
                            onChange={handleFilterChange(setSearch)}
                        />
                    </div>

                    <div className="flex items-center gap-3 md:grid md:grid-cols-2">
                        <div className="relative min-w-[160px]">
                            <select
                                className={`w-full px-4 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest outline-none hover:border-[#0061ff] focus:border-[#0061ff] transition-all appearance-none cursor-pointer pr-9 shadow-sm ${isDark ? 'bg-[#141829] border-[#2c3568] text-white' : 'bg-[#f8f9fa] border-slate-100 text-slate-700'}`}
                                value={agentFilter}
                                onChange={handleFilterChange(setAgentFilter)}
                            >
                                {agentList.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>

                        <div className="relative min-w-[180px]">
                            <select
                                className={`w-full px-4 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest outline-none hover:border-[#0061ff] focus:border-[#0061ff] transition-all appearance-none cursor-pointer pr-9 shadow-sm ${isDark ? 'bg-[#141829] border-[#2c3568] text-white' : 'bg-[#f8f9fa] border-slate-100 text-slate-700'}`}
                                value={stageFilter}
                                onChange={handleFilterChange(setStageFilter)}
                            >
                                {['All Stages', ...STAGES].map(s => <option key={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Table Container ── */}
            <div className={`rounded-3xl border shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden animate-slideUp ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7]'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`bg-slate-50/50 dark:bg-slate-800/20 border-b ${isDark ? 'border-[#2c3568]' : 'border-slate-100'}`}>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead / Client</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Agent</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Progress</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Stage</th>
                                <th className="px-6 py-5 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {paginated.length > 0 ? paginated.map((lead, i) => (
                                <tr
                                    key={lead.id}
                                    className={`group transition-all duration-200 ${isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/30'}`}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={`text-[10px] font-black font-mono tracking-wider ${isDark ? 'text-blue-400' : 'text-[#0061ff]'}`}>{lead.leadId}</span>
                                            <span className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.name}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        {lead.businessName ? (
                                            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${isDark ? 'bg-[#1a1f35] text-slate-400 border-[#2c3568]' : 'bg-[#f8faff] text-slate-600 border-slate-100'}`}>
                                                {lead.businessName}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-medium italic text-slate-400">Personal Lead</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md`}
                                                style={{ background: agentColorMap[lead.agentName] || '#64748b' }}
                                            >
                                                {lead.agentName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className={`text-[13px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lead.agentName}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex flex-col items-center gap-2 max-w-[140px] mx-auto">
                                            <div className="flex justify-between w-full text-[10px] font-black text-slate-400">
                                                <span>PROGRESS</span>
                                                <span className={isDark ? 'text-blue-400' : 'text-[#0061ff]'}>{lead.progress}%</span>
                                            </div>
                                            <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 shadow-[0_0_8px_rgba(36,71,215,0.3)]"
                                                    style={{ width: `${lead.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        {(() => {
                                            const isRejected = lead.stage === 'Rejected';
                                            const isCompleted = lead.stage === 'Completed';
                                            const isDocsDone = lead.stage === 'Document Verification Done';

                                            let badgeClass = "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800/30";
                                            let icon = <span className="w-1.5 h-1.5 rounded-full bg-current" />;

                                            if (isRejected) {
                                                badgeClass = "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800/30";
                                                icon = <IconAlert size={10} />;
                                            } else if (isCompleted) {
                                                badgeClass = "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30";
                                                icon = <IconCheck size={10} strokeWidth={4} />;
                                            } else if (isDocsDone) {
                                                badgeClass = "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border-orange-100 dark:border-orange-800/30";
                                                icon = <IconCheck size={10} strokeWidth={4} />;
                                            }

                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${badgeClass}`}>
                                                    {icon}
                                                    {lead.stage}
                                                </span>
                                            );
                                        })()}
                                    </td>

                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => onViewDetails?.(lead)}
                                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white' : 'bg-[#0061ff] text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30'}`}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 animate-fadeIn">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-slate-300 ${isDark ? 'bg-[#1a1f35]' : 'bg-slate-50'}`}>
                                                <IconDocs width={32} height={32} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className={`text-[15px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No matching leads</h3>
                                                <p className={`text-[11px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Try adjusting your filters or search search term</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer ── */}
                <div className={`px-6 py-5 border-t flex items-center justify-between md:flex-col md:gap-4 ${isDark ? 'bg-[#141829]/50 border-white/5' : 'bg-[#fcfdfd] border-slate-50'}`}>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        Showing <span className={isDark ? 'text-white' : 'text-slate-900'}>{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className={isDark ? 'text-white' : 'text-slate-900'}>{filtered.length}</span> Records
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${isDark ? 'border-[#2c3568] bg-[#1a1f35] text-slate-400 hover:text-white disabled:opacity-20' : 'border-slate-100 bg-white text-slate-400 hover:text-[#0061ff] disabled:opacity-40'}`}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 rounded-xl text-[11px] font-black transition-all border ${page === i + 1 ? 'bg-[#0061ff] text-white border-[#0061ff] shadow-lg shadow-blue-500/30' : (isDark ? 'border-[#2c3568] bg-[#1a1f35] text-slate-400 hover:border-blue-500' : 'border-slate-100 bg-white text-slate-400 hover:border-blue-500')}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${isDark ? 'border-[#2c3568] bg-[#1a1f35] text-slate-400 hover:text-white disabled:opacity-20' : 'border-slate-100 bg-white text-slate-400 hover:text-[#0061ff] disabled:opacity-40'}`}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadMonitoring;

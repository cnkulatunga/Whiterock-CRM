import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import UserProfileModal from '../../../components/modals/UserProfileModal';
import { useLeads } from '../../../context/LeadsContext';
import { useLenders } from '../../../context/LendersContext';

/* ─── ICONS ─────────────────────────────────── */

/* ─── RECENT ACTIVITY ─────────────────────── */
import { 
    SA_ACTIVITIES as ACTIVITIES,
    SA_STATS,
    SHARED_INITIAL_USERS,
    LEADS_BY_STAGE,
    MOCK_LEADS,
    AM_APPROVED_LOANS,
    QUALIFIED_LENDERS
} from '../../../data/dummyData';

const RecentActivity = () => (
    <div className="flex flex-col divide-y divide-[#f7fafc]">
        {ACTIVITIES.slice(0, 8).map((a, i) => (
            <div key={i} className="flex items-center gap-2 py-2.5 hover:bg-[#f8faff] rounded-lg px-2 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.color }} />
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[#1a202c] leading-tight truncate">{a.label}</span>
                    <span className="text-[10px] text-[#718096] leading-tight truncate">{a.detail}</span>
                </div>
                <span className="text-[9px] font-bold text-[#a0aec0] whitespace-nowrap">{a.time}</span>
            </div>
        ))}
    </div>
);

/* ─── SVG ICONS ─────────────────────────── */
const IconUserGroup = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconFolder = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
const IconClock = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconChevronRight = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><polyline points="9 18 15 12 9 6" /></svg>;
const IconCalculator = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="16" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="16" y2="18" /></svg>;
const IconBulb = (props) => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...props}><path d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z" /></svg>;
const IconSettings = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IconCommercial = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4"/><path d="M5 21V10.85"/><path d="M19 21V10.85"/><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/></svg>;
const IconSecured = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IconUnsecured = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>;
const IconRefinance = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>;


/* ─── DONUT CHART ─────────────────────────── */



/* ─── AGENT PERFORMANCE TABLE ──────────────── */
const AgentPerformanceTable = ({ onUserClick }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-[#edf2f7]">
                        <th className="py-2 px-3 text-[10px] font-semibold text-[#a0aec0] uppercase tracking-wider">User</th>
                        <th className="py-2 px-3 text-[10px] font-semibold text-[#a0aec0] uppercase tracking-wider">Role</th>
                        <th className="py-2 px-3 text-[10px] font-semibold text-[#a0aec0] uppercase tracking-wider text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f7fafc]">
                    {SHARED_INITIAL_USERS.filter(u => u.role !== 'Super Admin').map((user, i) => {
                        return (
                            <tr 
                                key={user.id} 
                                className="hover:bg-[#f8faff] transition-colors group cursor-pointer"
                                onClick={() => onUserClick && onUserClick(user)}
                            >
                                <td className="py-2 px-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white uppercase" style={{ background: user.color }}>
                                            {user.initials}
                                        </div>
                                        <span className="text-[11px] font-medium text-[#1a202c]">{user.name}</span>
                                    </div>
                                </td>
                                <td className="py-2 px-3 text-[10px] font-medium text-[#718096] uppercase tracking-wide italic">{user.role}</td>
                                <td className="py-2 px-3 text-right">
                                    <div className="flex flex-col items-end gap-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#059669]' : 'bg-[#94a3b8]'}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'text-[#059669]' : 'text-[#64748b]'}`}>
                                                {user.status === 'Active' ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-medium text-[#94a3b8] italic -mt-0.5">
                                            {user.status === 'Active' ? 'Active now' : '2h ago'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

/* ─── DOCUMENT HEALTH BREAKDOWN ───────────── */
const DocumentHealthBreakdown = () => {
    // Derived from MOCK_LEADS
    const counts = MOCK_LEADS.reduce((acc, lead) => {
        (lead.documents || []).forEach(doc => {
            acc[doc.status] = (acc[doc.status] || 0) + 1;
        });
        return acc;
    }, { Approved: 0, Pending: 0, Rejected: 0, Missing: 0 });

    const healthItems = [
        { label: 'Approved', count: counts.Approved, color: '#16a34a', bg: '#f0fdf4' },
        { label: 'Pending', count: counts.Pending, color: '#ca8a04', bg: '#fefce8' },
        { label: 'Rejected', count: counts.Rejected, color: '#dc2626', bg: '#fef2f2' },
        { label: 'Missing', count: counts.Missing, color: '#64748b', bg: '#f1f5f9' },
    ];

    return (
        <div className="grid grid-cols-2 gap-2">
            {healthItems.map((item) => (
                <div 
                    key={item.label}
                    className="p-2.5 rounded-lg border border-transparent hover:border-[#e2e8f0] transition-all cursor-pointer group"
                    style={{ background: item.bg }}
                    onClick={() => console.log(`Drilling into ${item.label} leads...`)}
                >
                    <div className="text-[9px] font-bold text-[#718096] uppercase tracking-widest mb-0.5">{item.label}</div>
                    <div className="flex justify-between items-end">
                        <div className="text-base font-bold" style={{ color: item.color }}>{item.count}</div>
                        <div className="text-[8px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.color }}>View →</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ─── PIE CHART ────────────────────────────── */
const PieChart = ({ data }) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setAnimated(true), 80);
        return () => clearTimeout(t);
    }, []);

    // Build donut segments using stroke-dasharray on circles
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercent = 0;

    return (
        <div className="relative w-28 h-28 mx-auto my-2">
            <svg viewBox="0 0 36 36" className="-rotate-90">
                {/* Track */}
                <circle cx="18" cy="18" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                {data.map((slice, i) => {
                    const offset = circumference * (1 - cumulativePercent);
                    const dash = (slice.share / 100) * circumference;
                    const gap = circumference - dash;
                    const startOffset = offset;
                    cumulativePercent += slice.share / 100;
                    return (
                        <circle
                            key={i}
                            cx="18" cy="18" r={radius}
                            fill="none"
                            stroke={slice.color}
                            strokeWidth="3.5"
                            strokeDasharray={animated ? `${dash} ${gap}` : `0 ${circumference}`}
                            strokeDashoffset={startOffset}
                            strokeLinecap="butt"
                            style={{
                                transition: `stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`,
                                filter: `drop-shadow(0 0 3px ${slice.color}60)`,
                            }}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                <span className="text-[10px] font-black text-slate-800 leading-none">Global</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Mix</span>
            </div>
        </div>
    );
};

/* ─── LENDING CATEGORIES SUMMARY ───────────── */
const LendingCategoriesSummary = () => {
    const { lenders } = useLenders();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { id: 'commercial', label: 'Commercial', share: 45, color: '#6366f1', icon: <IconCommercial /> },
        { id: 'secured', label: 'Secured', share: 25, color: '#10b981', icon: <IconSecured /> },
        { id: 'refinance', label: 'Refinance', share: 20, color: '#f59e0b', icon: <IconRefinance /> },
        { id: 'unsecured', label: 'Unsecured', share: 10, color: '#ef4444', icon: <IconUnsecured /> },
    ];

    // Filter lenders based on selected category (commercial, secured, etc are boolean flags)
    const filteredLenders = selectedCategory 
        ? lenders.filter(l => l[selectedCategory.id])
        : [];

    if (selectedCategory) {
        return (
            <div className="flex flex-col h-full animate-fadeIn">
                <div className="flex items-center gap-2 mb-4">
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14" className="rotate-180"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px]" style={{ backgroundColor: selectedCategory.color + '20', color: selectedCategory.color }}>
                            {selectedCategory.icon}
                        </div>
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{selectedCategory.label} Lenders</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 flex-1 pr-1">
                    {filteredLenders.length > 0 ? filteredLenders.map((lender, i) => (
                        <div key={i} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all flex justify-between items-center group">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-slate-700">{lender.name}</span>
                                <span className="text-[9px] text-[#2447d7] font-semibold">{lender.interestRate || 'Competitive'}</span>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full ${lender.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                    )) : (
                        <div className="py-10 text-center">
                            <span className="text-[10px] font-bold text-slate-400">No lenders found in this category</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5 h-full">
            <PieChart data={categories} />
            
            <div className="flex flex-col gap-2">
                {categories.map((cat) => {
                    const count = lenders.filter(l => l[cat.id]).length;
                    return (
                        <div key={cat.id} 
                             onClick={() => setSelectedCategory(cat)}
                             className="flex flex-col gap-1 group cursor-pointer">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300" 
                                         style={{ backgroundColor: cat.color + '15', color: cat.color }}>
                                        {React.cloneElement(cat.icon, { width: 13, height: 13 })}
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{cat.label}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-slate-800 leading-none">{cat.share}%</span>
                                    <span className="text-[8px] font-bold text-slate-400 tracking-wider mt-0.5">{count} PARTNERS</span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ 
                                        width: `${cat.share}%`, 
                                        backgroundColor: cat.color,
                                        boxShadow: `0 0 8px ${cat.color}30`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center px-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Active Portfolio</span>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">$42.5M</span>
            </div>
        </div>
    );
};


/* ─── LEAD PIPELINE FUNNEL ────────────────── */


/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const SuperAdminDashboard = ({ onNavigate }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.first_name || 'Admin';
    const [selectedUser, setSelectedUser] = useState(null);
    const { leads } = useLeads();

    // Re-use logic for doc counts for top tiles
    const docCounts = leads.reduce((acc, lead) => {
        (lead.documents || []).forEach(doc => {
            acc[doc.status] = (acc[doc.status] || 0) + 1;
        });
        return acc;
    }, { Approved: 0, Pending: 0, Rejected: 0 });

    return (
        <div className="w-full flex flex-col font-['Sora',sans-serif] animate-fadeIn p-3 gap-4">

            {/* ── ROW 1: STAT TILES ── */}
            <div className="grid grid-cols-6 sm:grid-cols-3 gap-3 w-full">

                {/* 1. Active Leads */}
                <div className="bg-blue-100/40 rounded-2xl border border-blue-200 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-transform text-center">
                    <div className="w-10 h-10 rounded-full bg-[#2447d7] text-white flex items-center justify-center mb-0.5 shadow-md shadow-[#2447d7]/20"><IconUserGroup width="20" height="20" /></div>
                    <h2 className="text-2xl font-black leading-none text-[#1e3a8a]">{SA_STATS.totalLeads}</h2>
                    <span className="text-[9px] font-bold text-[#4b5681] uppercase tracking-widest">Active Leads</span>
                </div>

                {/* 2. Revenue */}
                <div className="bg-orange-100/40 rounded-2xl border border-orange-200 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-transform text-center">
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center mb-0.5 shadow-md shadow-orange-500/20"><IconCalculator width="20" height="20" /></div>
                    <h2 className="text-[13px] font-black leading-tight text-orange-700">{SA_STATS.monthlyRevenue}</h2>
                    <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Revenue</span>
                </div>

                {/* 3. Approved */}
                <div className="bg-emerald-100/40 rounded-2xl border border-emerald-200 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-transform text-center group">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-0.5 shadow-md shadow-emerald-500/20 group-hover:bg-emerald-600">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h2 className="text-2xl font-black leading-none text-emerald-700">{docCounts.Approved}</h2>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Approved</span>
                </div>

                {/* 4. Pending */}
                <div className="bg-amber-100/40 rounded-2xl border border-amber-200 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-transform text-center group">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center mb-0.5 shadow-md shadow-amber-500/20 group-hover:bg-amber-600">
                        <IconFolder width="18" height="18" />
                    </div>
                    <h2 className="text-2xl font-black leading-none text-amber-700">{docCounts.Pending}</h2>
                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Pending</span>
                </div>

                {/* 5. Rejected */}
                <div className="bg-rose-100/40 rounded-2xl border border-rose-200 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-transform text-center group">
                    <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mb-0.5 shadow-md shadow-rose-600/20 group-hover:bg-rose-700">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <h2 className="text-2xl font-black leading-none text-rose-700">{docCounts.Rejected}</h2>
                    <span className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">Rejected</span>
                </div>

                {/* 6. AI Analytics */}
                <div className="bg-purple-100/30 rounded-2xl border border-purple-200 p-3 flex flex-col justify-center items-center gap-1.5 shadow-sm text-center relative overflow-hidden group hover:bg-purple-100/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center mb-1 shadow-md shadow-purple-500/30 relative z-10 group-hover:scale-110 transition-transform duration-500"><IconBulb width="20" height="20" /></div>
                    <h2 className="text-[11px] font-black leading-tight text-purple-700 relative z-10 uppercase tracking-tight italic">AI<br/>Analytics</h2>
                    <span className="absolute top-1.5 right-1.5 text-[7px] font-black bg-purple-200 text-purple-700 px-1 py-0.5 rounded tracking-widest z-10 scale-90">BETA</span>
                </div>
            </div>

            {/* ── ROW 2: MAIN CARDS ── */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 w-full">

                {/* 1. LENDING CATEGORIES */}
                <div className="flex flex-col bg-white rounded-[24px] border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                    <div className="bg-slate-50/50 border-b border-slate-100/60 p-3 px-5 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.12em]">Lending Categories</h2>
                        </div>
                        <span className="text-[8px] bg-blue-100/50 font-bold px-2 py-0.5 rounded-full text-blue-600 uppercase tracking-wider">Portfolio</span>
                    </div>
                    <div className="p-5">
                        <LendingCategoriesSummary />
                    </div>
                </div>

                {/* 2. RECENT ACTIVITY */}
                <div className="flex flex-col bg-white rounded-[24px] border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                    <div className="bg-slate-50/50 border-b border-slate-100/60 p-3 px-5 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.15em]">Recent Activity</h2>
                        </div>
                        <span className="text-[8px] bg-emerald-100/50 font-bold px-2 py-0.5 rounded-full text-emerald-600 uppercase tracking-wider">Live Feed</span>
                    </div>
                    <div className="p-4">
                        <RecentActivity />
                    </div>
                </div>

                {/* 3. USER TRACKING */}
                <div className="flex flex-col bg-white rounded-[24px] border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                    <div className="bg-slate-50/50 border-b border-slate-100/60 p-3 px-5 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                            <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.15em]">User Tracking</h2>
                        </div>
                        <button className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors">Full Report</button>
                    </div>
                    <div className="p-1">
                        <AgentPerformanceTable onUserClick={setSelectedUser} />
                    </div>
                </div>

            </div>

            {selectedUser && (
                <UserProfileModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                />
            )}
        </div>
    );
};

export default SuperAdminDashboard;

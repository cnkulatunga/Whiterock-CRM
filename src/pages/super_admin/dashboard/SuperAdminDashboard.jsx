import React from 'react';
import ReactDOM from 'react-dom';

/* ─── SVG ICONS ───────────────────────────── */
const IcoDownload = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const IcoBell = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IcoTrendUp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    </svg>
);

const IcoTrendDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    </svg>
);

/* ─── KPI CARD ────────────────────────────── */
const KpiCard = ({ icon, iconBg, label, value, trend, trendLabel }) => (
    <div className="bg-white rounded-3xl border border-[#edf2f7] p-6 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
        <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-[#2447d7] group-hover:text-white`} style={{ background: iconBg }}>
                {React.cloneElement(icon, { className: 'group-hover:stroke-white' })}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                trend === 'up' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 
                trend === 'down' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]' : 
                'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
            }`}>
                {trend === 'up' && <IcoTrendUp />}
                {trend === 'down' && <IcoTrendDown />}
                <span>{trendLabel}</span>
            </div>
        </div>
        <div className="text-[11px] font-black text-[#a0aec0] uppercase tracking-[0.1em] mb-1.5">{label}</div>
        <div className="text-3xl font-black text-[#1a202c] tracking-tight">{value}</div>
    </div>
);


/* ─── RECENT ACTIVITY ─────────────────────── */
const ACTIVITIES = [
    { type: 'approval', color: '#16a34a', bg: '#dcfce7', label: 'Loan Approved', detail: 'Ref #4821 — $42,000', time: '2m ago' },
    { type: 'lead', color: '#2447d7', bg: '#eef2ff', label: 'New Lead Submitted', detail: 'by Agent Sarah Miller', time: '8m ago' },
    { type: 'doc', color: '#0ea5e9', bg: '#e0f2fe', label: 'Document Uploaded', detail: 'KYC — John M.', time: '15m ago' },
    { type: 'reject', color: '#dc2626', bg: '#fee2e2', label: 'Loan Rejected', detail: 'Ref #4819 — insufficient docs', time: '34m ago' },
    { type: 'user', color: '#7c3aed', bg: '#f3e8ff', label: 'New User Registered', detail: 'Agent — Emily Tan', time: '1h ago' },
    { type: 'deal', color: '#16a34a', bg: '#dcfce7', label: 'Deal Closed', detail: '$28,500 — Priya Nair', time: '2h ago' },
];
const RecentActivity = () => (
    <div className="flex flex-col gap-2">
        {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f8faff] transition-all duration-200 group">
                <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-transform duration-300 group-hover:rotate-12"
                    style={{ background: a.bg, borderColor: `${a.color}20` }}
                >
                    <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                </div>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-[14px] font-bold text-[#1a202c] leading-tight truncate">{a.label}</span>
                    <span className="text-[12px] font-medium text-[#718096] truncate">{a.detail}</span>
                </div>
                <span className="text-[11px] font-black text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">{a.time}</span>
            </div>
        ))}
    </div>
);

/* ─── DONUT CHART — DEAL STATUS ───────────── */
const DONUT_DATA = [
    { label: 'Active Deals', value: 452, color: '#2447d7' },
    { label: 'Approved', value: 318, color: '#16a34a' },
    { label: 'Pending Loans', value: 124, color: '#f59e0b' },
    { label: 'Rejected', value: 84, color: '#dc2626' },
];
const DonutChart = () => {
    const total = DONUT_DATA.reduce((s, d) => s + d.value, 0);
    const r = 54, cx = 70, cy = 70;
    const C = 2 * Math.PI * r;
    let offset = C / 4;
    const segments = DONUT_DATA.map(d => {
        const len = (d.value / total) * C;
        const seg = { ...d, dasharray: `${len} ${C}`, dashoffset: offset, pct: Math.round((d.value / total) * 100) };
        offset -= len;
        return seg;
    });
    return (
        <div className="flex flex-col items-center gap-10">
            <div className="relative w-48 h-48 group">
                <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90 transition-transform duration-700 group-hover:rotate-12">
                    {segments.map(s => (
                        <circle key={s.label} cx={cx} cy={cy} r={r}
                            fill="none" stroke={s.color} strokeWidth="16"
                            strokeDasharray={s.dasharray}
                            strokeDashoffset={s.dashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out shadow-sm"
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-8 shadow-inner border border-[#edf2f7]">
                    <span className="text-2xl font-black text-[#1a202c] tracking-tighter leading-none">{total.toLocaleString()}</span>
                    <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest mt-1">Total Deals</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
                {segments.map(s => (
                    <div key={s.label} className="flex flex-col gap-2 p-4 bg-[#f8fafc] rounded-2xl border border-[#f1f5f9] hover:bg-white hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-tight">{s.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-[#1a202c]">{s.pct}%</span>
                            <span className="text-[11px] font-bold text-[#cbd5e0]">{s.value.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── QUICK ACTION ────────────────────────── */
const QuickAction = ({ icon, iconBg, title, desc, onClick }) => (
    <button className="flex items-center gap-5 p-5 bg-[#f8fafc] rounded-3xl border border-[#f1f5f9] hover:bg-white hover:border-[#2447d7]/20 hover:shadow-xl hover:translate-y-[-2px] transition-all group flex-1 min-w-[280px]" onClick={onClick}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white/50 group-hover:scale-110 transition-transform duration-300" style={{ background: iconBg }}>
            {React.cloneElement(icon, { strokeWidth: 2.5 })}
        </div>
        <div className="flex flex-col items-start gap-1">
            <span className="text-[15px] font-black text-[#1a202c] tracking-tight">{title}</span>
            <span className="text-[12px] font-medium text-[#718096] leading-tight text-left">{desc}</span>
        </div>
    </button>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const SuperAdminDashboard = ({ onNavigate }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.first_name || 'Alex';

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">

            {/* ── MOBILE HEADER PORTAL ── */}
            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="flex items-center gap-4">
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            <div className="flex flex-col gap-8">

                {/* ── PAGE HEADING ── */}
                <header className="mb-4">
                    <h1 className="text-[1.75rem] font-black text-[#1a202c] tracking-tight sm:text-2xl mb-1.5">Super Admin Overview</h1>
                    <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Welcome back, <span className="text-[#2447d7] font-bold">{firstName}</span>. Here's what's happening today.</p>
                </header>

                {/* ── TOP ROW: LEADS + REVENUE + VERIFICATION ── */}
                <div className="grid grid-cols-3 gap-6 lg:grid-cols-1">
                    <KpiCard
                        iconBg="#eef2ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
                        label="Total Leads" value="12,840" trend="up" trendLabel="+12%"
                    />

                    <div className="bg-gradient-to-br from-[#2447d7] to-[#1732a3] rounded-3xl p-8 relative overflow-hidden shadow-2xl hover:translate-y-[-4px] transition-all duration-300 group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="120" height="120">
                                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div className="relative z-10 flex flex-col h-full bg-white/5 backdrop-blur-3xl rounded-2xl p-6 border border-white/10">
                            <span className="text-[11px] font-black text-white/60 uppercase tracking-widest mb-1.5">Monthly Revenue</span>
                            <span className="text-4xl font-black text-white tracking-tighter mb-auto">$2.4M</span>
                            <div className="flex items-center gap-2 mt-6 text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-xl border border-[#10b981]/20 w-fit">
                                <IcoTrendUp />
                                <span className="text-[11px] font-black uppercase tracking-wider">18% Increase vs. Last Month</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#edf2f7] p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-14 h-14 bg-[#f0f9ff] text-[#0ea5e9] rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-[#0ea5e9] group-hover:text-white transition-all">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="text-[11px] font-black text-[#a0aec0] uppercase tracking-widest leading-none">Document Verification</div>
                                <div className="text-3xl font-black text-[#1a202c]">45 <span className="text-sm font-bold text-[#cbd5e0]">pending</span></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] rounded-full transition-all duration-[1500ms]" style={{ width: '30%' }} />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#fdf2f2] border border-[#fee2e2] rounded-xl text-[#991b1b] text-[10px] font-black uppercase tracking-wider animate-pulse">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                Priority 1 Approval Required
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ROW 3: QUICK ACTIONS ── */}
                <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] p-8 shadow-sm">
                    <h3 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em] mb-8 px-2 border-l-4 border-[#2447d7]">Quick Actions</h3>
                    <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar lg:flex-col lg:overflow-visible">
                        <QuickAction
                            iconBg="#eef2ff"
                            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                            title="Manage Leaders" desc="Review team leader performance"
                            onClick={() => onNavigate && onNavigate('team-leaders')}
                        />
                        <QuickAction
                            iconBg="#f3e8ff"
                            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>}
                            title="Finance Report" desc="Access revenue & transactions"
                            onClick={() => onNavigate && onNavigate('finance')}
                        />
                        <QuickAction
                            iconBg="#e0f2fe"
                            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                            title="Manage Users" desc="Update permissions & access"
                            onClick={() => onNavigate && onNavigate('user-management')}
                        />
                    </div>
                </section>

                {/* ── ROW 4: ACTIVITY + DEAL STATUS ── */}
                <div className="grid grid-cols-[1fr_400px] gap-8 xl:grid-cols-1">
                    <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] p-8 shadow-sm h-fit">
                        <h3 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em] mb-8 px-2 border-l-4 border-[#10b981]">Recent Activity</h3>
                        <RecentActivity />
                    </section>

                    <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] p-8 shadow-sm">
                        <h3 className="text-[13px] font-black text-[#1a202c] uppercase tracking-[0.2em] mb-8 px-2 border-l-4 border-[#f59e0b]">Deal Status Overview</h3>
                        <DonutChart />
                    </section>
                </div>

            </div>
        </div>
    );
};

export default SuperAdminDashboard;

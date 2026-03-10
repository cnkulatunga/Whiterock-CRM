/* ─── ICONS ─────────────────────────────────── */
const IcoTrendUp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    </svg>
);
const IcoTrendDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    </svg>
);

/* ─── KPI CARD ────────────────────────────── */
const KpiCard = ({ icon, iconBg, label, value, trend, trendLabel }) => (
    <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
                {icon}
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                trend === 'up' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' :
                trend === 'down' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]' :
                'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
            }`}>
                {trend === 'up' && <IcoTrendUp />}
                {trend === 'down' && <IcoTrendDown />}
                <span>{trendLabel}</span>
            </div>
        </div>
        <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-bold text-[#1a202c]">{value}</div>
    </div>
);

/* ─── RECENT ACTIVITY ─────────────────────── */
const ACTIVITIES = [
    { color: '#16a34a', label: 'Loan Approved',       detail: 'Ref #4821 — $42,000',           time: '2m ago' },
    { color: '#2447d7', label: 'New Lead Submitted',  detail: 'by Agent Sarah Miller',          time: '8m ago' },
    { color: '#0ea5e9', label: 'Document Uploaded',   detail: 'KYC — John M.',                  time: '15m ago' },
    { color: '#dc2626', label: 'Loan Rejected',       detail: 'Ref #4819 — insufficient docs',  time: '34m ago' },
    { color: '#7c3aed', label: 'New User Registered', detail: 'Agent — Emily Tan',              time: '1h ago' },
    { color: '#16a34a', label: 'Deal Closed',         detail: '$28,500 — Priya Nair',           time: '2h ago' },
];

const RecentActivity = () => (
    <div className="flex flex-col divide-y divide-[#f7fafc]">
        {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-3 hover:bg-[#f8faff] rounded-lg px-2 transition-colors">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-[#1a202c]">{a.label}</span>
                    <span className="text-[12px] text-[#718096]">{a.detail}</span>
                </div>
                <span className="text-[11px] text-[#a0aec0] whitespace-nowrap">{a.time}</span>
            </div>
        ))}
    </div>
);

/* ─── DONUT CHART ─────────────────────────── */
const DONUT_DATA = [
    { label: 'Active Deals',  pct: 46, color: '#2447d7' },
    { label: 'Approved',      pct: 33, color: '#16a34a' },
    { label: 'Pending Loans', pct: 13, color: '#f59e0b' },
    { label: 'Rejected',      pct: 8,  color: '#dc2626' },
];

const DonutChart = () => {
    const r = 52, cx = 64, cy = 64, C = 2 * Math.PI * r;
    let cumPct = 0;
    return (
        <div className="flex flex-col items-center gap-5">
            <div className="relative w-[130px] h-[130px]">
                <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
                    {DONUT_DATA.map(d => {
                        const dash = (d.pct / 100) * C;
                        const rot = -90 + (cumPct / 100) * 360;
                        cumPct += d.pct;
                        return (
                            <circle key={d.label} cx={cx} cy={cy} r={r}
                                fill="none" stroke={d.color} strokeWidth="14"
                                strokeDasharray={`${dash} ${C}`} strokeDashoffset="0"
                                transform={`rotate(${rot} ${cx} ${cy})`}
                                strokeLinecap="round"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-[#1a202c]">978</span>
                    <span className="text-[9px] font-semibold text-[#a0aec0] uppercase tracking-wider">Total Deals</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
                {DONUT_DATA.map(d => (
                    <div key={d.label} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <div>
                            <div className="text-[11px] text-[#718096]">{d.label}</div>
                            <div className="text-[12px] font-semibold text-[#1a202c]">{d.pct}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── QUICK ACTION ────────────────────────── */
const QuickAction = ({ icon, iconBg, title, desc, onClick }) => (
    <button
        className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] hover:bg-white hover:border-[#e2e8f0] hover:shadow-sm transition-all text-left flex-1 min-w-[200px]"
        onClick={onClick}
    >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
            {icon}
        </div>
        <div>
            <div className="text-[14px] font-semibold text-[#1a202c]">{title}</div>
            <div className="text-[12px] text-[#718096]">{desc}</div>
        </div>
    </button>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const SuperAdminDashboard = ({ onNavigate }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.first_name || 'Admin';

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── PAGE HEADING ── */}
            <header>
                <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">Super Admin Overview</h1>
                <p className="text-sm text-[#718096]">Welcome back, {firstName}. Here's what's happening today.</p>
            </header>

            {/* ── TOP ROW: KPI CARDS ── */}
            <div className="grid grid-cols-3 gap-5 lg:grid-cols-1">
                <KpiCard
                    iconBg="#eef2ff"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
                    label="Total Leads" value="12,840" trend="up" trendLabel="+12%"
                />

                {/* Monthly Revenue card */}
                <div className="bg-gradient-to-br from-[#2447d7] to-[#1a38b8] rounded-2xl p-6 relative overflow-hidden shadow-sm">
                    <div className="absolute -right-2 -top-2 opacity-10">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" width="90" height="90">
                            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <div className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-2">Monthly Revenue</div>
                        <div className="text-3xl font-bold text-white mb-4">$2.4M</div>
                        <div className="flex items-center gap-1.5 bg-[#10b981]/20 text-[#6ee7b7] px-2.5 py-1 rounded-lg w-fit">
                            <IcoTrendUp />
                            <span className="text-[11px] font-medium">18% Increase vs. Last Month</span>
                        </div>
                    </div>
                </div>

                {/* Document Pending */}
                <div className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#f0f9ff] rounded-xl flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">Document Pending Verification</div>
                            <div className="text-2xl font-bold text-[#1a202c]">45</div>
                        </div>
                    </div>
                    <div className="h-1.5 bg-[#f1f5f9] rounded-full mb-3 overflow-hidden">
                        <div className="h-full w-[30%] bg-[#0ea5e9] rounded-full" />
                    </div>
                    <div className="text-[11px] text-[#718096]">Needs executive approval (Priority 1)</div>
                </div>
            </div>

            {/* ── QUICK ACTIONS ── */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm">
                <h3 className="text-[13px] font-semibold text-[#1a202c] mb-4">Quick Actions</h3>
                <div className="flex gap-4 flex-wrap">
                    <QuickAction
                        iconBg="#eef2ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                        title="Manage Leaders" desc="Review team leader performance"
                        onClick={() => onNavigate && onNavigate('team-leaders')}
                    />
                    <QuickAction
                        iconBg="#f3e8ff"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                        title="Finance Report" desc="Access revenue & transactions"
                        onClick={() => onNavigate && onNavigate('finance')}
                    />
                    <QuickAction
                        iconBg="#e0f2fe"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                        title="Manage Users" desc="Update permissions & access"
                        onClick={() => onNavigate && onNavigate('user-management')}
                    />
                </div>
            </section>

            {/* ── BOTTOM: ACTIVITY + DEAL STATUS ── */}
            <div className="grid grid-cols-[1fr_320px] gap-5 xl:grid-cols-1">
                <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm">
                    <h3 className="text-[13px] font-semibold text-[#1a202c] mb-2">Recent Activity</h3>
                    <RecentActivity />
                </section>
                <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-sm">
                    <h3 className="text-[13px] font-semibold text-[#1a202c] mb-4">Deal Status Overview</h3>
                    <DonutChart />
                </section>
            </div>

        </div>
    );
};

export default SuperAdminDashboard;

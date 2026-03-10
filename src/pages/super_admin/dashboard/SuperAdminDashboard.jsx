import ReactDOM from 'react-dom';
import './SuperAdminDashboard.css';


/* ─── SVG ICONS ───────────────────────────── */
const IcoDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IcoBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IcoTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
  </svg>
);

const IcoTrendDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
  </svg>
);

/* ─── KPI CARD ────────────────────────────── */
const KpiCard = ({ icon, iconBg, label, value, trend, trendLabel }) => (
  <div className="sa-kpi-card">
    <div className="sa-kpi-top">
      <div className="sa-kpi-icon" style={{ background: iconBg }}>{icon}</div>
      <div className={`sa-kpi-badge ${trend === 'up' ? 'badge--up' : trend === 'down' ? 'badge--down' : 'badge--flat'}`}>
        {trend === 'up' && <IcoTrendUp />}
        {trend === 'down' && <IcoTrendDown />}
        <span>{trendLabel}</span>
      </div>
    </div>
    <div className="sa-kpi-label">{label}</div>
    <div className="sa-kpi-value">{value}</div>
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
  <div className="sa-activity-rows">
    {ACTIVITIES.map((a, i) => (
      <div key={i} className="sa-activity-row">
        <span className="sa-activity-dot" style={{ background: a.bg, border: `1.5px solid ${a.color}30` }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, display: 'block' }} />
        </span>
        <div className="sa-activity-text">
          <span className="sa-activity-label">{a.label}</span>
          <span className="sa-activity-detail">{a.detail}</span>
        </div>
        <span className="sa-activity-time">{a.time}</span>
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
    <div className="sa-donut-wrap">
      <svg viewBox="0 0 140 140" className="sa-donut-svg">
        {segments.map(s => (
          <circle key={s.label} cx={cx} cy={cy} r={r}
            fill="none" stroke={s.color} strokeWidth="18"
            strokeDasharray={s.dasharray}
            strokeDashoffset={s.dashoffset}
            strokeLinecap="butt"
          />
        ))}
        <text x="70" y="64" textAnchor="middle" fontSize="17" fontWeight="800" fill="#0f172a" fontFamily="Sora,sans-serif">{total.toLocaleString()}</text>
        <text x="70" y="79" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="Sora,sans-serif">Total Deals</text>
      </svg>
      <div className="sa-donut-legend">
        {segments.map(s => (
          <div key={s.label} className="sa-donut-leg-item">
            <span className="sa-donut-dot" style={{ background: s.color }} />
            <span className="sa-donut-leg-label">{s.label}</span>
            <span className="sa-donut-leg-pct">{s.pct}%</span>
            <span className="sa-donut-leg-val">{s.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── QUICK ACTION ────────────────────────── */
const QuickAction = ({ icon, iconBg, title, desc, onClick }) => (
  <button className="sa-qa-item" onClick={onClick}>
    <div className="sa-qa-icon" style={{ background: iconBg }}>{icon}</div>
    <div className="sa-qa-text">
      <span className="sa-qa-title">{title}</span>
      <span className="sa-qa-desc">{desc}</span>
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
    <div className="sa-dashboard">

      {/* ── MOBILE HEADER PORTAL ── */}
      {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
        <div className="sa-mobile-header-actions">
        </div>,
        document.getElementById('mobile-header-portal')
      )}

      {/* ── TOPBAR ── */}
      <header className="sa-topbar">
        <div className="sa-topbar-right">
        </div>
      </header>

      <div className="sa-content">

        {/* ── PAGE HEADING ── */}
        <div className="sa-heading-row">
          <div>
            <h1 className="sa-title">Super Admin Overview</h1>
            <p className="sa-subtitle">Welcome back, {firstName}. Here's what's happening today.</p>
          </div>
        </div>

        {/* ── TOP ROW: LEADS + REVENUE + VERIFICATION ── */}
        <div className="sa-top-row">
          <KpiCard
            iconBg="#eef2ff"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
            label="Total Leads" value="12,840" trend="up" trendLabel="+12%"
          />

          <div className="sa-revenue-card">
            <div className="sa-revenue-bg-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="90" height="90">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="sa-revenue-inner">
              <span className="sa-revenue-label">Monthly Revenue</span>
              <span className="sa-revenue-value">$2.4M</span>
              <div className="sa-revenue-trend">
                <IcoTrendUp />
                <span>18% Increase vs. Last Month</span>
              </div>
            </div>
          </div>

          <div className="sa-mini-card">
            <div className="sa-mini-top">
              <div className="sa-mini-icon sa-mini-icon--sky">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div>
                <div className="sa-mini-label">Document Pending Verification</div>
                <div className="sa-mini-value">45</div>
              </div>
            </div>
            <div className="sa-mini-track"><div className="sa-mini-fill sa-mini-fill--sky" style={{ width: '30%' }} /></div>
            <div className="sa-mini-sub">Needs executive approval (Priority 1)</div>
          </div>
        </div>

        {/* ── ROW 3: QUICK ACTIONS ── */}
        <div className="sa-row3">
          <div className="sa-qa-card">
            <h3 className="sa-section-title">Quick Actions</h3>
            <div className="sa-qa-actions-row">
              <QuickAction
                iconBg="#eef2ff"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                title="Manage Leaders" desc="Review team leader performance"
                onClick={() => onNavigate && onNavigate('team-leaders')}
              />
              <QuickAction
                iconBg="#f3e8ff"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>}
                title="Finance Report" desc="Access revenue & transactions"
                onClick={() => onNavigate && onNavigate('finance')}
              />
              <QuickAction
                iconBg="#e0f2fe"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                title="Manage Users" desc="Update permissions & access"
                onClick={() => onNavigate && onNavigate('user-management')}
              />
            </div>
          </div>
        </div>

        {/* ── ROW 4: TARGETS + ALERTS + DEAL STATUS ── */}
        <div className="sa-row4">
          <div className="sa-panel">
            <h3 className="sa-section-title">Recent Activity</h3>
            <RecentActivity />
          </div>

          <div className="sa-panel">
            <h3 className="sa-section-title">Deal Status Overview</h3>
            <DonutChart />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;

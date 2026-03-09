
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

const IcoSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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


/* ─── FUNNEL ROW ──────────────────────────── */
const FunnelRow = ({ label, value, max, color }) => (
  <div className="sa-funnel-row">
    <div className="sa-funnel-top">
      <span className="sa-funnel-label">{label}</span>
      <span className="sa-funnel-val">{value.toLocaleString()}</span>
    </div>
    <div className="sa-funnel-track">
      <div className="sa-funnel-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  </div>
);

/* ─── PERFORMER ROW ───────────────────────── */
const PerformerRow = ({ name, amount, initials, bg }) => (
  <div className="sa-perf-row">
    <div className="sa-perf-avatar" style={{ background: bg }}>{initials}</div>
    <span className="sa-perf-name">{name}</span>
    <span className="sa-perf-amount">{amount}</span>
  </div>
);

/* ─── HEALTH ROW ──────────────────────────── */
const HealthRow = ({ icon, label, badge, value, barPct, barColor }) => (
  <div className="sa-health-row">
    <div className="sa-health-left">
      {icon}
      <span className="sa-health-label">{label}</span>
    </div>
    {badge
      ? <span className="sa-health-badge">{badge}</span>
      : (
        <div className="sa-health-right">
          <span className="sa-health-val">{value}</span>
          <div className="sa-health-track">
            <div className="sa-health-fill" style={{ width: `${barPct}%`, background: barColor }} />
          </div>
        </div>
      )
    }
  </div>
);

/* ─── QUICK ACTION ────────────────────────── */
const QuickAction = ({ icon, iconBg, title, desc }) => (
  <button className="sa-qa-item">
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
const SuperAdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const firstName = user.first_name || 'Alex';

  return (
    <div className="sa-dashboard">

      {/* ── TOPBAR ── */}
      <header className="sa-topbar">
        <div className="sa-heading">
          <h1>Executive Dashboard</h1>
          <p>Welcome back, {firstName}. Here's what's happening today.</p>
        </div>
        <div className="sa-topbar-right">
          <div className="sa-search">
            <IcoSearch />
            <input placeholder="Search data, deals, users..." />
          </div>
          <button className="sa-icon-btn"><IcoBell /></button>
          <button className="sa-export-btn"><IcoDownload /> Export PDF</button>
        </div>
      </header>

      <div className="sa-content">

        {/* ── ROW 1: KPI CARDS ── */}
        <div className="sa-kpi-grid">
          <KpiCard
            iconBg="#eef2ff"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
            label="Total Leads" value="12,840" trend="up" trendLabel="+12%"
          />
          <KpiCard
            iconBg="#f3e8ff"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
            label="Active Deals" value="452" trend="up" trendLabel="+5%"
          />
          <KpiCard
            iconBg="#dcfce7"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
            label="Approved Deals" value="318" trend="flat" trendLabel="Stable –"
          />
          <KpiCard
            iconBg="#fee2e2"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>}
            label="Rejected Deals" value="84" trend="down" trendLabel="-2%"
          />
        </div>

        {/* ── ROW 2: REVENUE + PENDING + VERIFICATION ── */}
        <div className="sa-row2">
          <div className="sa-revenue-card">
            <div className="sa-revenue-bg-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="90" height="90">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
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
              <div className="sa-mini-icon sa-mini-icon--amber">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <div className="sa-mini-label">Pending Payments</div>
                <div className="sa-mini-value">124</div>
              </div>
            </div>
            <div className="sa-mini-track"><div className="sa-mini-fill sa-mini-fill--amber" style={{ width: '45%' }} /></div>
            <div className="sa-mini-sub">45% of total outstanding invoices</div>
          </div>

          <div className="sa-mini-card">
            <div className="sa-mini-top">
              <div className="sa-mini-icon sa-mini-icon--sky">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div>
                <div className="sa-mini-label">Pending Verification</div>
                <div className="sa-mini-value">45</div>
              </div>
            </div>
            <div className="sa-mini-track"><div className="sa-mini-fill sa-mini-fill--sky" style={{ width: '30%' }} /></div>
            <div className="sa-mini-sub">Needs executive approval (Priority 1)</div>
          </div>
        </div>

        {/* ── ROW 3: QUICK ACTIONS ── */}
        <div className="sa-row3">
          <div className="sa-qa-card sa-qa-card--full">
            <h3 className="sa-section-title">Quick Actions</h3>
            <QuickAction
              iconBg="#eef2ff"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>}
              title="Create New Lead" desc="Add prospect manually"
            />
            <QuickAction
              iconBg="#f3e8ff"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
              title="View Approvals" desc="12 pending payment reviews"
            />
            <QuickAction
              iconBg="#e0f2fe"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              title="Manage Users" desc="Update permissions & access"
            />
          </div>
        </div>

        {/* ── ROW 4: FUNNEL + PERFORMERS + HEALTH ── */}
        <div className="sa-row4">
          <div className="sa-panel">
            <h3 className="sa-section-title">Sales Funnel</h3>
            <div className="sa-funnel-rows">
              <FunnelRow label="Lead Generation" value={2400} max={2400} color="#2447d7" />
              <FunnelRow label="Qualification"   value={1850} max={2400} color="#2447d7" />
              <FunnelRow label="Proposal"        value={1240} max={2400} color="#7c3aed" />
              <FunnelRow label="Negotiation"     value={780}  max={2400} color="#7c3aed" />
              <FunnelRow label="Closed Won"      value={452}  max={2400} color="#16a34a" />
            </div>
          </div>

          <div className="sa-panel">
            <h3 className="sa-section-title">Top Performers</h3>
            <div className="sa-perf-rows">
              <PerformerRow name="Sarah Miller" amount="$840k" initials="SM" bg="#dbeafe" />
              <PerformerRow name="James Chen"   amount="$720k" initials="JC" bg="#f3e8ff" />
              <PerformerRow name="Priya Nair"   amount="$610k" initials="PN" bg="#fef9c3" />
              <PerformerRow name="Luca Romano"  amount="$580k" initials="LR" bg="#dcfce7" />
            </div>
          </div>

          <div className="sa-panel">
            <h3 className="sa-section-title">System Health</h3>
            <div className="sa-health-rows">
              <HealthRow
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>}
                label="Server Status" badge="OPTIMAL"
              />
              <HealthRow
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>}
                label="Database Load" value="24%" barPct={24} barColor="#f59e0b"
              />
              <HealthRow
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                label="Security Score" value="98%" barPct={98} barColor="#2447d7"
              />
              <HealthRow
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>}
                label="API Latency" value="42ms" barPct={30} barColor="#16a34a"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;

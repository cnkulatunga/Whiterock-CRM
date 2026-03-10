import React, { useState } from 'react';
import './SuperAdminLayout.css';
import { UsersProvider } from '../context/UsersContext';
import SuperAdminSidebar from '../components/super_admin_siderbar/superAdminSidebar';
import UserManagement from '../pages/super_admin/user_management/UserManagement';
import SuperAdminDashboard from '../pages/super_admin/dashboard/SuperAdminDashboard';
import FinanceReport from '../pages/super_admin/finance/FinanceReport';
import LeadPerformance from '../pages/super_admin/leads/LeadPerformance';
import AuditLogs from '../pages/super_admin/audit_logs/AuditLogs';
import TeamLeaders from '../pages/super_admin/team_leaders/TeamLeaders';

/* ─── PLACEHOLDER PAGES ───────────────────────── */
const PlaceholderPage = ({ title, icon }) => (
    <div className="placeholder-page">
        <div className="placeholder-icon">{icon}</div>
        <h2>{title}</h2>
        <p>This page is coming soon.</p>
    </div>
);

const DashboardPage = () => <SuperAdminDashboard />;

const LeadsPage = () => <LeadPerformance />;

const AccountsPage = () => (
    <PlaceholderPage
        title="Accounts"
        icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        }
    />
);

const ReportsPage = () => <AuditLogs />;

const SettingsPage = () => (
    <PlaceholderPage
        title="Settings"
        icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        }
    />
);

const DealsPage = () => (
    <PlaceholderPage
        title="Deals Pipeline"
        icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        }
    />
);

const FinancePage = () => <FinanceReport />;

const TeamLeadersPage = ({ onNavigate }) => <TeamLeaders onNavigate={onNavigate} />;

/* ─── PAGE MAP ────────────────────────────────── */
const PAGE_MAP = {
    'dashboard': <DashboardPage />,
    'user-management': <UserManagement />,
    'leads': <LeadsPage />,
    'deals': <DealsPage />,
    'finance': <FinancePage />,
    'accounts': <AccountsPage />,
    'reports': <ReportsPage />,
    'settings': <SettingsPage />,
};

/* ─── APP LAYOUT ──────────────────────────────── */
const AppLayout = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleNavigate = (page) => {
        setActivePage(page);
        setSidebarOpen(false);
    };

    const renderPage = () => {
        if (activePage === 'team-leaders') return <TeamLeadersPage onNavigate={handleNavigate} />;
        return PAGE_MAP[activePage] ?? <DashboardPage />;
    };

    return (
        <div className="app-layout">
            {/* ── Mobile top bar ── */}
            <header className="mobile-topbar">
                <button className="mobile-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div className="mobile-topbar-logo">
                    <div className="mobile-topbar-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="mobile-topbar-title">Whiterock CRM</span>
                </div>
            </header>

            {/* ── Sidebar backdrop ── */}
            {sidebarOpen && (
                <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
            )}

            <SuperAdminSidebar
                activePage={activePage}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="app-main" key={activePage}>
                {renderPage()}
            </div>
        </div>
    );
};

const AppLayoutWithProviders = (props) => (
    <UsersProvider>
        <AppLayout {...props} />
    </UsersProvider>
);

export default AppLayoutWithProviders;

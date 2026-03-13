import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UsersProvider } from '../context/UsersContext';
import SuperAdminSidebar from '../components/super_admin_siderbar/superAdminSidebar';
import UserManagement from '../pages/super_admin/user_management/UserManagement';
import SuperAdminDashboard from '../pages/super_admin/dashboard/SuperAdminDashboard';
import FinanceReport from '../pages/super_admin/finance/FinanceReport';
import LeadPerformance from '../pages/super_admin/leads/LeadPerformance';
import AuditLogs from '../pages/super_admin/audit_logs/AuditLogs';
import TeamLeaders from '../pages/super_admin/team_leaders/TeamLeaders';
import Lenders from '../pages/super_admin/lenders/Lenders';
import OperationalFlow from '../pages/super_admin/operational_flow/OperationalFlow';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/theme/ThemeToggle';

/* ─── PLACEHOLDER PAGES ───────────────────────── */
const PlaceholderPage = ({ title, icon }) => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-screen text-center p-10" style={{ background: 'var(--bg-page)', color: '#64748b' }}>
        <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-2" style={{ background: 'var(--bg-active)' }}>{icon}</div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        <p className="text-[0.9rem]" style={{ color: 'var(--text-muted)' }}>This page is coming soon.</p>
    </div>
);

const AccountsPage = () => (
    <PlaceholderPage
        title="Accounts"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>}
    />
);

const SettingsPage = () => (
    <PlaceholderPage
        title="Settings"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
    />
);

const DealsPage = () => (
    <PlaceholderPage
        title="Deals Pipeline"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
    />
);

/* ─── APP LAYOUT ──────────────────────────────── */
const AppLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleNavigate = (page) => {
        setSidebarOpen(false);
        switch (page) {
            case 'dashboard': navigate('/super-admin/dashboard'); break;
            case 'user-management': navigate('/super-admin/user-management'); break;
            case 'leads': navigate('/super-admin/leads'); break;
            case 'deals': navigate('/super-admin/deals'); break;
            case 'finance': navigate('/super-admin/finance'); break;
            case 'accounts': navigate('/super-admin/accounts'); break;
            case 'reports': navigate('/super-admin/reports'); break;
            case 'settings': navigate('/super-admin/settings'); break;
            case 'team-leaders': navigate('/super-admin/team-leaders'); break;
            case 'lenders': navigate('/super-admin/lenders'); break;
            case 'operational-flow': navigate('/super-admin/operational-flow'); break;
            default: navigate('/super-admin/dashboard');
        }
    };

    return (
        <div
            className="flex min-h-screen w-full overflow-x-hidden relative"
            style={{ background: isDark ? '#181c2e' : '#edf0fb' }}
        >
            <div className={`fixed inset-0 bg-black/40 z-[99] backdrop-blur-[2px] transition-opacity duration-300 ${sidebarOpen ? 'block opacity-100' : 'hidden opacity-0'}`} onClick={() => setSidebarOpen(false)} />
            <SuperAdminSidebar
                activePage={location.pathname}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onCollapseChange={setIsSidebarCollapsed}
            />
            <div className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out ${sidebarOpen ? 'ml-0' : isSidebarCollapsed ? 'ml-[60px] lg:ml-0' : 'ml-[280px] lg:ml-0'}`}>
                <div
                    className={`h-[68px] flex items-center gap-4 px-8 fixed top-0 right-0 z-[90] transition-all duration-300 ease-in-out lg:px-5 ${sidebarOpen ? 'left-0' : isSidebarCollapsed ? 'left-[60px] lg:left-0' : 'left-[280px] lg:left-0'}`}
                    style={{
                        background: isDark ? 'rgba(22,26,48,0.97)' : 'rgba(255,255,255,0.98)',
                        borderBottom: `1px solid ${isDark ? '#36407a' : '#e6ebf5'}`,
                        boxShadow: isDark ? '0 1px 12px rgba(0,0,0,0.25)' : '0 1px 6px rgba(36,71,215,0.06)',
                    }}
                >
                    <button
                        className="hidden lg:flex bg-none border-none cursor-pointer p-1.5"
                        style={{ color: isDark ? '#94abda' : '#4b5681' }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </div>

                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4">
                    <Routes>
                        <Route path="dashboard" element={<SuperAdminDashboard onNavigate={handleNavigate} />} />
                        <Route path="user-management" element={<UserManagement />} />
                        <Route path="leads" element={<LeadPerformance />} />
                        <Route path="deals" element={<DealsPage />} />
                        <Route path="finance" element={<FinanceReport />} />
                        <Route path="accounts" element={<AccountsPage />} />
                        <Route path="reports" element={<AuditLogs />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="team-leaders" element={<TeamLeaders onNavigate={handleNavigate} />} />
                        <Route path="lenders" element={<Lenders readOnly={false} />} />
                        <Route path="operational-flow" element={<OperationalFlow />} />
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </div>
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

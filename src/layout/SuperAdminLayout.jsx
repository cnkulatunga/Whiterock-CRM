import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#f4f6fb] min-h-screen text-[#64748b] text-center p-10">
        <div className="w-20 h-20 bg-[#eef2ff] rounded-[20px] flex items-center justify-center mb-2">{icon}</div>
        <h2 className="text-2xl font-bold text-[#1a1f36]">{title}</h2>
        <p className="text-[0.9rem] text-[#94a3b8]">This page is coming soon.</p>
    </div>
);

const DashboardPage = ({ onNavigate }) => <SuperAdminDashboard onNavigate={onNavigate} />;

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

/* ─── SEARCH PLACEHOLDER MAP ──────────────────── */
const SEARCH_PLACEHOLDERS = {
    'dashboard':       'Global search...',
    'leads':           'Quick search...',
    'finance':         'Search reports...',
    'user-management': 'Search users, roles, or emails...',
    'team-leaders':    'Search team leaders...',
    'reports':         'Global search...',
};

/* ─── APP LAYOUT ──────────────────────────────── */
const AppLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Derive activePage from location
    const getActivePage = () => {
        const path = location.pathname;
        if (path.includes('/super-admin/dashboard')) return 'dashboard';
        if (path.includes('/super-admin/user-management')) return 'user-management';
        if (path.includes('/super-admin/leads')) return 'leads';
        if (path.includes('/super-admin/deals')) return 'deals';
        if (path.includes('/super-admin/finance')) return 'finance';
        if (path.includes('/super-admin/accounts')) return 'accounts';
        if (path.includes('/super-admin/reports')) return 'reports';
        if (path.includes('/super-admin/settings')) return 'settings';
        if (path.includes('/super-admin/team-leaders')) return 'team-leaders';
        return 'dashboard';
    };

    const activePage = getActivePage();

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
            default: navigate('/super-admin/dashboard');
        }
    };


    const searchPlaceholder = SEARCH_PLACEHOLDERS[activePage] || 'Global search...';

    return (
        <div className="flex min-h-screen w-full md:flex-col">
            {/* ── Mobile top bar ── */}
            <header className="hidden md:flex items-center gap-3 fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#e8edf5] px-4 z-[900] shadow-[0_2px_8px_rgba(36,71,215,0.06)]">
                <button className="bg-none border-none text-[#4a5568] cursor-pointer p-1.5 rounded-lg flex items-center shrink-0 transition-all duration-150 hover:bg-[#eef2ff] hover:text-[#2447d7]" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div id="mobile-header-portal" className="flex-1"></div>
            </header>

            {/* ── Sidebar backdrop ── */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-[#0a1228]/45 z-[1000] animate-fadeIn" onClick={() => setSidebarOpen(false)} />
            )}

            <SuperAdminSidebar
                activePage={location.pathname}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 md:mt-14 bg-[#f4f6fb]" key={activePage}>
                {/* ── Desktop top search bar ── */}
                <div className="md:hidden sticky top-0 z-50 bg-white border-b border-[#e8edf5] px-10 h-[60px] flex items-center justify-end shadow-[0_2px_8px_rgba(36,71,215,0.04)] lg:px-6">
                    <div className="relative group w-[260px] xl:w-[200px]">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors pointer-events-none">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <input
                            className="w-full bg-[#f1f5f9] border border-transparent rounded-xl py-2 pl-9 pr-4 text-[13px] font-medium text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 focus:shadow-sm transition-all placeholder:text-[#a0aec0]"
                            placeholder={searchPlaceholder}
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex-1 p-10 lg:p-6 sm:p-4 animate-pageSlide">
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

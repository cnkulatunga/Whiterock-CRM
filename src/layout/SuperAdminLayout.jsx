import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UsersProvider } from '../context/UsersContext';
import SuperAdminSidebar from '../components/super_admin_siderbar/superAdminSidebar';
import UserManagement from '../pages/super_admin/user_management/UserManagement';
import SuperAdminDashboard from '../pages/super_admin/dashboard/SuperAdminDashboard';
import LeadPerformance from '../pages/super_admin/leads/LeadPerformance';
import AuditLogs from '../pages/super_admin/audit_logs/AuditLogs';
import TeamLeaders from '../pages/super_admin/team_leaders/TeamLeaders';
import Lenders from '../pages/super_admin/lenders/Lenders';
import OperationalFlow from '../pages/super_admin/operational_flow/OperationalFlow';
import SuperAdminTasks from '../pages/super_admin/tasks/SuperAdminTasks';
import LenderPromotions from '../pages/super_admin/promotions/LenderPromotions';
import CreateLead from '../pages/tele_agent/leads/CreateLead';
import LeadDetails from '../pages/tele_agent/leads/LeadDetails';
import { useReminders } from '../hooks/useReminders';
import { useTasks } from '../context/TasksContext';
import NotificationTray from '../components/NotificationTray/NotificationTray';
import ReminderModal from '../components/NotificationTray/ReminderModal';
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
    const [selectedLead, setSelectedLead] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { tasks, setTasks } = useTasks();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const myTasks = tasks.filter(t => {
        const uid = user.id?.toString();
        const assignedArr = Array.isArray(t.assignedTo)
            ? t.assignedTo.map(x => x?.toString())
            : [t.assignedTo?.toString()];
        const isAssignedToMe = assignedArr.includes(uid) || assignedArr.includes('Self') || assignedArr.includes('All');
        return isAssignedToMe || t.creatorId?.toString() === uid || t.createdBy === 'Super Admin';
    });

    const { notifications, activeAlerts, removeNotification, notifyReminderSet, dismissAlert } = useReminders(myTasks, setTasks);

    const hasReminders = myTasks.some(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed');

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return { title: 'Super Admin Dashboard', subtitle: `Operational Overview • ${user.first_name || 'Jane'}` };
        if (path.includes('user-management')) return { title: 'User Management', subtitle: 'System Access Control' };
        if (path.includes('leads')) return { title: 'Lead Performance', subtitle: 'Global Analytics' };
        if (path.includes('audit-logs') || path.includes('reports')) return { title: 'Compliance & Audit', subtitle: 'System Activity Logs' };
        if (path.includes('team-leaders')) return { title: 'Team Leaders', subtitle: 'Performance Monitoring' };
        if (path.includes('lenders')) return { title: 'Lender Management', subtitle: 'Provider Directory' };
        if (path.includes('operational-flow')) return { title: 'Operational Flow', subtitle: 'Cycle Management' };
        if (path.includes('tasks')) return { title: 'Tasks & Follow-ups', subtitle: 'Priority Queue' };
        if (path.includes('promotions')) return { title: 'Lender Promotions', subtitle: 'Active Campaigns' };
        if (path.includes('create-lead')) return { title: 'Create New Lead', subtitle: 'Manual Entry' };
        if (path.includes('lead-details')) return { title: 'Lead Details', subtitle: 'Global Perspective' };
        return { title: 'Alpha Funding CRM', subtitle: 'Super Admin Access' };
    };

    const handleNavigate = (page, data = null) => {
        setSidebarOpen(false);
        if (data) setSelectedLead(data);
        switch (page) {
            case 'dashboard': navigate('/super-admin/dashboard'); break;
            case 'user-management': navigate('/super-admin/user-management', { state: data || undefined }); break;
            case 'leads': navigate('/super-admin/leads'); break;
            case 'deals': navigate('/super-admin/deals'); break;
            case 'finance': navigate('/super-admin/finance'); break;
            case 'accounts': navigate('/super-admin/accounts'); break;
            case 'reports': navigate('/super-admin/reports'); break;
            case 'settings': navigate('/super-admin/settings'); break;
            case 'team-leaders': navigate('/super-admin/team-leaders'); break;
            case 'lenders': navigate('/super-admin/lenders'); break;
            case 'tasks': navigate('/super-admin/tasks'); break;
            case 'operational-flow': navigate('/super-admin/operational-flow'); break;
            case 'promotions': navigate('/super-admin/promotions'); break;
            case 'create-lead': navigate('/super-admin/create-lead'); break;
            case 'lead-details': 
                navigate('/super-admin/lead-details'); 
                break;
            default: navigate('/super-admin/dashboard');
        }
    };

    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
    React.useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

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
                    className={`h-[68px] flex items-center gap-4 px-8 fixed top-0 right-0 z-[90] transition-all duration-300 ease-in-out lg:px-3 lg:gap-2 sm:px-2 sm:gap-1.5 ${sidebarOpen ? 'left-0' : isSidebarCollapsed ? 'left-[60px] lg:left-0' : 'left-[280px] lg:left-0'}`}
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

                    {/* NEW DYNAMIC PAGE HEADER */}
                    <div className="flex flex-col min-w-0">
                        <h2 className={`text-md lg:text-[13px] sm:text-[12px] font-black uppercase tracking-tight leading-tight truncate ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>
                            {getPageTitle().title}
                        </h2>
                        <p className={`text-[9px] font-bold uppercase tracking-widest lg:hidden ${isDark ? 'text-[#8ea0d4]' : 'text-[#718096]'}`}>
                            {getPageTitle().subtitle}
                        </p>
                    </div>

                    <div className="flex-1" />
                    <div className="flex items-center gap-4 lg:gap-2">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative border shadow-sm ${
                                    isDark
                                        ? 'bg-[#1e2347] border-[#2c3568] text-[#8ea0d4] hover:bg-[#242b58] hover:text-[#e4ecff]'
                                        : 'bg-white border-[#edf2f7] text-[#718096] hover:bg-[#f7fafc] hover:text-[#2447d7]'
                                } ${hasReminders ? 'after:content-[""] after:absolute after:top-2.5 after:right-2.5 after:w-2 after:h-2 after:bg-red-500 after:border-2 after:rounded-full after:border-white' : ''}`}
                                onClick={() => setShowNotifications(!showNotifications)}
                                title="Reminders"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </button>
                            {showNotifications && (
                                <div className={`absolute top-14 right-0 w-[300px] lg:w-[min(88vw,300px)] rounded-2xl shadow-xl z-[100] overflow-hidden animate-fadeIn border ${
                                    isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7]'
                                }`}>
                                    <div className={`p-4 border-b text-sm font-bold ${
                                        isDark ? 'bg-[#141829] border-[#2c3568] text-[#e4ecff]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#1a202c]'
                                    }`}>Reminders &amp; Alerts</div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {myTasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').length > 0 ? (
                                            myTasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').map(t => (
                                                <div key={t.id} className={`p-3 px-4 flex items-center gap-3 border-b transition-colors ${
                                                    isDark ? 'border-[#2c3568] hover:bg-[#242b58]' : 'border-[#f7fafc] hover:bg-[#f8fafc]'
                                                }`}>
                                                    <div className={`w-8 h-8 rounded-lg text-red-500 flex items-center justify-center shrink-0 ${
                                                        isDark ? 'bg-red-500/15' : 'bg-red-50'
                                                    }`}>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                            <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[12px] font-bold leading-tight ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>{t.title}</span>
                                                            {t.createdBy && (
                                                                <span className="bg-[#fff7ed] text-[#ea580c] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 border border-[#ffedd5]">By: {t.createdBy}</span>
                                                            )}
                                                        </div>
                                                        <span className={`text-[10px] font-medium ${isDark ? 'text-[#8ea0d4]' : 'text-[#a0aec0]'}`}>{t.date} at {t.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className={`p-6 text-center text-[13px] italic ${isDark ? 'text-[#8ea0d4]' : 'text-[#a0aec0]'}`}>No active reminders</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <ThemeToggle compact={isMobile} />
                        {/* Leave button — COMMENTED OUT */}
                        {/* <button
                            className="text-white border-none h-10 px-4 rounded-xl text-sm font-extrabold flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                            style={{
                                background: isDark ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 6px 16px rgba(16,185,129,0.3)',
                            }}
                            onClick={() => navigate('/leave-management/login')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span className="lg:hidden">Leave </span>
                        </button> */}
                        <button
                            className="text-white border-none h-10 px-4 rounded-xl text-sm font-extrabold flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                            style={{
                                background: isDark ? 'linear-gradient(135deg, #1d4ed8, #1e40af)' : 'linear-gradient(135deg, #2447d7, #1d4ed8)',
                                boxShadow: '0 6px 16px rgba(36,71,215,0.3)',
                            }}
                            onClick={() => handleNavigate('create-lead')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                            <span className="lg:hidden">Create Lead</span>
                        </button>
                    </div>
                </div>

                <div className={`flex-1 mt-[68px] lg:p-6 lg:px-4 sm:p-4 sm:px-3 ${location.pathname.includes('tasks') ? 'p-0' : 'p-[36px_40px]'}`}>
                    <Routes>
                        <Route path="dashboard" element={<SuperAdminDashboard onNavigate={handleNavigate} />} />
                        <Route path="user-management" element={<UserManagement />} />
                        <Route path="leads" element={<LeadPerformance />} />
                        <Route path="deals" element={<DealsPage />} />
                        <Route path="accounts" element={<AccountsPage />} />
                        <Route path="reports" element={<AuditLogs />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="team-leaders" element={<TeamLeaders onNavigate={handleNavigate} />} />
                        <Route path="lenders" element={<Lenders readOnly={false} />} />
                        <Route path="tasks" element={<SuperAdminTasks tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="operational-flow" element={<OperationalFlow />} />
                        <Route path="promotions" element={<LenderPromotions />} />
                        <Route path="create-lead" element={<CreateLead onBack={() => handleNavigate('dashboard')} tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="lead-details" element={<LeadDetails lead={selectedLead} tasks={tasks} setTasks={setTasks} onBack={() => navigate(-1)} />} />
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </div>
                <NotificationTray notifications={notifications} onRemove={removeNotification} isDark={isDark} />
                {activeAlerts.length > 0 && <ReminderModal reminders={activeAlerts} onDismiss={(id) => dismissAlert(id)} />}
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

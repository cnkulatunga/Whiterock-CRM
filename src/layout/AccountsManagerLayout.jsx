import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AccountsManagerSidebar from '../components/accounts_manager_sidebar/AccountsManagerSidebar';
import AMDashboard from '../pages/accounts_manager/dashboard/AMDashboard';
import LenderSelection from '../pages/accounts_manager/lender_selection/LenderSelection';
import LeadPerformance from '../pages/super_admin/leads/LeadPerformance';
import AMTasksFollowups from '../pages/accounts_manager/dashboard/AMTasksFollowups';
import { useReminders } from '../hooks/useReminders';
import { useTasks } from '../context/TasksContext';
import NotificationTray from '../components/NotificationTray/NotificationTray';
import ReminderModal from '../components/NotificationTray/ReminderModal';
import LenderSelectionApproved from '../pages/accounts_manager/lender_selection_approved/LenderSelectionApproved';
import LenderPromotionsView from '../pages/shared/promotions/LenderPromotionsView';
import Lenders from '../pages/super_admin/lenders/Lenders';
import CreateLead from '../pages/tele_agent/leads/CreateLead';
import ManageLeads from '../pages/tele_agent/leads/ManageLeads';
import LeadDetails from '../pages/tele_agent/leads/LeadDetails';

import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/theme/ThemeToggle';
import { UsersProvider } from '../context/UsersContext';

const AccountsManagerLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedLead, setSelectedLead] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { tasks: allTasks, setTasks: setAllTasks } = useTasks();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Filter tasks for this manager
    const tasks = allTasks.filter(t => {
        const isAssignedToMe = Array.isArray(t.assignedTo)
            ? (t.assignedTo.includes(user.id?.toString()) || (t.assignedTo.includes('Self') && user.role === 'Accounts Manager') || t.assignedTo.includes('All'))
            : (t.assignedTo?.toString() === user.id?.toString() || (t.assignedTo === 'Self' && user.role === 'Accounts Manager') || t.assignedTo === 'All');
        
        return isAssignedToMe || t.createdBy === 'Accounts Manager';
    });

    const setTasks = (newTasksOrFn) => {
        if (typeof newTasksOrFn === 'function') {
            setAllTasks(prev => {
                const currentRelevantTasks = prev.filter(t => t.assignedTo?.toString() === user.id?.toString() || t.createdBy === 'Accounts Manager' || (t.assignedTo === 'Self' && user.role === 'Accounts Manager'));
                const otherTasks = prev.filter(t => !(t.assignedTo?.toString() === user.id?.toString() || t.createdBy === 'Accounts Manager' || (t.assignedTo === 'Self' && user.role === 'Accounts Manager')));
                const updatedRelevantTasks = newTasksOrFn(currentRelevantTasks);
                return [...otherTasks, ...updatedRelevantTasks];
            });
        } else {
            setAllTasks(prev => {
                const otherTasks = prev.filter(t => !(t.assignedTo?.toString() === user.id?.toString() || t.createdBy === 'Accounts Manager' || (t.assignedTo === 'Self' && user.role === 'Accounts Manager')));
                return [...otherTasks, ...newTasksOrFn];
            });
        }
    };

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { notifications, activeAlerts, removeNotification, notifyReminderSet, dismissAlert } = useReminders(tasks, setTasks);

    const hasReminders = tasks.some(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed');

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page, lead = null) => {
        setIsSidebarOpen(false);
        if (lead) setSelectedLead(lead);
        switch (page) {
            case 'accounts_manager_dashboard': navigate('/accounts-manager/dashboard'); break;
            case 'lender_selection': navigate('/accounts-manager/lender-selection'); break;
            case 'lead_performance': navigate('/accounts-manager/lead-performance'); break;
            case 'lender_selection_approved': navigate('/accounts-manager/lender-selection-approved'); break;
            case 'lenders': navigate('/accounts-manager/lenders', { state: { targetLender: lead } }); break;
            case 'create_lead': navigate('/accounts-manager/create-lead'); break;
            case 'manage_leads': navigate('/accounts-manager/manage-leads'); break;
            case 'lead_details': navigate('/accounts-manager/lead-details'); break;

            case 'tasks_followups': navigate('/accounts-manager/tasks-followups'); break;
            case 'promotions': navigate('/accounts-manager/promotions'); break;
            default: navigate('/accounts-manager/dashboard');
        }
    };

    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return { title: 'Accounts Manager Dashboard', subtitle: `Overview • ${user.first_name || 'Manager'}` };
        if (path.includes('manage-leads')) return { title: 'Manage Leads', subtitle: 'Lead Pipeline' };
        if (path.includes('lead-details')) return { title: 'Lead Details', subtitle: 'Client Profile' };
        if (path.includes('create-lead')) return { title: 'Create New Lead', subtitle: 'Manual Entry' };
        if (path.includes('lender-selection-approved')) return { title: 'Lender Approved Loans', subtitle: 'Approved Applications' };
        if (path.includes('lender-selection')) return { title: 'Lender Selection', subtitle: 'Match & Submit' };
        if (path.includes('lenders')) return { title: 'Lender Management', subtitle: 'Provider Directory' };
        if (path.includes('tasks-followups')) return { title: 'Tasks & Follow-ups', subtitle: 'Priority Queue' };
        if (path.includes('promotions')) return { title: 'Lender Promotions', subtitle: 'Active Campaigns' };
        if (path.includes('lead-performance')) return { title: 'Lead Performance', subtitle: 'Analytics' };
        return { title: 'Alpha Funding CRM', subtitle: 'Accounts Manager' };
    };
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
            <div className={`fixed inset-0 bg-black/40 z-[99] backdrop-blur-[2px] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
            <AccountsManagerSidebar
                activePage={location.pathname}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onCollapseChange={setIsSidebarCollapsed}
            />
            <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-[margin] duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : isSidebarCollapsed ? 'ml-[60px] lg:ml-0' : 'ml-[280px] lg:ml-0'}`}>
                <div
                    className={`h-[68px] flex items-center gap-4 px-8 fixed top-0 right-0 z-[90] transition-all duration-300 ease-in-out lg:px-5 ${isSidebarOpen ? 'left-0' : isSidebarCollapsed ? 'left-[60px] lg:left-0' : 'left-[280px] lg:left-0'}`}
                    style={{
                        background: isDark ? 'rgba(22,26,48,0.97)' : 'rgba(255,255,255,0.98)',
                        borderBottom: `1px solid ${isDark ? '#36407a' : '#e6ebf5'}`,
                        boxShadow: isDark ? '0 1px 12px rgba(0,0,0,0.25)' : '0 1px 6px rgba(36,71,215,0.06)',
                    }}
                >
                    <button
                        className="hidden lg:flex bg-none border-none cursor-pointer p-1.5"
                        style={{ color: isDark ? '#94abda' : '#4b5681' }}
                        onClick={toggleSidebar}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    {/* DYNAMIC PAGE TITLE */}
                    <div className="flex flex-col">
                        <h2 className={`text-md font-black uppercase tracking-tight leading-tight ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>
                            {getPageTitle().title}
                        </h2>
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-[#8ea0d4]' : 'text-[#718096]'}`}>
                            {getPageTitle().subtitle}
                        </p>
                    </div>

                    <div className="flex-1" />
                    <div className="flex items-center gap-4 lg:gap-3">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative border shadow-sm ${isDark
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
                                <div className={`absolute top-14 right-0 w-[300px] rounded-2xl shadow-xl z-[100] overflow-hidden animate-fadeIn border ${isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7]'
                                    }`}>
                                    <div className={`p-4 border-b text-sm font-bold ${isDark ? 'bg-[#141829] border-[#2c3568] text-[#e4ecff]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#1a202c]'
                                        }`}>Reminders &amp; Alerts</div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').length > 0 ? (
                                            tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').map(t => (
                                                <div key={t.id} className={`p-3 px-4 flex items-center gap-3 border-b transition-colors ${isDark ? 'border-[#2c3568] hover:bg-[#242b58]' : 'border-[#f7fafc] hover:bg-[#f8fafc]'
                                                    }`}>
                                                    <div className={`w-8 h-8 rounded-lg text-red-500 flex items-center justify-center shrink-0 ${isDark ? 'bg-red-500/15' : 'bg-red-50'
                                                        }`}>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                            <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[12px] font-bold leading-tight ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>{t.title}</span>
                                                            {t.createdBy && t.createdBy !== 'Accounts Manager' && (
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
                        <div className={isMobile ? "" : "w-[280px]"}>
                            <ThemeToggle compact={isMobile} />
                        </div>
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
                            <span className="lg:hidden">Leave</span>
                        </button> */}
                        <button
                            className="text-white border-none h-10 px-4 rounded-xl text-sm font-extrabold flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                            style={{
                                background: isDark ? 'linear-gradient(135deg, #2447d7, #1732a3)' : 'linear-gradient(135deg, #2447d7, #1732a3)',
                                boxShadow: '0 6px 16px rgba(36,71,215,0.3)',
                            }}
                            onClick={() => navigate('/accounts-manager/create-lead')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span className="lg:hidden">Create Lead</span>
                        </button>
                    </div>
                </div>

                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4">
                    <Routes>
                        <Route path="dashboard" element={<AMDashboard onNavigate={handleNavigate} tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="lender-selection" element={<LenderSelection lead={selectedLead} onNavigate={handleNavigate} />} />
                        <Route path="lead-performance" element={<LeadPerformance />} />
                        <Route path="lender-selection-approved" element={<LenderSelectionApproved />} />
                        <Route path="lenders" element={<Lenders readOnly={true} />} />

                        <Route path="tasks-followups" element={<AMTasksFollowups tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="promotions" element={<LenderPromotionsView />} />
                        <Route path="create-lead" element={<CreateLead onBack={() => handleNavigate('accounts_manager_dashboard')} tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="manage-leads" element={<ManageLeads onViewDetails={(lead) => handleNavigate('lead_details', lead)} onSelectLender={(lead) => handleNavigate('lender_selection', lead)} isAccountsManager={true} />} />
                        <Route path="lead-details" element={<LeadDetails lead={selectedLead} tasks={tasks} setTasks={setTasks} onBack={() => handleNavigate('manage_leads')} />} />
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

const AccountsManagerLayoutWithProviders = (props) => (
    <UsersProvider>
        <AccountsManagerLayout {...props} />
    </UsersProvider>
);

export default AccountsManagerLayoutWithProviders;

import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import TeleAgentSidebar from '../components/tele_agent_sidebar/TeleAgentSidebar';
import TeleDashboard from '../pages/tele_agent/dashboard/TeleDashboard';
import ManageLeads from '../pages/tele_agent/leads/ManageLeads';
import LeadDetails from '../pages/tele_agent/leads/LeadDetails';
import CreateLead from '../pages/tele_agent/leads/CreateLead';
import TasksFollowups from '../pages/tele_agent/tasks/TasksFollowups';
import LenderPromotionsView from '../pages/shared/promotions/LenderPromotionsView';
import { useReminders } from '../hooks/useReminders';
import { useTasks } from '../context/TasksContext';
import NotificationTray from '../components/NotificationTray/NotificationTray';
import ReminderModal from '../components/NotificationTray/ReminderModal';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/theme/ThemeToggle';
import { UsersProvider } from '../context/UsersContext';

const TeleAgentLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedLead, setSelectedLead] = useState(null);
    const { tasks: allTasks, setTasks: setAllTasks } = useTasks();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Filter tasks for this agent
    const tasks = allTasks.filter(t => {
        if (Array.isArray(t.assignedTo)) {
            return t.assignedTo.includes(user.id?.toString()) || (t.assignedTo.includes('Self') && user.role === 'Tele Agent') || t.assignedTo.includes('All');
        }
        return t.assignedTo?.toString() === user.id?.toString() || (t.assignedTo === 'Self' && user.role === 'Tele Agent') || t.assignedTo === 'All';
    });

    const setTasks = (newTasksOrFn) => {
        if (typeof newTasksOrFn === 'function') {
            setAllTasks(prev => {
                const currentRelevantTasks = prev.filter(t => {
                    if (Array.isArray(t.assignedTo)) {
                        return t.assignedTo.includes(user.id?.toString()) || (t.assignedTo.includes('Self') && user.role === 'Tele Agent') || t.assignedTo.includes('All');
                    }
                    return t.assignedTo?.toString() === user.id?.toString() || (t.assignedTo === 'Self' && user.role === 'Tele Agent') || t.assignedTo === 'All';
                });
                const otherTasks = prev.filter(t => !((Array.isArray(t.assignedTo) ? (t.assignedTo.includes(user.id?.toString()) || (t.assignedTo.includes('Self') && user.role === 'Tele Agent') || t.assignedTo.includes('All')) : (t.assignedTo?.toString() === user.id?.toString() || (t.assignedTo === 'Self' && user.role === 'Tele Agent') || t.assignedTo === 'All'))));
                const updatedRelevantTasks = newTasksOrFn(currentRelevantTasks);
                return [...otherTasks, ...updatedRelevantTasks];
            });
        } else {
            setAllTasks(prev => {
                const otherTasks = prev.filter(t => !(t.assignedTo?.toString() === user.id?.toString() || (t.assignedTo === 'Self' && user.role === 'Tele Agent')));
                return [...otherTasks, ...newTasksOrFn];
            });
        }
    };

    const [pendingTaskDate, setPendingTaskDate] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { notifications, activeAlerts, removeNotification, notifyReminderSet, dismissAlert } = useReminders(tasks, setTasks);

    const hasReminders = tasks.some(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed');

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page, date = null) => {
        setIsSidebarOpen(false);
        if (date) setPendingTaskDate(date);
        switch (page) {
            case 'dashboard': navigate('/tele-agent/dashboard'); break;
            case 'leads': navigate('/tele-agent/leads'); break;
            case 'lead-details': navigate('/tele-agent/lead-details'); break;
            case 'create-lead': navigate('/tele-agent/create-lead'); break;
            case 'follow-ups': navigate('/tele-agent/follow-ups'); break;
            case 'promotions': navigate('/tele-agent/promotions'); break;
            // case 'leave': navigate('/leave-management/login'); break; // COMMENTED OUT
            default: navigate('/tele-agent/dashboard');
        }
    };

    const handleViewLeadDetails = (lead) => {
        setSelectedLead(lead);
        navigate('/tele-agent/lead-details');
    };

    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
    React.useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Tele Dashboard';
        if (path.includes('create-lead')) return 'Create Lead';
        if (path.includes('lead-details')) return 'Lead Details';
        if (path.includes('leads')) return 'Manage Leads';
        if (path.includes('follow-ups')) return 'Tasks & Follow-ups';
        if (path.includes('promotions')) return 'Lender Promotions';
        return '';
    };

    return (
        <div
            className="flex min-h-screen w-full overflow-x-hidden"
            style={{ background: isDark ? '#181c2e' : '#edf0fb' }}
        >
            <div className={`fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0 lg:hidden'}`} onClick={() => setIsSidebarOpen(false)} />
            <TeleAgentSidebar
                activePage={location.pathname}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onCollapseChange={setIsSidebarCollapsed}
            />
            <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-[margin] duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : isSidebarCollapsed ? 'ml-[60px] lg:ml-0' : 'ml-[280px] lg:ml-0'}`}>
                <div
                    className={`h-[68px] flex items-center gap-4 px-8 fixed top-0 right-0 z-[90] transition-all duration-300 ease-in-out lg:px-5 sm:px-3 sm:gap-2 ${isSidebarOpen ? 'left-0' : isSidebarCollapsed ? 'left-[60px] lg:left-0' : 'left-[280px] lg:left-0'}`}
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
                    
                    <div className="flex-1 flex items-center pl-2 lg:pl-0">
                        <h1 className="text-[16px] font-black tracking-widest uppercase text-slate-900 dark:text-white truncate">
                            {getPageTitle()}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
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
                                <div className={`absolute top-14 right-0 w-[300px] rounded-2xl shadow-xl z-[100] overflow-hidden animate-fadeIn border ${
                                    isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-[#edf2f7]'
                                }`}>
                                    <div className={`p-4 border-b text-sm font-bold ${
                                        isDark ? 'bg-[#141829] border-[#2c3568] text-[#e4ecff]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#1a202c]'
                                    }`}>Reminders &amp; Alerts</div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').length > 0 ? (
                                            tasks.filter(t => t.reminder && t.reminder !== 'none' && t.status !== 'Completed').map(t => (
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
                                                            {t.createdBy && t.createdBy !== 'Tele Agent' && (
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
                        {!location.pathname.includes('dashboard') && (
                            <button
                                className="text-white border-none h-11 sm:h-10 px-6 sm:px-3 rounded-xl text-sm font-extrabold flex items-center gap-2.5 sm:gap-1 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                                style={{
                                    background: isDark
                                        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                                        : 'linear-gradient(135deg, #2447d7, #1a38b8)',
                                    boxShadow: isDark
                                        ? '0 8px 20px rgba(59,130,246,0.3)'
                                        : '0 8px 20px rgba(36,71,215,0.25)',
                                }}
                                onClick={() => navigate('/tele-agent/create-lead')}
                            >
                                <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </div>
                                <span className="md:hidden lg:inline-block">Create Lead</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4 sm:p-5 sm:px-3">
                    <Routes>
                        <Route path="dashboard" element={<TeleDashboard onNavigate={handleNavigate} tasks={tasks} onViewLeadDetails={handleViewLeadDetails} />} />
                        <Route path="leads" element={<ManageLeads onViewDetails={handleViewLeadDetails} />} />
                        <Route path="lead-details" element={<LeadDetails lead={selectedLead} tasks={tasks} setTasks={setTasks} onBack={() => navigate('/tele-agent/leads')} />} />
                        <Route path="create-lead" element={<CreateLead onBack={() => navigate('/tele-agent/leads')} tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="follow-ups" element={<TasksFollowups tasks={tasks} setTasks={setTasks} initialDate={pendingTaskDate} onClearPendingDate={() => setPendingTaskDate(null)} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="promotions" element={<LenderPromotionsView />} />
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

const TeleAgentLayoutWithProviders = (props) => (
    <UsersProvider>
        <TeleAgentLayout {...props} />
    </UsersProvider>
);

export default TeleAgentLayoutWithProviders;

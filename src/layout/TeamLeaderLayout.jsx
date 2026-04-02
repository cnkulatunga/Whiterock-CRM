import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import TeamLeaderSidebar from '../components/team_leader_sidebar/TeamLeaderSidebar';
import TeamLeaderDashboard from '../pages/team_leader/dashboard/TeamLeaderDashboard';
import LeadMonitoring from '../pages/team_leader/lead_monitoring/LeadMonitoring';
import TeamLeaderCalendar from '../pages/team_leader/calendar/TeamLeaderCalendar';
import LenderPromotionsView from '../pages/shared/promotions/LenderPromotionsView';
import CreateLead from '../pages/tele_agent/leads/CreateLead';
import LeadDetails from '../pages/tele_agent/leads/LeadDetails';
import { useReminders } from '../hooks/useReminders';
import { useTasks } from '../context/TasksContext';
import NotificationTray from '../components/NotificationTray/NotificationTray';
import ReminderModal from '../components/NotificationTray/ReminderModal';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/theme/ThemeToggle';
import { UsersProvider } from '../context/UsersContext';


const TeamLeaderLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const { tasks: allTasks, setTasks: setAllTasks } = useTasks();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Filter tasks: assigned to self OR created by self (so they can see team assignments)
    const tasks = allTasks.filter(t => {
        const uid = user.id?.toString();
        const assignedArr = Array.isArray(t.assignedTo)
            ? t.assignedTo.map(x => x?.toString())
            : [t.assignedTo?.toString()];
        const isAssignedToMe = assignedArr.includes(uid) || assignedArr.includes('Self') || assignedArr.includes('All');
        return isAssignedToMe || t.creatorId?.toString() === uid || t.createdBy === 'Team Leader';
    });

    const setTasks = (newTasksOrFn) => {
        const uid = user.id?.toString();
        const isRelevant = (t) => {
            const assignedArr = Array.isArray(t.assignedTo)
                ? t.assignedTo.map(x => x?.toString())
                : [t.assignedTo?.toString()];
            const isAsgn = assignedArr.includes(uid) || assignedArr.includes('Self') || assignedArr.includes('All');
            return isAsgn || t.creatorId?.toString() === uid || t.createdBy === 'Team Leader';
        };
        if (typeof newTasksOrFn === 'function') {
            setAllTasks(prev => {
                const currentRelevantTasks = prev.filter(isRelevant);
                const otherTasks = prev.filter(t => !isRelevant(t));
                const updatedRelevantTasks = newTasksOrFn(currentRelevantTasks);
                return [...otherTasks, ...updatedRelevantTasks];
            });
        } else {
            setAllTasks(prev => {
                const otherTasks = prev.filter(t => !isRelevant(t));
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
            case 'dashboard': navigate('/team-leader/dashboard'); break;
            case 'lead-monitoring': navigate('/team-leader/lead-monitoring'); break;
            case 'calendar': navigate('/team-leader/calendar'); break;
            case 'promotions': navigate('/team-leader/promotions'); break;
            case 'create-lead': navigate('/team-leader/create-lead'); break;
            case 'lead-details': navigate('/team-leader/lead-details'); break;
            default: navigate('/team-leader/dashboard');
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
            <div className={`fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
            <TeamLeaderSidebar
                activePage={location.pathname}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onCollapseChange={setIsSidebarCollapsed}
            />
            <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : isSidebarCollapsed ? 'ml-[60px] lg:ml-0' : 'ml-[280px] lg:ml-0'}`}>
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
                    
                    {/* Page Title in Top Menu Bar */}
                    {location.pathname === '/team-leader/dashboard' && (
                        <div className="flex flex-col">
                            <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Team Leader Dashboard
                            </h1>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Monitor team performance, track leads, and manage operations.
                            </p>
                        </div>
                    )}
                    {location.pathname === '/team-leader/lead-monitoring' && (
                        <div className="flex flex-col">
                            <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Lead Monitoring
                            </h1>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Track lead progress through workflow stages and team performance.
                            </p>
                        </div>
                    )}

                    {location.pathname === '/team-leader/calendar' && (
                        <div className="flex flex-col">
                            <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Tasks and Followups
                            </h1>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Manage tasks, schedule followups, and track team activities.
                            </p>
                        </div>
                    )}
                    
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
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
                                                            {t.createdBy && t.createdBy !== 'Team Leader' && (
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

                <div className={`flex-1 mt-[68px] lg:p-6 lg:px-4 ${location.pathname.includes('calendar') ? 'p-0' : 'p-[36px_40px]'}`}>
                    <Routes>
                        <Route path="dashboard" element={<TeamLeaderDashboard onNavigate={handleNavigate} tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} onViewLeadDetails={(lead) => handleNavigate('lead-details', lead)} />} />
                        <Route path="lead-monitoring" element={<LeadMonitoring onViewDetails={(lead) => handleNavigate('lead-details', lead)} />} />
                        <Route path="calendar" element={<TeamLeaderCalendar tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="promotions" element={<LenderPromotionsView />} />
                        <Route path="create-lead" element={<CreateLead onBack={() => handleNavigate('dashboard')} tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="lead-details" element={<LeadDetails lead={selectedLead} tasks={tasks} setTasks={setTasks} onBack={() => handleNavigate('lead-monitoring')} />} />
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

const TeamLeaderLayoutWithProviders = (props) => (
    <UsersProvider>
        <TeamLeaderLayout {...props} />
    </UsersProvider>
);

export default TeamLeaderLayoutWithProviders;

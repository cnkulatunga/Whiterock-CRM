import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import TeamLeaderSidebar from '../components/team_leader_sidebar/TeamLeaderSidebar';
import TeamLeaderDashboard from '../pages/team_leader/dashboard/TeamLeaderDashboard';
import LeadMonitoring from '../pages/team_leader/lead_monitoring/LeadMonitoring';
import DocumentVerification from '../pages/team_leader/document_verification/DocumentVerification';
import TeamLeaderCalendar from '../pages/team_leader/calendar/TeamLeaderCalendar';
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
    const { tasks: allTasks, setTasks: setAllTasks } = useTasks();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Filter tasks: assigned to self OR created by self (so they can see team assignments)
    const tasks = allTasks.filter(t => 
        t.assignedTo?.toString() === user.id?.toString() || 
        t.createdBy === 'Team Leader' || 
        (t.assignedTo === 'Self' && user.role === 'Team Leader')
    );

    const setTasks = (newTasksOrFn) => {
        if (typeof newTasksOrFn === 'function') {
            setAllTasks(prev => {
                const currentRelevantTasks = prev.filter(t => t.assignedTo?.toString() === user.id?.toString() || t.createdBy === 'Team Leader' || (t.assignedTo === 'Self' && user.role === 'Team Leader'));
                const otherTasks = prev.filter(t => !(t.assignedTo?.toString() === user.id?.toString() || t.createdBy === 'Team Leader' || (t.assignedTo === 'Self' && user.role === 'Team Leader')));
                const updatedRelevantTasks = newTasksOrFn(currentRelevantTasks);
                return [...otherTasks, ...updatedRelevantTasks];
            });
        } else {
            setAllTasks(prev => {
                const otherTasks = prev.filter(t => !(t.assignedTo?.toString() === user.id?.toString() || t.createdBy === 'Team Leader' || (t.assignedTo === 'Self' && user.role === 'Team Leader')));
                return [...otherTasks, ...newTasksOrFn];
            });
        }
    };

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { notifications, activeAlerts, removeNotification, notifyReminderSet, dismissAlert } = useReminders(tasks, setTasks);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page) => {
        setIsSidebarOpen(false);
        switch (page) {
            case 'dashboard': navigate('/team-leader/dashboard'); break;
            case 'lead-monitoring': navigate('/team-leader/lead-monitoring'); break;
            case 'document-verification': navigate('/team-leader/document-verification'); break;
            case 'calendar': navigate('/team-leader/calendar'); break;
            default: navigate('/team-leader/dashboard');
        }
    };

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
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </div>

                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4">
                    <Routes>
                        <Route path="dashboard" element={<TeamLeaderDashboard onNavigate={handleNavigate} tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="lead-monitoring" element={<LeadMonitoring />} />
                        <Route path="document-verification" element={<DocumentVerification />} />
                        <Route path="calendar" element={<TeamLeaderCalendar tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
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

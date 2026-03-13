import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import TeleAgentSidebar from '../components/tele_agent_sidebar/TeleAgentSidebar';
import TeleDashboard from '../pages/tele_agent/dashboard/TeleDashboard';
import ManageLeads from '../pages/tele_agent/leads/ManageLeads';
import LeadDetails from '../pages/tele_agent/leads/LeadDetails';
import CreateLead from '../pages/tele_agent/leads/CreateLead';
import TasksFollowups from '../pages/tele_agent/tasks/TasksFollowups';
import { useReminders } from '../hooks/useReminders';
import NotificationTray from '../components/NotificationTray/NotificationTray';
import ReminderModal from '../components/NotificationTray/ReminderModal';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/theme/ThemeToggle';

const INITIAL_TASKS = [
    { id: 1, title: 'Follow up with Robert Miller', lead: 'Robert Miller', status: 'Pending', date: '2026-03-09', time: '14:00', type: 'Call', reminder: '15m' },
    { id: 2, title: "Verify Alice Huang's documents", lead: 'Alice Huang', status: 'In Progress', date: '2026-03-09', time: '16:30', type: 'Document', reminder: '1h' },
    { id: 3, title: 'Check loan eligibility for David Rivera', lead: 'David Rivera', status: 'Completed', date: '2026-03-08', time: '10:00', type: 'Review', reminder: 'none' },
    { id: 4, title: 'Send welcome email to Michael Chen', lead: 'Michael Chen', status: 'Pending', date: '2026-03-10', time: '10:00', type: 'Email', reminder: '1d' },
];

/* ─── TELE AGENT LAYOUT ──────────────────────────────── */
const TeleAgentLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [pendingTaskDate, setPendingTaskDate] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { notifications, activeAlerts, removeNotification, notifyReminderSet, dismissAlert } = useReminders(tasks, setTasks);

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
            default: navigate('/tele-agent/dashboard');
        }
    };

    const handleViewLeadDetails = (leadId) => {
        setSelectedLeadId(leadId);
        navigate('/tele-agent/lead-details');
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
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            className="text-white border-none h-11 px-5 rounded-[10px] text-sm font-bold flex items-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-px"
                            style={{
                                background: 'linear-gradient(135deg, #2447d7, #1a38b8)',
                                boxShadow: '0 4px 12px rgba(36,71,215,0.25)',
                            }}
                            onClick={() => navigate('/tele-agent/create-lead')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span className="md:hidden">Create Lead</span>
                        </button>
                    </div>
                </div>
                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4">
                    <Routes>
                        <Route path="dashboard" element={<TeleDashboard onNavigate={handleNavigate} tasks={tasks} />} />
                        <Route path="leads" element={<ManageLeads onViewDetails={handleViewLeadDetails} />} />
                        <Route path="lead-details" element={<LeadDetails leadId={selectedLeadId} tasks={tasks} setTasks={setTasks} onBack={() => navigate('/tele-agent/leads')} />} />
                        <Route path="create-lead" element={<CreateLead onBack={() => navigate('/tele-agent/leads')} />} />
                        <Route path="follow-ups" element={<TasksFollowups tasks={tasks} setTasks={setTasks} initialDate={pendingTaskDate} onClearPendingDate={() => setPendingTaskDate(null)} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </div>
                <NotificationTray notifications={notifications} onRemove={removeNotification} />
                {activeAlerts.length > 0 && <ReminderModal reminder={activeAlerts[0]} onDismiss={() => dismissAlert(activeAlerts[0].id)} />}
            </div>
        </div>
    );
};

export default TeleAgentLayout;

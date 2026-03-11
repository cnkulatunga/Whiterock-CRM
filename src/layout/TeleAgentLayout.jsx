import React, { useState, useEffect } from 'react';
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

const INITIAL_TASKS = [
    { id: 1, title: 'Follow up with Robert Miller', lead: 'Robert Miller', status: 'Pending', date: '2026-03-09', time: '14:00', type: 'Call', reminder: '15m' },
    { id: 2, title: 'Verify Alice Huang\'s documents', lead: 'Alice Huang', status: 'In Progress', date: '2026-03-09', time: '16:30', type: 'Document', reminder: '1h' },
    { id: 3, title: 'Check loan eligibility for David Rivera', lead: 'David Rivera', status: 'Completed', date: '2026-03-08', time: '10:00', type: 'Review', reminder: 'none' },
    { id: 4, title: 'Send welcome email to Michael Chen', lead: 'Michael Chen', status: 'Pending', date: '2026-03-10', time: '10:00', type: 'Email', reminder: '1d' },
];

/* ─── PLACEHOLDER PAGES ───────────────────────── */
const PlaceholderPage = ({ title, icon }) => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-2xl border border-dashed border-[#cbd5e0] p-10">
        <div className="w-20 h-20 bg-[#ebf0ff] rounded-[20px] flex items-center justify-center mb-6">{icon}</div>
        <h2 className="text-2xl font-bold text-[#1a202c] mb-2">{title}</h2>
        <p className="text-[#718096] text-base">This tele-agent page is under construction.</p>
    </div>
);

/* ─── TELE AGENT LAYOUT ──────────────────────────────── */
const TeleAgentLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [pendingTaskDate, setPendingTaskDate] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Derive activePage from location
    const getActivePage = () => {
        const path = location.pathname;
        if (path.includes('/tele-agent/dashboard')) return 'dashboard';
        if (path.includes('/tele-agent/leads')) return 'leads';
        if (path.includes('/tele-agent/lead-details')) return 'lead-details';
        if (path.includes('/tele-agent/create-lead')) return 'create-lead';
        if (path.includes('/tele-agent/follow-ups')) return 'follow-ups';
        return 'dashboard';
    };

    const activePage = getActivePage();

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
        <div className="flex min-h-screen bg-[#f7fafc] w-full overflow-x-hidden">
            <div className={`fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0 lg:hidden'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <TeleAgentSidebar
                activePage={location.pathname}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onCollapseChange={setIsSidebarCollapsed}
            />
            <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-[margin] duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : isSidebarCollapsed ? 'ml-[60px] lg:ml-0' : 'ml-[240px] lg:ml-0'}`}>
                <div className={`h-[68px] bg-white/97 border-b border-[#edf2f7] flex items-center gap-4 px-8 fixed top-0 right-0 z-[90] shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out lg:px-5 ${isSidebarOpen ? 'left-0' : isSidebarCollapsed ? 'left-[60px] lg:left-0' : 'left-[240px] lg:left-0'}`}>
                    <button className="hidden lg:flex bg-none border-none text-[#4a5568] cursor-pointer p-1.5" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-3">
                        <button className="bg-[#2447d7] text-white border-none h-11 px-5 rounded-[10px] text-sm font-bold flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(36,71,215,0.25)] transition-all duration-200 hover:bg-[#1732a3] hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(36,71,215,0.3)]" onClick={() => navigate('/tele-agent/create-lead')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
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

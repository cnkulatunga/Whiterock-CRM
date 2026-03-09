import React, { useState } from 'react';
import './TeleAgentLayout.css';
import TeleAgentSidebar from '../components/tele_agent_sidebar/TeleAgentSidebar';

import TeleDashboard from '../pages/tele_agent/dashboard/TeleDashboard';
import ManageLeads from '../pages/tele_agent/leads/ManageLeads';
import LeadDetails from '../pages/tele_agent/leads/LeadDetails';
import CreateLead from '../pages/tele_agent/leads/CreateLead';
import TasksFollowups from '../pages/tele_agent/tasks/TasksFollowups';

const INITIAL_TASKS = [
    { id: 1, title: 'Follow up with Robert Miller', lead: 'Robert Miller', status: 'Pending', date: '2026-03-09', time: '14:00', type: 'Call', reminder: '15m' },
    { id: 2, title: 'Verify Alice Huang\'s documents', lead: 'Alice Huang', status: 'In Progress', date: '2026-03-09', time: '16:30', type: 'Document', reminder: '1h' },
    { id: 3, title: 'Check loan eligibility for David Rivera', lead: 'David Rivera', status: 'Completed', date: '2026-03-08', time: '10:00', type: 'Review', reminder: 'none' },
    { id: 4, title: 'Send welcome email to Michael Chen', lead: 'Michael Chen', status: 'Pending', date: '2026-03-10', time: '10:00', type: 'Email', reminder: '1d' },
];

/* ─── PLACEHOLDER PAGES ───────────────────────── */
const PlaceholderPage = ({ title, icon }) => (
    <div className="placeholder-page">
        <div className="placeholder-icon">{icon}</div>
        <h2>{title}</h2>
        <p>This tele-agent page is under construction.</p>
    </div>
);

/* ─── TELE AGENT LAYOUT ──────────────────────────────── */
const TeleAgentLayout = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [pendingTaskDate, setPendingTaskDate] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page, date = null) => {
        setActivePage(page);
        setSelectedLeadId(null);
        setIsSidebarOpen(false);
        if (date) setPendingTaskDate(date);
    };

    const handleViewLeadDetails = (leadId) => {
        setSelectedLeadId(leadId);
        setActivePage('lead-details');
    };

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <TeleDashboard onNavigate={handleNavigate} tasks={tasks} />;
            case 'leads':
                return <ManageLeads onViewDetails={handleViewLeadDetails} />;
            case 'lead-details':
                return <LeadDetails leadId={selectedLeadId} onBack={() => setActivePage('leads')} />;
            case 'create-lead':
                return <CreateLead onBack={() => setActivePage('leads')} />;
            case 'follow-ups':
                return <TasksFollowups tasks={tasks} setTasks={setTasks} initialDate={pendingTaskDate} onClearPendingDate={() => setPendingTaskDate(null)} />;
            default:
                return <TeleDashboard />;
        }
    };

    return (
        <div className={`tele-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <TeleAgentSidebar
                activePage={activePage === 'lead-details' || activePage === 'create-lead' ? 'leads' : activePage}
                onNavigate={handleNavigate}
                onLogout={onLogout}
            />
            <div className="tele-main">
                <div className="tele-top-bar">
                    <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>                    <div className="tele-top-spacer"></div>
                    <div className="tele-top-actions">
                        <button className="tele-primary-btn" onClick={() => setActivePage('create-lead')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ marginRight: '8px' }}>
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            <span>Create Lead</span>
                        </button>
                    </div>
                </div>
                <div className="tele-content" key={activePage}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TeleAgentLayout;

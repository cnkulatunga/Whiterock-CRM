import React, { useState } from 'react';
import TeamLeaderSidebar from '../components/team_leader_sidebar/TeamLeaderSidebar';
import TeamLeaderDashboard from '../pages/team_leader/dashboard/TeamLeaderDashboard';
import LeadMonitoring from '../pages/team_leader/lead_monitoring/LeadMonitoring';
import DocumentVerification from '../pages/team_leader/document_verification/DocumentVerification';
import TeamLeaderCalendar from '../pages/team_leader/calendar/TeamLeaderCalendar';
import { useReminders } from '../hooks/useReminders';
import NotificationTray from '../components/NotificationTray/NotificationTray';
import ReminderModal from '../components/NotificationTray/ReminderModal';

const INITIAL_TASKS = [
    { id: 101, title: 'Weekly Team Sync', lead: null, status: 'Pending', date: '2026-03-09', time: '09:00', type: 'Meeting', reminder: '15m', assignedTo: 'Self' },
    { id: 102, title: 'Review John\'s high-value leads', lead: 'Portfolio Review', status: 'In Progress', date: '2026-03-09', time: '11:00', type: 'Review', reminder: 'none', assignedTo: '1' },
    { id: 103, title: 'Monthly goal setting', lead: null, status: 'Completed', date: '2026-03-02', time: '10:00', type: 'Review', reminder: 'none', assignedTo: 'Self' },
    { id: 104, title: 'Check document backlog', lead: 'Backlog', status: 'Pending', date: '2026-03-10', time: '14:00', type: 'Document', reminder: '1h', assignedTo: '3' },
];

const TeamLeaderLayout = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    
    const { notifications, activeAlerts, removeNotification, notifyReminderSet, dismissAlert } = useReminders(tasks, setTasks);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page) => {
        setActivePage(page);
        setIsSidebarOpen(false);
    };

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <TeamLeaderDashboard onNavigate={handleNavigate} />;
            case 'lead-monitoring':
                return <LeadMonitoring />;
            case 'document-verification':
                return <DocumentVerification />;
            case 'calendar':
                return <TeamLeaderCalendar tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />;

            default:
                return (
                    <div className="p-10">
                        <h1 className="text-[2rem] font-extrabold">{activePage.replace('-', ' ').toUpperCase()}</h1>
                        <div className="mt-5 p-10 border border-[#e2e8f0] rounded-2xl bg-white">
                            <p className="text-[#718096]">This section is currently under development.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f7fafc] w-full overflow-x-hidden relative">
            <div className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <TeamLeaderSidebar 
                activePage={activePage} 
                onNavigate={handleNavigate} 
                onLogout={onLogout} 
                isOpen={isSidebarOpen}
            />
            <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : 'ml-[260px] lg:ml-0'}`}>
                <div className={`h-[72px] bg-white/95 backdrop-blur-sm border-b border-[#edf2f7] flex items-center justify-between px-10 fixed top-0 right-0 z-[90] transition-all duration-300 ease-in-out lg:left-0 lg:px-5 md:h-[60px] md:px-3 md:gap-1 ${isSidebarOpen ? 'left-0' : 'left-[260px] lg:left-0'}`}>
                    <button className="hidden lg:block bg-none border-none text-[#4a5568] cursor-pointer p-2 rounded-lg hover:bg-[#f7fafc]" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    <div className="flex-1 max-w-[480px] ml-5 md:ml-1 md:max-w-none">
                        <div className="relative flex items-center bg-[#f7fafc] rounded-xl px-4 border border-transparent transition-all duration-200 focus-within:bg-white focus-within:border-[#2447d7] focus-within:shadow-[0_0_0_3px_rgba(36,71,215,0.1)]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className="mr-3 shrink-0">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input type="text" placeholder="Search leads, agents, or files..." 
                                className="w-full h-11 bg-transparent border-none outline-none text-sm text-[#1a202c] font-medium placeholder:text-[#a0aec0] md:h-10 md:text-[13px] md:placeholder:text-xs" />
                        </div>
                    </div>

                </div>

                <div className="p-8 flex-1 mt-[72px] lg:p-[16px_12px]" key={activePage}>
                    {renderContent()}
                </div>
                <NotificationTray notifications={notifications} onRemove={removeNotification} />
                {activeAlerts.length > 0 && <ReminderModal reminder={activeAlerts[0]} onDismiss={() => dismissAlert(activeAlerts[0].id)} />}
            </div>
        </div>
    );
};

export default TeamLeaderLayout;

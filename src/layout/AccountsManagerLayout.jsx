import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AccountsManagerSidebar from '../components/accounts_manager_sidebar/AccountsManagerSidebar';
import AMDashboard from '../pages/accounts_manager/dashboard/AMDashboard';
import LenderSelector from '../pages/accounts_manager/lender_selector/LenderSelector';
import LenderSelection from '../pages/accounts_manager/lender_selection/LenderSelection';
import FinanceReport from '../pages/super_admin/finance/FinanceReport';
import AuditLogs from '../pages/super_admin/audit_logs/AuditLogs';
import AMTasksFollowups from '../pages/accounts_manager/dashboard/AMTasksFollowups';
import { useReminders } from '../hooks/useReminders';
import NotificationTray from '../components/NotificationTray/NotificationTray';
import ReminderModal from '../components/NotificationTray/ReminderModal';
import LenderSelectionApproved from '../pages/accounts_manager/lender_selection_approved/LenderSelectionApproved';
import Lenders from '../pages/super_admin/lenders/Lenders';
import ClientLenderSelection from '../pages/accounts_manager/client_lender_selection/ClientLenderSelection';
import { useTheme } from '../context/ThemeContext';

const INITIAL_TASKS = [
    { id: 201, title: 'Review loan applications', lead: 'Pipeline', status: 'Pending', date: '2026-03-11', time: '10:00', type: 'Review', reminder: 'none', assignedTo: 'Self' },
    { id: 202, title: 'Follow up with lender', lead: 'ABC Bank', status: 'In Progress', date: '2026-03-11', time: '14:00', type: 'Call', reminder: '15m', assignedTo: 'Self' },
];

const AccountsManagerLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedLead, setSelectedLead] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { notifications, activeAlerts, removeNotification, notifyReminderSet, dismissAlert } = useReminders(tasks, setTasks);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page, lead = null) => {
        setIsSidebarOpen(false);
        if (lead) setSelectedLead(lead);
        switch (page) {
            case 'accounts_manager_dashboard': navigate('/accounts-manager/dashboard'); break;
            case 'lender_selector': navigate('/accounts-manager/lender-selector'); break;
            case 'lender_selection': navigate('/accounts-manager/lender-selection'); break;
            case 'financial_payment_report': navigate('/accounts-manager/financial-payment-report'); break;
            case 'audit_logs': navigate('/accounts-manager/audit-logs'); break;
            case 'lender_selection_approved': navigate('/accounts-manager/lender-selection-approved'); break;
            case 'lenders': navigate('/accounts-manager/lenders'); break;
            case 'client_lender_selection': navigate('/accounts-manager/client-lender-selection'); break;
            case 'tasks_followups': navigate('/accounts-manager/tasks-followups'); break;
            default: navigate('/accounts-manager/dashboard');
        }
    };

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
                </div>

                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4">
                    <Routes>
                        <Route path="dashboard" element={<AMDashboard onNavigate={handleNavigate} tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="lender-selector" element={<LenderSelector onNavigate={handleNavigate} />} />
                        <Route path="lender-selection" element={<LenderSelection lead={selectedLead} onNavigate={handleNavigate} />} />
                        <Route path="financial-payment-report" element={<FinanceReport />} />
                        <Route path="audit-logs" element={<AuditLogs />} />
                        <Route path="lender-selection-approved" element={<LenderSelectionApproved />} />
                        <Route path="lenders" element={<Lenders readOnly={true} />} />
                        <Route path="client-lender-selection" element={<ClientLenderSelection onNavigate={handleNavigate} />} />
                        <Route path="tasks-followups" element={<AMTasksFollowups tasks={tasks} setTasks={setTasks} notifyReminderSet={notifyReminderSet} />} />
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </div>
                <NotificationTray notifications={notifications} onRemove={removeNotification} isDark={isDark} />
                {activeAlerts.length > 0 && <ReminderModal reminder={activeAlerts[0]} onDismiss={() => dismissAlert(activeAlerts[0].id)} />}
            </div>
        </div>
    );
};

export default AccountsManagerLayout;

import React, { useState } from 'react';
import './AccountsManagerLayout.css';
import AccountsManagerSidebar from '../components/accounts_manager_sidebar/AccountsManagerSidebar';
import AMDashboard from '../pages/accounts_manager/dashboard/AMDashboard';
import LenderSelector from '../pages/accounts_manager/lender_selector/LenderSelector';
import LenderSelection from '../pages/accounts_manager/lender_selection/LenderSelection';
import FinanceReport from '../pages/super_admin/finance/FinanceReport';
import LeadPerformance from '../pages/super_admin/leads/LeadPerformance';
import AuditLogs from '../pages/accounts_manager/audit_logs/AuditLogs';
import DraftDashboard from '../pages/accounts_manager/draft_dashboard/DraftDashboard';
import LenderSelectionApproved from '../pages/accounts_manager/lender_selection_approved/LenderSelectionApproved';

const AccountsManagerLayout = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('accounts_manager_dashboard');
    const [selectedLead, setSelectedLead] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page, lead = null) => {
        setActivePage(page);
        setSelectedLead(lead);
        setIsSidebarOpen(false);
    };

    const renderContent = () => {
        switch (activePage) {
            case 'accounts_manager_dashboard': return <AMDashboard onNavigate={handleNavigate} />;
            case 'lender_selector': return <LenderSelector onNavigate={handleNavigate} />;
            case 'lender_selection': return <LenderSelection lead={selectedLead} />;
            case 'financial_payment_report': return <FinanceReport />;
            case 'lead_performance_report': return <LeadPerformance />;
            case 'audit_logs': return <AuditLogs />;
            case 'draft_dashboard': return <DraftDashboard onNavigate={handleNavigate} />;
            case 'lender_selection_approved': return <LenderSelectionApproved />;
            default: return <AMDashboard onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className={`am-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className={`am-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)} />
            <AccountsManagerSidebar
                activePage={activePage}
                onNavigate={handleNavigate}
                onLogout={onLogout}
            />
            <div className="am-main">
                <div className="am-top-bar">
                    <button className="am-mobile-toggle" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <div className="am-search-wrapper">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Search accounts or deals..." />
                    </div>

                </div>

                <div className="am-content" key={activePage}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AccountsManagerLayout;

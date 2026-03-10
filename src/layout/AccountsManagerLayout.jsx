import React, { useState } from 'react';
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
        <div className="flex min-h-screen bg-[#f7fafc] w-full overflow-x-hidden relative">
            <div className={`fixed inset-0 bg-black/40 z-[99] backdrop-blur-[2px] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
            <AccountsManagerSidebar
                activePage={activePage}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
            />
            <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-[margin] duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : 'ml-[260px] lg:ml-0'}`}>
                <div className={`h-[68px] bg-white/97 border-b border-[#edf2f7] flex items-center gap-4 px-8 fixed top-0 right-0 z-[90] shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out lg:px-5 ${isSidebarOpen ? 'left-0' : 'left-[260px] lg:left-0'}`}>
                    <button className="hidden lg:flex bg-none border-none text-[#4a5568] cursor-pointer p-1.5" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <div className="flex-1 max-w-[380px] flex items-center gap-[10px] bg-[#f1f5f9] rounded-lg px-3.5 h-10 sm:max-w-[200px]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Search accounts or deals..." className="border-none bg-transparent w-full text-sm text-[#1a202c] outline-none placeholder:text-[#a0aec0]" />
                    </div>

                </div>

                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4" key={activePage}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AccountsManagerLayout;

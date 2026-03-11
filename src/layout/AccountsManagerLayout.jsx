import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AccountsManagerSidebar from '../components/accounts_manager_sidebar/AccountsManagerSidebar';
import AMDashboard from '../pages/accounts_manager/dashboard/AMDashboard';
import LenderSelector from '../pages/accounts_manager/lender_selector/LenderSelector';
import LenderSelection from '../pages/accounts_manager/lender_selection/LenderSelection';
import FinanceReport from '../pages/super_admin/finance/FinanceReport';
import AuditLogs from '../pages/super_admin/audit_logs/AuditLogs';
import DraftDashboard from '../pages/accounts_manager/draft_dashboard/DraftDashboard';
import LenderSelectionApproved from '../pages/accounts_manager/lender_selection_approved/LenderSelectionApproved';
import Lenders from '../pages/super_admin/lenders/Lenders';
import ClientLenderSelection from '../pages/accounts_manager/client_lender_selection/ClientLenderSelection';

const AccountsManagerLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedLead, setSelectedLead] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Derive activePage from location
    const getActivePage = () => {
        const path = location.pathname;
        if (path.includes('/accounts-manager/dashboard')) return 'accounts_manager_dashboard';
        if (path.includes('/accounts-manager/lender-selector')) return 'lender_selector';
        if (path.includes('/accounts-manager/lender-selection')) return 'lender_selection';
        if (path.includes('/accounts-manager/financial-payment-report')) return 'financial_payment_report';
        if (path.includes('/accounts-manager/audit-logs')) return 'audit_logs';
        if (path.includes('/accounts-manager/draft-dashboard')) return 'draft_dashboard';
        if (path.includes('/accounts-manager/lender-selection-approved')) return 'lender_selection_approved';
        if (path.includes('/accounts-manager/lenders')) return 'lenders';
        if (path.includes('/accounts-manager/client-lender-selection')) return 'client_lender_selection';
        return 'accounts_manager_dashboard';
    };

    const activePage = getActivePage();

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
            case 'draft_dashboard': navigate('/accounts-manager/draft-dashboard'); break;
            case 'lender_selection_approved': navigate('/accounts-manager/lender-selection-approved'); break;
            case 'lenders': navigate('/accounts-manager/lenders'); break;
            case 'client_lender_selection': navigate('/accounts-manager/client-lender-selection'); break;
            default: navigate('/accounts-manager/dashboard');
        }
    };


    return (
        <div className="flex min-h-screen bg-[#f7fafc] w-full overflow-x-hidden relative">
            <div className={`fixed inset-0 bg-black/40 z-[99] backdrop-blur-[2px] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
            <AccountsManagerSidebar
                activePage={location.pathname}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onCollapseChange={setIsSidebarCollapsed}
            />
            <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-[margin] duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : isSidebarCollapsed ? 'ml-[60px] lg:ml-0' : 'ml-[240px] lg:ml-0'}`}>
                <div className={`h-[68px] bg-white/97 border-b border-[#edf2f7] flex items-center gap-4 px-8 fixed top-0 right-0 z-[90] shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out lg:px-5 ${isSidebarOpen ? 'left-0' : isSidebarCollapsed ? 'left-[60px] lg:left-0' : 'left-[240px] lg:left-0'}`}>
                    <button className="hidden lg:flex bg-none border-none text-[#4a5568] cursor-pointer p-1.5" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>


                </div>

                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4">
                    <Routes>
                        <Route path="dashboard" element={<AMDashboard onNavigate={handleNavigate} />} />
                        <Route path="lender-selector" element={<LenderSelector onNavigate={handleNavigate} />} />
                        <Route path="lender-selection" element={<LenderSelection lead={selectedLead} onNavigate={handleNavigate} />} />
                        <Route path="financial-payment-report" element={<FinanceReport />} />
                        <Route path="audit-logs" element={<AuditLogs />} />
                        <Route path="draft-dashboard" element={<DraftDashboard onNavigate={handleNavigate} />} />
                        <Route path="lender-selection-approved" element={<LenderSelectionApproved />} />
                        <Route path="lenders" element={<Lenders readOnly={true} />} />
                        <Route path="client-lender-selection" element={<ClientLenderSelection onNavigate={handleNavigate} />} />
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AccountsManagerLayout;

import React, { useState } from 'react';
import ClientSidebar from '../components/client_sidebar/ClientSidebar';
import Dashboard from '../pages/client/dashboard/Dashboard';
import Documents from '../pages/client/documents/Documents';
import LoanStatus from '../pages/client/loan_status/LoanStatus';
import LoanHistory from '../pages/client/loan_history/LoanHistory';
import Support from '../pages/client/support/Support';

/* ─── PAGE MAP ────────────────────────────────── */
const PAGE_MAP = {
    'dashboard': <Dashboard />,
    'documents': <Documents />,
    'loan-status': <LoanStatus />,
    'loan-history': <LoanHistory />,
    'support': <Support />,
};

/* ─── CLIENT LAYOUT ──────────────────────────────── */
const ClientLayout = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = `${user.first_name || 'Client'} ${user.last_name || ''}`.trim();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page) => {
        setActivePage(page);
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-[#f7fafc] w-full overflow-x-hidden relative">
            <div className={`fixed inset-0 bg-black/40 z-[99] backdrop-blur-[2px] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <ClientSidebar
                activePage={activePage}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
            />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : 'ml-[260px] lg:ml-0'}`}>
                <div className={`h-[70px] bg-white/95 backdrop-blur-sm border-b border-[#edf2f7] flex items-center justify-between px-10 fixed top-0 right-0 z-[90] transition-[left] duration-300 ease-in-out lg:h-16 lg:px-5 ${isSidebarOpen ? 'left-0' : 'left-[260px] lg:left-0'}`}>
                    <button className="hidden lg:block bg-none border-none text-[#4a5568] cursor-pointer p-2 mr-3" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div className="flex-1"></div>
                </div>
                <div className="p-10 flex-1 overflow-y-auto w-full box-border mt-[70px] lg:p-[24px_16px]" key={activePage}>
                    {PAGE_MAP[activePage] ?? <Dashboard />}
                </div>
            </div>
        </div>
    );
};

export default ClientLayout;

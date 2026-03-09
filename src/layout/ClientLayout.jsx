import React, { useState } from 'react';
import './ClientLayout.css';
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
        <div className={`client-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <ClientSidebar
                activePage={activePage}
                onNavigate={handleNavigate}
                onLogout={onLogout}
            />
            <div className="client-main">
                <div className="top-menu-bar">
                    <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input type="text" placeholder="Search applications..." />
                        </div>
                    </div>
                </div>
                <div className="client-content" key={activePage}>
                    {PAGE_MAP[activePage] ?? <Dashboard />}
                </div>
            </div>
        </div>
    );
};

export default ClientLayout;

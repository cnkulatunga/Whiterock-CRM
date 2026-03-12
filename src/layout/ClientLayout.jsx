import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ClientSidebar from '../components/client_sidebar/ClientSidebar';
import Dashboard from '../pages/client/dashboard/Dashboard';
import Documents from '../pages/client/documents/Documents';
import LoanStatus from '../pages/client/loan_status/LoanStatus';
import LoanHistory from '../pages/client/loan_history/LoanHistory';
import Support from '../pages/client/support/Support';
import { useTheme } from '../context/ThemeContext';

/* ─── CLIENT LAYOUT ──────────────────────────────── */
const ClientLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getActivePage = () => {
        const path = location.pathname;
        if (path.includes('/client/dashboard')) return 'dashboard';
        if (path.includes('/client/documents')) return 'documents';
        if (path.includes('/client/loan-status')) return 'loan-status';
        if (path.includes('/client/loan-history')) return 'loan-history';
        if (path.includes('/client/support')) return 'support';
        return 'dashboard';
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigate = (page) => {
        setIsSidebarOpen(false);
        switch (page) {
            case 'dashboard': navigate('/client/dashboard'); break;
            case 'documents': navigate('/client/documents'); break;
            case 'loan-status': navigate('/client/loan-status'); break;
            case 'loan-history': navigate('/client/loan-history'); break;
            case 'support': navigate('/client/support'); break;
            default: navigate('/client/dashboard');
        }
    };

    return (
        <div
            className="flex min-h-screen w-full overflow-x-hidden relative"
            style={{ background: isDark ? '#181c2e' : '#edf0fb' }}
        >
            <div className={`fixed inset-0 bg-black/40 z-[99] backdrop-blur-[2px] transition-opacity duration-300 ${isSidebarOpen ? 'block opacity-100' : 'hidden opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
            <ClientSidebar
                activePage={location.pathname}
                onNavigate={handleNavigate}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onCollapseChange={setIsSidebarCollapsed}
            />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : isSidebarCollapsed ? 'ml-[60px] lg:ml-0' : 'ml-[280px] lg:ml-0'}`}>
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
                </div>
                <div className="p-[36px_40px] flex-1 mt-[68px] lg:p-6 lg:px-4">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="documents" element={<Documents />} />
                        <Route path="loan-status" element={<LoanStatus />} />
                        <Route path="loan-history" element={<LoanHistory />} />
                        <Route path="support" element={<Support />} />
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default ClientLayout;

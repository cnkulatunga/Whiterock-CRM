import React, { useState } from 'react';
import Login from './pages/login/Login';
import ClientLayout from './layout/ClientLayout';
import SuperAdminLayout from './layout/SuperAdminLayout';
import TeleAgentLayout from './layout/TeleAgentLayout';
import AccountsManagerLayout from './layout/AccountsManagerLayout';
import TeamLeaderLayout from './layout/TeamLeaderLayout';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Real login transition
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogoutTrigger = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setShowLogoutConfirm(false);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const renderLayout = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role || 'client';

        switch (role) {
            case 'super_admin':
                return <SuperAdminLayout onLogout={handleLogoutTrigger} />;
            case 'tele_agent':
                return <TeleAgentLayout onLogout={handleLogoutTrigger} />;
            case 'accounts_manager':
                return <AccountsManagerLayout onLogout={handleLogoutTrigger} />;
            case 'team_leader':
                return <TeamLeaderLayout onLogout={handleLogoutTrigger} />;
            case 'client':
            default:
                return <ClientLayout onLogout={handleLogoutTrigger} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {isLoggedIn ? renderLayout() : <Login onLogin={handleLogin} />}
            
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn">
                    <div className="bg-white w-full max-w-[420px] rounded-[20px] p-8 text-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] animate-slideUp max-[520px]:p-6 max-[520px]:mx-4 max-[520px]:rounded-2xl">
                        <div className="w-16 h-16 bg-[#fff5f5] text-[#e53e3e] rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#1a202c] mb-3">Confirm Logout</h3>
                        <p className="text-[15px] text-[#718096] leading-relaxed mb-7">Are you sure you want to log out of Whiterock CRM? Any unsaved changes might be lost.</p>
                        <div className="flex gap-3 max-[520px]:flex-col-reverse max-[520px]:gap-2">
                            <button className="flex-1 py-3.5 rounded-xl font-semibold text-[15px] cursor-pointer transition-all bg-[#f7fafc] border border-[#edf2f7] text-[#4a5568] hover:bg-[#edf2f7] max-[520px]:w-full max-[520px]:py-3" onClick={cancelLogout}>Stay Logged In</button>
                            <button className="flex-1 py-3.5 rounded-xl font-semibold text-[15px] cursor-pointer transition-all bg-[#e53e3e] border-none text-white hover:bg-[#c53030] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(229,62,62,0.2)] max-[520px]:w-full max-[520px]:py-3" onClick={confirmLogout}>Yes, Log Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

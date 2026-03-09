import React, { useState } from 'react';
import Login from './pages/login/Login';
import ClientLayout from './layout/ClientLayout';
import SuperAdminLayout from './layout/SuperAdminLayout';
import TeleAgentLayout from './layout/TeleAgentLayout';
import AccountsManagerLayout from './layout/AccountsManagerLayout';
import TeamLeaderLayout from './layout/TeamLeaderLayout';
import './App.css';

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
        <div className="App">
            {isLoggedIn ? renderLayout() : <Login onLogin={handleLogin} />}
            
            {showLogoutConfirm && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-card">
                        <div className="logout-icon-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to log out of Whiterock CRM? Any unsaved changes might be lost.</p>
                        <div className="logout-modal-actions">
                            <button className="btn-logout-cancel" onClick={cancelLogout}>Stay Logged In</button>
                            <button className="btn-logout-confirm" onClick={confirmLogout}>Yes, Log Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

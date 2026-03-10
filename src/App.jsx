import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/login/Login';
import ClientLayout from './layout/ClientLayout';
import SuperAdminLayout from './layout/SuperAdminLayout';
import TeleAgentLayout from './layout/TeleAgentLayout';
import AccountsManagerLayout from './layout/AccountsManagerLayout';
import TeamLeaderLayout from './layout/TeamLeaderLayout';

const ProtectedRoute = ({ children, allowedRoles, isLoggedIn }) => {
    const userString = localStorage.getItem('user');
    if (!isLoggedIn || !userString) {
        return <Navigate to="/login" replace />;
    }
    
    try {
        const user = JSON.parse(userString);
        const role = user.role;
        
        if (allowedRoles && !allowedRoles.includes(role)) {
            // Redirect to their respective home if they try to access a restricted role path
            switch (role) {
                case 'super_admin': return <Navigate to="/super-admin" replace />;
                case 'tele_agent': return <Navigate to="/tele-agent" replace />;
                case 'accounts_manager': return <Navigate to="/accounts-manager" replace />;
                case 'team_leader': return <Navigate to="/team-leader" replace />;
                case 'client':
                default: return <Navigate to="/client" replace />;
            }
        }
        return children;
    } catch (e) {
        console.error("Auth error:", e);
        return <Navigate to="/login" replace />;
    }
};

const DashboardHome = ({ isLoggedIn }) => {
    const userString = localStorage.getItem('user');
    if (!isLoggedIn || !userString) return <Navigate to="/login" replace />;
    
    try {
        const user = JSON.parse(userString);
        const role = user.role;
        switch (role) {
            case 'super_admin': return <Navigate to="/super-admin" replace />;
            case 'tele_agent': return <Navigate to="/tele-agent" replace />;
            case 'accounts_manager': return <Navigate to="/accounts-manager" replace />;
            case 'team_leader': return <Navigate to="/team-leader" replace />;
            case 'client':
            default: return <Navigate to="/client" replace />;
        }
    } catch (e) {
        return <Navigate to="/login" replace />;
    }
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (role = null) => {
        setIsLoggedIn(true);
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : {};
        const userRole = role || user.role || 'client';
        
        console.log("Logging in as:", userRole);
        switch (userRole) {
            case 'super_admin': navigate('/super-admin'); break;
            case 'tele_agent': navigate('/tele-agent'); break;
            case 'accounts_manager': navigate('/accounts-manager'); break;
            case 'team_leader': navigate('/team-leader'); break;
            default: navigate('/client'); break;
        }
    };

    const handleLogoutTrigger = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setShowLogoutConfirm(false);
        navigate('/login');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Routes>
                {/* Generic Login */}
                <Route path="/login" element={isLoggedIn ? <DashboardHome isLoggedIn={isLoggedIn} /> : <Login onLogin={() => handleLogin()} />} />
                
                {/* Specific Login Routes */}
                <Route path="/login/lead" element={isLoggedIn ? <Navigate to="/client" replace /> : <Login onLogin={() => handleLogin('client')} defaultRole="client" />} />
                <Route path="/login/tele-agent" element={isLoggedIn ? <Navigate to="/tele-agent" replace /> : <Login onLogin={() => handleLogin('tele_agent')} defaultRole="tele_agent" />} />
                <Route path="/login/team-leader" element={isLoggedIn ? <Navigate to="/team-leader" replace /> : <Login onLogin={() => handleLogin('team_leader')} defaultRole="team_leader" />} />
                <Route path="/login/accounts-manager" element={isLoggedIn ? <Navigate to="/accounts-manager" replace /> : <Login onLogin={() => handleLogin('accounts_manager')} defaultRole="accounts_manager" />} />
                <Route path="/login/super-admin" element={isLoggedIn ? <Navigate to="/super-admin" replace /> : <Login onLogin={() => handleLogin('super_admin')} defaultRole="super_admin" />} />

                {/* Role-Protected Layouts */}
                <Route path="/super-admin/*" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['super_admin']}>
                        <SuperAdminLayout onLogout={handleLogoutTrigger} />
                    </ProtectedRoute>
                } />
                
                <Route path="/tele-agent/*" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['tele_agent']}>
                        <TeleAgentLayout onLogout={handleLogoutTrigger} />
                    </ProtectedRoute>
                } />
                
                <Route path="/accounts-manager/*" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['accounts_manager']}>
                        <AccountsManagerLayout onLogout={handleLogoutTrigger} />
                    </ProtectedRoute>
                } />
                
                <Route path="/team-leader/*" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['team_leader']}>
                        <TeamLeaderLayout onLogout={handleLogoutTrigger} />
                    </ProtectedRoute>
                } />
                
                <Route path="/client/*" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['client']}>
                        <ClientLayout onLogout={handleLogoutTrigger} />
                    </ProtectedRoute>
                } />

                {/* Root Redirection */}
                <Route path="/" element={<DashboardHome isLoggedIn={isLoggedIn} />} />
                
                {/* Final Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
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

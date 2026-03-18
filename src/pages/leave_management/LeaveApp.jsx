import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/theme/ThemeToggle';
import { LeaveProvider } from '../../context/LeaveContext';
import alphaLogo from '../../assets/images/alpha.png';
import TeleAgentLeaveDashboard from './tele_agent/TeleAgentLeaveDashboard';
import TeamLeaderLeaveDashboard from './team_leader/TeamLeaderLeaveDashboard';
import AccountsManagerLeaveDashboard from './accounts_manager/AccountsManagerLeaveDashboard';
import SuperAdminLeaveDashboard from './super_admin/SuperAdminLeaveDashboard';

const ROLE_LABELS = {
    super_admin: 'Super Admin',
    team_leader: 'Team Leader',
    tele_agent: 'Tele Agent',
    accounts_manager: 'Accounts Manager',
};

const ROLE_COLORS = {
    super_admin: { bg: 'rgba(229,62,62,0.12)', text: '#e53e3e', border: 'rgba(229,62,62,0.25)' },
    team_leader: { bg: 'rgba(56,161,105,0.12)', text: '#38a169', border: 'rgba(56,161,105,0.25)' },
    tele_agent: { bg: 'rgba(36,71,215,0.12)', text: '#2447d7', border: 'rgba(36,71,215,0.25)' },
    accounts_manager: { bg: 'rgba(128,90,213,0.12)', text: '#805ad5', border: 'rgba(128,90,213,0.25)' },
};

const LeaveAppInner = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [showLogout, setShowLogout] = useState(false);

    const leaveUserStr = localStorage.getItem('leave_user');
    if (!leaveUserStr) return <Navigate to="/leave-management/login" replace />;

    let leaveUser;
    try { leaveUser = JSON.parse(leaveUserStr); }
    catch { return <Navigate to="/leave-management/login" replace />; }

    const { role, name, first_name, last_name, initials } = leaveUser;
    const displayName = name || `${first_name || ''} ${last_name || ''}`.trim();
    const roleLabel = ROLE_LABELS[role] || role;
    const roleColor = ROLE_COLORS[role] || ROLE_COLORS.tele_agent;
    const avatarInitials = initials || displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = () => {
        localStorage.removeItem('leave_user');
        navigate('/leave-management/login');
    };

    const renderDashboard = () => {
        switch (role) {
            case 'tele_agent': return <TeleAgentLeaveDashboard user={leaveUser} />;
            case 'team_leader': return <TeamLeaderLeaveDashboard user={leaveUser} />;
            case 'accounts_manager': return <AccountsManagerLeaveDashboard user={leaveUser} />;
            case 'super_admin': return <SuperAdminLeaveDashboard user={leaveUser} />;
            default: return <Navigate to="/leave-management/login" replace />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: isDark ? '#181c2e' : '#edf0fb' }}>
            {/* Top Header */}
            <header
                className="h-[64px] flex items-center px-8 gap-4 fixed top-0 left-0 right-0 z-50 lg:px-4"
                style={{
                    background: isDark ? 'rgba(22,26,48,0.98)' : 'rgba(255,255,255,0.98)',
                    borderBottom: `1px solid ${isDark ? '#36407a' : '#e6ebf5'}`,
                    boxShadow: isDark ? '0 1px 12px rgba(0,0,0,0.25)' : '0 1px 6px rgba(36,71,215,0.06)',
                }}
            >
                {/* Logo + Title */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2855e8] to-[#1a38b8] flex items-center justify-center shadow-md">
                        <img src={alphaLogo} alt="Alpha" className="w-full h-full object-contain" />
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[0.78rem] font-bold leading-tight" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Alpha Funding</span>
                        <span className="text-[0.6rem] font-bold tracking-[1.1px] uppercase" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>Leave Management</span>
                    </div>
                </div>

                {/* Center calendar icon badge */}
                <div className="flex items-center gap-2 ml-2">
                    <div
                        className="px-3 py-1.5 rounded-lg flex items-center gap-2"
                        style={{
                            background: isDark ? '#242b58' : '#f0f3ff',
                            border: `1px solid ${isDark ? '#2c3568' : '#dde5f5'}`,
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#6080f8' : '#2447d7'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span className="text-[0.72rem] font-bold" style={{ color: isDark ? '#6080f8' : '#2447d7' }}>Leave Portal</span>
                    </div>
                </div>

                <div className="flex-1" />

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <ThemeToggle compact />

                    {/* Back to CRM */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80 sm:hidden md:flex"
                        style={{
                            background: isDark ? '#242b58' : '#f0f3ff',
                            border: `1px solid ${isDark ? '#2c3568' : '#dde5f5'}`,
                            color: isDark ? '#8ea0d4' : '#4b5a8a',
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back to CRM
                    </button>

                    {/* User Info + Logout */}
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.7rem] font-bold shrink-0"
                            style={{ background: 'linear-gradient(135deg, #2855e8, #1a38b8)' }}
                        >
                            {avatarInitials}
                        </div>
                        <div className="hidden md:flex flex-col">
                            <span className="text-[0.78rem] font-semibold leading-tight" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{displayName}</span>
                            <span
                                className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full w-fit"
                                style={{ background: roleColor.bg, color: roleColor.text, border: `1px solid ${roleColor.border}` }}
                            >
                                {roleLabel}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowLogout(true)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                            style={{
                                background: isDark ? 'rgba(229,62,62,0.1)' : '#fff5f5',
                                border: '1px solid rgba(229,62,62,0.2)',
                                color: '#e53e3e',
                                cursor: 'pointer',
                            }}
                            title="Sign Out"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 mt-[64px] p-8 lg:p-5 sm:p-4">
                {renderDashboard()}
            </main>

            {/* Logout Confirm Modal */}
            {showLogout && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
                    <div
                        className="w-full max-w-[380px] rounded-[20px] p-8 text-center mx-4"
                        style={{
                            background: isDark ? '#242b50' : '#ffffff',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            border: isDark ? '1px solid #2a3055' : 'none',
                        }}
                    >
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: isDark ? 'rgba(229,62,62,0.15)' : '#fff5f5', color: '#e53e3e' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#e4ecff' : '#0d1236' }}>Sign Out</h3>
                        <p className="text-sm mb-6" style={{ color: isDark ? '#94abda' : '#4b5681' }}>Are you sure you want to sign out of the Leave Portal?</p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                                style={{ background: isDark ? '#313a6e' : '#f7f8ff', border: `1px solid ${isDark ? '#3e4a88' : '#e1e6f5'}`, color: isDark ? '#94abda' : '#4b5681' }}
                                onClick={() => setShowLogout(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer text-white"
                                style={{ background: '#e53e3e', border: 'none' }}
                                onClick={handleLogout}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LeaveApp = () => (
    <LeaveProvider>
        <LeaveAppInner />
    </LeaveProvider>
);

export default LeaveApp;

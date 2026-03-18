import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SHARED_INITIAL_USERS } from '../../data/dummyData';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/theme/ThemeToggle';
import alphaLogo from '../../assets/images/alpha.png';

const ROLE_MAP = {
    'Super Admin': 'super_admin',
    'Team Leader': 'team_leader',
    'Tele Agent': 'tele_agent',
    'Accounts Manager': 'accounts_manager',
};

const ROLE_LABELS = {
    super_admin: 'Super Admin',
    team_leader: 'Team Leader',
    tele_agent: 'Tele Agent',
    accounts_manager: 'Accounts Manager',
};

const LeaveLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Please enter your email address.'); return; }
        if (!password) { setError('Please enter your password.'); return; }

        setLoading(true);
        setTimeout(() => {
            const found = SHARED_INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
            if (!found) {
                setError('No account found with this email address.');
                setLoading(false);
                return;
            }
            const leaveUser = {
                id: found.id,
                email: found.email,
                name: found.name,
                first_name: found.name.split(' ')[0],
                last_name: found.name.split(' ').slice(1).join(' '),
                role: ROLE_MAP[found.role] || 'tele_agent',
                initials: found.initials,
            };
            localStorage.setItem('leave_user', JSON.stringify(leaveUser));
            setLoading(false);
            navigate('/leave-management/dashboard');
        }, 500);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative"
            style={{ background: isDark ? '#181c2e' : '#edf0fb' }}
        >
            <div className="absolute top-4 right-6">
                <ThemeToggle />
            </div>

            <div
                className="w-full max-w-[440px] rounded-[24px] p-10"
                style={{
                    background: isDark ? '#1e2347' : '#ffffff',
                    border: `1px solid ${isDark ? '#2c3568' : '#e1e8f5'}`,
                    boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.4)' : '0 24px 64px rgba(36,71,215,0.1)',
                }}
            >
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2855e8] to-[#1a38b8] flex items-center justify-center shadow-lg">
                            <img src={alphaLogo} alt="Alpha" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <div className="text-[0.95rem] font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Alpha Funding</div>
                            <div className="text-[0.62rem] font-bold tracking-[1.2px] uppercase" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>Staff Portal</div>
                        </div>
                    </div>

                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md"
                        style={{ background: 'linear-gradient(135deg, #2447d7 0%, #1a38b8 100%)' }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold mb-1" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Leave Management</h1>
                    <p className="text-[0.8rem]" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>Sign in with your CRM credentials</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your.email@whiterock.crm"
                            autoFocus
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                            style={{
                                background: isDark ? '#242b58' : '#f5f7ff',
                                border: `1.5px solid ${isDark ? '#2c3568' : '#e1e8f5'}`,
                                color: isDark ? '#e4ecff' : '#090e28',
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                                style={{
                                    background: isDark ? '#242b58' : '#f5f7ff',
                                    border: `1.5px solid ${isDark ? '#2c3568' : '#e1e8f5'}`,
                                    color: isDark ? '#e4ecff' : '#090e28',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity opacity-50 hover:opacity-100"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#8ea0d4' : '#6b7eb8' }}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="px-4 py-3 rounded-xl text-sm font-medium"
                            style={{ background: isDark ? 'rgba(229,62,62,0.1)' : '#fff5f5', color: '#e53e3e', border: '1px solid rgba(229,62,62,0.2)' }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 mt-1"
                        style={{
                            background: 'linear-gradient(135deg, #2447d7, #1a38b8)',
                            boxShadow: '0 8px 20px rgba(36,71,215,0.25)',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In to Leave Portal'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs font-semibold hover:underline transition-all"
                        style={{ color: isDark ? '#6080f8' : '#2447d7', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        ← Back to CRM Dashboard
                    </button>
                </div>

                {/* Role hints */}
                <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${isDark ? '#2c3568' : '#edf0fb'}` }}>
                    <p className="text-center text-[0.65rem] font-bold uppercase tracking-wider mb-2.5" style={{ color: isDark ? '#546298' : '#b0bdd9' }}>
                        Available Roles
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                        {Object.values(ROLE_LABELS).map(label => (
                            <span
                                key={label}
                                className="px-2.5 py-1 rounded-full text-[0.65rem] font-semibold"
                                style={{
                                    background: isDark ? '#242b58' : '#f0f3ff',
                                    color: isDark ? '#8ea0d4' : '#4b5a8a',
                                    border: `1px solid ${isDark ? '#2c3568' : '#dde5f5'}`,
                                }}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveLogin;

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const NAV_GROUPS = [
    {
        group: 'MAIN MENU',
        items: [
            { id: 'dashboard', path: '/tele-agent/dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
            { id: 'leads', path: '/tele-agent/leads', label: 'Leads', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M22 7l-3 3 2 2" /></svg> },
            { id: 'follow-ups', path: '/tele-agent/follow-ups', label: 'Tasks and Followups', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
        ],
    },
    {
        group: 'INTELLIGENCE',
        items: [
            { id: 'ai-assist', path: '/tele-agent/ai-assist', label: 'AI Assist', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M3 5h4" /><path d="M19 17v4" /><path d="M17 19h4" /></svg>, comingSoon: true },
            { id: 'knowledge', path: '/tele-agent/knowledge', label: 'Knowledge Based', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>, comingSoon: true },
        ],
    },
];

const TeleAgentSidebar = ({ activePage, onNavigate, onLogout, isOpen, onCollapseChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.role === 'tele_agent' ? 'Sarah Jenkins' : `${user.first_name || 'Tele'} ${user.last_name || 'Agent'}`.trim();
    const email = user.email || 'agent@whiterock.com';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const toggle = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        onCollapseChange && onCollapseChange(next);
    };

    return (
        <aside
            className={`${isCollapsed ? 'w-[60px]' : 'w-[280px]'} h-screen flex flex-col fixed left-0 top-0 z-[101] font-['Sora',sans-serif] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0' : 'lg:-translate-x-full'}`}
            style={{
                background: isDark
                    ? 'linear-gradient(180deg, #1f2347 0%, #1c2040 100%)'
                    : '#ffffff',
                borderRight: `1px solid ${isDark ? '#36407a' : '#d8e0f4'}`,
                boxShadow: isDark
                    ? '2px 0 24px rgba(0,0,0,0.35)'
                    : '2px 0 12px rgba(36,71,215,0.04)',
            }}
        >
            {/* Logo */}
            <div
                className={`relative flex items-center ${isCollapsed ? 'justify-center p-4 py-[34px]' : 'gap-3 p-[36px_16px_20px]'}`}
                style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#dde5f5'}` }}
            >
                <div className="w-[40px] h-[40px] bg-gradient-to-br from-[#2855e8] to-[#1a38b8] rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(40,85,232,0.38)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M4 6l3 11 5-7 5 7 3-11" fill="none" /></svg>
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col gap-[1px] min-w-0 flex-1 pr-4">
                        <span className="text-[0.95rem] font-bold tracking-[-0.3px] whitespace-nowrap" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Alpha Funding</span>
                        <span className="text-[0.62rem] font-bold tracking-[1.1px] uppercase" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>Tele Agent</span>
                    </div>
                )}

                <button
                    onClick={toggle}
                    className={`absolute top-[40px] flex items-center justify-center transition-all hover:scale-105 shadow-sm border ${isCollapsed ? '-right-3.5 w-7 h-7 rounded-full' : 'right-4 w-7 h-7 rounded-lg'}`}
                    style={{
                        color: isDark ? '#7a96fa' : '#2855e8',
                        background: isDark ? '#1a1f3c' : '#ffffff',
                        borderColor: isDark ? '#36407a' : '#dde5f5',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        {isCollapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
                {NAV_GROUPS.map((group) => (
                    <div className="flex flex-col gap-[2px]" key={group.group}>
                        {!isCollapsed && (
                            <span className="sidebar-group-label text-[0.68rem] font-bold tracking-[1.2px] uppercase px-2.5 pb-1.5" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>
                                {group.group}
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="sidebar-divider h-[1px] mx-1 my-1" style={{ background: isDark ? '#2c3568' : '#dde5f5' }} />
                        )}
                        {group.items.map((item) => {
                            const isActive = activePage.startsWith(item.path) || (item.id === 'leads' && (activePage.includes('lead-details') || activePage.includes('create-lead')));
                            const isComingSoon = item.comingSoon;
                            return (
                                <button
                                    key={item.id}
                                    title={isCollapsed ? (isComingSoon ? `${item.label} (Coming Soon)` : item.label) : undefined}
                                    className={`sidebar-nav-btn${isActive ? ' active' : ''} flex items-center gap-[10px] rounded-[9px] border-none group cursor-pointer font-['Sora',sans-serif] text-[0.875rem] font-medium text-left w-full relative ${isCollapsed ? 'justify-center p-[9px_0]' : 'p-[9px_12px]'} ${isComingSoon ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : ''}`}
                                    style={{
                                        background: isActive
                                            ? (isDark ? '#1e3278' : '#e0e7ff')
                                            : 'transparent',
                                        color: isActive
                                            ? (isDark ? '#7a96fa' : '#2855e8')
                                            : (isDark ? '#94abda' : '#3a4b7c'),
                                        fontWeight: isActive ? 600 : 500,
                                    }}
                                    onClick={() => !isComingSoon && onNavigate(item.id)}
                                >
                                    {!isCollapsed && isActive && (
                                        <span style={{
                                            position: 'absolute',
                                            left: '-12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '3px',
                                            height: '22px',
                                            background: isDark ? '#6080f8' : '#2855e8',
                                            borderRadius: '0 3px 3px 0',
                                        }} />
                                    )}
                                    <span className="nav-icon flex items-center shrink-0" style={{ color: isActive ? (isDark ? '#7a96fa' : '#2855e8') : (isDark ? '#546298' : '#7d8eb6') }}>
                                        {item.icon}
                                    </span>
                                    {!isCollapsed && (
                                        <div className="flex-1 flex items-center justify-between min-w-0">
                                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                                            {isComingSoon && (
                                                <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-2" style={{ background: isDark ? '#242b50' : '#edf2f7', color: isDark ? '#546298' : '#718096' }}>Soon</span>
                                            )}
                                        </div>
                                    )}
                                    {isCollapsed && isComingSoon && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: isDark ? '#6080f8' : '#2855e8' }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div style={{ borderTop: `1px solid ${isDark ? '#2c3568' : '#dde5f5'}` }}>
                {isCollapsed ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#94a3b8] to-[#64748b] text-white text-[0.7rem] font-bold flex items-center justify-center">{initials}</div>
                        <button
                            className="p-1 rounded transition-colors"
                            style={{ color: isDark ? '#7a96fa' : '#2855e8', background: isDark ? 'rgba(96,128,248,0.1)' : 'rgba(40,85,232,0.07)', border: isDark ? '1px solid rgba(96,128,248,0.22)' : '1px solid rgba(40,85,232,0.14)', cursor: 'pointer' }}
                            onClick={onLogout}
                            title="Logout"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </button>
                    </div>
                ) : (
                    <div
                        className="flex items-center gap-[10px] p-[14px_18px]"
                        style={{ background: isDark ? '#1c2040' : '#f5f6ff' }}
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#94a3b8] to-[#64748b] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0">{initials}</div>
                        <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                                <span className="text-[0.82rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{name}</span>
                                <button
                                    className="p-1 rounded-[5px] flex items-center shrink-0 transition-all"
                                    style={{ background: 'none', border: 'none', color: isDark ? '#546298' : '#7d8eb6', cursor: 'pointer' }}
                                    onClick={onLogout}
                                    title="Logout"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                </button>
                            </div>
                            <span className="text-[0.7rem] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>{email}</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default TeleAgentSidebar;

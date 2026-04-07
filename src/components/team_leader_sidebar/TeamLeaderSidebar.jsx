import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import alphaLogo from '../../assets/images/alpha.png';

const NAV_GROUPS = [
    {
        group: 'MAIN MENU',
        items: [
            { id: 'dashboard', path: '/team-leader/dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
            { id: 'lead-monitoring', path: '/team-leader/lead-monitoring', label: 'Lead Monitoring', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M21 12h-4l-3 9L9 3l-3 9H2" /></svg> },
            { id: 'calendar', path: '/team-leader/calendar', label: 'Tasks and Followups', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
            { id: 'promotions', path: '/team-leader/promotions', label: 'Lender Promotions', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> },
            
        ],
    },
];

const TeamLeaderSidebar = ({ activePage, onNavigate, onLogout, isOpen, onCollapseChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = `${user.first_name || 'Team'} ${user.last_name || 'Leader'}`.trim();
    const email = user.email || 'teamleader@alphafunding.com';
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
                    ? 'linear-gradient(160deg, #c8dcf0 0%, #d4e5f7 60%, #c8dcf0 100%)'
                    : 'linear-gradient(160deg, #1e2347 0%, #252b5c 60%, #1e2347 100%)',
                borderRight: `1px solid ${isDark ? '#a8c8e8' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isDark
                    ? '2px 0 24px rgba(59,130,246,0.15)'
                    : '2px 0 32px rgba(20,24,48,0.45)',
            }}
        >
            {/* Logo */}
            <div
                className={`relative flex items-center ${isCollapsed ? 'justify-center p-4 py-[34px]' : 'gap-3 p-[36px_16px_20px]'}`}
                style={{ borderBottom: `1px solid ${isDark ? '#a8c8e8' : 'rgba(255,255,255,0.08)'}` }}
            >
                <div className="w-[40px] h-[40px] bg-gradient-to-br from-[#2855e8] to-[#1a38b8] rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(40,85,232,0.38)]">
                    <img src={alphaLogo} alt="Alpha" className="w-full h-full object-contain" />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col gap-[1px] min-w-0 flex-1 pr-4">
                        <span className="text-[0.95rem] font-bold tracking-[-0.3px] whitespace-nowrap" style={{ color: isDark ? '#0f2952' : '#ffffff' }}>Alpha Funding</span>
                        <span className="text-[0.62rem] font-bold tracking-[1.1px] uppercase" style={{ color: isDark ? '#1d4ed8' : '#93c5fd' }}>Team Leader</span>
                    </div>
                )}

                <button
                    onClick={toggle}
                    className={`absolute top-[40px] flex items-center justify-center transition-all hover:scale-105 shadow-sm border ${isCollapsed ? '-right-3.5 w-7 h-7 rounded-full' : 'right-4 w-7 h-7 rounded-lg'}`}
                    style={{
                        color: isDark ? '#1d4ed8' : 'rgba(255,255,255,0.85)',
                        background: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
                        borderColor: isDark ? '#93c5fd' : 'rgba(255,255,255,0.15)',
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
                            <span className="sidebar-group-label text-[0.68rem] font-bold tracking-[1.2px] uppercase px-2.5 pb-1.5" style={{ color: isDark ? '#1d4ed8' : '#93c5fd' }}>
                                {group.group}
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="sidebar-divider h-[1px] mx-1 my-1" style={{ background: isDark ? '#a8c8e8' : 'rgba(255,255,255,0.1)' }} />
                        )}
                        {group.items.map((item) => {
                            const isActive = activePage.startsWith(item.path);
                            return (
                                <button
                                    key={item.id}
                                    title={isCollapsed ? item.label : undefined}
                                    className={`sidebar-nav-btn${isActive ? ' active' : ''} flex items-center gap-[10px] rounded-[9px] border-none group cursor-pointer font-['Sora',sans-serif] text-[0.875rem] font-medium text-left w-full relative ${isCollapsed ? 'justify-center p-[9px_0]' : 'p-[9px_12px]'}`}
                                    style={{
                                        background: isActive
                                            ? (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.14)')
                                            : 'transparent',
                                        color: isActive
                                            ? (isDark ? '#0f2952' : '#ffffff')
                                            : (isDark ? '#1e3a5f' : 'rgba(255,255,255,0.65)'),
                                        fontWeight: isActive ? 600 : 500,
                                    }}
                                    onClick={() => onNavigate(item.id)}
                                >
                                    {!isCollapsed && isActive && (
                                        <span style={{
                                            position: 'absolute',
                                            left: '-12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '3px',
                                            height: '22px',
                                            background: isDark ? '#1d4ed8' : 'rgba(255,255,255,0.9)',
                                            borderRadius: '0 3px 3px 0',
                                        }} />
                                    )}
                                    <span className="nav-icon flex items-center shrink-0" style={{ color: isActive ? (isDark ? '#0f2952' : '#ffffff') : (isDark ? '#3b6a9e' : 'rgba(255,255,255,0.45)') }}>
                                        {item.icon}
                                    </span>
                                    {!isCollapsed && <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div style={{ borderTop: `1px solid ${isDark ? '#a8c8e8' : 'rgba(255,255,255,0.08)'}` }}>
                {isCollapsed ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#94a3b8] to-[#64748b] text-white text-[0.7rem] font-bold flex items-center justify-center">{initials}</div>
                        <button
                            className="p-1 rounded transition-colors"
                            style={{ color: isDark ? '#1d4ed8' : 'rgba(255,255,255,0.8)', background: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)', border: isDark ? '1px solid #93c5fd' : '1px solid rgba(255,255,255,0.18)', cursor: 'pointer' }}
                            onClick={onLogout}
                            title="Logout"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </button>
                    </div>
                ) : (
                    <div
                        className="flex items-center gap-[10px] p-[14px_18px]"
                        style={{ background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.22)' }}
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#94a3b8] to-[#64748b] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0">{initials}</div>
                        <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                                <span className="text-[0.82rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: isDark ? '#0f2952' : '#ffffff' }}>{name}</span>
                                <button
                                    className="p-1 rounded-[5px] flex items-center shrink-0 transition-all"
                                    style={{ background: 'none', border: 'none', color: isDark ? '#1d4ed8' : 'rgba(255,255,255,0.55)', cursor: 'pointer' }}
                                    onClick={onLogout}
                                    title="Logout"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                </button>
                            </div>
                            <span className="text-[0.7rem] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: isDark ? '#2563eb' : 'rgba(255,255,255,0.5)' }}>{email}</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default TeamLeaderSidebar;

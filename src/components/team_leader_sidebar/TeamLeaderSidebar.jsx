import React, { useState } from 'react';

const NAV_GROUPS = [
    {
        group: 'MAIN MENU',
        items: [
            { id: 'dashboard',             path: '/team-leader/dashboard',             label: 'Dashboard',             icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
            { id: 'calendar',              path: '/team-leader/calendar',              label: 'Tasks and Followups',    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
            { id: 'lead-monitoring',       path: '/team-leader/lead-monitoring',       label: 'Lead Monitoring',       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M21 12h-4l-3 9L9 3l-3 9H2"/></svg> },
            { id: 'document-verification', path: '/team-leader/document-verification', label: 'Document Verification', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/></svg> },
        ],
    },
];

const TeamLeaderSidebar = ({ activePage, onNavigate, onLogout, isOpen, onCollapseChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = `${user.first_name || 'Team'} ${user.last_name || 'Leader'}`.trim();
    const email = user.email || 'teamleader@whiterock.com';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const toggle = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        onCollapseChange && onCollapseChange(next);
    };

    return (
        <aside className={`${isCollapsed ? 'w-[60px]' : 'w-[240px]'} h-screen bg-white border-r border-[#e8edf5] flex flex-col fixed left-0 top-0 z-[101] font-['Sora',sans-serif] shadow-[2px_0_12px_rgba(36,71,215,0.04)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${isOpen ? 'translate-x-0' : 'lg:-translate-x-full'}`}>

            {/* Logo */}
            <div className={`flex items-center border-b border-[#f0f4fb] ${isCollapsed ? 'justify-center p-4 py-[34px]' : 'gap-3 p-[36px_16px_20px]'}`}>
                <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#2447d7] to-[#1a38b8] rounded-lg flex items-center justify-center shrink-0 shadow-[0_3px_10px_rgba(36,71,215,0.3)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                {!isCollapsed && (
                    <>
                        <div className="flex flex-col gap-[1px] min-w-0 flex-1">
                            <span className="text-[0.95rem] font-bold text-[#1a1f36] tracking-[-0.3px] whitespace-nowrap">Whiterock CRM</span>
                            <span className="text-[0.62rem] font-bold tracking-[1.1px] text-[#94a3b8] uppercase">Team Leader</span>
                        </div>
                        <button onClick={toggle} className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[#94a3b8] hover:bg-[#f0f4fb] hover:text-[#2447d7] transition-colors" title="Collapse sidebar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                    </>
                )}
            </div>

            {isCollapsed && (
                <button onClick={toggle} className="mx-auto mt-2 w-8 h-8 rounded-md flex items-center justify-center text-[#94a3b8] hover:bg-[#f0f4fb] hover:text-[#2447d7] transition-colors" title="Expand sidebar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
                {NAV_GROUPS.map((group) => (
                    <div className="flex flex-col gap-[2px]" key={group.group}>
                        {!isCollapsed && <span className="text-[0.68rem] font-bold tracking-[1.2px] text-[#94a3b8] uppercase px-2.5 pb-1.5">{group.group}</span>}
                        {isCollapsed && <div className="h-[1px] bg-[#f0f4fb] mx-1 my-1" />}
                        {group.items.map((item) => {
                            const isActive = activePage.startsWith(item.path);
                            return (
                                <button
                                    key={item.id}
                                    title={isCollapsed ? item.label : undefined}
                                    className={`flex items-center gap-[10px] rounded-[9px] border-none group bg-transparent cursor-pointer font-['Sora',sans-serif] text-[0.875rem] font-medium text-left w-full transition-all duration-150 relative hover:bg-[#f0f4fb] hover:text-[#2447d7] ${isCollapsed ? 'justify-center p-[9px_0]' : 'p-[9px_12px]'} ${isActive ? 'bg-[#eef2ff] text-[#2447d7] font-semibold' + (!isCollapsed ? ' before:content-[""] before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[22px] before:bg-[#2447d7] before:rounded-[0_3px_3px_0]' : '') : 'text-[#4a5568]'}`}
                                    onClick={() => onNavigate(item.id)}
                                >
                                    <span className={`flex items-center shrink-0 transition-colors duration-150 group-hover:text-[#2447d7] ${isActive ? 'text-[#2447d7]' : 'text-[#94a3b8]'}`}>{item.icon}</span>
                                    {!isCollapsed && <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="border-t border-[#f0f4fb]">
                {isCollapsed ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#94a3b8] to-[#64748b] text-white text-[0.7rem] font-bold flex items-center justify-center">{initials}</div>
                        <button className="text-[#94a3b8] p-1 rounded hover:text-[#ef4444] hover:bg-[#fee2e2] transition-colors" onClick={onLogout} title="Logout">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-[10px] p-[14px_18px] bg-[#fafbff]">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#94a3b8] to-[#64748b] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0">{initials}</div>
                        <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                                <span className="text-[0.82rem] font-semibold text-[#1a1f36] whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
                                <button className="bg-none border-none text-[#94a3b8] cursor-pointer p-1 rounded-[5px] flex items-center shrink-0 transition-all hover:bg-[#fee2e2] hover:text-[#ef4444]" onClick={onLogout} title="Logout">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                </button>
                            </div>
                            <span className="text-[0.7rem] text-[#94a3b8] whitespace-nowrap overflow-hidden text-ellipsis">{email}</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default TeamLeaderSidebar;

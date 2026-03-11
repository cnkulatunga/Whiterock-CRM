import React from 'react';

const NAV_GROUPS = [
    {
        group: 'MAIN MENU',
        items: [
            {
                id: 'dashboard',
                path: '/tele-agent/dashboard',
                label: 'Dashboard',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                ),
            },
            {
                id: 'leads',
                path: '/tele-agent/leads',
                label: 'Leads',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M22 7l-3 3 2 2" />
                    </svg>
                ),
            },
            {
                id: 'follow-ups',
                path: '/tele-agent/follow-ups',
                label: 'Tasks & Follow-ups',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                ),
            },
        ],
    },
];

const TeleAgentSidebar = ({ activePage, onNavigate, onLogout, isOpen }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.role === 'tele_agent' ? 'Sarah Jenkins' : `${user.first_name || 'Tele'} ${user.last_name || 'Agent'}`.trim();
    const role = user.role === 'tele_agent' ? 'SENIOR AGENT' : 'TELE AGENT';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <aside className={`w-[260px] h-screen bg-white border-r border-[#edf2f7] flex flex-col py-6 shadow-[2px_0_10px_rgba(0,0,0,0.02)] fixed left-0 top-0 z-[101] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'lg:-translate-x-full'}`}>
            <div className="px-6 mb-8 flex items-center gap-3">
                <div className="w-[34px] h-[34px] bg-gradient-to-br from-[#2447d7] to-[#1732a3] rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(36,71,215,0.25)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-extrabold text-[#1a202c] tracking-tight leading-tight">Whiterock CRM</span>
                    <span className="text-[10px] font-semibold text-[#718096] tracking-wide">Tele Agent Portal</span>
                </div>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto">
                {NAV_GROUPS.map((group) => (
                    <div className="mb-6" key={group.group}>
                        {group.items.map((item) => (
                            <button
                                key={item.id}
                                className={`w-full h-12 px-4 mb-1 flex items-center gap-3 bg-transparent border-none rounded-[10px] text-[#4a5568] cursor-pointer transition-all duration-200 text-sm font-semibold text-left hover:bg-[#f8fafc] hover:text-[#2447d7] ${activePage.startsWith(item.path) || (item.id === 'leads' && (activePage.includes('lead-details') || activePage.includes('create-lead'))) ? 'bg-[#ebf0ff] text-[#2447d7]' : ''}`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <span className="flex items-center justify-center color-inherit">{item.icon}</span>
                                <span className="nav-item-label">{item.label}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="px-5 py-4 mt-auto border-t border-[#f7fafc]">
                <div className="flex items-center gap-3">
                    <div className="w-[34px] h-[34px] bg-[#ebf0ff] text-[#2447d7] rounded-lg flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {user.role === 'tele_agent' ? (
                            <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=2447d7&color=fff" alt="Sarah" className="w-full h-full object-cover" />
                        ) : initials}
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#1a202c] whitespace-nowrap overflow-hidden text-ellipsis mb-[1px]">{name}</span>
                        <span className="text-[9px] font-bold text-[#a0aec0] tracking-wide">{role}</span>
                    </div>
                    <button className="bg-transparent border border-[#edf2f7] w-8 h-8 rounded-lg text-[#a0aec0] flex items-center justify-center cursor-pointer transition-all duration-200 ml-2 shrink-0 hover:text-[#e53e3e] hover:border-[#fed7d7] hover:bg-[#fff5f5]" onClick={onLogout} title="Sign Out">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default TeleAgentSidebar;

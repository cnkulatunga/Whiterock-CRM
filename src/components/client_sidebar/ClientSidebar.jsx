import React from 'react';

const NAV_GROUPS = [
    {
        group: 'MAIN MENU',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                ),
            },
            {
                id: 'documents',
                label: 'Documents',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                ),
            },
            {
                id: 'loan-status',
                label: 'Loan Status',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 11 12 14 15 11" />
                    </svg>
                ),
            },
            {
                id: 'loan-history',
                label: 'Loan History',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                ),
            },
            {
                id: 'support',
                label: 'Support Page',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                ),
            },
        ],
    },
];

const ClientSidebar = ({ activePage, onNavigate, onLogout, isOpen }) => {
    // Get user data from localStorage for demo persistence
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = `${user.first_name || 'Client'} ${user.last_name || ''}`.trim();
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <aside className={`w-[260px] h-screen bg-white border-r border-[#edf2f7] flex flex-col py-6 shadow-[2px_0_10px_rgba(0,0,0,0.02)] fixed left-0 top-0 z-[101] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'lg:-translate-x-full'}`}>
            <div className="px-6 mb-8 flex items-center gap-3">
                <div className="w-[34px] h-[34px] bg-gradient-to-br from-[#2447d7] to-[#1732a3] rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(36,71,215,0.25)] shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-extrabold text-[#1a202c] tracking-tight leading-tight">Whiterock CRM</span>
                    <span className="text-[10px] font-semibold text-[#718096] tracking-wide">Customer Portal</span>
                </div>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto">
                {NAV_GROUPS.map((group) => (
                    <div className="mb-6" key={group.group}>
                        <span className="block px-2 mb-3 text-[11px] font-bold text-[#a0aec0] tracking-widest">{group.group}</span>
                        {group.items.map((item) => (
                            <button
                                key={item.id}
                                className={`w-[calc(100%-32px)] ml-4 h-12 px-4 mb-1 flex items-center gap-3 bg-transparent border-none rounded-[10px] text-[#4a5568] cursor-pointer transition-all duration-200 text-sm font-semibold hover:bg-[#f8fafc] hover:text-[#2447d7] ${activePage === item.id ? 'bg-[#ebf0ff] text-[#2447d7]' : ''}`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <span className="flex items-center justify-center shrink-0 color-inherit">{item.icon}</span>
                                <span className="flex-1 text-left">{item.label}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="p-6 mt-auto border-t border-[#edf2f7]">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#2447d7] text-white rounded-[10px] flex items-center justify-center font-bold text-sm shrink-0">{initials}</div>
                    <div className="flex-1 flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-[#1a202c] whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
                        <span className="text-[10px] font-semibold text-[#718096]">Premium Member</span>
                    </div>
                    <button className="bg-transparent border-none p-2 text-[#cbd5e0] cursor-pointer transition-all duration-200 flex items-center justify-center hover:text-[#e53e3e] hover:bg-[#fff5f5] hover:rounded-md" onClick={onLogout} title="Logout">
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

export default ClientSidebar;

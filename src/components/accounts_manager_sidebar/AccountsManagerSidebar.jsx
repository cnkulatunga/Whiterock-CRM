import React from 'react';

const NAV_ITEMS = [
    {
        group: 'MAIN MENU',
        items: [
            {
                id: 'accounts_manager_dashboard',
                path: '/accounts-manager/dashboard',
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
                id: 'lender_selector',
                path: '/accounts-manager/lender-selector',
                label: 'Lender Selector',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                ),
            },
            {
                id: 'lender_selection',
                path: '/accounts-manager/lender-selection',
                label: 'Lender Selection',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                ),
            },
            {
                id: 'financial_payment_report',
                path: '/accounts-manager/financial-payment-report',
                label: 'Finance & Payments',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                ),
            },
            {
                id: 'lead_performance_report',
                path: '/accounts-manager/lead-performance-report',
                label: 'Lead Performance',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                ),
            },
            {
                id: 'audit_logs',
                path: '/accounts-manager/audit-logs',
                label: 'Audit Logs',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                ),
            },
            {
                id: 'draft_dashboard',
                path: '/accounts-manager/draft-dashboard',
                label: 'Draft Dashboard',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                ),
            },
            {
                id: 'lender_selection_approved',
                path: '/accounts-manager/lender-selection-approved',
                label: 'Lender Selection Approved',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                ),
            },
        ]
    }
];

const AccountsManagerSidebar = ({ activePage, onNavigate, onLogout, isOpen }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = `${user.first_name || 'Alex'} ${user.last_name || 'Thompson'}`.trim();
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <aside className={`w-[260px] h-screen bg-white border-r border-[#edf2f7] flex flex-col pt-6 shadow-[2px_0_10px_rgba(0,0,0,0.02)] fixed left-0 top-0 z-[101] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'lg:-translate-x-full'}`}>
            <div className="px-6 mb-8 flex items-center gap-3">
                <div className="w-[34px] h-[34px] bg-gradient-to-br from-[#2447d7] to-[#1732a3] rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(36,71,215,0.25)] shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-extrabold text-[#1a202c] tracking-tight leading-tight">Whiterock CRM</span>
                    <span className="text-[10px] font-semibold text-[#718096] tracking-wide">Accounts Manager</span>
                </div>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto">
                {NAV_ITEMS.map((group) => (
                    <div className="mb-6" key={group.group}>
                        <span className="block px-2 mb-2 text-[11px] font-bold text-[#a0aec0] tracking-widest">{group.group}</span>
                        {group.items.map((item) => (
                            <button
                                key={item.id}
                                className={`w-full h-11 px-3 mb-0.5 flex items-center gap-2.5 bg-transparent border-none rounded-[10px] text-[#4a5568] cursor-pointer transition-all duration-200 text-sm font-semibold text-left hover:bg-[#f8fafc] hover:text-[#2447d7] ${activePage.startsWith(item.path) ? 'bg-[#ebf0ff] text-[#2447d7]' : ''}`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <span className="flex items-center justify-center shrink-0 color-inherit">{item.icon}</span>
                                <span className="flex-1">{item.label}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="px-6 py-4 border-t border-[#edf2f7]">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2447d7] to-[#1732a3] text-white rounded-[10px] flex items-center justify-center font-bold text-[13px] shrink-0">{initials}</div>
                    <div className="flex-1 flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-[#1a202c] whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
                        <span className="text-[10px] font-bold text-[#718096] tracking-wide">ACCOUNTS MANAGER</span>
                    </div>
                    <button className="bg-transparent border-none p-2 text-[#cbd5e0] cursor-pointer transition-all duration-200 flex items-center justify-center rounded-md hover:text-[#e53e3e] hover:bg-[#fff5f5]" onClick={onLogout} title="Logout">
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

export default AccountsManagerSidebar;

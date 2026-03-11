import React from 'react';

const NAV_GROUPS = [
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
                id: 'lender_selection_approved',
                path: '/accounts-manager/lender-selection-approved',
                label: 'Lender Approved',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
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
        ],
    },
    {
        group: 'REPORTS',
        items: [
            {
                id: 'financial_payment_report',
                path: '/accounts-manager/financial-payment-report',
                label: 'Finance & Payments',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
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
                    </svg>
                ),
            },
        ],
    },
];

const AccountsManagerSidebar = ({ activePage, onNavigate, onLogout, isOpen }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Alex Thompson';
    const email = user.email || 'accounts@whiterock.com';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <aside className={`w-[240px] min-w-[240px] h-screen bg-white border-r border-[#e8edf5] flex flex-col fixed left-0 top-0 z-[101] font-['Sora',sans-serif] shadow-[2px_0_12px_rgba(36,71,215,0.04)] transition-transform duration-[0.28s] ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0' : 'lg:-translate-x-full'}`}>

            {/* Logo */}
            <div className="flex items-center gap-3 p-[40px_20px_24px] border-b border-[#f0f4fb]">
                <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#2447d7] to-[#1a38b8] rounded-lg flex items-center justify-center shrink-0 shadow-[0_3px_10px_rgba(36,71,215,0.3)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="flex flex-col gap-[1px] min-w-0">
                    <span className="text-[0.95rem] font-bold text-[#1a1f36] tracking-[-0.3px] whitespace-nowrap">Whiterock CRM</span>
                    <span className="text-[0.62rem] font-bold tracking-[1.1px] text-[#94a3b8] uppercase">Accounts Manager</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-[12px_12px] flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
                {NAV_GROUPS.map((group) => (
                    <div className="flex flex-col gap-[2px]" key={group.group}>
                        <span className="text-[0.68rem] font-bold tracking-[1.2px] text-[#94a3b8] uppercase px-2.5 pb-1.5">{group.group}</span>
                        {group.items.map((item) => {
                            const isActive = activePage.startsWith(item.path);
                            return (
                                <button
                                    key={item.id}
                                    className={`flex items-center gap-[10px] p-[9px_12px] rounded-[9px] border-none group bg-transparent cursor-pointer font-['Sora',sans-serif] text-[0.875rem] font-medium text-left w-full transition-all duration-150 relative hover:bg-[#f0f4fb] hover:text-[#2447d7] ${isActive ? 'bg-[#eef2ff] text-[#2447d7] font-semibold before:content-[""] before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[22px] before:bg-[#2447d7] before:rounded-[0_3px_3px_0]' : 'text-[#4a5568]'}`}
                                    onClick={() => onNavigate(item.id)}
                                >
                                    <span className={`flex items-center shrink-0 transition-colors duration-150 group-hover:text-[#2447d7] ${isActive ? 'text-[#2447d7]' : 'text-[#94a3b8]'}`}>{item.icon}</span>
                                    <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="border-t border-[#f0f4fb]">
                <div className="flex items-center gap-[10px] p-[14px_18px] bg-[#fafbff]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#94a3b8] to-[#64748b] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0">{initials}</div>
                    <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[0.82rem] font-semibold text-[#1a1f36] whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
                            <button className="bg-none border-none text-[#94a3b8] cursor-pointer p-1 rounded-[5px] flex items-center shrink-0 transition-all duration-150 hover:bg-[#fee2e2] hover:text-[#ef4444]" onClick={onLogout} title="Logout">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                        <span className="text-[0.7rem] text-[#94a3b8] font-normal whitespace-nowrap overflow-hidden text-ellipsis">{email}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AccountsManagerSidebar;

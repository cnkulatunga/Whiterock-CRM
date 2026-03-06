import React from 'react';
import './Sidebar.css';

const NAV_GROUPS = [
    {
        group: 'MAIN MENU',
        items: [
            {
                id: 'dashboard',
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
                id: 'user-management',
                label: 'User Management',
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
                id: 'leads',
                label: 'Leads',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                ),
            },
            {
                id: 'accounts',
                label: 'Accounts',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                ),
            },
            {
                id: 'reports',
                label: 'Reports',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                ),
            },
        ],
    },
    {
        group: 'SYSTEM',
        items: [
            {
                id: 'settings',
                label: 'Settings',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                ),
            },
        ],
    },
];

const Sidebar = ({ activePage, onNavigate, onLogout }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <aside className="sidebar">
            {/* ── Logo ── */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="sidebar-logo-text">Whiterock</span>
            </div>

            {/* ── Navigation ── */}
            <nav className="sidebar-nav">
                {NAV_GROUPS.map((group) => (
                    <div className="nav-group" key={group.group}>
                        <span className="nav-group-label">{group.group}</span>
                        {group.items.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-item ${activePage === item.id ? 'nav-item--active' : ''}`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <span className="nav-item-icon">{item.icon}</span>
                                <span className="nav-item-label">{item.label}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── User Profile & Logout ── */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">{initials}</div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name-row">
                            <span className="sidebar-user-name">{name}</span>
                            <button className="btn-logout-small" onClick={onLogout} title="Logout">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                        <span className="sidebar-user-role">{user.is_staff ? 'Super Admin' : 'Staff'}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

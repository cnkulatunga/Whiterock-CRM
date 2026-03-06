import React from 'react';
import './TeleAgentSidebar.css';

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
                id: 'leads',
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

const TeleAgentSidebar = ({ activePage, onNavigate, onLogout }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.role === 'tele_agent' ? 'Sarah Jenkins' : `${user.first_name || 'Tele'} ${user.last_name || 'Agent'}`.trim();
    const role = user.role === 'tele_agent' ? 'SENIOR AGENT' : 'TELE AGENT';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <aside className="tele-sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="sidebar-logo-info">
                    <span className="sidebar-brand-name">Whiterock CRM</span>
                    <span className="sidebar-brand-subtext">Tele Agent Portal</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {NAV_GROUPS.map((group) => (
                    <div className="nav-group" key={group.group}>
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

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {user.role === 'tele_agent' ? (
                            <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=2447d7&color=fff" alt="Sarah" />
                        ) : initials}
                    </div>
                    <div className="sidebar-user-details">
                        <span className="sidebar-user-name">{name}</span>
                        <span className="sidebar-user-tier">{role}</span>
                    </div>
                    <button className="logout-action-btn" onClick={onLogout} title="Sign Out">
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

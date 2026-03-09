import React from 'react';
import './TeamLeaderSidebar.css';

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
                id: 'lead-monitoring',
                label: 'Lead Monitoring',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M21 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                ),
            },
            {
                id: 'document-verification',
                label: 'Document Verification',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <polyline points="20 6 9 17 4 12" />
                        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                    </svg>
                ),
            },
        ],
    },
];

const TeamLeaderSidebar = ({ activePage, onNavigate, onLogout }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = `${user.first_name || 'Team'} ${user.last_name || 'Leader'}`.trim();
    const role = 'TEAM LEADER';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <aside className="tele-sidebar tl-sidebar">
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
                    <span className="sidebar-brand-subtext">Team Leader Portal</span>
                </div>
            </div>

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

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2447d7&color=fff`} alt={name} />
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

export default TeamLeaderSidebar;

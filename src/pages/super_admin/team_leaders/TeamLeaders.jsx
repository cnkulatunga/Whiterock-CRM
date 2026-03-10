import React, { useState } from 'react';
import './TeamLeaders.css';
import { useUsers } from '../../../context/UsersContext';

/* ─── INITIAL TEAM MEMBERSHIPS (leaderId → members[]) ── */
const INITIAL_MEMBERSHIPS = {
    2: [ // Marcus Smith's team
        { id: 3,  name: 'Cody Lane',   email: 'cody.l@whiterock.crm',  phone: '', status: 'Active' },
    ],
    5: [ // Diana Fernandez's team
        { id: 6,  name: 'Leo Kumar',   email: 'leo.k@whiterock.crm',   phone: '', status: 'Active' },
        { id: 7,  name: 'Nina Hassan', email: 'nina.h@whiterock.crm',  phone: '', status: 'Inactive' },
    ],
};

/* ─── AVATAR COLORS ───────────────────────────── */
const AVATAR_COLORS = [
    { bg: '#dbeafe', text: '#1d4ed8' },
    { bg: '#f3e8ff', text: '#7c3aed' },
    { bg: '#dcfce7', text: '#15803d' },
    { bg: '#fef9c3', text: '#a16207' },
    { bg: '#fee2e2', text: '#b91c1c' },
    { bg: '#e0f2fe', text: '#0369a1' },
    { bg: '#fce7f3', text: '#be185d' },
    { bg: '#f1f5f9', text: '#475569' },
];

const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ─── ICONS ───────────────────────────────────── */
const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconChevron = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IconUsers = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconUserSingle = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const IconTeams = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
    </svg>
);
const IconBan = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);
const IconActivate = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
    </svg>
);

/* ─── SHARED: USER PICKER MODAL ───────────────── */
const UserPickerModal = ({ title, subtitle, iconWrapClass, confirmLabel, confirmBtnClass, excludeIds, onClose, onSelect }) => {
    const { users } = useUsers();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState('');

    const available = users.filter(u =>
        !excludeIds.includes(u.id) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
         u.email.toLowerCase().includes(search.toLowerCase()))
    );

    const handle = () => {
        if (!selected) { setError('Please select a user.'); return; }
        onSelect(selected);
        onClose();
    };

    return (
        <div className="tl-modal-overlay" onClick={onClose}>
            <div className="tl-modal-box tl-modal-box--picker" onClick={(e) => e.stopPropagation()}>
                <div className="tl-modal-header">
                    <div className="tl-modal-title-wrap">
                        <div className={`tl-modal-icon-wrap ${iconWrapClass}`}>
                            <IconUsers />
                        </div>
                        <div>
                            <h3>{title}</h3>
                            <p>{subtitle}</p>
                        </div>
                    </div>
                    <button className="tl-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="tl-picker-search-wrap">
                    <span className="tl-picker-search-icon"><IconSearch /></span>
                    <input
                        className="tl-picker-search"
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setError(''); }}
                        autoFocus
                    />
                </div>

                <div className="tl-picker-list">
                    {available.length === 0 ? (
                        <div className="tl-picker-state">
                            {search ? 'No users match your search.' : 'No users available to assign.'}
                        </div>
                    ) : (
                        available.map((u) => {
                            const av = getAvatarColor(u.id);
                            const isSelected = selected?.id === u.id;
                            return (
                                <div
                                    key={u.id}
                                    className={`tl-picker-row ${isSelected ? 'tl-picker-row--selected' : ''}`}
                                    onClick={() => { setSelected(u); setError(''); }}
                                >
                                    <div className="tl-avatar tl-avatar--sm" style={{ background: av.bg, color: av.text }}>
                                        {getInitials(u.name)}
                                    </div>
                                    <div className="tl-picker-user-info">
                                        <span className="tl-picker-name">{u.name}</span>
                                        <span className="tl-picker-email">{u.email}</span>
                                    </div>
                                    <span className={`tl-status-pill tl-status-pill--sm ${u.status === 'Active' ? 'tl-status-pill--active' : 'tl-status-pill--inactive'}`}>
                                        <span className="tl-status-dot" />{u.status}
                                    </span>
                                    {isSelected && (
                                        <span className="tl-picker-check">✓</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {error && <div className="tl-picker-error">{error}</div>}

                <div className="tl-picker-actions">
                    <button className="tl-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className={`tl-btn-primary ${confirmBtnClass}`} onClick={handle} disabled={!selected}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── MODAL: ADD TELE AGENT ───────────────────── */
const AddAgentModal = ({ leaderName, existingMemberIds, onClose, onAdd }) => (
    <UserPickerModal
        title="Add Tele Agent"
        subtitle={`Select a user to assign to ${leaderName}'s team`}
        iconWrapClass="tl-modal-icon-wrap--agent"
        confirmLabel="Add to Team"
        confirmBtnClass="tl-btn-primary--agent"
        excludeIds={existingMemberIds}
        onClose={onClose}
        onSelect={onAdd}
    />
);

/* ─── TEAM LEADER CARD ────────────────────────── */
const LeaderCard = ({ leader, onAddAgent, onToggleLeader, onToggleAgent, onRemoveAgent }) => {
    const [expanded, setExpanded] = useState(false);
    const [showAddAgent, setShowAddAgent] = useState(false);
    const av = getAvatarColor(leader.id);
    const activeMembers = leader.members.filter(m => m.status === 'Active').length;

    return (
        <>
            <div className={`tl-card ${leader.status === 'Inactive' ? 'tl-card--inactive' : ''}`}>
                {/* ── Card Header ── */}
                <div className="tl-card-header">
                    <div className="tl-card-leader-info">
                        <div className="tl-avatar tl-avatar--lg"
                            style={{ background: av.bg, color: av.text }}>
                            {getInitials(leader.name)}
                        </div>
                        <div className="tl-leader-details">
                            <div className="tl-leader-name-row">
                                <span className="tl-leader-name">{leader.name}</span>
                                <span className={`tl-status-pill ${leader.status === 'Active' ? 'tl-status-pill--active' : 'tl-status-pill--inactive'}`}>
                                    <span className="tl-status-dot" />
                                    {leader.status}
                                </span>
                            </div>
                            <span className="tl-leader-email">{leader.email}</span>
                            {leader.phone && <span className="tl-leader-phone">{leader.phone}</span>}
                        </div>
                    </div>

                    <div className="tl-card-meta">
                        <div className="tl-meta-stat">
                            <span className="tl-meta-count">{leader.members.length}</span>
                            <span className="tl-meta-label">Total Agents</span>
                        </div>
                        <div className="tl-meta-stat">
                            <span className="tl-meta-count tl-meta-count--active">{activeMembers}</span>
                            <span className="tl-meta-label">Active</span>
                        </div>
                    </div>
                </div>

                {/* ── Card Actions ── */}
                <div className="tl-card-footer">
                    <div className="tl-card-left-actions">
                        <button
                            className={`tl-toggle-status-btn ${leader.status === 'Active' ? 'tl-toggle-status-btn--deactivate' : 'tl-toggle-status-btn--activate'}`}
                            onClick={() => onToggleLeader(leader.id)}
                        >
                            {leader.status === 'Active' ? <><IconBan /> Deactivate</> : <><IconActivate /> Activate</>}
                        </button>
                    </div>
                    <div className="tl-card-right-actions">
                        <button className="tl-add-agent-btn" onClick={() => setShowAddAgent(true)}>
                            <IconPlus /> Add Agent
                        </button>
                        <button className="tl-expand-btn" onClick={() => setExpanded(e => !e)}>
                            View Team ({leader.members.length})
                            <IconChevron open={expanded} />
                        </button>
                    </div>
                </div>

                {/* ── Expanded Members List ── */}
                {expanded && (
                    <div className="tl-members-panel">
                        <div className="tl-members-header">
                            <span className="tl-members-title">Tele Agents — {leader.name}'s Team</span>
                        </div>
                        {leader.members.length === 0 ? (
                            <div className="tl-members-empty">
                                No agents assigned yet.
                                <button className="tl-members-empty-btn" onClick={() => setShowAddAgent(true)}>
                                    + Add first agent
                                </button>
                            </div>
                        ) : (
                            <div className="tl-members-list">
                                {leader.members.map((member) => {
                                    const mav = getAvatarColor(member.id);
                                    return (
                                        <div key={member.id} className={`tl-member-row ${member.status === 'Inactive' ? 'tl-member-row--inactive' : ''}`}>
                                            <div className="tl-member-info">
                                                <div className="tl-avatar tl-avatar--sm"
                                                    style={{ background: mav.bg, color: mav.text }}>
                                                    {getInitials(member.name)}
                                                </div>
                                                <div className="tl-member-details">
                                                    <span className="tl-member-name">{member.name}</span>
                                                    <span className="tl-member-email">{member.email}</span>
                                                </div>
                                            </div>
                                            <div className="tl-member-right">
                                                {member.phone && <span className="tl-member-phone">{member.phone}</span>}
                                                <span className={`tl-status-pill tl-status-pill--sm ${member.status === 'Active' ? 'tl-status-pill--active' : 'tl-status-pill--inactive'}`}>
                                                    <span className="tl-status-dot" />
                                                    {member.status}
                                                </span>
                                                <div className="tl-member-actions">
                                                    <button
                                                        className={`tl-member-btn ${member.status === 'Active' ? 'tl-member-btn--ban' : 'tl-member-btn--activate'}`}
                                                        title={member.status === 'Active' ? 'Deactivate agent' : 'Activate agent'}
                                                        onClick={() => onToggleAgent(leader.id, member.id)}
                                                    >
                                                        {member.status === 'Active' ? <IconBan /> : <IconActivate />}
                                                    </button>
                                                    <button
                                                        className="tl-member-btn tl-member-btn--remove"
                                                        title="Remove from team"
                                                        onClick={() => onRemoveAgent(leader.id, member.id)}
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showAddAgent && (
                <AddAgentModal
                    leaderName={leader.name}
                    existingMemberIds={leader.members.map(m => m.id)}
                    onClose={() => setShowAddAgent(false)}
                    onAdd={(user) => onAddAgent(leader.id, user)}
                />
            )}
        </>
    );
};

/* ─── MAIN PAGE ───────────────────────────────── */
const TeamLeaders = ({ onNavigate }) => {
    const { users, setUsers } = useUsers();
    const [memberships, setMemberships] = useState(INITIAL_MEMBERSHIPS); // { leaderId: members[] }
    const [search, setSearch] = useState('');

    /* Leaders = users with role "Team Leader" */
    const leaders = users
        .filter(u => u.role === 'Team Leader')
        .map(u => ({
            ...u,
            phone: u.phone || '',
            members: memberships[u.id] || [],
        }));

    /* KPI stats */
    const totalLeaders = leaders.length;
    const totalAgents = leaders.reduce((sum, l) => sum + l.members.length, 0);
    const activeTeams = leaders.filter(l => l.status === 'Active').length;

    /* Search filter */
    const filtered = leaders.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase())
    );

    /* Add agent to leader */
    const handleAddAgent = (leaderId, user) => {
        setMemberships(prev => ({
            ...prev,
            [leaderId]: [...(prev[leaderId] || []), { id: user.id, name: user.name, email: user.email, phone: user.phone || '', status: user.status }],
        }));
    };

    const handleToggleLeader = (leaderId) => {
        setUsers(prev => prev.map(u => u.id === leaderId
            ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
            : u
        ));
    };

    /* Toggle agent status */
    const handleToggleAgent = (leaderId, memberId) => {
        setMemberships(prev => ({
            ...prev,
            [leaderId]: (prev[leaderId] || []).map(m => m.id === memberId
                ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' }
                : m
            ),
        }));
    };

    /* Remove agent */
    const handleRemoveAgent = (leaderId, memberId) => {
        setMemberships(prev => ({
            ...prev,
            [leaderId]: (prev[leaderId] || []).filter(m => m.id !== memberId),
        }));
    };

    return (
        <div className="tl-wrapper">

            {/* ── TOP BAR ── */}
            <header className="tl-topbar">
                <div className="tl-search-wrap">
                    <span className="tl-search-icon"><IconSearch /></span>
                    <input
                        className="tl-search"
                        type="text"
                        placeholder="Search team leaders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="tl-create-btn" onClick={() => onNavigate('user-management')}>
                    <IconPlus /> Add Team Leader
                </button>
            </header>

            {/* ── PAGE CONTENT ── */}
            <div className="tl-content">

                {/* Breadcrumb */}
                <nav className="tl-breadcrumb">
                    <span>Admin Console</span>
                    <span className="tl-breadcrumb-sep">›</span>
                    <span className="tl-breadcrumb-active">Team Leaders</span>
                </nav>

                {/* Page heading */}
                <div className="tl-heading-row">
                    <div>
                        <h1 className="tl-title">Team Leaders</h1>
                        <p className="tl-subtitle">Manage team leaders and their tele agent members.</p>
                    </div>
                </div>

                {/* KPI Summary */}
                <div className="tl-kpi-row">
                    <div className="tl-kpi-card">
                        <div className="tl-kpi-icon tl-kpi-icon--blue"><IconUsers /></div>
                        <div className="tl-kpi-info">
                            <span className="tl-kpi-value">{totalLeaders}</span>
                            <span className="tl-kpi-label">Total Leaders</span>
                        </div>
                    </div>
                    <div className="tl-kpi-card">
                        <div className="tl-kpi-icon tl-kpi-icon--green"><IconUserSingle /></div>
                        <div className="tl-kpi-info">
                            <span className="tl-kpi-value">{totalAgents}</span>
                            <span className="tl-kpi-label">Total Tele Agents</span>
                        </div>
                    </div>
                    <div className="tl-kpi-card">
                        <div className="tl-kpi-icon tl-kpi-icon--purple"><IconTeams /></div>
                        <div className="tl-kpi-info">
                            <span className="tl-kpi-value">{activeTeams}</span>
                            <span className="tl-kpi-label">Active Teams</span>
                        </div>
                    </div>
                </div>

                {/* Leaders List */}
                {filtered.length === 0 ? (
                    <div className="tl-empty-state">
                        <div className="tl-empty-icon"><IconUsers /></div>
                        <h3>No team leaders found</h3>
                        <p>{search ? 'Try a different search term.' : 'Add your first team leader to get started.'}</p>
                        {!search && (
                            <button className="tl-create-btn" onClick={() => onNavigate('user-management')}>
                                <IconPlus /> Add Team Leader
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="tl-leaders-list">
                        {filtered.map((leader) => (
                            <LeaderCard
                                key={leader.id}
                                leader={leader}
                                onAddAgent={handleAddAgent}
                                onToggleLeader={handleToggleLeader}
                                onToggleAgent={handleToggleAgent}
                                onRemoveAgent={handleRemoveAgent}
                            />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default TeamLeaders;

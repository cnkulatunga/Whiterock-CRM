import React, { useState } from 'react';
import './UserManagement.css';

/* ─── SAMPLE DATA ─────────────────────────────── */
const INITIAL_USERS = [
    { id: 1, name: 'Jane Doe', email: 'jane.doe@whiterock.crm', initials: 'JD', color: '#dbeafe', textColor: '#1d4ed8', role: 'Super Admin', roleColor: 'role--super', status: 'Active' },
    { id: 2, name: 'Marcus Smith', email: 'm.smith@whiterock.crm', initials: 'MS', color: '#f3e8ff', textColor: '#7c3aed', role: 'Team Leader', roleColor: 'role--leader', status: 'Active' },
    { id: 3, name: 'Cody Lane', email: 'cody.l@whiterock.crm', initials: 'CL', color: '#f1f5f9', textColor: '#64748b', role: 'Tele Agent', roleColor: 'role--agent', status: 'Inactive' },
    { id: 4, name: 'Sarah White', email: 'sarah.w@whiterock.crm', initials: 'SW', color: '#fef9c3', textColor: '#a16207', role: 'Accounts Manager', roleColor: 'role--accounts', status: 'Active' },
];

const ALL_ROLES = ['All Roles', 'Super Admin', 'Team Leader', 'Tele Agent', 'Accounts Manager'];
const ALL_STATUSES = ['All Status', 'Active', 'Inactive'];
const PAGE_SIZE = 4;
const TOTAL_USERS = 24;

/* ─── ICON HELPERS ────────────────────────────── */
const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconBell = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IconHelp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconHistory = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
);
const IconBan = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);
const IconActivate = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const IconChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IconFilter = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);
const IconGrid = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const IconList = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

/* ─── EDIT USER MODAL ─────────────────────────── */
const EditUserModal = ({ user, onClose, onEdit }) => {
    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    });
    const [error, setError] = useState('');

    const handle = (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Name is required.'); return; }
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError('Enter a valid email address.'); return;
        }
        onEdit(user.id, form);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit User: {user.name}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handle} noValidate className="modal-form">
                    <div className="modal-field">
                        <label>Full Name</label>
                        <input type="text" placeholder="e.g. John Smith"
                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="modal-field">
                        <label>Email Address</label>
                        <input type="email" placeholder="e.g. john@whiterock.crm"
                            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="modal-field">
                        <label>Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            {ALL_ROLES.slice(1).map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="modal-field">
                        <label>Status</label>
                        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option>Active</option><option>Inactive</option>
                        </select>
                    </div>
                    {error && <div className="modal-error">{error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-create">Update User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── CREATE USER MODAL ───────────────────────── */
const CreateUserModal = ({ onClose, onCreate }) => {
    const [form, setForm] = useState({ name: '', email: '', role: 'Tele Agent', status: 'Active' });
    const [error, setError] = useState('');

    const handle = (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Name is required.'); return; }
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError('Enter a valid email address.'); return;
        }
        onCreate(form);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Create New User</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handle} noValidate className="modal-form">
                    <div className="modal-field">
                        <label>Full Name</label>
                        <input type="text" placeholder="e.g. John Smith"
                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="modal-field">
                        <label>Email Address</label>
                        <input type="email" placeholder="e.g. john@whiterock.crm"
                            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="modal-field">
                        <label>Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            {ALL_ROLES.slice(1).map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="modal-field">
                        <label>Status</label>
                        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option>Active</option><option>Inactive</option>
                        </select>
                    </div>
                    {error && <div className="modal-error">{error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-create">Create User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── MAIN COMPONENT ──────────────────────────── */
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const totalPages = 3;

    /* Role → css class map */
    const roleColorMap = {
        'Super Admin': 'role--super',
        'Team Leader': 'role--leader',
        'Tele Agent': 'role--agent',
        'Accounts Manager': 'role--accounts',
    };

    /* Avatar colors */
    const avatarColors = [
        { bg: '#dbeafe', text: '#1d4ed8' },
        { bg: '#f3e8ff', text: '#7c3aed' },
        { bg: '#f1f5f9', text: '#64748b' },
        { bg: '#fef9c3', text: '#a16207' },
        { bg: '#dcfce7', text: '#15803d' },
        { bg: '#fee2e2', text: '#b91c1c' },
    ];

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    /* Fetch users on mount */
    React.useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/users/', {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();

            // Map DRF fields to component fields if necessary
            const mappedUsers = data.map(u => ({
                id: u.id,
                name: `${u.first_name} ${u.last_name}`.trim() || u.email.split('@')[0],
                email: u.email,
                initials: getInitials(`${u.first_name} ${u.last_name}`.trim() || u.email.split('@')[0]),
                color: avatarColors[u.id % avatarColors.length].bg,
                textColor: avatarColors[u.id % avatarColors.length].text,
                role: u.is_staff ? 'Super Admin' : 'Tele Agent',
                roleColor: u.is_staff ? 'role--super' : 'role--agent',
                status: u.is_active ? 'Active' : 'Inactive',
            }));
            setUsers(mappedUsers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* Filtered users */
    const filtered = users.filter(u => {
        const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
        const matchStatus = statusFilter === 'All Status' || u.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    /* Toggle status */
    const toggleStatus = async (id) => {
        const user = users.find(u => u.id === id);
        try {
            const res = await fetch(`http://localhost:8000/api/users/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ is_active: user.status !== 'Active' }),
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    /* Create user */
    const handleCreate = async (form) => {
        try {
            const res = await fetch('http://localhost:8000/api/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: form.email,
                    first_name: form.name.split(' ')[0],
                    last_name: form.name.split(' ').slice(1).join(' '),
                    is_active: form.status === 'Active',
                    is_staff: form.role === 'Super Admin',
                }),
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error('Failed to create user:', err);
        }
    };

    /* Edit user */
    const handleEdit = async (id, form) => {
        try {
            const res = await fetch(`http://localhost:8000/api/users/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: form.email,
                    first_name: form.name.split(' ')[0],
                    last_name: form.name.split(' ').slice(1).join(' '),
                    is_active: form.status === 'Active',
                    is_staff: form.role === 'Super Admin',
                }),
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error('Failed to edit user:', err);
        }
    };

    return (
        <div className="um-wrapper">

            {/* ── TOP BAR ── */}
            <header className="um-topbar">
                <div className="um-search-wrap">
                    <span className="um-search-icon"><IconSearch /></span>
                    <input
                        className="um-search"
                        type="text"
                        placeholder="Search users, roles, or emails..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="um-topbar-actions">
                    <button className="um-icon-btn" aria-label="Notifications"><IconBell /></button>
                    <button className="um-icon-btn" aria-label="Help"><IconHelp /></button>
                    <button className="um-create-btn" onClick={() => setShowModal(true)}>
                        <IconPlus /> Create New User
                    </button>
                </div>
            </header>

            {/* ── PAGE CONTENT ── */}
            <div className="um-content">

                {/* Breadcrumb */}
                <nav className="um-breadcrumb">
                    <span>Admin Console</span>
                    <span className="um-breadcrumb-sep">›</span>
                    <span className="um-breadcrumb-active">User Management</span>
                </nav>

                {/* Page heading */}
                <div className="um-heading-row">
                    <div>
                        <h1 className="um-title">User Management</h1>
                        <p className="um-subtitle">Manage and audit team members, roles, and access permissions.</p>
                    </div>
                    <div className="um-view-toggle">
                        <button
                            className={`um-view-btn ${viewMode === 'list' ? 'um-view-btn--active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <IconList /> List View
                        </button>
                        <button
                            className={`um-view-btn ${viewMode === 'grid' ? 'um-view-btn--active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <IconGrid /> Grid View
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="um-filters">
                    <span className="um-filter-label"><IconFilter /> Filter By:</span>
                    <div className="um-select-wrap">
                        <select className="um-select" value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}>
                            {ALL_ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>
                        <span className="um-select-arrow"><IconChevronDown /></span>
                    </div>
                    <div className="um-select-wrap">
                        <select className="um-select" value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}>
                            {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <span className="um-select-arrow"><IconChevronDown /></span>
                    </div>
                    <button className="um-clear-btn" onClick={() => {
                        setRoleFilter('All Roles');
                        setStatusFilter('All Status');
                        setSearch('');
                    }}>
                        ✕ Clear Filters
                    </button>
                </div>

                {/* ── TABLE (List View) ── */}
                {loading ? (
                    <div className="um-loading">Loading users...</div>
                ) : error ? (
                    <div className="um-error">Error: {error}</div>
                ) : viewMode === 'list' && (
                    <div className="um-table-wrap">
                        <table className="um-table">
                            <thead>
                                <tr>
                                    <th>USER DETAILS</th>
                                    <th>ROLE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="um-empty">No users match the current filters.</td>
                                    </tr>
                                ) : (
                                    filtered.map((user) => (
                                        <tr key={user.id} className={user.status === 'Inactive' ? 'row--inactive' : ''}>
                                            <td>
                                                <div className="um-user-cell">
                                                    <div className="um-avatar"
                                                        style={{ background: user.color, color: user.textColor }}>
                                                        {user.initials}
                                                    </div>
                                                    <div>
                                                        <div className="um-user-name">{user.name}</div>
                                                        <div className="um-user-email">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`um-role-badge ${user.roleColor}`}>{user.role}</span>
                                            </td>
                                            <td>
                                                <span className={`um-status ${user.status === 'Active' ? 'status--active' : 'status--inactive'}`}>
                                                    <span className="status-dot" />
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="um-actions">
                                                    <button className="um-action-btn" title="Edit user" onClick={() => setEditingUser(user)}><IconEdit /></button>
                                                    <button className="um-action-btn" title="View history"><IconHistory /></button>
                                                    <button
                                                        className={`um-action-btn ${user.status === 'Active' ? 'btn--ban' : 'btn--activate'}`}
                                                        title={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}
                                                        onClick={() => toggleStatus(user.id)}
                                                    >
                                                        {user.status === 'Active' ? <IconBan /> : <IconActivate />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="um-pagination">
                            <span className="um-pagination-info">
                                Showing {filtered.length} of {TOTAL_USERS} users
                            </span>
                            <div className="um-pagination-btns">
                                <button className="um-page-btn"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}>‹</button>
                                {[1, 2, 3].map(p => (
                                    <button key={p}
                                        className={`um-page-btn ${currentPage === p ? 'um-page-btn--active' : ''}`}
                                        onClick={() => setCurrentPage(p)}>{p}</button>
                                ))}
                                <button className="um-page-btn"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}>›</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── GRID VIEW ── */}
                {viewMode === 'grid' && (
                    <div className="um-grid">
                        {filtered.length === 0 ? (
                            <div className="um-empty-grid">No users match the current filters.</div>
                        ) : (
                            filtered.map((user) => (
                                <div key={user.id} className={`um-grid-card ${user.status === 'Inactive' ? 'card--inactive' : ''}`}>
                                    <div className="um-grid-avatar"
                                        style={{ background: user.color, color: user.textColor }}>
                                        {user.initials}
                                    </div>
                                    <div className="um-grid-name">{user.name}</div>
                                    <div className="um-grid-email">{user.email}</div>
                                    <span className={`um-role-badge ${user.roleColor}`}>{user.role}</span>
                                    <span className={`um-status ${user.status === 'Active' ? 'status--active' : 'status--inactive'}`}>
                                        <span className="status-dot" />{user.status}
                                    </span>
                                    <div className="um-actions um-actions--center">
                                        <button className="um-action-btn" title="Edit" onClick={() => setEditingUser(user)}><IconEdit /></button>
                                        <button className="um-action-btn" title="History"><IconHistory /></button>
                                        <button
                                            className={`um-action-btn ${user.status === 'Active' ? 'btn--ban' : 'btn--activate'}`}
                                            title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            onClick={() => toggleStatus(user.id)}
                                        >
                                            {user.status === 'Active' ? <IconBan /> : <IconActivate />}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* ── CREATE USER MODAL ── */}
            {showModal && (
                <CreateUserModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
            )}

            {/* ── EDIT USER MODAL ── */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
};

export default UserManagement;

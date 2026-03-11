import React, { useState } from 'react';
import { useUsers } from '../../../context/UsersContext';

const ALL_ROLES = ['All Roles', 'Super Admin', 'Team Leader', 'Tele Agent', 'Accounts Manager'];
const ALL_STATUSES = ['All Status', 'Active', 'Inactive'];
const TOTAL_USERS = 24;

/* ─── ICONS ────────────────────────────────────── */
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconHistory = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
);
const IconBan = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);
const IconActivate = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const IconChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IconGrid = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const IconList = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

/* ─── MODAL ─────────────────────────────────────── */
const UserModal = ({ title, children, onClose, onSubmit, submitLabel, submitClass }) => (
    <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fadeIn p-6" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#f1f5f9] flex justify-between items-center">
                <h3 className="text-[15px] font-semibold text-[#1a202c]">{title}</h3>
                <button className="text-[#a0aec0] hover:text-[#1a202c] transition-colors p-1.5 rounded-lg hover:bg-[#f8fafc]" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <form onSubmit={onSubmit} noValidate className="p-6">
                <div className="flex flex-col gap-4">{children}</div>
                <div className="mt-6 flex gap-3">
                    <button type="button" className="flex-1 py-2.5 bg-white border border-[#edf2f7] rounded-xl text-[13px] font-medium text-[#718096] hover:bg-[#f8fafc] transition-all" onClick={onClose}>Cancel</button>
                    <button type="submit" className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all ${submitClass}`}>{submitLabel}</button>
                </div>
            </form>
        </div>
    </div>
);

const UserFormFields = ({ form, setForm, error }) => (
    <>
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">Full Name</label>
            <input type="text" className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/30 transition-all" placeholder="e.g. John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">Email Address</label>
            <input type="email" className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/30 transition-all" placeholder="e.g. john@whiterock.crm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">Role</label>
                <div className="relative">
                    <select className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 pr-8 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/30 transition-all" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                        {ALL_ROLES.slice(1).map(r => <option key={r}>{r}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IconChevronDown /></div>
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">Status</label>
                <div className="relative">
                    <select className="w-full bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3 pr-8 rounded-xl text-[13px] font-medium text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/30 transition-all" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option>Active</option><option>Inactive</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IconChevronDown /></div>
                </div>
            </div>
        </div>
        {error && <div className="p-3 bg-[#fef2f2] border border-[#fee2e2] text-[#dc2626] text-[12px] font-medium text-center rounded-xl animate-shake">{error}</div>}
    </>
);

const EditUserModal = ({ user, onClose, onEdit }) => {
    const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role, status: user.status });
    const [error, setError] = useState('');
    const handle = (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Name is required.'); return; }
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address.'); return; }
        onEdit(user.id, form); onClose();
    };
    return <UserModal title={`Edit User: ${user.name}`} onClose={onClose} onSubmit={handle} submitLabel="Update User" submitClass="bg-[#2447d7] hover:bg-[#1732a3]"><UserFormFields form={form} setForm={setForm} error={error} /></UserModal>;
};

const CreateUserModal = ({ onClose, onCreate }) => {
    const [form, setForm] = useState({ name: '', email: '', role: 'Tele Agent', status: 'Active' });
    const [error, setError] = useState('');
    const handle = (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Name is required.'); return; }
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address.'); return; }
        onCreate(form); onClose();
    };
    return <UserModal title="Create New User" onClose={onClose} onSubmit={handle} submitLabel="Create User" submitClass="bg-[#2447d7] hover:bg-[#1732a3]"><UserFormFields form={form} setForm={setForm} error={error} /></UserModal>;
};

/* ─── MAIN COMPONENT ──────────────────────────── */
const UserManagement = () => {
    const { users, setUsers } = useUsers();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [viewMode, setViewMode] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const totalPages = 3;

    const roleColorMap = {
        'Super Admin':      'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]',
        'Team Leader':      'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]',
        'Tele Agent':       'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]',
        'Accounts Manager': 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]',
    };
    const avatarColors = [
        { bg: '#ebf0ff', text: '#2447d7' },
        { bg: '#f3e8ff', text: '#7c3aed' },
        { bg: '#f1f5f9', text: '#475569' },
        { bg: '#fffbeb', text: '#d97706' },
        { bg: '#ecfdf5', text: '#059669' },
        { bg: '#fef2f2', text: '#dc2626' },
    ];
    const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    React.useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/users/', { credentials: 'include' });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setUsers(data.map(u => ({
                id: u.id,
                name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email.split('@')[0],
                email: u.email,
                initials: getInitials(`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email.split('@')[0]),
                color: avatarColors[u.id % avatarColors.length].bg,
                textColor: avatarColors[u.id % avatarColors.length].text,
                role: u.is_staff ? 'Super Admin' : 'Tele Agent',
                roleColor: u.is_staff ? roleColorMap['Super Admin'] : roleColorMap['Tele Agent'],
                status: u.is_active ? 'Active' : 'Inactive',
            })));
        } catch { /* keep sample data */ }
    };

    const filtered = users.filter(u => {
        const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
        const matchStatus = statusFilter === 'All Status' || u.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    const buildLocalUser = (id, form) => ({
        id, name: form.name, email: form.email,
        initials: getInitials(form.name),
        color: avatarColors[id % avatarColors.length].bg,
        textColor: avatarColors[id % avatarColors.length].text,
        role: form.role,
        roleColor: roleColorMap[form.role] || roleColorMap['Tele Agent'],
        status: form.status,
    });

    const toggleStatus = async (id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
        try {
            const user = users.find(u => u.id === id);
            await fetch(`http://localhost:8000/api/users/${id}/`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ is_active: user.status !== 'Active' }) });
        } catch { /* ignored */ }
    };

    const handleCreate = async (form) => {
        const tempId = Date.now();
        setUsers(prev => [...prev, buildLocalUser(tempId, form)]);
        try {
            const res = await fetch('http://localhost:8000/api/users/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email: form.email, first_name: form.name.split(' ')[0], last_name: form.name.split(' ').slice(1).join(' '), is_active: form.status === 'Active', is_staff: form.role === 'Super Admin' }) });
            if (res.ok) fetchUsers();
        } catch { /* kept as temp */ }
    };

    const handleEdit = async (id, form) => {
        setUsers(prev => prev.map(u => u.id === id ? buildLocalUser(id, form) : u));
        try {
            const res = await fetch(`http://localhost:8000/api/users/${id}/`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email: form.email, first_name: form.name.split(' ')[0], last_name: form.name.split(' ').slice(1).join(' '), is_active: form.status === 'Active', is_staff: form.role === 'Super Admin' }) });
            if (res.ok) fetchUsers();
        } catch { /* ignored */ }
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">

            {/* ── HEADER ── */}
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold text-[#1a202c] mb-1">User Management</h1>
                    <p className="text-sm text-[#718096] animate-fadeIn [animation-delay:150ms] [animation-fill-mode:both]">Manage and audit team members, roles, and access permissions.</p>
                </div>
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium border transition-all ${viewMode === 'list' ? 'bg-white text-[#2447d7] border-[#2447d7]/20 shadow-sm' : 'text-[#718096] border-[#edf2f7] bg-white hover:bg-[#f8fafc]'}`}
                        onClick={() => setViewMode('list')}
                    >
                        <IconList /> List View
                    </button>
                    <button
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium border transition-all ${viewMode === 'grid' ? 'bg-white text-[#2447d7] border-[#2447d7]/20 shadow-sm' : 'text-[#718096] border-[#edf2f7] bg-white hover:bg-[#f8fafc]'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <IconGrid /> Grid View
                    </button>
                </div>
            </header>

            {/* ── FILTERS ── */}
            <div className="bg-white rounded-2xl border border-[#edf2f7] px-5 py-4 shadow-sm flex items-center justify-between gap-4 flex-wrap animate-slideDown [animation-delay:100ms] [animation-fill-mode:both]">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest whitespace-nowrap">Filter By:</span>
                    <div className="relative">
                        <select className="bg-[#f8fafc] border border-[#edf2f7] py-2 px-3 pr-7 rounded-xl text-[13px] font-medium text-[#4a5568] outline-none appearance-none cursor-pointer hover:border-[#2447d7]/30 transition-colors" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            {ALL_ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IconChevronDown /></div>
                    </div>
                    <div className="relative">
                        <select className="bg-[#f8fafc] border border-[#edf2f7] py-2 px-3 pr-7 rounded-xl text-[13px] font-medium text-[#4a5568] outline-none appearance-none cursor-pointer hover:border-[#2447d7]/30 transition-colors" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0]"><IconChevronDown /></div>
                    </div>
                    {(roleFilter !== 'All Roles' || statusFilter !== 'All Status' || search) && (
                        <button className="text-[12px] font-medium text-[#dc2626] hover:underline transition-all" onClick={() => { setRoleFilter('All Roles'); setStatusFilter('All Status'); setSearch(''); }}>
                            ✕ Clear
                        </button>
                    )}
                </div>
                <button className="flex items-center gap-2 bg-[#2447d7] text-white px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#1732a3] transition-colors shadow-sm" onClick={() => setShowModal(true)}>
                    <IconPlus /> Create New User
                </button>
            </div>

            {/* ── TABLE (List View) ── */}
            {viewMode === 'list' && (
                <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden animate-slideUp [animation-delay:200ms] [animation-fill-mode:both]">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#f8fafc]">
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">USER DETAILS</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">ROLE</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">STATUS</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#a0aec0] uppercase tracking-widest">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7fafc]">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-16 text-center text-[13px] text-[#a0aec0] font-medium">No users match the current filters.</td>
                                    </tr>
                                ) : (
                                    filtered.map((user, i) => (
                                        <tr key={user.id} className={`hover:bg-[#f8faff] transition-colors animate-rowIn ${user.status === 'Inactive' ? 'opacity-60' : ''}`} style={{ animationDelay: `${250 + i * 50}ms`, animationFillMode: 'both' }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: user.color, color: user.textColor }}>{user.initials}</div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[13px] font-semibold text-[#1a202c] truncate">{user.name}</span>
                                                        <span className="text-[12px] text-[#a0aec0] truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${user.roleColor}`}>{user.role}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-1.5 text-[12px] font-medium ${user.status === 'Active' ? 'text-[#059669]' : 'text-[#64748b]'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#059669]' : 'bg-[#64748b]'}`} />
                                                    {user.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="w-8 h-8 rounded-lg bg-white border border-[#edf2f7] text-[#4a5568] flex items-center justify-center hover:bg-[#2447d7] hover:text-white hover:border-[#2447d7] transition-all" title="Edit user" onClick={() => setEditingUser(user)}><IconEdit /></button>
                                                    <button className="w-8 h-8 rounded-lg bg-white border border-[#edf2f7] text-[#4a5568] flex items-center justify-center hover:bg-[#1a202c] hover:text-white hover:border-[#1a202c] transition-all" title="View history"><IconHistory /></button>
                                                    <button
                                                        className={`w-8 h-8 rounded-lg border transition-all flex items-center justify-center ${user.status === 'Active' ? 'bg-[#fff5f5] text-[#dc2626] border-[#fee2e2] hover:bg-[#dc2626] hover:text-white' : 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5] hover:bg-[#059669] hover:text-white'}`}
                                                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
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
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-[#f7fafc] flex justify-between items-center">
                        <span className="text-[12px] text-[#a0aec0]">
                            Showing <span className="font-semibold text-[#2447d7]">{filtered.length}</span> of <span className="font-semibold text-[#1a202c]">{TOTAL_USERS} users</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button className="w-8 h-8 bg-white border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6" /></svg>
                            </button>
                            {[1, 2, 3].map(p => (
                                <button key={p}
                                    className={`w-8 h-8 rounded-xl text-[13px] font-medium transition-all ${currentPage === p ? 'bg-[#2447d7] text-white shadow-sm' : 'text-[#718096] bg-white border border-[#edf2f7] hover:bg-[#f1f5f9]'}`}
                                    onClick={() => setCurrentPage(p)}>{p}
                                </button>
                            ))}
                            <button className="w-8 h-8 bg-white border border-[#edf2f7] rounded-xl flex items-center justify-center text-[#a0aec0] hover:text-[#2447d7] hover:border-[#2447d7] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* ── GRID VIEW ── */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-4 gap-5 lg:grid-cols-2 sm:grid-cols-1">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#edf2f7] text-[#a0aec0] text-[13px] font-medium">No users match the current filters.</div>
                    ) : (
                        filtered.map((user, i) => (
                            <div key={user.id} className={`bg-white rounded-2xl border border-[#edf2f7] p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all animate-popIn ${user.status === 'Inactive' ? 'opacity-60' : ''}`} style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl transition-transform duration-300 hover:scale-110 hover:rotate-3 animate-avatarPop" style={{ background: user.color, color: user.textColor, animationDelay: `${i * 60 + 80}ms`, animationFillMode: 'both' }}>{user.initials}</div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <div className="text-[14px] font-semibold text-[#1a202c]">{user.name}</div>
                                    <div className="text-[12px] text-[#a0aec0]">{user.email}</div>
                                </div>
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <span className={`text-[10px] font-semibold px-3 py-1 rounded-lg border uppercase tracking-wider ${user.roleColor}`}>{user.role}</span>
                                    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${user.status === 'Active' ? 'text-[#059669]' : 'text-[#64748b]'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#059669]' : 'bg-[#64748b]'}`} />
                                        {user.status}
                                    </div>
                                </div>
                                <div className="w-full h-px bg-[#f1f5f9]" />
                                <div className="flex items-center gap-2">
                                    <button className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#718096] flex items-center justify-center hover:bg-[#2447d7] hover:text-white transition-all" title="Edit" onClick={() => setEditingUser(user)}><IconEdit /></button>
                                    <button className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#718096] flex items-center justify-center hover:bg-[#1a202c] hover:text-white transition-all" title="History"><IconHistory /></button>
                                    <button className={`w-8 h-8 rounded-lg border transition-all flex items-center justify-center ${user.status === 'Active' ? 'bg-[#fff5f5] text-[#dc2626] border-[#fee2e2] hover:bg-[#dc2626] hover:text-white' : 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5] hover:bg-[#059669] hover:text-white'}`}
                                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => toggleStatus(user.id)}>
                                        {user.status === 'Active' ? <IconBan /> : <IconActivate />}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showModal && <CreateUserModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
            {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onEdit={handleEdit} />}
        </div>
    );
};

export default UserManagement;

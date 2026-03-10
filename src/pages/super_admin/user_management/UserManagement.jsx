import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useUsers } from '../../../context/UsersContext';

const ALL_ROLES = ['All Roles', 'Super Admin', 'Team Leader', 'Tele Agent', 'Accounts Manager'];
const ALL_STATUSES = ['All Status', 'Active', 'Inactive'];
const PAGE_SIZE = 4;
const TOTAL_USERS = 24;

/* ─── ICON HELPERS ────────────────────────────── */
const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconHistory = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
);
const IconBan = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);
const IconActivate = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const IconChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IconFilter = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);
const IconGrid = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const IconList = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

/* ─── GENERIC MODAL WRAPPER ─────────────────────── */
const UserModal = ({ title, children, onClose, onSubmit, submitLabel, submitClass }) => (
    <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fadeIn p-6" onClick={onClose}>
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[500px] overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-[#f1f5f9] flex justify-between items-center">
                <h3 className="text-xl font-black text-[#1a202c] tracking-tight">{title}</h3>
                <button className="text-[#a0aec0] hover:text-[#1a202c] transition-colors p-2" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <form onSubmit={onSubmit} noValidate className="p-8">
                <div className="flex flex-col gap-6">
                    {children}
                </div>
                <div className="mt-10 flex gap-4">
                    <button type="button" className="flex-1 p-4 bg-white border-2 border-[#edf2f7] rounded-2xl text-[14px] font-black text-[#718096] hover:bg-[#f8fafc] transition-all active:scale-95" onClick={onClose}>Cancel</button>
                    <button type="submit" className={`flex-1 p-4 rounded-2xl text-[14px] font-black text-white shadow-xl transition-all active:scale-95 ${submitClass}`}>{submitLabel}</button>
                </div>
            </form>
        </div>
    </div>
);

const UserFormFields = ({ form, setForm, error }) => (
    <>
        <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">Full Name</label>
            <input 
                type="text" 
                className="w-full bg-[#f8fafc] border-2 border-[#edf2f7] p-4 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all"
                placeholder="e.g. John Smith"
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
            />
        </div>
        <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">Email Address</label>
            <input 
                type="email" 
                className="w-full bg-[#f8fafc] border-2 border-[#edf2f7] p-4 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all"
                placeholder="e.g. john@whiterock.crm"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">Role</label>
                <div className="relative group">
                    <select 
                        className="w-full bg-[#f8fafc] border-2 border-[#edf2f7] p-4 px-6 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/20 transition-all"
                        value={form.role} 
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                        {ALL_ROLES.slice(1).map(r => <option key={r}>{r}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-focus-within:text-[#2447d7]">
                        <IconChevronDown />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest pl-1">Status</label>
                <div className="relative group">
                    <select 
                        className="w-full bg-[#f8fafc] border-2 border-[#edf2f7] p-4 px-6 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/20 transition-all"
                        value={form.status} 
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-focus-within:text-[#2447d7]">
                        <IconChevronDown />
                    </div>
                </div>
            </div>
        </div>
        {error && <div className="p-3 bg-[#fef2f2] border border-[#fee2e2] text-[#dc2626] text-[12px] font-black uppercase tracking-wider text-center rounded-xl animate-shake">{error}</div>}
    </>
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
        <UserModal 
            title={`Edit User: ${user.name}`} 
            onClose={onClose} 
            onSubmit={handle} 
            submitLabel="Update User" 
            submitClass="bg-[#2447d7] shadow-[#2447d7]/20 hover:bg-[#1732a3]"
        >
            <UserFormFields form={form} setForm={setForm} error={error} />
        </UserModal>
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
        <UserModal 
            title="Create New User" 
            onClose={onClose} 
            onSubmit={handle} 
            submitLabel="Create System User" 
            submitClass="bg-[#10b981] shadow-[#10b981]/20 hover:bg-[#059669]"
        >
            <UserFormFields form={form} setForm={setForm} error={error} />
        </UserModal>
    );
};

/* ─── MAIN COMPONENT ──────────────────────────── */
const UserManagement = () => {
    const { users, setUsers } = useUsers();
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
        'Super Admin': 'bg-[#ebf0ff] text-[#2447d7] border-[#d9e8ff]',
        'Team Leader': 'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]',
        'Tele Agent': 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]',
        'Accounts Manager': 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]',
    };

    /* Avatar colors */
    const avatarColors = [
        { bg: '#ebf0ff', text: '#2447d7' },
        { bg: '#f3e8ff', text: '#7c3aed' },
        { bg: '#f1f5f9', text: '#475569' },
        { bg: '#fffbeb', text: '#d97706' },
        { bg: '#ecfdf5', text: '#059669' },
        { bg: '#fef2f2', text: '#dc2626' },
    ];

    const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    /* Fetch users on mount */
    React.useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/users/', {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            const mappedUsers = data.map(u => ({
                id: u.id,
                name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email.split('@')[0],
                email: u.email,
                initials: getInitials(`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email.split('@')[0]),
                color: avatarColors[u.id % avatarColors.length].bg,
                textColor: avatarColors[u.id % avatarColors.length].text,
                role: u.is_staff ? 'Super Admin' : 'Tele Agent',
                roleColor: u.is_staff ? roleColorMap['Super Admin'] : roleColorMap['Tele Agent'],
                status: u.is_active ? 'Active' : 'Inactive',
            }));
            setUsers(mappedUsers);
        } catch (err) {
            /* keep showing sample data already in state if API fails */
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

    /* Build a local user object from a form */
    const buildLocalUser = (id, form) => ({
        id,
        name: form.name,
        email: form.email,
        initials: getInitials(form.name),
        color: avatarColors[id % avatarColors.length].bg,
        textColor: avatarColors[id % avatarColors.length].text,
        role: form.role,
        roleColor: roleColorMap[form.role] || roleColorMap['Tele Agent'],
        status: form.status,
    });

    /* Toggle status */
    const toggleStatus = async (id) => {
        setUsers(prev => prev.map(u => u.id === id
            ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
            : u
        ));
        try {
            const user = users.find(u => u.id === id);
            await fetch(`http://localhost:8000/api/users/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ is_active: user.status !== 'Active' }),
            });
        } catch { /* ignored */ }
    };

    /* Create user */
    const handleCreate = async (form) => {
        const tempId = Date.now();
        setUsers(prev => [...prev, buildLocalUser(tempId, form)]);
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
        } catch { /* kept as temp */ }
    };

    /* Edit user */
    const handleEdit = async (id, form) => {
        setUsers(prev => prev.map(u => u.id === id ? buildLocalUser(id, form) : u));
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
        } catch { /* ignored */ }
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">

            {/* ── MOBILE HEADER PORTAL ── */}
            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="p-4 px-6 border-b border-[#edf2f7] bg-white flex items-center gap-4 fixed top-[60px] left-0 right-0 z-40">
                    <div className="relative group flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                            <IconSearch />
                        </div>
                        <input
                            className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 pl-12 rounded-2xl text-sm font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all"
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="w-12 h-12 bg-[#10b981] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#10b981]/20 active:scale-95" onClick={() => setShowModal(true)}>
                        <IconPlus />
                    </button>
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            <div className="flex flex-col gap-8">

                {/* Page heading */}
                <header className="flex justify-between items-end gap-6 flex-wrap lg:items-start lg:flex-col">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[1.75rem] font-black text-[#1a202c] tracking-tight sm:text-2xl">User Management</h1>
                        <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Manage and audit team members, roles, and access permissions.</p>
                    </div>
                    <div className="flex items-center gap-4 lg:hidden">
                        <div className="flex bg-[#f1f5f9] p-1.5 rounded-2xl shadow-inner border border-[#edf2f7]">
                            <button
                                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all active:scale-95 ${viewMode === 'list' ? 'bg-white text-[#2447d7] shadow-xl' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <IconList /> List View
                            </button>
                            <button
                                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all active:scale-95 ${viewMode === 'grid' ? 'bg-white text-[#2447d7] shadow-xl' : 'text-[#718096] hover:text-[#4a5568]'}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <IconGrid /> Grid View
                            </button>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className="bg-white rounded-3xl border border-[#edf2f7] p-8 shadow-sm flex items-center justify-between gap-6 sm:p-6 sm:flex-col sm:items-stretch">
                    <div className="flex items-center gap-6 flex-wrap flex-1 min-w-0">
                         <div className="relative group min-w-[300px] lg:hidden">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                                <IconSearch />
                            </div>
                            <input
                                className="w-full bg-[#f8fafc] border-2 border-[#edf2f7] p-3 pl-12 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all cursor-text"
                                type="text"
                                placeholder="Search users, roles, or emails..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-[1.5px] h-8 bg-[#f1f5f9] lg:hidden" />
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] whitespace-nowrap"><IconFilter className="inline mr-2" /> Filter By:</span>
                            <div className="relative group min-w-[160px]">
                                <select className="w-full bg-[#f8fafc] border-2 border-transparent p-3 px-6 rounded-2xl text-[13px] font-black text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/20 transition-all uppercase tracking-wider" value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}>
                                    {ALL_ROLES.map(r => <option key={r}>{r}</option>)}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-focus-within:text-[#2447d7]">
                                    <IconChevronDown />
                                </div>
                            </div>
                            <div className="relative group min-w-[160px]">
                                <select className="w-full bg-[#f8fafc] border-2 border-transparent p-3 px-6 rounded-2xl text-[13px] font-black text-[#1a202c] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#2447d7]/20 transition-all uppercase tracking-wider" value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}>
                                    {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-focus-within:text-[#2447d7]">
                                    <IconChevronDown />
                                </div>
                            </div>
                        </div>
                        {(roleFilter !== 'All Roles' || statusFilter !== 'All Status' || search) && (
                            <button className="text-[11px] font-black text-[#e53e3e] uppercase tracking-wider bg-[#fff5f5] px-4 py-2.5 rounded-xl border border-[#fee2e2] hover:bg-[#e53e3e] hover:text-white transition-all active:scale-95" onClick={() => {
                                setRoleFilter('All Roles');
                                setStatusFilter('All Status');
                                setSearch('');
                            }}>
                                ✕ Reset
                            </button>
                        )}
                    </div>
                    <button className="bg-[#10b981] text-white px-8 py-3.5 rounded-2xl text-sm font-black tracking-tight hover:bg-[#059669] hover:translate-y-[-2px] transition-all shadow-xl shadow-[#10b981]/20 active:scale-95 whitespace-nowrap lg:w-full" onClick={() => setShowModal(true)}>
                        <IconPlus /> Create New User
                    </button>
                </div>

                {/* ── TABLE (List View) ── */}
                {viewMode === 'list' && (
                    <section className="bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="overflow-x-auto overflow-y-hidden">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#fbfeff]">
                                        <th className="p-8 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">ACTIVE SYSTEM USERS</th>
                                        <th className="p-8 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">ASSIGNED PERMISSION</th>
                                        <th className="p-8 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">NETWORK STATUS</th>
                                        <th className="p-8 px-10 text-left text-[11px] font-black text-[#cbd5e0] uppercase tracking-widest border-b border-[#f7fafc]">MANAGEMENT ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f7fafc]">
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 text-[#cbd5e0]">
                                                    <div className="w-20 h-20 rounded-full bg-[#f8fafc] flex items-center justify-center rotate-6"><IconList /></div>
                                                    <span className="text-[14px] font-black uppercase tracking-widest">No users satisfy current filter parameters</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((user) => (
                                            <tr key={user.id} className={`hover:bg-[#f8faff]/50 transition-all group ${user.status === 'Inactive' ? 'opacity-60 grayscale-[0.2]' : ''}`}>
                                                <td className="p-6 px-10">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner transform transition-transform group-hover:scale-110 group-hover:rotate-3"
                                                            style={{ background: user.color, color: user.textColor }}>
                                                            {user.initials}
                                                        </div>
                                                        <div className="flex flex-col gap-1 min-w-0">
                                                            <div className="text-[15px] font-black text-[#1a202c] tracking-tight truncate">{user.name}</div>
                                                            <div className="text-[12px] font-bold text-[#a0aec0] truncate">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 px-10">
                                                    <span className={`text-[10px] font-black px-3.5 py-1.5 rounded-[10px] border uppercase tracking-wider shadow-sm ${user.roleColor}`}>{user.role}</span>
                                                </td>
                                                <td className="p-6 px-10">
                                                    <span className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest relative pl-4 ${user.status === 'Active' ? 'text-[#059669]' : 'text-[#64748b]'}`}>
                                                        <div className={`absolute left-0 w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-[#059669] ring-4 ring-[#059669]/10 animate-pulse' : 'bg-[#64748b]'}`} />
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 px-10">
                                                    <div className="flex items-center gap-3">
                                                        <button className="w-10 h-10 rounded-xl bg-white border border-[#edf2f7] text-[#4a5568] flex items-center justify-center hover:bg-[#2447d7] hover:text-white hover:border-[#2447d7] hover:shadow-lg transition-all active:scale-90" title="Edit user" onClick={() => setEditingUser(user)}><IconEdit /></button>
                                                        <button className="w-10 h-10 rounded-xl bg-white border border-[#edf2f7] text-[#4a5568] flex items-center justify-center hover:bg-[#1a202c] hover:text-white hover:border-[#1a202c] hover:shadow-lg transition-all active:scale-90" title="View history"><IconHistory /></button>
                                                        <button
                                                            className={`w-10 h-10 rounded-xl border transition-all active:scale-90 flex items-center justify-center hover:shadow-lg ${user.status === 'Active' ? 'bg-[#fff5f5] text-[#e53e3e] border-[#fee2e2] hover:bg-[#e53e3e] hover:text-white hover:border-[#e53e3e]' : 'bg-[#ecfdf5] text-[#10b981] border-[#d1fae5] hover:bg-[#10b981] hover:text-white hover:border-[#10b981]'}`}
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
                        </div>

                        {/* Pagination */}
                        <div className="p-8 px-10 border-t border-[#f7fafc] bg-[#fcfdff] flex justify-between items-center sm:flex-col sm:gap-6">
                            <span className="text-[12px] font-black text-[#cbd5e0] uppercase tracking-widest pl-2">
                                Tracking <span className="text-[#2447d7]">{filtered.length} members</span> of the <span className="text-[#1a202c]">active repository</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <button className="w-11 h-11 bg-white border border-[#edf2f7] rounded-2xl flex items-center justify-center text-[#cbd5e0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                                <div className="flex items-center gap-2 px-3">
                                    {[1, 2, 3].map(p => (
                                        <button key={p}
                                            className={`w-11 h-11 rounded-2xl text-[13px] font-black transition-all ${currentPage === p ? 'bg-[#2447d7] text-white shadow-xl shadow-[#2447d7]/20 scale-110' : 'text-[#718096] bg-white border border-[#edf2f7] hover:bg-[#f1f5f9]'}`}
                                            onClick={() => setCurrentPage(p)}>{p}
                                        </button>
                                    ))}
                                </div>
                                <button className="w-11 h-11 bg-white border border-[#edf2f7] rounded-2xl flex items-center justify-center text-[#cbd5e0] hover:text-[#2447d7] hover:border-[#2447d7] hover:bg-[#f0f4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── GRID VIEW ── */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-4 gap-8 lg:grid-cols-2 sm:grid-cols-1">
                        {filtered.length === 0 ? (
                            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-[#edf2f7] text-[#cbd5e0] text-[14px] font-black uppercase tracking-[0.2em]">Repository filter returned zero matches</div>
                        ) : (
                            filtered.map((user) => (
                                <div key={user.id} className={`bg-white rounded-[2.5rem] border border-[#edf2f7] p-8 flex flex-col items-center gap-6 shadow-sm hover:shadow-2xl hover:translate-y-[-6px] transition-all duration-500 relative group animate-popIn ${user.status === 'Inactive' ? 'opacity-60 shadow-none grayscale-[0.3]' : ''}`}>
                                    <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-lg ring-8 ring-white transform transition-all group-hover:scale-110 group-hover:rotate-6"
                                        style={{ background: user.color, color: user.textColor }}>
                                        {user.initials}
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 text-center px-2">
                                        <div className="text-lg font-black text-[#1a202c] tracking-tight line-clamp-1">{user.name}</div>
                                        <div className="text-[12px] font-bold text-[#a0aec0] line-clamp-1">{user.email}</div>
                                    </div>
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl border uppercase tracking-[0.1em] shadow-sm ${user.roleColor}`}>{user.role}</span>
                                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-[#059669]' : 'text-[#64748b]'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#059669] ring-2 ring-[#059669]/20' : 'bg-[#64748b]'}`} />
                                            {user.status}
                                        </span>
                                    </div>
                                    <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#f1f5f9] to-transparent my-2" />
                                    <div className="flex items-center gap-4 w-full justify-center">
                                        <button className="w-11 h-11 rounded-[1.25rem] bg-[#f8fafc] text-[#718096] flex items-center justify-center hover:bg-[#2447d7] hover:text-white transition-all shadow-sm active:scale-90" title="Edit" onClick={() => setEditingUser(user)}><IconEdit /></button>
                                        <button className="w-11 h-11 rounded-[1.25rem] bg-[#f8fafc] text-[#718096] flex items-center justify-center hover:bg-[#1a202c] hover:text-white transition-all shadow-sm active:scale-90" title="History"><IconHistory /></button>
                                        <button
                                            className={`w-11 h-11 rounded-[1.25rem] border transition-all active:scale-90 flex items-center justify-center shadow-sm ${user.status === 'Active' ? 'bg-[#fff5f5] text-[#e53e3e] border-[#fee2e2] hover:bg-[#e53e3e] hover:text-white' : 'bg-[#ecfdf5] text-[#10b981] border-[#d1fae5] hover:bg-[#10b981] hover:text-white'}`}
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

'use client';

import React, { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '@/components/Toast';

import { PERMISSIONS_SCHEMA, FEATURES_SCHEMA, DASHBOARD_CARDS_SCHEMA, DEFAULT_ROLE_PERMISSIONS, RolePermissions, ROLES } from '@/data/permissions';

interface Team {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    designation: string;
    joined: string;
    permissions: RolePermissions;
    phone: string;
    team: { id: string; name: string } | null;
}

const TEAM_ROLES = ['Team Leader', 'Tele Agent'];

const panelHeader: React.CSSProperties = {
    padding: '0 16px',
    borderBottom: '1px solid rgba(255,255,255,.06)',
    background: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    flexShrink: 0,
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [moduleFilter, setModuleFilter] = useState('');
    const [activeTab, setActiveTab] = useState('details');
    const [permissionSearch, setPermissionSearch] = useState('');
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Teams state
    const [teams, setTeams] = useState<Team[]>([]);
    const [rightPanel, setRightPanel] = useState<'directory' | 'teams'>('directory');
    const [teamForm, setTeamForm] = useState({ name: '', description: '' });
    const [editTeamId, setEditTeamId] = useState<string | null>(null);
    const [teamSearch, setTeamSearch] = useState('');

    const { toasts, remove, toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);
    useEffect(() => {
        const session = JSON.parse(sessionStorage.getItem('crm_session') || '{}');
        setCurrentUser(session);
        loadUsers();
        loadTeams();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users', { headers: getAuthHeader() });
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data?.results ?? []);
            setUsers(list);
        } catch (err) {
            console.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTeams = async () => {
        try {
            const res = await fetch('/api/teams', { headers: getAuthHeader() });
            const data = await res.json();
            setTeams(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load teams');
        }
    };

    const isSuperAdmin = currentUser?.role === 'Super Admin';

    const [editId, setEditId] = useState<string | null>(null);
    const blankForm = {
        name: '',
        designation: '',
        email: '',
        role: '',
        status: 'Active',
        phone: '',
        joined: '',
        teamId: '',
        permissions: JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS['Tele Agent'])) as RolePermissions
    };
    const [formData, setFormData] = useState(blankForm);

    const resetForm = () => {
        setEditId(null);
        setFormData(JSON.parse(JSON.stringify(blankForm)));
        setActiveTab('details');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveUser();
    };

    const toggleRow = (id: string) => {
        setExpandedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleTabSwitch = (tab: string) => setActiveTab(tab);

    const handleRoleChange = (role: string) => {
        const defaultPerms = DEFAULT_ROLE_PERMISSIONS[role] || DEFAULT_ROLE_PERMISSIONS['Tele Agent'];
        setFormData(prev => ({
            ...prev,
            role,
            teamId: TEAM_ROLES.includes(role) ? prev.teamId : '',
            permissions: JSON.parse(JSON.stringify(defaultPerms))
        }));
    };

    const handleModuleToggle = (key: string) => {
        setFormData(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev.permissions)) as RolePermissions;
            const current = newPerms.modules[key] || { enabled: false, actions: {}, view: 'self' };
            newPerms.modules[key] = { ...current, enabled: !current.enabled };
            return { ...prev, permissions: newPerms };
        });
    };

    const handleActionToggle = (modKey: string, action: string) => {
        setFormData(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev.permissions)) as RolePermissions;
            const mod = newPerms.modules[modKey];
            if (mod) mod.actions[action] = !mod.actions[action];
            return { ...prev, permissions: newPerms };
        });
    };

    const handleViewChange = (modKey: string, view: 'self' | 'team' | 'all') => {
        setFormData(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev.permissions)) as RolePermissions;
            if (newPerms.modules[modKey]) newPerms.modules[modKey].view = view;
            return { ...prev, permissions: newPerms };
        });
    };

    const toggleAllModuleActions = (modKey: string, enabled: boolean) => {
        setFormData(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev.permissions)) as RolePermissions;
            const mod = PERMISSIONS_SCHEMA.find(m => m.key === modKey);
            if (mod) {
                newPerms.modules[modKey].actions = mod.actions.reduce((acc, act) => ({ ...acc, [act]: enabled }), {});
            }
            return { ...prev, permissions: newPerms };
        });
    };

    const handleFeatureToggle = (key: string) => {
        setFormData(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev.permissions)) as RolePermissions;
            newPerms.features[key] = !newPerms.features[key];
            return { ...prev, permissions: newPerms };
        });
    };

    const handleDashboardCardToggle = (key: string) => {
        setFormData(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev.permissions)) as RolePermissions;
            newPerms.dashboardCards[key] = !newPerms.dashboardCards[key];
            return { ...prev, permissions: newPerms };
        });
    };

    const toggleAllModules = (enabled: boolean) => {
        setFormData(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev.permissions)) as RolePermissions;
            PERMISSIONS_SCHEMA.forEach(mod => {
                newPerms.modules[mod.key] = {
                    enabled,
                    actions: mod.actions.reduce((acc, act) => ({ ...acc, [act]: enabled }), {}),
                    view: enabled ? (mod.viewOptions?.[2] || mod.viewOptions?.[0] || 'all') as any : 'self'
                };
            });
            return { ...prev, permissions: newPerms };
        });
    };

    const toggleAllFeatures = (enabled: boolean) => {
        setFormData(prev => {
            const newPerms = { ...prev.permissions };
            FEATURES_SCHEMA.forEach(feat => { newPerms.features[feat.key] = enabled; });
            return { ...prev, permissions: newPerms };
        });
    };

    const toggleAllDashboards = (enabled: boolean) => {
        setFormData(prev => {
            const newPerms = { ...prev.permissions };
            DASHBOARD_CARDS_SCHEMA.forEach(card => { newPerms.dashboardCards[card.key] = enabled; });
            return { ...prev, permissions: newPerms };
        });
    };

    const getAuthHeader = (): Record<string, string> => {
        try {
            const s = sessionStorage.getItem('crm_session');
            const token = s ? JSON.parse(s).access : null;
            return token ? { Authorization: `Bearer ${token}` } : {};
        } catch { return {}; }
    };

    const saveUser = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.name || !formData.email || !formData.role) {
            toast.warning('Please fill in all required fields (*)');
            return;
        }
        if (formData.role === 'Super Admin') {
            const existingSA = users.find(u => u.role === 'Super Admin' && (editId ? u.id !== editId : true));
            if (existingSA) {
                toast.error(`Only one Super Admin allowed. Current: ${existingSA.name}`);
                return;
            }
        }

        const payload: any = { ...formData };
        payload.team_id = TEAM_ROLES.includes(formData.role) ? (formData.teamId || '') : '';
        delete payload.teamId;

        const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };

        try {
            let res: Response;
            if (editId) {
                res = await fetch('/api/users', {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ id: editId, ...payload }),
                });
            } else {
                res = await fetch('/api/users', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload),
                });
            }
            if (res.ok) {
                const result = await res.json();
                if (!editId && result.temporary_password) {
                    toast.success(`User created! Temporary password: ${result.temporary_password}`);
                } else {
                    toast.success(editId ? 'User updated!' : 'User created!');
                }
                loadUsers();
                resetForm();
                setDrawerOpen(false);
            } else {
                const errData = await res.json();
                toast.error(errData.error || 'Failed to save user');
            }
        } catch (err) {
            toast.error('Network error while saving user');
        }
    };

    const editUser = (user: User) => {
        setEditId(user.id);
        const roleDefaults = JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS[user.role] || DEFAULT_ROLE_PERMISSIONS['Tele Agent']));
        const dbPerms = user.permissions || { modules: {}, features: {}, dashboardCards: {} };
        const mergedPerms: RolePermissions = {
            modules: (dbPerms.modules && Object.keys(dbPerms.modules).length > 0)
                ? JSON.parse(JSON.stringify(dbPerms.modules))
                : roleDefaults.modules,
            features: (dbPerms.features && Object.keys(dbPerms.features).length > 0)
                ? JSON.parse(JSON.stringify(dbPerms.features))
                : roleDefaults.features,
            dashboardCards: (dbPerms.dashboardCards && Object.keys(dbPerms.dashboardCards).length > 0)
                ? JSON.parse(JSON.stringify(dbPerms.dashboardCards))
                : roleDefaults.dashboardCards,
        };
        setFormData({
            name: user.name || '',
            designation: user.designation || '',
            email: user.email || '',
            role: user.role || '',
            status: user.status || 'Active',
            phone: user.phone || '',
            joined: user.joined || '',
            teamId: user.team?.id || '',
            permissions: mergedPerms,
        });
        setActiveTab('details');
        setDrawerOpen(true);
    };

    const handleDelete = async (id: string) => {
        const targetUser = users.find(u => u.id === id);
        if (targetUser?.role === 'Super Admin') {
            toast.error('The Super Admin account cannot be deleted.');
            return;
        }
        if (confirm('Are you sure you want to delete this team member?')) {
            try {
                const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE', headers: getAuthHeader() });
                if (res.ok) {
                    loadUsers();
                } else {
                    const errData = await res.json();
                    toast.error(errData.error || 'Delete failed');
                }
            } catch (err) {
                toast.error('Delete failed');
            }
        }
    };

    // ── Team CRUD ──────────────────────────────────────────────
    const saveTeam = async () => {
        if (!teamForm.name.trim()) { toast.warning('Team name is required'); return; }
        try {
            let res: Response;
            if (editTeamId) {
                res = await fetch('/api/teams', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                    body: JSON.stringify({ id: editTeamId, ...teamForm }),
                });
            } else {
                res = await fetch('/api/teams', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                    body: JSON.stringify(teamForm),
                });
            }
            if (res.ok) {
                setTeamForm({ name: '', description: '' });
                setEditTeamId(null);
                loadTeams();
                loadUsers();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to save team');
            }
        } catch {
            toast.error('Network error while saving team');
        }
    };

    const editTeam = (team: Team) => {
        setEditTeamId(team.id);
        setTeamForm({ name: team.name, description: team.description || '' });
    };

    const deleteTeam = async (id: string) => {
        if (!confirm('Delete this team? Members will be unassigned.')) return;
        try {
            const res = await fetch(`/api/teams?id=${id}`, { method: 'DELETE', headers: getAuthHeader() });
            if (res.ok) { loadTeams(); loadUsers(); }
            else { const err = await res.json(); toast.error(err.error || 'Delete failed'); }
        } catch { toast.error('Delete failed'); }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
            (u.email || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
            (u.role || '').toLowerCase().includes((searchQuery || '').toLowerCase());
        const matchesModule = !moduleFilter || u.permissions?.modules?.[moduleFilter]?.enabled;
        return matchesSearch && matchesModule;
    });

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(teamSearch.toLowerCase())
    );

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'Active').length,
        inactive: users.filter(u => u.status !== 'Active').length
    };

    return (
        <div className="flex-1 overflow-hidden flex flex-col h-full">
            <ToastContainer toasts={toasts} remove={remove} />

            <style>{`
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `}</style>

            {/* ── Drawer backdrop ── */}
            {drawerOpen && (
                <div
                    onClick={() => { setDrawerOpen(false); resetForm(); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 100, backdropFilter: 'blur(2px)' }}
                />
            )}

            {/* ── Add / Edit User Drawer ── */}
            {drawerOpen && (
                <div style={{
                    position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
                    background: '#fff', zIndex: 101, display: 'flex', flexDirection: 'column',
                    boxShadow: '-8px 0 40px rgba(0,0,0,.15)', animation: 'slideInRight .22s ease'
                }}>
                    {/* Drawer header */}
                    <div style={{ ...panelHeader, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <i className="fa-solid fa-user-plus" style={{ color: '#818cf8', fontSize: 13 }}></i>
                            <div>
                                <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                                    {editId ? 'Edit User' : 'Add New User'}
                                </span>
                                {editId && (
                                    <p style={{ color: '#fbbf24', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>Editing Mode Active</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => { setDrawerOpen(false); resetForm(); }}
                            style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#94a3b8', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', flexShrink: 0, padding: '0 8px', gap: 4, overflowX: 'auto' }}>
                        {['details', 'modules', 'features', 'dashboards'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabSwitch(tab)}
                                style={{
                                    padding: '10px 12px', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em',
                                    border: 'none', borderBottom: `2px solid ${activeTab === tab ? '#0f172a' : 'transparent'}`,
                                    background: 'transparent', color: activeTab === tab ? '#0f172a' : '#94a3b8',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0
                                }}
                            >
                                <i className={`fa-solid ${tab === 'details' ? 'fa-id-card' : tab === 'modules' ? 'fa-puzzle-piece' : tab === 'features' ? 'fa-microchip' : 'fa-gauge-high'}`}></i>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable form body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: 16 }}>

                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name *</label>
                                        <input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            type="text" placeholder="Sarah Collins"
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Designation</label>
                                        <input
                                            value={formData.designation}
                                            onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                            type="text" placeholder="Senior Broker"
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address *</label>
                                    <input
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        type="email" placeholder="sarah@whiterock.com"
                                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Role *</label>
                                        <select
                                            value={formData.role}
                                            onChange={e => handleRoleChange(e.target.value)}
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none cursor-pointer"
                                        >
                                            <option value="">Select Role</option>
                                            {ROLES.filter(r => isSuperAdmin || r !== 'Super Admin').map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none cursor-pointer"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                {TEAM_ROLES.includes(formData.role) && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                            <i className="fa-solid fa-people-group mr-1"></i>Assign Team
                                        </label>
                                        <select
                                            value={formData.teamId}
                                            onChange={e => setFormData({ ...formData, teamId: e.target.value })}
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none cursor-pointer"
                                        >
                                            <option value="">No Team</option>
                                            {teams.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                        {teams.length === 0 && (
                                            <p className="text-[10px] text-amber-500 font-bold px-1">
                                                No teams yet — create one in the Teams panel
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Contact Number</label>
                                        <input
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            type="text" placeholder="0400 000 000"
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Joined Date</label>
                                        <input
                                            value={formData.joined}
                                            onChange={e => setFormData({ ...formData, joined: e.target.value })}
                                            type="date"
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 italic text-[10px] text-slate-400 text-center">
                                    <p>A secure temporary password will be generated. Share it with the user so they can log in and set their own password.</p>
                                </div>
                            </div>
                        )}

                        {/* Modules Tab */}
                        {activeTab === 'modules' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <div className="relative flex-1">
                                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                                        <input
                                            value={permissionSearch}
                                            onChange={e => setPermissionSearch(e.target.value)}
                                            placeholder="Search modules..."
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg pl-9 pr-3 text-[10px] font-bold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                                        />
                                    </div>
                                    <button onClick={() => toggleAllModules(true)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase text-indigo-600 hover:bg-indigo-50 transition-all">Select All</button>
                                    <button onClick={() => toggleAllModules(false)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Reset</button>
                                </div>

                                {PERMISSIONS_SCHEMA.filter(m => m.label.toLowerCase().includes(permissionSearch.toLowerCase())).map(mod => {
                                    const modState = formData.permissions.modules[mod.key] || { enabled: false, actions: {}, view: 'self' };
                                    return (
                                        <div key={mod.key} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                            <div className="p-3 flex items-center justify-between bg-white border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] ${modState.enabled ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                                                        <i className={`fa-solid ${mod.key === 'tasks' ? 'fa-tasks' : mod.key === 'leads' ? 'fa-user-group' : mod.key === 'pipeline' ? 'fa-diagram-project' : mod.key === 'lenders' ? 'fa-hand-holding-dollar' : mod.key === 'docs' ? 'fa-folder-open' : mod.key === 'users' ? 'fa-user-gear' : 'fa-chart-line'}`}></i>
                                                    </div>
                                                    <span className={`text-xs font-black uppercase tracking-tight ${modState.enabled ? 'text-slate-900' : 'text-slate-400'}`}>{mod.label}</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked={modState.enabled} onChange={() => handleModuleToggle(mod.key)} />
                                                    <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-900"></div>
                                                </label>
                                            </div>
                                            {modState.enabled && (
                                                <div className="p-3 space-y-4 bg-slate-50/50">
                                                    {mod.actions && mod.actions.length > 0 && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-xs font-black text-slate-400 uppercase tracking-[.2em]">Available Actions</p>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => toggleAllModuleActions(mod.key, true)} className="text-xs font-black text-indigo-600 uppercase hover:underline">Select All</button>
                                                                    <span className="text-[10px] text-slate-300">|</span>
                                                                    <button onClick={() => toggleAllModuleActions(mod.key, false)} className="text-xs font-black text-slate-400 uppercase hover:underline">Reset</button>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {mod.actions.map(action => (
                                                                    <button key={action} onClick={() => handleActionToggle(mod.key, action)}
                                                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all ${modState.actions[action] ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'bg-transparent border-slate-200 text-slate-400'}`}
                                                                    >
                                                                        <i className={`fa-solid ${modState.actions[action] ? 'fa-square-check' : 'fa-square'} text-[9px]`}></i>
                                                                        <span className="text-[10px] font-bold uppercase tracking-tighter">{action.replace(/_/g, ' ')}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {mod.viewOptions && mod.viewOptions.length > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[.2em]">View Access Level</p>
                                                            <div className="flex gap-1.5">
                                                                {mod.viewOptions.map(option => (
                                                                    <button key={option} onClick={() => handleViewChange(mod.key, option as any)}
                                                                        className={`flex-1 py-1.5 rounded-lg border text-xs font-black uppercase tracking-tighter transition-all ${modState.view === option ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                                                    >
                                                                        {option}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Features Tab */}
                        {activeTab === 'features' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <div className="relative flex-1">
                                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                                        <input value={permissionSearch} onChange={e => setPermissionSearch(e.target.value)} placeholder="Search features..."
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg pl-9 pr-3 text-[10px] font-bold outline-none focus:border-indigo-300 transition-all"
                                        />
                                    </div>
                                    <button onClick={() => toggleAllFeatures(true)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase text-indigo-600 hover:border-indigo-100 transition-all">All On</button>
                                    <button onClick={() => toggleAllFeatures(false)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase text-slate-400">All Off</button>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {FEATURES_SCHEMA.filter(f => f.label.toLowerCase().includes(permissionSearch.toLowerCase())).map(feat => (
                                        <button key={feat.key} onClick={() => handleFeatureToggle(feat.key)}
                                            className={`p-4 rounded-xl border flex items-center gap-4 transition-all group ${formData.permissions.features[feat.key] ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-slate-50/50 border-slate-200 opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${formData.permissions.features[feat.key] ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm border'}`}>
                                                <i className={`fa-solid ${feat.icon}`}></i>
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-[11px] font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{feat.label}</p>
                                                <p className="text-xs font-bold text-slate-400">Enable advanced module functionality</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${formData.permissions.features[feat.key] ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-transparent rotate-90'}`}>
                                                <i className="fa-solid fa-check text-[10px]"></i>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dashboards Tab */}
                        {activeTab === 'dashboards' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <div className="relative flex-1">
                                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                                        <input value={permissionSearch} onChange={e => setPermissionSearch(e.target.value)} placeholder="Search dashboard cards..."
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg pl-9 pr-3 text-[10px] font-bold outline-none focus:border-emerald-300 transition-all"
                                        />
                                    </div>
                                    <button onClick={() => toggleAllDashboards(true)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase text-emerald-600 hover:border-emerald-100 transition-all">Select All</button>
                                    <button onClick={() => toggleAllDashboards(false)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase text-slate-400">Clear</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {DASHBOARD_CARDS_SCHEMA.filter(c => c.label.toLowerCase().includes(permissionSearch.toLowerCase())).map(card => (
                                        <button key={card.key} onClick={() => handleDashboardCardToggle(card.key)}
                                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${formData.permissions.dashboardCards[card.key] ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'bg-slate-50/50 border-slate-200 opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.permissions.dashboardCards[card.key] ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border shadow-sm'}`}>
                                                <i className={`fa-solid ${card.icon} text-[12px]`}></i>
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-xs font-black text-slate-900 leading-tight uppercase tracking-tight">{card.label}</p>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${formData.permissions.dashboardCards[card.key] ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-transparent'}`}>
                                                <i className="fa-solid fa-check text-[10px]"></i>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Drawer footer */}
                    <div style={{ padding: 12, background: '#fff', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
                        <button
                            onClick={() => saveUser()}
                            style={{ width: '100%', height: 40, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                            <i className="fa-solid fa-check"></i>
                            {editId ? 'Store Changes' : 'Create Account'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Main content: full-width directory ── */}
            <div style={{ flex: 1, overflow: 'hidden', padding: 12, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 0 }}>
                <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm" style={{ flex: 1, minHeight: 0 }}>

                    {/* Dark header */}
                    <div style={{ ...panelHeader, justifyContent: 'space-between', gap: 8 }}>
                        {/* Panel toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: 2, flexShrink: 0 }}>
                            <button
                                onClick={() => setRightPanel('directory')}
                                style={{
                                    padding: '0 12px', height: 28, borderRadius: 6, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em', border: 'none', cursor: 'pointer', transition: 'all .15s',
                                    background: rightPanel === 'directory' ? '#fff' : 'transparent',
                                    color: rightPanel === 'directory' ? '#0f172a' : '#64748b'
                                }}
                            >
                                <i className="fa-solid fa-users" style={{ marginRight: 6 }}></i>Directory
                            </button>
                            <button
                                onClick={() => setRightPanel('teams')}
                                style={{
                                    padding: '0 12px', height: 28, borderRadius: 6, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em', border: 'none', cursor: 'pointer', transition: 'all .15s',
                                    background: rightPanel === 'teams' ? '#fff' : 'transparent',
                                    color: rightPanel === 'teams' ? '#0f172a' : '#64748b'
                                }}
                            >
                                <i className="fa-solid fa-people-group" style={{ marginRight: 6 }}></i>Teams
                                {teams.length > 0 && (
                                    <span style={{ marginLeft: 6, padding: '1px 6px', background: '#6366f1', color: '#fff', borderRadius: 4, fontSize: 10, fontWeight: 900 }}>{teams.length}</span>
                                )}
                            </button>
                        </div>

                        {/* Search + filter (directory) */}
                        {rightPanel === 'directory' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#475569' }}></i>
                                    <input
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        type="text" placeholder="Search by name, email or role..."
                                        style={{ width: '100%', height: 32, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, paddingLeft: 30, paddingRight: 12, fontSize: 11, fontWeight: 700, color: '#fff', outline: 'none' }}
                                    />
                                </div>
                                <select
                                    value={moduleFilter}
                                    onChange={e => setModuleFilter(e.target.value)}
                                    style={{ height: 32, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '0 10px', fontSize: 11, fontWeight: 700, color: '#cbd5e1', outline: 'none', cursor: 'pointer', flexShrink: 0 }}
                                >
                                    <option value="" style={{ background: '#1e293b' }}>All Access</option>
                                    {PERMISSIONS_SCHEMA.map(m => (
                                        <option key={m.key} value={m.key} style={{ background: '#1e293b' }}>{m.label}</option>
                                    ))}
                                </select>

                                {/* Stats */}
                                <div style={{ display: 'flex', alignItems: 'center', height: 48, borderLeft: '1px solid rgba(255,255,255,.05)', paddingLeft: 12, flexShrink: 0, gap: 0 }}>
                                    {[{ val: stats.total, label: 'Total', color: '#fff' }, { val: stats.active, label: 'Live', color: '#34d399' }, { val: stats.inactive, label: 'Off', color: '#94a3b8' }].map((s, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 48, borderRight: i < 2 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                                            <span style={{ fontSize: 13, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</span>
                                            <span style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '.1em' }}>{s.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* New User button */}
                                <button
                                    onClick={() => { resetForm(); setDrawerOpen(true); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                                >
                                    <i className="fa-solid fa-plus" style={{ fontSize: 10 }} /> New User
                                </button>
                            </div>
                        )}

                        {/* Search (teams) */}
                        {rightPanel === 'teams' && (
                            <div style={{ position: 'relative', flex: 1 }}>
                                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#475569' }}></i>
                                <input
                                    value={teamSearch}
                                    onChange={e => setTeamSearch(e.target.value)}
                                    type="text" placeholder="Search teams..."
                                    style={{ width: '100%', height: 32, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, paddingLeft: 30, paddingRight: 12, fontSize: 11, fontWeight: 700, color: '#fff', outline: 'none' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* ── Directory Table ── */}
                    {rightPanel === 'directory' && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm border-b border-slate-100 z-10">
                                    <tr>
                                        <th className="w-10 px-4 py-3"></th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Role</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Team</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Permissions</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading && Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 py-3 text-center"><div className="w-3 h-3 bg-slate-100 rounded mx-auto" /></td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                                                    <div className="space-y-1.5">
                                                        <div className="h-2.5 w-28 bg-slate-100 rounded" />
                                                        <div className="h-2 w-36 bg-slate-50 rounded" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center"><div className="h-6 w-20 bg-slate-100 rounded-lg mx-auto" /></td>
                                            <td className="px-4 py-3"><div className="h-5 w-16 bg-slate-100 rounded-lg" /></td>
                                            <td className="px-4 py-3"><div className="flex gap-1"><div className="h-5 w-12 bg-slate-100 rounded" /><div className="h-5 w-10 bg-slate-100 rounded" /><div className="h-5 w-14 bg-slate-100 rounded" /></div></td>
                                            <td className="px-4 py-3 text-center"><div className="h-5 w-14 bg-slate-100 rounded-full mx-auto" /></td>
                                            <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><div className="w-7 h-7 bg-slate-100 rounded-lg" /><div className="w-7 h-7 bg-slate-100 rounded-lg" /></div></td>
                                        </tr>
                                    ))}
                                    {!isLoading && filteredUsers.map(user => {
                                        const modules = user.permissions?.modules || {};
                                        const features = user.permissions?.features || {};
                                        const activeMods = Object.keys(modules).filter(k => modules[k]?.enabled);
                                        const activeFeats = Object.keys(features).filter(k => features[k]);
                                        const isExpanded = expandedRows.includes(user.id);

                                        return (
                                            <React.Fragment key={user.id}>
                                                <tr
                                                    onClick={() => toggleRow(user.id)}
                                                    className={`group cursor-pointer transition-all ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}
                                                >
                                                    <td className="px-4 py-3 text-center">
                                                        <i className={`fa-solid fa-chevron-right text-[10px] transition-all duration-300 ${isExpanded ? 'rotate-90 text-indigo-600' : 'text-slate-300'}`}></i>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200">
                                                                {user.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-900 leading-tight">{user.name}</p>
                                                                <p className="text-xs font-bold text-slate-400">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-tighter border border-indigo-100 shadow-sm">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {user.team ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-600 rounded-lg text-[10px] font-black border border-violet-100">
                                                                <i className="fa-solid fa-people-group text-[10px]"></i>
                                                                {user.team.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-300 italic">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                                                            {activeMods.slice(0, 3).map(m => (
                                                                <span key={m} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-black uppercase tracking-tighter border border-slate-200">{m}</span>
                                                            ))}
                                                            {activeMods.length > 3 && (
                                                                <span className="text-xs font-black text-slate-300 uppercase pl-1">+{activeMods.length - 3} More</span>
                                                            )}
                                                            {activeMods.length === 0 && <span className="text-xs font-bold text-slate-300 italic">No Access</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-widest ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                            <button onClick={(e) => { e.stopPropagation(); editUser(user); }}
                                                                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all">
                                                                <i className="fa-solid fa-pen text-[9px]"></i>
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                                                                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-md transition-all">
                                                                <i className="fa-solid fa-trash text-[9px]"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={7} className="p-0 border-b border-slate-100">
                                                            <div className="bg-slate-50/50 p-6 grid grid-cols-4 gap-8 animate-in slide-in-from-top-2 duration-300">
                                                                <div>
                                                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                        <i className="fa-solid fa-id-card"></i> Professional Bio
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Designation</p>
                                                                            <p className="text-xs font-black text-indigo-600">{user.designation || 'Specialist'}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Team</p>
                                                                            <p className="text-xs font-black text-violet-600">{user.team?.name || '—'}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Registered Date</p>
                                                                            <p className="text-xs font-black text-slate-700">{user.joined || 'Ongoing'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                        <i className="fa-solid fa-phone"></i> Contact Details
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Corporate Email</p>
                                                                            <p className="text-xs font-black text-blue-600 underline decoration-blue-200 underline-offset-4">{user.email}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Secure Line</p>
                                                                            <p className="text-xs font-black text-slate-700">{user.phone || 'N/A'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                        <i className="fa-solid fa-puzzle-piece"></i> Module Access
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                                        {activeMods.map(m => {
                                                                            const modState = user.permissions.modules[m];
                                                                            const schema = PERMISSIONS_SCHEMA.find(x => x.key === m);
                                                                            return (
                                                                                <div key={m} className="space-y-1">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{schema?.label}</span>
                                                                                        <span className="text-xs font-black text-indigo-600 uppercase bg-indigo-50 px-1 rounded">{modState.view}</span>
                                                                                    </div>
                                                                                    <div className="flex flex-wrap gap-1">
                                                                                        {Object.keys(modState.actions).filter(a => modState.actions[a]).map(a => (
                                                                                            <span key={a} className="text-xs font-bold text-slate-400 border border-slate-200 px-1 rounded bg-white capitalize whitespace-nowrap">{a.replace(/_/g, ' ')}</span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                        {activeMods.length === 0 && <p className="text-xs font-bold text-slate-300 italic">No modules assigned.</p>}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                        <i className="fa-solid fa-gauge-high"></i> UI & Tools
                                                                    </h4>
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Modules & Features</p>
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {activeFeats.map(f => (
                                                                                    <span key={f} className="text-xs font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">{f.replace('_', ' ')}</span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Dashboard Access</p>
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {Object.keys(user.permissions.dashboardCards).filter(k => user.permissions.dashboardCards[k]).map(k => (
                                                                                    <span key={k} className="text-xs font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{k.replace('_', ' ')}</span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {!isLoading && filteredUsers.length === 0 && (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                                        <i className="fa-solid fa-users-slash text-2xl"></i>
                                    </div>
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No team members found</h3>
                                    <p className="text-xs font-bold text-slate-300 mt-1">Adjust your search or filters to broaden results</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Teams Panel ── */}
                    {rightPanel === 'teams' && (
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    {editTeamId ? 'Edit Team' : 'Create New Team'}
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        value={teamForm.name}
                                        onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                                        placeholder="Team name *"
                                        className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-slate-400 transition-all"
                                    />
                                    <input
                                        value={teamForm.description}
                                        onChange={e => setTeamForm({ ...teamForm, description: e.target.value })}
                                        placeholder="Description (optional)"
                                        className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-slate-400 transition-all"
                                    />
                                    <button
                                        onClick={saveTeam}
                                        className="h-9 px-4 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black transition-all shrink-0 flex items-center gap-1.5"
                                    >
                                        <i className="fa-solid fa-check text-[10px]"></i>
                                        {editTeamId ? 'Update' : 'Create'}
                                    </button>
                                    {editTeamId && (
                                        <button
                                            onClick={() => { setEditTeamId(null); setTeamForm({ name: '', description: '' }); }}
                                            className="h-9 px-3 bg-white border border-slate-200 text-slate-500 rounded-lg text-xs font-black uppercase hover:bg-slate-50 transition-all shrink-0"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {filteredTeams.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                                            <i className="fa-solid fa-people-group text-2xl"></i>
                                        </div>
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No teams yet</h3>
                                        <p className="text-xs font-bold text-slate-300 mt-1">Create a team above to get started</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm border-b border-slate-100 z-10">
                                            <tr>
                                                <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Team</th>
                                                <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Description</th>
                                                <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Members</th>
                                                <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredTeams.map(team => {
                                                const memberCount = users.filter(u => u.team?.id === team.id).length;
                                                return (
                                                    <tr key={team.id} className="group hover:bg-slate-50/50 transition-all">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-[11px] font-black shadow-lg shadow-violet-100">
                                                                    {team.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <p className="text-xs font-black text-slate-900">{team.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <p className="text-xs font-bold text-slate-400 italic">{team.description || '—'}</p>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-600 rounded-lg text-xs font-black border border-violet-100">
                                                                <i className="fa-solid fa-user text-[10px]"></i>
                                                                {memberCount}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                                <button onClick={() => editTeam(team)}
                                                                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all">
                                                                    <i className="fa-solid fa-pen text-[9px]"></i>
                                                                </button>
                                                                <button onClick={() => deleteTeam(team.id)}
                                                                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-md transition-all">
                                                                    <i className="fa-solid fa-trash text-[9px]"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

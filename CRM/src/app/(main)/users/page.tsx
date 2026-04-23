'use client';

import React, { useState, useEffect } from 'react';

import { PERMISSIONS_SCHEMA, FEATURES_SCHEMA, DASHBOARD_CARDS_SCHEMA, DEFAULT_ROLE_PERMISSIONS, RolePermissions, ROLES } from '@/data/permissions';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    designation: string;
    joined: string;
    permissions: RolePermissions;
    phone: string;
}

const INITIAL_USERS: User[] = [
    {
        id: 1,
        name: 'Thanushika A',
        email: 'ceo@whiterock.com',
        role: 'Super Admin',
        status: 'Active',
        designation: 'Chief Executive Officer',
        joined: '2023-06-01',
        permissions: DEFAULT_ROLE_PERMISSIONS['Super Admin'],
        phone: '+94 77 123 4567'
    },
    {
        id: 4,
        name: 'Ops Manager',
        email: 'admin.ops@whiterock.com',
        role: 'Admin',
        status: 'Active',
        designation: 'Operations Director',
        joined: '2024-01-05',
        permissions: DEFAULT_ROLE_PERMISSIONS['Admin'],
        phone: '+94 77 987 6543'
    },
    {
        id: 2,
        name: 'Sarah White',
        email: 'sarah.w@whiterock.com',
        role: 'Team Leader',
        status: 'Active',
        designation: 'Lending Specialist',
        joined: '2024-02-15',
        permissions: DEFAULT_ROLE_PERMISSIONS['Team Leader'],
        phone: '0400 333 444'
    },
    {
        id: 3,
        name: 'Cody Lane',
        email: 'cody@whiterock.com',
        role: 'Tele Agent',
        status: 'Active',
        designation: 'Lead Generator',
        joined: '2024-03-10',
        permissions: DEFAULT_ROLE_PERMISSIONS['Tele Agent'],
        phone: '0400 555 666'
    },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [moduleFilter, setModuleFilter] = useState('');
    const [activeTab, setActiveTab] = useState('details');
    const [permissionSearch, setPermissionSearch] = useState('');
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    // Simulate logged in user (Change to 'Admin' to test restrictions)
    const [currentUser] = useState<User>(INITIAL_USERS[0]);
    const isSuperAdmin = currentUser.role === 'Super Admin';

    // Form State
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        email: '',
        role: '',
        status: 'Active',
        phone: '',
        joined: '',
        password: '',
        confirmPassword: '',
        permissions: JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS['Tele Agent'])) as RolePermissions
    });

    const toggleRow = (id: number) => {
        setExpandedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleTabSwitch = (tab: string) => setActiveTab(tab);

    const handleRoleChange = (role: string) => {
        const defaultPerms = DEFAULT_ROLE_PERMISSIONS[role] || DEFAULT_ROLE_PERMISSIONS['Tele Agent'];
        setFormData(prev => ({
            ...prev,
            role,
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
            if (mod) {
                mod.actions[action] = !mod.actions[action];
            }
            return { ...prev, permissions: newPerms };
        });
    };

    const handleViewChange = (modKey: string, view: 'self' | 'team' | 'all') => {
        setFormData(prev => {
            const newPerms = JSON.parse(JSON.stringify(prev.permissions)) as RolePermissions;
            if (newPerms.modules[modKey]) {
                newPerms.modules[modKey].view = view;
            }
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
            FEATURES_SCHEMA.forEach(feat => {
                newPerms.features[feat.key] = enabled;
            });
            return { ...prev, permissions: newPerms };
        });
    };

    const toggleAllDashboards = (enabled: boolean) => {
        setFormData(prev => {
            const newPerms = { ...prev.permissions };
            DASHBOARD_CARDS_SCHEMA.forEach(card => {
                newPerms.dashboardCards[card.key] = enabled;
            });
            return { ...prev, permissions: newPerms };
        });
    };

    const saveUser = () => {
        if (!formData.name || !formData.email || !formData.role) {
            alert('Please fill in all required fields (*)');
            return;
        }

        // One-Super-Admin Rule
        if (formData.role === 'Super Admin') {
            const existingSA = users.find(u => u.role === 'Super Admin' && (editId ? u.id !== editId : true));
            if (existingSA) {
                alert(`Security Violation: Only one Super Admin is allowed. Current Super Admin: ${existingSA.name}`);
                return;
            }
        }

        const userData: User = {
            id: editId || Date.now(),
            name: formData.name,
            designation: formData.designation,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            phone: formData.phone,
            joined: formData.joined,
            permissions: JSON.parse(JSON.stringify(formData.permissions))
        };

        if (editId) {
            setUsers(prev => prev.map(u => u.id === editId ? userData : u));
        } else {
            setUsers(prev => [...prev, userData]);
        }
        cancelEdit();
    };

    const editUser = (user: User) => {
        setEditId(user.id);
        setFormData({
            ...user,
            password: '',
            confirmPassword: '',
            permissions: JSON.parse(JSON.stringify(user.permissions))
        });
        setActiveTab('details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: number) => {
        const targetUser = users.find(u => u.id === id);
        if (targetUser?.role === 'Super Admin') {
            alert("Critical Error: The Super Admin account cannot be deleted.");
            return;
        }
        if (!isSuperAdmin && targetUser?.role === 'Admin') {
            // Optional: prevent admins from deleting other admins
        }
        if (confirm('Are you sure you want to delete this team member?')) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const cancelEdit = () => {
        setEditId(null);
        setFormData({
            name: '',
            designation: '',
            email: '',
            role: '',
            status: 'Active',
            phone: '',
            joined: '',
            password: '',
            confirmPassword: '',
            permissions: JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS['Tele Agent']))
        });
        setActiveTab('details');
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesModule = !moduleFilter || u.permissions.modules[moduleFilter]?.enabled;
        return matchesSearch && matchesModule;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'Active').length,
        inactive: users.filter(u => u.status !== 'Active').length
    };

    return (
        <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-[400px_1fr] gap-3 h-full p-3 bg-slate-50">
                {/* LEFT PANEL: Add/Edit User */}
                <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="px-4 border-b border-slate-100 flex items-center justify-between h-12 shrink-0">
                        <div className="flex flex-col">
                            <h2 className="text-[9px] font-black text-slate-900 uppercase tracking-widest">
                                {editId ? 'Edit User' : 'Add New User'}
                            </h2>
                            {editId && <p className="text-[8px] text-amber-600 font-semibold uppercase tracking-tighter">Editing Mode Active</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            {editId && (
                                <button
                                    onClick={cancelEdit}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-[8px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    <i className="fa-solid fa-xmark text-[7px]"></i> Cancel
                                </button>
                            )}
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0 px-2 gap-1 overflow-x-auto no-scrollbar">
                        <button
                            className={`px-3 py-2.5 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 shrink-0 ${activeTab === 'details' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'}`}
                            onClick={() => handleTabSwitch('details')}
                        >
                            <i className="fa-solid fa-id-card"></i> Details
                        </button>
                        <button
                            className={`px-3 py-2.5 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 shrink-0 ${activeTab === 'modules' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'}`}
                            onClick={() => handleTabSwitch('modules')}
                        >
                            <i className="fa-solid fa-puzzle-piece"></i> Modules
                        </button>
                        <button
                            className={`px-3 py-2.5 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 shrink-0 ${activeTab === 'features' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'}`}
                            onClick={() => handleTabSwitch('features')}
                        >
                            <i className="fa-solid fa-microchip"></i> Features
                        </button>
                        <button
                            className={`px-3 py-2.5 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 shrink-0 ${activeTab === 'dashboards' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'}`}
                            onClick={() => handleTabSwitch('dashboards')}
                        >
                            <i className="fa-solid fa-gauge-high"></i> Dashboards
                        </button>
                    </div>

                    {/* Scrollable Form Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name *</label>
                                        <input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            type="text" placeholder="Sarah Collins"
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Designation</label>
                                        <input
                                            value={formData.designation}
                                            onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                            type="text" placeholder="Senior Broker"
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address *</label>
                                    <input
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        type="email" placeholder="sarah@whiterock.com"
                                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Role *</label>
                                        <select
                                            value={formData.role}
                                            onChange={e => handleRoleChange(e.target.value)}
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none cursor-pointer"
                                        >
                                            <option value="">Select Role</option>
                                            {ROLES.filter(r => isSuperAdmin || r !== 'Super Admin').map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none cursor-pointer"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Number</label>
                                        <input
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            type="text" placeholder="0400 000 000"
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Joined Date</label>
                                        <input
                                            value={formData.joined}
                                            onChange={e => setFormData({ ...formData, joined: e.target.value })}
                                            type="date"
                                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-key"></i> Credentials Setup
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                                            <input
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                type="password" placeholder="••••••••"
                                                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm</label>
                                            <input
                                                value={formData.confirmPassword}
                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                type="password" placeholder="••••••••"
                                                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'modules' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Tab Header / Search */}
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
                                    <button onClick={() => toggleAllModules(true)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-indigo-600 hover:bg-indigo-50 transition-all">Select All</button>
                                    <button onClick={() => toggleAllModules(false)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Reset</button>
                                </div>

                                {PERMISSIONS_SCHEMA.filter(m => m.label.toLowerCase().includes(permissionSearch.toLowerCase())).map(mod => {
                                    const modState = formData.permissions.modules[mod.key] || { enabled: false, actions: {}, view: 'self' };
                                    const isExpanded = modState.enabled;
                                    return (
                                        <div key={mod.key} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                                            <div className="p-3 flex items-center justify-between bg-white border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] ${modState.enabled ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                                                        <i className={`fa-solid ${mod.key === 'tasks' ? 'fa-tasks' : mod.key === 'leads' ? 'fa-user-group' : mod.key === 'pipeline' ? 'fa-diagram-project' : mod.key === 'lenders' ? 'fa-hand-holding-dollar' : mod.key === 'docs' ? 'fa-folder-open' : mod.key === 'users' ? 'fa-user-gear' : 'fa-chart-line'}`}></i>
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-tight ${modState.enabled ? 'text-slate-900' : 'text-slate-400'}`}>{mod.label}</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={modState.enabled}
                                                        onChange={() => handleModuleToggle(mod.key)}
                                                    />
                                                    <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-900"></div>
                                                </label>
                                            </div>

                                            {modState.enabled && (
                                                <div className="p-3 space-y-4 bg-slate-50/50">
                                                    {/* Actions */}
                                                    {mod.actions && mod.actions.length > 0 && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-[.2em]">Available Actions</p>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => toggleAllModuleActions(mod.key, true)} className="text-[7px] font-black text-indigo-600 uppercase hover:underline">Select All</button>
                                                                    <span className="text-[7px] text-slate-300">|</span>
                                                                    <button onClick={() => toggleAllModuleActions(mod.key, false)} className="text-[7px] font-black text-slate-400 uppercase hover:underline">Reset</button>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {mod.actions.map(action => (
                                                                    <button
                                                                        key={action}
                                                                        onClick={() => handleActionToggle(mod.key, action)}
                                                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all ${modState.actions[action] ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'bg-transparent border-slate-200 text-slate-400'}`}
                                                                    >
                                                                        <i className={`fa-solid ${modState.actions[action] ? 'fa-square-check' : 'fa-square'} text-[9px]`}></i>
                                                                        <span className="text-[8px] font-bold uppercase tracking-tighter">{action.replace(/_/g, ' ')}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* View Permissions */}
                                                    {mod.viewOptions && mod.viewOptions.length > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[.2em]">View Access Level</p>
                                                            <div className="flex gap-1.5">
                                                                {mod.viewOptions.map(option => (
                                                                    <button
                                                                        key={option}
                                                                        onClick={() => handleViewChange(mod.key, option as any)}
                                                                        className={`flex-1 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-tighter transition-all ${modState.view === option ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
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

                        {activeTab === 'features' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <div className="relative flex-1">
                                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                                        <input
                                            value={permissionSearch}
                                            onChange={e => setPermissionSearch(e.target.value)}
                                            placeholder="Search features..."
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg pl-9 pr-3 text-[10px] font-bold outline-none focus:border-indigo-300 transition-all"
                                        />
                                    </div>
                                    <button onClick={() => toggleAllFeatures(true)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-indigo-600 hover:border-indigo-100 transition-all">All On</button>
                                    <button onClick={() => toggleAllFeatures(false)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-400">All Off</button>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {FEATURES_SCHEMA.filter(f => f.label.toLowerCase().includes(permissionSearch.toLowerCase())).map(feat => (
                                        <button
                                            key={feat.key}
                                            onClick={() => handleFeatureToggle(feat.key)}
                                            className={`p-4 rounded-xl border flex items-center gap-4 transition-all group ${formData.permissions.features[feat.key] ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-slate-50/50 border-slate-200 opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${formData.permissions.features[feat.key] ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm border'}`}>
                                                <i className={`fa-solid ${feat.icon}`}></i>
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-[11px] font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{feat.label}</p>
                                                <p className="text-[9px] font-bold text-slate-400">Enable advanced module functionality</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${formData.permissions.features[feat.key] ? 'bg-indigo-600 border-indigo-600 text-white rotate-0' : 'bg-white border-slate-200 text-transparent rotate-90'}`}>
                                                <i className="fa-solid fa-check text-[10px]"></i>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'dashboards' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <div className="relative flex-1">
                                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                                        <input
                                            value={permissionSearch}
                                            onChange={e => setPermissionSearch(e.target.value)}
                                            placeholder="Search dashboard cards..."
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg pl-9 pr-3 text-[10px] font-bold outline-none focus:border-emerald-300 transition-all"
                                        />
                                    </div>
                                    <button onClick={() => toggleAllDashboards(true)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-emerald-600 hover:border-emerald-100 transition-all">Select All</button>
                                    <button onClick={() => toggleAllDashboards(false)} className="px-3 h-9 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-400">Clear</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {DASHBOARD_CARDS_SCHEMA.filter(c => c.label.toLowerCase().includes(permissionSearch.toLowerCase())).map(card => (
                                        <button
                                            key={card.key}
                                            onClick={() => handleDashboardCardToggle(card.key)}
                                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${formData.permissions.dashboardCards[card.key] ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'bg-slate-50/50 border-slate-200 opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.permissions.dashboardCards[card.key] ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border shadow-sm'}`}>
                                                <i className={`fa-solid ${card.icon} text-[12px]`}></i>
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-[10px] font-black text-slate-900 leading-tight uppercase tracking-tight">{card.label}</p>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${formData.permissions.dashboardCards[card.key] ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-transparent'}`}>
                                                <i className="fa-solid fa-check text-[7px]"></i>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Submit */}
                    <div className="p-3 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.02)] shrink-0">
                        <button
                            onClick={saveUser}
                            className="w-full py-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[.2em] rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-100 flex items-center justify-center gap-3"
                        >
                            <i className={`fa-solid ${editId ? 'fa-check' : 'fa-plus'}`}></i>
                            {editId ? 'Save Changes' : 'Add Team Member'}
                        </button>
                    </div>
                </section>

                {/* RIGHT PANEL: Directory */}
                <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                    {/* Dark Header */}
                    <div className="px-4 bg-[#0f172a] h-12 flex items-center gap-4 shrink-0 shadow-lg">
                        <h2 className="text-[9px] font-black uppercase tracking-widest text-white shrink-0">Team Directory</h2>

                        <div className="relative flex-1">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[8px] text-slate-500"></i>
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                type="text" placeholder="Search by name, email or role..."
                                className="w-full h-8 bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 text-[9px] font-bold text-white outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-slate-600"
                            />
                        </div>

                        <select
                            value={moduleFilter}
                            onChange={e => setModuleFilter(e.target.value)}
                            className="h-8 bg-white/5 border border-white/10 rounded-lg px-3 text-[9px] font-bold text-slate-300 outline-none cursor-pointer focus:bg-white/10"
                        >
                            <option value="" className="bg-[#1e293b]">All Access</option>
                            {PERMISSIONS_SCHEMA.map(m => (
                                <option key={m.key} value={m.key} className="bg-[#1e293b]">{m.label}</option>
                            ))}
                        </select>

                        <div className="flex items-center h-12 border-l border-white/5 pl-4 gap-0 shrink-0">
                            <div className="flex items-center gap-2 px-3 h-12 border-r border-white/5">
                                <span className="text-[13px] font-black text-white leading-none">{stats.total}</span>
                                <span className="text-[7px] font-extrabold text-slate-500 uppercase tracking-widest">Total</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 h-12 border-r border-white/5">
                                <span className="text-[13px] font-black text-emerald-400 leading-none">{stats.active}</span>
                                <span className="text-[7px] font-extrabold text-slate-500 uppercase tracking-widest">Live</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 h-12">
                                <span className="text-[13px] font-black text-slate-300 leading-none">{stats.inactive}</span>
                                <span className="text-[7px] font-extrabold text-slate-500 uppercase tracking-widest">Off</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm border-b border-slate-100 z-10">
                                <tr>
                                    <th className="w-10 px-4 py-3"></th>
                                    <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                                    <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Role</th>
                                    <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">Permissions</th>
                                    <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map(user => {
                                    const activeMods = Object.keys(user.permissions.modules).filter(k => user.permissions.modules[k]?.enabled);
                                    const activeFeats = Object.keys(user.permissions.features).filter(k => user.permissions.features[k]);
                                    const isExpanded = expandedRows.includes(user.id);

                                    return (
                                        <React.Fragment key={user.id}>
                                            <tr
                                                onClick={() => toggleRow(user.id)}
                                                className={`group cursor-pointer transition-all ${isExpanded ? 'bg-slate-50/80 mb-0' : 'hover:bg-slate-50/50'}`}
                                            >
                                                <td className="px-4 py-3 text-center">
                                                    <i className={`fa-solid fa-chevron-right text-[7px] transition-all duration-300 ${isExpanded ? 'rotate-90 text-indigo-600' : 'text-slate-300'}`}></i>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[9px] font-black shadow-lg shadow-slate-200">
                                                            {user.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 leading-tight">{user.name}</p>
                                                            <p className="text-[8px] font-bold text-slate-400">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-tighter border border-indigo-100 shadow-sm">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                                                        {activeMods.slice(0, 3).map(m => (
                                                            <span key={m} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[7px] font-black uppercase tracking-tighter border border-slate-200">
                                                                {m}
                                                            </span>
                                                        ))}
                                                        {activeMods.length > 3 && (
                                                            <span className="text-[7px] font-black text-slate-300 uppercase pl-1">
                                                                +{activeMods.length - 3} More
                                                            </span>
                                                        )}
                                                        {activeMods.length === 0 && <span className="text-[7px] font-bold text-slate-300 italic">No Access</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); editUser(user); }}
                                                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all"
                                                        >
                                                            <i className="fa-solid fa-pen text-[9px]"></i>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                                                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-md transition-all"
                                                        >
                                                            <i className="fa-solid fa-trash text-[9px]"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={6} className="p-0 border-b border-slate-100">
                                                        <div className="bg-slate-50/50 p-6 grid grid-cols-4 gap-8 animate-in slide-in-from-top-2 duration-300">
                                                            {/* BIO */}
                                                            <div>
                                                                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                    <i className="fa-solid fa-id-card"></i> Professional Bio
                                                                </h4>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Designation</p>
                                                                        <p className="text-[10px] font-black text-indigo-600">{user.designation || 'Specialist'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Registered Date</p>
                                                                        <p className="text-[10px] font-black text-slate-700">{user.joined || 'Ongoing'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* CONTACT */}
                                                            <div>
                                                                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                    <i className="fa-solid fa-phone"></i> Contact Details
                                                                </h4>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Corporate Email</p>
                                                                        <p className="text-[10px] font-black text-blue-600 underline decoration-blue-200 underline-offset-4">{user.email}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Secure Line</p>
                                                                        <p className="text-[10px] font-black text-slate-700">{user.phone || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* ACCESS */}
                                                            <div>
                                                                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                    <i className="fa-solid fa-puzzle-piece"></i> Module Access
                                                                </h4>
                                                                <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                                    {activeMods.map(m => {
                                                                        const modState = user.permissions.modules[m];
                                                                        const schema = PERMISSIONS_SCHEMA.find(x => x.key === m);
                                                                        return (
                                                                            <div key={m} className="space-y-1">
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{schema?.label}</span>
                                                                                    <span className="text-[7px] font-black text-indigo-600 uppercase bg-indigo-50 px-1 rounded">{modState.view}</span>
                                                                                </div>
                                                                                <div className="flex flex-wrap gap-1">
                                                                                    {Object.keys(modState.actions).filter(a => modState.actions[a]).map(a => (
                                                                                        <span key={a} className="text-[6px] font-bold text-slate-400 border border-slate-200 px-1 rounded bg-white capitalize whitespace-nowrap">{a.replace(/_/g, ' ')}</span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {activeMods.length === 0 && <p className="text-[9px] font-bold text-slate-300 italic">No modules assigned.</p>}
                                                                </div>
                                                            </div>
                                                            {/* DASHBOARDS/FEATURES */}
                                                            <div>
                                                                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                    <i className="fa-solid fa-gauge-high"></i> UI & Tools
                                                                </h4>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Modules & Features</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {activeFeats.map(f => (
                                                                                <span key={f} className="text-[7px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">{f.replace('_', ' ')}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Dashboard Access</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {Object.keys(user.permissions.dashboardCards).filter(k => user.permissions.dashboardCards[k]).map(k => (
                                                                                <span key={k} className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{k.replace('_', ' ')}</span>
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
                        {filteredUsers.length === 0 && (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                                    <i className="fa-solid fa-users-slash text-2xl"></i>
                                </div>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No team members found</h3>
                                <p className="text-[9px] font-bold text-slate-300 mt-1">Adjust your search or filters to broaden results</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}


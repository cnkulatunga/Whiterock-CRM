'use client';

import React, { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    designation: string;
    joined: string;
    modules: Record<string, boolean>;
    features: Record<string, boolean>;
    phone: string;
}

const MODULES = [
    { key: 'tasks', label: 'Tasks & Followups', icon: 'fa-tasks' },
    { key: 'leads', label: 'Lead Management', icon: 'fa-user-group' },
    { key: 'pipeline', label: 'Loan Pipeline', icon: 'fa-diagram-project' },
    { key: 'lenders', label: 'Lender Management', icon: 'fa-hand-holding-dollar' },
    { key: 'docs', label: 'Document Vault', icon: 'fa-folder-open' },
    { key: 'users', label: 'User Management', icon: 'fa-user-gear' },
    { key: 'reports', label: 'Reporting Hub', icon: 'fa-chart-line' }
];

const FEATURES = [
    { key: 'ai', label: 'AI Assistant', icon: 'fa-robot' },
    { key: 'calculator', label: 'Premium Calculator', icon: 'fa-calculator' },
    { key: 'whatsapp', label: 'WhatsApp Direct', icon: 'fa-brands fa-whatsapp' }
];

const INITIAL_USERS: User[] = [
    { id: 1, name: 'Lakshan R', email: 'admin@whiterock.com', role: 'Admin', status: 'Active', designation: 'Super Admin', joined: '2024-01-01', modules: { tasks: true, leads: true, pipeline: true, lenders: true, docs: true, users: true, reports: true }, features: { ai: true, calculator: true, whatsapp: true }, phone: '0400 111 222' },
    { id: 2, name: 'Sarah White', email: 'sarah.w@whiterock.com', role: 'Team Leader', status: 'Active', designation: 'Lending Specialist', joined: '2024-02-15', modules: { tasks: true, leads: true, docs: true }, features: { calculator: true }, phone: '0400 333 444' },
    { id: 3, name: 'Cody Lane', email: 'cody@whiterock.com', role: 'Tele Agent', status: 'Active', designation: 'Lead Generator', joined: '2024-03-10', modules: { tasks: true, leads: true }, features: { whatsapp: true }, phone: '0400 555 666' },
    { id: 4, name: 'Leo Kumar', email: 'leo.k@whiterock.com', role: 'Accounts Manager', status: 'Inactive', designation: 'Brokerage Accounts', joined: '2024-01-20', modules: { tasks: true, lenders: true }, features: {}, phone: '0400 777 888' }
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [moduleFilter, setModuleFilter] = useState('');
    const [activeTab, setActiveTab] = useState('details');
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

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
        modules: {} as Record<string, boolean>,
        features: {} as Record<string, boolean>
    });

    const toggleRow = (id: number) => {
        setExpandedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleTabSwitch = (tab: string) => setActiveTab(tab);

    const handleRoleChange = (role: string) => {
        let newModules = {} as Record<string, boolean>;
        if (role === 'Admin') {
            MODULES.forEach(m => newModules[m.key] = true);
        } else if (role === 'Team Leader') {
            MODULES.forEach(m => newModules[m.key] = ['tasks', 'leads', 'docs'].includes(m.key));
        } else {
            MODULES.forEach(m => newModules[m.key] = ['tasks', 'leads'].includes(m.key));
        }
        setFormData(prev => ({ ...prev, role, modules: newModules }));
    };

    const handleModuleToggle = (key: string) => {
        setFormData(prev => ({
            ...prev,
            modules: { ...prev.modules, [key]: !prev.modules[key] }
        }));
    };

    const handleFeatureToggle = (key: string) => {
        setFormData(prev => ({
            ...prev,
            features: { ...prev.features, [key]: !prev.features[key] }
        }));
    };

    const saveUser = () => {
        if (!formData.name || !formData.email || !formData.role) {
            alert('Please fill in all required fields (*)');
            return;
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
            modules: { ...formData.modules },
            features: { ...formData.features }
        };

        if (editId) {
            setUsers(prev => prev.map(u => u.id === editId ? userData : u));
        } else {
            setUsers(prev => [...prev, userData]);
        }
        cancelEdit();
    };

    const editUser = (user: any) => {
        setEditId(user.id);
        setFormData({
            name: user.name,
            designation: user.designation || '',
            email: user.email,
            role: user.role,
            status: user.status,
            phone: user.phone || '',
            joined: user.joined || '',
            password: '',
            confirmPassword: '',
            modules: { ...user.modules },
            features: { ...user.features }
        });
        setActiveTab('details');
    };

    const deleteUser = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
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
            modules: {},
            features: {}
        });
        setActiveTab('details');
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesModule = !moduleFilter || u.modules[moduleFilter as keyof typeof u.modules];
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
                    <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0 px-2 gap-1">
                        <button
                            className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${activeTab === 'details' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'}`}
                            onClick={() => handleTabSwitch('details')}
                        >
                            <i className="fa-solid fa-id-card"></i> Details
                        </button>
                        <button
                            className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${activeTab === 'modules' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'}`}
                            onClick={() => handleTabSwitch('modules')}
                        >
                            <i className="fa-solid fa-puzzle-piece"></i> Modules
                        </button>
                        <button
                            className={`flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${activeTab === 'features' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'}`}
                            onClick={() => handleTabSwitch('features')}
                        >
                            <i className="fa-solid fa-microchip"></i> Features
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
                                            <option value="Admin">Admin</option>
                                            <option value="Team Leader">Team Leader</option>
                                            <option value="Tele Agent">Tele Agent</option>
                                            <option value="Accounts Manager">Accounts Manager</option>
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
                            <div className="space-y-1.5">
                                {MODULES.map(m => (
                                    <div key={m.key} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-slate-300 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shadow-sm">
                                                <i className={`fa-solid ${m.icon} text-[10px]`}></i>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{m.label}</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={!!formData.modules[m.key]}
                                                onChange={() => handleModuleToggle(m.key)}
                                            />
                                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-900"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div className="space-y-1.5">
                                {FEATURES.map(f => (
                                    <div key={f.key} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-slate-300 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:border-amber-100 transition-all shadow-sm">
                                                <i className={`fa-solid ${f.icon} text-[10px]`}></i>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{f.label}</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={!!formData.features[f.key]}
                                                onChange={() => handleFeatureToggle(f.key)}
                                            />
                                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-900"></div>
                                        </label>
                                    </div>
                                ))}
                                <div className="py-6 px-4 text-center">
                                    <i className="fa-solid fa-wand-magic-sparkles text-slate-200 text-3xl mb-3"></i>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-relaxed">
                                        Enable value-added integrations to empower your team's workflow and communication.
                                    </p>
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
                            {MODULES.map(m => (
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
                                    const activeMods = Object.keys(user.modules).filter(k => user.modules[k as keyof typeof user.modules]);
                                    const activeFeats = Object.keys(user.features).filter(k => user.features[k as keyof typeof user.features]);
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
                                                            onClick={(e) => { e.stopPropagation(); deleteUser(user.id); }}
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
                                                                <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                                                                    {activeMods.map(m => (
                                                                        <div key={m} className="flex items-center gap-2.5">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                                                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{MODULES.find(x => x.key === m)?.label}</span>
                                                                        </div>
                                                                    ))}
                                                                    {activeMods.length === 0 && <p className="text-[9px] font-bold text-slate-300 italic">No modules assigned.</p>}
                                                                </div>
                                                            </div>
                                                            {/* FEATURES */}
                                                            <div>
                                                                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[.2em] mb-4 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 w-fit">
                                                                    <i className="fa-solid fa-microchip"></i> System Features
                                                                </h4>
                                                                <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                                                                    {activeFeats.map(f => (
                                                                        <div key={f} className="flex items-center gap-2.5">
                                                                            <i className="fa-solid fa-bolt text-[8px] text-amber-500"></i>
                                                                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{FEATURES.find(x => x.key === f)?.label}</span>
                                                                        </div>
                                                                    ))}
                                                                    {activeFeats.length === 0 && <p className="text-[9px] font-bold text-slate-300 italic">Default standard toolkit.</p>}
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


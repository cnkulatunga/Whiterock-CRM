'use client';

import React, { useState } from 'react';
import {
    PERMISSIONS_SCHEMA,
    FEATURES_SCHEMA,
    DASHBOARD_CARDS_SCHEMA,
    DEFAULT_ROLE_PERMISSIONS,
    RolePermissions,
    ROLES
} from '@/data/permissions';
import { useToast, ToastContainer } from '@/components/Toast';

export default function PermissionMatrixPage() {
    const { toasts, remove, toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | 'modules' | 'features' | 'dashboards'>('modules');
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [templatePerms, setTemplatePerms] = useState<Record<string, RolePermissions>>(
        JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS))
    );
    const [isSaving, setIsSaving] = useState(false);

    // Load actual permissions from server on mount
    React.useEffect(() => {
        fetch('/api/permissions')
            .then(res => res.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setTemplatePerms(data);
                }
            })
            .catch(err => console.error('Failed to load permissions:', err));
    }, []);

    const pushChanges = async (role?: string) => {
        setIsSaving(true);
        try {
            // If role is provided, only save that role, else save all roles (for initial build, we save all)
            const rolesToSave = role ? [role] : ROLES;

            for (const r of rolesToSave) {
                await fetch('/api/permissions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: r, permissions: templatePerms[r] }),
                });
            }
            toast.success('Permissions saved successfully!');
        } catch (error) {
            toast.error('Failed to save permissions');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleModuleExpansion = (key: string) => {
        setExpandedModules(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const toggleAllExpansion = (expand: boolean) => {
        setExpandedModules(expand ? PERMISSIONS_SCHEMA.map(m => m.key) : []);
    };

    const handleToggle = (role: string, category: string, subKey: string, actionOrValue: string | boolean) => {
        setTemplatePerms(prev => {
            const newTemplates = JSON.parse(JSON.stringify(prev)) as Record<string, RolePermissions>;
            const rolePerms = newTemplates[role];

            if (category === 'modules') {
                const [modKey, action] = subKey.split(':');
                const mod = rolePerms.modules[modKey];
                if (action === 'enabled') {
                    mod.enabled = !mod.enabled;
                } else if (action === 'view') {
                    mod.view = actionOrValue as any;
                } else if (mod.actions) {
                    mod.actions[action] = !mod.actions[action];
                }
            } else if (category === 'features') {
                rolePerms.features[subKey] = !rolePerms.features[subKey];
            } else if (category === 'dashboards') {
                rolePerms.dashboardCards[subKey] = !rolePerms.dashboardCards[subKey];
            }

            return newTemplates;
        });
    };

    const isMatch = (text: string) => text.toLowerCase().includes(searchQuery.toLowerCase());

    return (
        <div className="flex-1 flex flex-col h-screen bg-[#f8fafc]">
            <ToastContainer toasts={toasts} remove={remove} />

            {/* Dark unified header */}
            <header style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 12, borderRight: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
                    <i className="fa-solid fa-shield-halved" style={{ color: '#818cf8', fontSize: 13 }}></i>
                    <div>
                        <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1 }}>Permission Matrix</p>
                        <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>Global Role Configurator</p>
                    </div>
                </div>

                {/* Category tabs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: 2, flexShrink: 0 }}>
                    {['all', 'modules', 'features', 'dashboards'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat as any)}
                            style={{
                                padding: '0 12px', height: 28, borderRadius: 6, fontSize: 10, fontWeight: 900,
                                textTransform: 'uppercase', letterSpacing: '.05em', border: 'none', cursor: 'pointer', transition: 'all .15s',
                                background: activeCategory === cat ? '#fff' : 'transparent',
                                color: activeCategory === cat ? '#0f172a' : '#64748b',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={{ position: 'relative', flex: 1, minWidth: 120, maxWidth: 200 }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.3)', fontSize: 10 }}></i>
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        style={{ width: '100%', height: 30, paddingLeft: 28, paddingRight: 10, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#fff', fontSize: 11, fontWeight: 600, outline: 'none' }}
                    />
                </div>

                {/* Expand / Collapse — modules only */}
                {activeCategory === 'modules' && (
                    <div style={{ display: 'flex', gap: 4, borderLeft: '1px solid rgba(255,255,255,.08)', paddingLeft: 12, flexShrink: 0 }}>
                        <button onClick={() => toggleAllExpansion(true)} style={{ padding: '0 10px', height: 28, background: 'transparent', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, color: '#a5b4fc', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer' }}>Expand All</button>
                        <button onClick={() => toggleAllExpansion(false)} style={{ padding: '0 10px', height: 28, background: 'transparent', border: '1px solid rgba(255,255,255,.08)', borderRadius: 6, color: '#64748b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer' }}>Collapse</button>
                    </div>
                )}

                {/* Push Changes */}
                <button
                    onClick={() => pushChanges()}
                    disabled={isSaving}
                    style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 32, background: isSaving ? '#334155' : '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em', cursor: isSaving ? 'not-allowed' : 'pointer', flexShrink: 0 }}
                >
                    {isSaving ? <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: 10 }}></i> : <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 10 }}></i>}
                    {isSaving ? 'Saving...' : 'Push Changes'}
                </button>
            </header>

            {/* Matrix View */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="sticky top-0 bg-white z-30 shadow-sm">
                            <tr className="border-b border-slate-100">
                                <th className="w-[240px] p-4 bg-slate-50/50 sticky left-0 z-40 backdrop-blur-md">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[.2em]">Identifier</span>
                                </th>
                                {ROLES.map(role => (
                                    <th key={role} className="p-4 border-l border-slate-100 text-center bg-slate-50/10">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                                                {role}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* MODULES GROUP */}
                            {(activeCategory === 'all' || activeCategory === 'modules') && (
                                <>
                                    <tr className="bg-indigo-50/30">
                                        <td colSpan={ROLES.length + 1} className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-puzzle-piece text-indigo-600 text-[10px]"></i>
                                                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[.2em]">Core Module Permissions</span>
                                            </div>
                                        </td>
                                    </tr>
                                    {PERMISSIONS_SCHEMA.filter(m => isMatch(m.label)).map(mod => (
                                        <React.Fragment key={mod.key}>
                                            {/* Module Access Row */}
                                            <tr className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                                <td className="p-4 sticky left-0 bg-white z-10 group-hover:bg-slate-50 transition-colors border-r border-slate-50">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => toggleModuleExpansion(mod.key)}
                                                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] transition-all ${expandedModules.includes(mod.key) ? 'bg-indigo-600 text-white rotate-90' : 'bg-slate-100 text-slate-400 hover:text-indigo-600'}`}
                                                        >
                                                            <i className="fa-solid fa-chevron-right text-[10px]"></i>
                                                        </button>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 leading-none">{mod.label}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {ROLES.map(role => (
                                                    <td key={role} className="p-4 border-l border-slate-50 text-center">
                                                        <label className="relative inline-flex items-center cursor-pointer group/toggle scale-75">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={templatePerms[role].modules[mod.key]?.enabled}
                                                                onChange={() => handleToggle(role, 'modules', `${mod.key}:enabled`, true)}
                                                            />
                                                            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900 shadow-inner"></div>
                                                        </label>
                                                    </td>
                                                ))}
                                            </tr>
                                            {/* Action Level Rows if expanded */}
                                            {expandedModules.includes(mod.key) && mod.actions.map(action => (
                                                <tr key={`${mod.key}-${action}`} className="bg-slate-50/30 group hover:bg-slate-100/50 transition-colors border-b border-slate-50/50">
                                                    <td className="px-4 py-2 pl-12 sticky left-0 bg-white/80 group-hover:bg-slate-50 transition-colors border-r border-slate-50">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-500 capitalize">{action.replace(/_/g, ' ')} Access</span>
                                                        </div>
                                                    </td>
                                                    {ROLES.map(role => (
                                                        <td key={role} className="px-4 py-2 border-l border-slate-50 text-center">
                                                            <button
                                                                onClick={() => handleToggle(role, 'modules', `${mod.key}:${action}`, true)}
                                                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all mx-auto ${templatePerms[role].modules[mod.key]?.actions[action] ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-transparent'}`}
                                                            >
                                                                <i className="fa-solid fa-check text-[10px]"></i>
                                                            </button>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            {/* View Options */}
                                            {expandedModules.includes(mod.key) && mod.viewOptions && (
                                                <tr className="bg-amber-50/5 border-b border-slate-50">
                                                    <td className="px-4 py-3 pl-12 sticky left-0 bg-white/80 border-r border-slate-50">
                                                        <span className="text-[9px] font-black text-amber-700 uppercase leading-none">View Visibility</span>
                                                    </td>
                                                    {ROLES.map(role => (
                                                        <td key={role} className="px-4 py-3 border-l border-slate-50 text-center">
                                                            <div className="flex justify-center gap-1">
                                                                {mod.viewOptions!.map(opt => (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => handleToggle(role, 'modules', `${mod.key}:view`, opt)}
                                                                        className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase transition-all ${templatePerms[role].modules[mod.key]?.view === opt ? 'bg-amber-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-400'}`}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </>
                            )}

                            {/* FEATURES GROUP */}
                            {(activeCategory === 'all' || activeCategory === 'features') && (
                                <>
                                    <tr className="bg-emerald-50/30">
                                        <td colSpan={ROLES.length + 1} className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-bolt text-emerald-600 text-[10px]"></i>
                                                <span className="text-[10px] font-black text-emerald-900 uppercase tracking-[.2em]">Global System Enhancements</span>
                                            </div>
                                        </td>
                                    </tr>
                                    {FEATURES_SCHEMA.filter(f => isMatch(f.label)).map(feat => (
                                        <tr key={feat.key} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                            <td className="p-4 sticky left-0 bg-white z-10 border-r border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-all">
                                                        <i className={`fa-solid ${feat.icon} text-[10px]`}></i>
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-900 leading-none">{feat.label}</p>
                                                </div>
                                            </td>
                                            {ROLES.map(role => (
                                                <td key={role} className="p-4 border-l border-slate-50 text-center">
                                                    <button
                                                        onClick={() => handleToggle(role, 'features', feat.key, true)}
                                                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all mx-auto ${templatePerms[role].features[feat.key] ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-300'}`}
                                                    >
                                                        <i className={`fa-solid ${templatePerms[role].features[feat.key] ? 'fa-check' : 'fa-minus'} text-[10px]`}></i>
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </>
                            )}

                            {/* DASHBOARD CARDS GROUP */}
                            {(activeCategory === 'all' || activeCategory === 'dashboards') && (
                                <>
                                    <tr className="bg-rose-50/30">
                                        <td colSpan={ROLES.length + 1} className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-chart-line text-rose-600 text-[10px]"></i>
                                                <span className="text-[10px] font-black text-rose-900 uppercase tracking-[.2em]">Visual Data Widgets</span>
                                            </div>
                                        </td>
                                    </tr>
                                    {DASHBOARD_CARDS_SCHEMA.filter(c => isMatch(c.label)).map(card => (
                                        <tr key={card.key} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                            <td className="p-4 sticky left-0 bg-white z-10 border-r border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-rose-600 transition-all">
                                                        <i className={`fa-solid ${card.icon} text-[10px]`}></i>
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-900 leading-none">{card.label}</p>
                                                </div>
                                            </td>
                                            {ROLES.map(role => (
                                                <td key={role} className="p-4 border-l border-slate-50 text-center">
                                                    <button
                                                        onClick={() => handleToggle(role, 'dashboards', card.key, true)}
                                                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all mx-auto ${templatePerms[role].dashboardCards[card.key] ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-200 text-transparent'}`}
                                                    >
                                                        <i className="fa-solid fa-check text-[10px]"></i>
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {searchQuery && (
                        <div className="hidden only:block py-20 text-center bg-slate-50">
                            <i className="fa-solid fa-magnifying-glass-slash text-4xl text-slate-200 mb-4"></i>
                            <h3 className="text-slate-500 font-black uppercase tracking-widest text-[11px]">No permissions matching "{searchQuery}"</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / Stats bar */}
            <footer className="px-4 py-2 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Modules: <span className="text-slate-900">{PERMISSIONS_SCHEMA.length}</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Features: <span className="text-slate-900">{FEATURES_SCHEMA.length}</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Cards: <span className="text-slate-900">{DASHBOARD_CARDS_SCHEMA.length}</span></span>
                    </div>
                </div>
                <p className="text-xs font-bold text-slate-300 italic">Templates automatically sync to new user creation workflows.</p>
            </footer>
        </div>
    );
}

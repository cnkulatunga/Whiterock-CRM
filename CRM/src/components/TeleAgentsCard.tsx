'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AgentDrawer from './AgentDrawer';

const AVATAR_COLORS = [
    'bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-sky-500',
    'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-pink-500',
];

function initials(name: string) {
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

interface DirectoryUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    designation: string;
    status: string;
    is_online: boolean;
    last_seen: string | null;
    lead_count: number;
}

export default function TeleAgentsCard() {
    const [users, setUsers] = useState<DirectoryUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        try {
            const session = sessionStorage.getItem('crm_session');
            const token = session ? JSON.parse(session).access : null;
            fetch('/api/users?directory=true', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            })
                .then(r => r.ok ? r.json() : Promise.reject())
                .then((data: DirectoryUser[]) => setUsers(data))
                .catch(() => {})
                .finally(() => setLoading(false));
        } catch {
            setLoading(false);
        }
    }, []);

    const openAgent = (user: DirectoryUser, colorClass: string) => {
        setSelectedAgent({
            id: initials(user.name),
            name: user.name,
            email: user.email,
            phone: user.phone || '—',
            status: user.is_online ? 'ACTIVE' : 'OFFLINE',
            leads: user.lead_count,
            color: colorClass,
        });
        setDrawerOpen(true);
    };

    const onlineCount = users.filter(u => u.is_online).length;

    return (
        <div className="glass-card card-h-std flex flex-col">
            <div className="flex items-center gap-2.5 shrink-0" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48 }}>
                <i className="fa-solid fa-headset" style={{ color: '#34d399', fontSize: 13, flexShrink: 0 }}></i>
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>Online Agents</p>
                    <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>Team Directory</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#34d399', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                        {loading ? 'Loading…' : `${onlineCount} Online`}
                    </span>
                </div>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto custom-scrollbar">
                {loading && (
                    <div className="flex items-center justify-center h-32 text-slate-400 text-xs">Loading…</div>
                )}
                {!loading && users.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-slate-400 text-xs">No users found</div>
                )}
                {users.map((user, idx) => {
                    const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    const isOnline = user.is_online;
                    return (
                        <div
                            key={user.id}
                            onClick={() => openAgent(user, colorClass)}
                            className={`px-3 py-2 cursor-pointer bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group flex items-center justify-between ${!isOnline ? 'opacity-70 grayscale hover:grayscale-0' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center text-white text-xs font-black`}>
                                        {initials(user.name)}
                                    </div>
                                    {isOnline && (
                                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"></span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 leading-tight">{user.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-500 mt-0.5 flex items-center gap-1.5">
                                        <i className="fa-solid fa-envelope text-[10px] w-3"></i> {user.email}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-500 mt-0.5 flex items-center gap-1.5">
                                        <i className="fa-solid fa-phone text-[10px] w-3"></i> {user.phone || '—'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end justify-between h-full gap-1.5">
                                <span className={`${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'} text-[6px] font-black px-1.5 py-0.5 rounded uppercase`}>
                                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                                </span>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Leads: {user.lead_count}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {typeof window !== 'undefined' && createPortal(
                <AgentDrawer
                    agent={selectedAgent}
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                />,
                document.body
            )}
        </div>
    );
}

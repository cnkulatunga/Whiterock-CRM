'use client';

import { useEffect, useState } from 'react';

const AVATAR_COLORS = [
    '#6366f1', '#0891b2', '#16a34a', '#b45309', '#b91c1c',
    '#7c3aed', '#0369a1', '#059669', '#d97706', '#dc2626',
];

function avatarColor(name: string) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function timeAgo(iso: string | null): string {
    if (!iso) return 'Never';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

interface Member {
    id: string;
    name: string;
    role: string;
    designation: string;
    is_online: boolean;
    last_seen: string | null;
    lead_count: number;
}

export default function TeamDirectoryCard() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/users?directory=true')
            .then(r => r.ok ? r.json() : [])
            .then(data => setMembers(Array.isArray(data) ? data : []))
            .catch(() => setMembers([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="glass-card card-h-std flex flex-col">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between bg-white/50 sticky top-0 z-10 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-tight">Team Directory</h3>
                    <div className="flex items-center gap-1.5 ml-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase">Live Now</span>
                    </div>
                </div>
                {!loading && (
                    <span className="text-[10px] font-black text-emerald-500 uppercase">
                        {members.filter(m => m.is_online).length} online
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {loading && Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-2.5 w-28 bg-slate-100 rounded" />
                            <div className="h-2 w-20 bg-slate-50 rounded" />
                        </div>
                    </div>
                ))}

                {!loading && members.length === 0 && (
                    <div className="flex items-center justify-center h-full py-8">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No team members</span>
                    </div>
                )}

                {!loading && members.map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-sm shrink-0"
                            style={{ backgroundColor: avatarColor(member.name) }}
                        >
                            {member.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-900 truncate">{member.name}</h4>
                                <span className={`text-[10px] font-black uppercase ${member.is_online ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {member.is_online ? 'Online' : 'Offline'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{member.designation || member.role}</p>
                                <p className="text-[10px] font-medium text-slate-300">{member.is_online ? 'Active now' : timeAgo(member.last_seen)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

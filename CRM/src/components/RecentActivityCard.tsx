'use client';

import { useEffect, useState } from 'react';

interface ActivityEntry {
    id: string;
    user_name: string;
    action: string;
    entity_type: string;
    timestamp: string;
}

function iconForEntry(entry: ActivityEntry): { icon: string; color: string } {
    const a = entry.action.toLowerCase();
    const t = entry.entity_type.toLowerCase();
    if (/creat|add/.test(a)) return { icon: 'fa-plus-circle', color: 'indigo' };
    if (/delet|remov/.test(a)) return { icon: 'fa-circle-xmark', color: 'rose' };
    if (/approv/.test(a)) return { icon: 'fa-circle-check', color: 'emerald' };
    if (/reject/.test(a)) return { icon: 'fa-circle-xmark', color: 'red' };
    if (/upload|document|doc/.test(a)) return { icon: 'fa-file-arrow-up', color: 'blue' };
    if (/note/.test(a)) return { icon: 'fa-note-sticky', color: 'amber' };
    if (/task|follow/.test(a)) return { icon: 'fa-list-check', color: 'violet' };
    if (/status|mov|stage/.test(a)) return { icon: 'fa-arrows-rotate', color: 'sky' };
    if (/login|auth/.test(a)) return { icon: 'fa-right-to-bracket', color: 'slate' };
    if (t === 'lender') return { icon: 'fa-building-columns', color: 'indigo' };
    if (t === 'user') return { icon: 'fa-user', color: 'slate' };
    return { icon: 'fa-bolt-lightning', color: 'indigo' };
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function RecentActivityCard() {
    const [activities, setActivities] = useState<ActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/audit?page_size=20')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list = Array.isArray(data) ? data : (data?.results ?? []);
                setActivities(list.slice(0, 20));
            })
            .catch(() => setActivities([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="glass-card card-h-std flex flex-col">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <i className="fa-solid fa-bolt-lightning text-xs"></i>
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Recent Activity</h3>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">View Log</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {loading && Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0" />
                        <div className="flex-1 space-y-1.5 pt-0.5">
                            <div className="h-2.5 w-32 bg-slate-100 rounded" />
                            <div className="h-2 w-48 bg-slate-50 rounded" />
                        </div>
                    </div>
                ))}

                {!loading && activities.length === 0 && (
                    <div className="flex items-center justify-center h-full py-8">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No activity yet</span>
                    </div>
                )}

                {!loading && activities.map((activity, idx) => {
                    const { icon, color } = iconForEntry(activity);
                    return (
                        <div key={activity.id} className="flex gap-3 relative">
                            {idx !== activities.length - 1 && (
                                <div className="absolute left-[15px] top-[30px] bottom-[-20px] w-px bg-slate-100"></div>
                            )}
                            <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-600 shrink-0 z-10 border border-white`}>
                                <i className={`fa-solid ${icon} text-[10px]`}></i>
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex justify-between items-center bg-white">
                                    <span className="text-xs font-black text-slate-900 truncate pr-2">{activity.user_name || 'System'}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{timeAgo(activity.timestamp)}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">{activity.action}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

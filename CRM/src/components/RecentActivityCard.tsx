'use client';

const ACTIVITIES = [
    { id: 1, user: 'James Smith', action: 'Uploaded Bank Statements', time: '10 mins ago', icon: 'fa-file-arrow-up', color: 'indigo' },
    { id: 2, user: 'NatWest', action: 'Approved Application #AF-022', time: '45 mins ago', icon: 'fa-circle-check', color: 'emerald' },
    { id: 3, user: 'System', action: 'Sent Automated Follow-up to Oliver', time: '2h ago', icon: 'fa-paper-plane', color: 'blue' },
    { id: 4, user: 'Priya', action: 'Rejected Document for #AF-045', time: '3h ago', icon: 'fa-circle-xmark', color: 'rose' },
    { id: 5, user: 'Lloyds Bank', action: 'Requested Further Info', time: '5h ago', icon: 'fa-circle-info', color: 'amber' },
];

export default function RecentActivityCard() {
    return (
        <div className="glass-card flex flex-col h-[280px]">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <i className="fa-solid fa-bolt-lightning text-xs"></i>
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Recent Activity</h3>
                </div>
                <button className="text-[8px] font-black text-indigo-600 uppercase hover:underline">View Log</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {ACTIVITIES.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-3 relative">
                        {idx !== ACTIVITIES.length - 1 && (
                            <div className="absolute left-[15px] top-[30px] bottom-[-20px] w-px bg-slate-100"></div>
                        )}
                        <div className={`w-8 h-8 rounded-lg bg-${activity.color}-50 flex items-center justify-center text-${activity.color}-600 shrink-0 z-10 border border-white`}>
                            <i className={`fa-solid ${activity.icon} text-[10px]`}></i>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-center bg-white">
                                <span className="text-[9px] font-black text-slate-900 truncate pr-2">{activity.user}</span>
                                <span className="text-[7px] font-bold text-slate-400 uppercase whitespace-nowrap">{activity.time}</span>
                            </div>
                            <p className="text-[9px] font-medium text-slate-500 mt-0.5">{activity.action}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

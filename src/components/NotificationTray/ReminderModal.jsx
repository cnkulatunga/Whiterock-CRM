import React from 'react';

const ReminderModal = ({ reminder, onDismiss }) => {
    if (!reminder) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-[#1a202c]/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white w-full max-w-[450px] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-scaleIn">
                <div className="p-8 pb-0 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-[#ebf0ff] flex items-center justify-center text-[#2447d7] shadow-lg shadow-[#2447d7]/10 animate-bounce-slow">
                        <IconBell size={40} />
                    </div>
                    <h3 className="mt-6 text-[11px] font-black text-[#cbd5e0] uppercase tracking-[0.3em]">Critical Task Notification</h3>
                </div>

                <div className="p-10 flex flex-col gap-6">
                    <h2 className="text-2xl font-black text-[#1a202c] text-center tracking-tight leading-tight">{reminder.title}</h2>
                    
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 group cursor-help">
                            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] flex items-center justify-center text-[#a0aec0] group-hover:text-[#2447d7] transition-colors border border-[#f1f5f9]">
                                <IconUser size={16} />
                            </div>
                            <span className="text-[12px] font-bold text-[#4a5568]">{reminder.lead || 'Personal Task'}</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-help">
                            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] flex items-center justify-center text-[#a0aec0] group-hover:text-[#f97316] transition-colors border border-[#f1f5f9]">
                                <IconClock size={16} />
                            </div>
                            <span className="text-[12px] font-bold text-[#4a5568]">{reminder.time}</span>
                        </div>
                    </div>

                    {reminder.message && (
                        <div className="p-6 bg-[#f8fafc] rounded-[1.5rem] border border-[#f1f5f9] relative">
                            <div className="absolute -top-3 left-6 px-3 bg-white border border-[#f1f5f9] rounded-full text-[9px] font-black text-[#cbd5e0] uppercase tracking-widest">
                                Transaction Brief
                            </div>
                            <p className="text-[13px] font-medium text-[#4a5568] leading-relaxed italic text-center">"{reminder.message}"</p>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-[#fcfdff] border-t border-[#f7fafc] flex flex-col gap-3">
                    <button 
                        className="w-full py-4 bg-[#2447d7] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.15em] shadow-xl shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all active:scale-95"
                        onClick={onDismiss}
                    >
                        Acknowledge & Dismiss
                    </button>
                    <p className="text-[10px] text-center text-[#cbd5e0] font-bold uppercase tracking-widest">
                        Logged at {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

const IconBell = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconUser = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const IconClock = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

export default ReminderModal;

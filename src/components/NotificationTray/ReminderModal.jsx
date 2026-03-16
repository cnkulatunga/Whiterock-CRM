import React from 'react';

const ReminderModal = ({ reminders, onDismiss }) => {
    if (!reminders || reminders.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-[#1a202c]/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-scaleIn flex flex-col max-h-[90vh]">
                <div className="p-8 pb-4 flex flex-col items-center shrink-0">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#ebf0ff] flex items-center justify-center text-[#2447d7] shadow-lg shadow-[#2447d7]/10">
                        <IconBell size={32} />
                    </div>
                    <h3 className="mt-4 text-[11px] font-black text-[#cbd5e0] uppercase tracking-[0.3em]">
                        {reminders.length > 1 ? 'Multiple Task Notifications' : 'Critical Task Notification'}
                    </h3>
                </div>

                <div className="px-8 py-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-4">
                        {reminders.map((reminder) => (
                            <div key={reminder.id} className="p-6 bg-[#f8fafc] rounded-[2rem] border border-[#f1f5f9] group transition-all hover:border-[#2447d7]/30">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <h2 className="text-lg font-black text-[#1a202c] tracking-tight leading-tight">
                                        {reminder.title}
                                    </h2>
                                    <button 
                                        onClick={() => onDismiss(reminder.id)}
                                        className="text-[#cbd5e0] hover:text-[#e53e3e] transition-colors"
                                        title="Dismiss this notification"
                                    >
                                        <IconClose size={20} />
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <IconUser size={14} className="text-[#a0aec0]" />
                                        <span className="text-[11px] font-bold text-[#718096]">{reminder.lead || 'Personal Task'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <IconClock size={14} className="text-[#a0aec0]" />
                                        <span className="text-[11px] font-bold text-[#718096]">{reminder.time}</span>
                                    </div>
                                </div>

                                {reminder.message && (
                                    <div className="mt-2 p-3 px-4 bg-white/50 rounded-xl border border-[#f1f5f9] text-[12px] text-[#4a5568] italic font-medium">
                                        "{reminder.message}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 pb-6 bg-[#fcfdff] border-t border-[#f7fafc] shrink-0">
                    <button 
                        className="w-full py-4 bg-[#2447d7] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.15em] shadow-xl shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all active:scale-95 mb-4"
                        onClick={() => reminders.forEach(r => onDismiss(r.id))}
                    >
                        Dismiss All Notifications
                    </button>
                    <p className="text-[10px] text-center text-[#cbd5e0] font-bold uppercase tracking-widest">
                        Total {reminders.length} active {reminders.length === 1 ? 'alert' : 'alerts'}
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

const IconUser = ({ size = 20, className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size} className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const IconClock = ({ size = 20, className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size} className={className}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconClose = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default ReminderModal;

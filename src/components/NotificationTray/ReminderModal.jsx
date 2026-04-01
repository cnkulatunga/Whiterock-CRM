import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ReminderModal = ({ reminders, onDismiss }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!reminders || reminders.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-[#1a202c]/60 backdrop-blur-md animate-fadeIn">
            <div className={`w-full max-w-[500px] rounded-[2.5rem] shadow-2xl overflow-hidden border animate-scaleIn flex flex-col max-h-[90vh] ${isDark ? 'bg-[#1e2347] border-white/10' : 'bg-white border-white/20'}`}>
                <div className="p-8 pb-4 flex flex-col items-center shrink-0">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-[#2447d7]/10 ${isDark ? 'bg-[#2447d7]/20 text-[#7a96fa]' : 'bg-[#ebf0ff] text-[#2447d7]'}`}>
                        <IconBell size={32} />
                    </div>
                    <h3 className={`mt-4 text-[11px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-[#546298]' : 'text-[#cbd5e0]'}`}>
                        {reminders.length > 1 ? 'Multiple Task Notifications' : 'Critical Task Notification'}
                    </h3>
                </div>

                <div className="px-8 py-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-4">
                        {reminders.map((reminder) => (
                            <div key={reminder.id} className={`p-6 rounded-[2rem] border group transition-all ${isDark ? 'bg-[#242b58] border-white/10 hover:border-[#2447d7]/40' : 'bg-[#f8fafc] border-[#f1f5f9] hover:border-[#2447d7]/30'}`}>
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <h2 className={`text-lg font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#1a202c]'}`}>
                                        {reminder.title}
                                    </h2>
                                    <button
                                        onClick={() => onDismiss(reminder.id)}
                                        className={`transition-colors ${isDark ? 'text-[#546298] hover:text-red-400' : 'text-[#cbd5e0] hover:text-[#e53e3e]'}`}
                                        title="Dismiss this notification"
                                    >
                                        <IconClose size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <IconUser size={14} className={isDark ? 'text-[#546298]' : 'text-[#a0aec0]'} />
                                        <span className={`text-[11px] font-bold ${isDark ? 'text-[#8ea0d4]' : 'text-[#718096]'}`}>{reminder.lead || 'Personal Task'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <IconClock size={14} className={isDark ? 'text-[#546298]' : 'text-[#a0aec0]'} />
                                        <span className={`text-[11px] font-bold ${isDark ? 'text-[#8ea0d4]' : 'text-[#718096]'}`}>{reminder.time}</span>
                                    </div>
                                </div>

                                {reminder.message && (
                                    <div className={`mt-2 p-3 px-4 rounded-xl border text-[12px] italic font-medium ${isDark ? 'bg-white/5 border-white/10 text-[#8ea0d4]' : 'bg-white/50 border-[#f1f5f9] text-[#4a5568]'}`}>
                                        "{reminder.message}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`p-8 pb-6 border-t shrink-0 ${isDark ? 'bg-[#1a2040] border-white/10' : 'bg-[#fcfdff] border-[#f7fafc]'}`}>
                    <button
                        className="w-full py-4 bg-[#2447d7] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.15em] shadow-xl shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all active:scale-95 mb-4"
                        onClick={() => reminders.forEach(r => onDismiss(r.id))}
                    >
                        Dismiss All Notifications
                    </button>
                    <p className={`text-[10px] text-center font-bold uppercase tracking-widest ${isDark ? 'text-[#546298]' : 'text-[#cbd5e0]'}`}>
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

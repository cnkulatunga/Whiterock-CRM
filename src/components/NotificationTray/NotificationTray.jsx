import React from 'react';

const NotificationTray = ({ notifications, onRemove }) => {
    return (
        <div className="fixed top-6 right-6 flex flex-col gap-3 z-[10000] w-[350px] max-w-[90vw] pointer-events-none">
            {notifications.map(n => (
                <div 
                    key={n.id} 
                    className={`pointer-events-auto bg-white border-2 rounded-[1.25rem] p-4 flex gap-4 shadow-2xl animate-slideInRight cursor-pointer group transition-all hover:translate-x-[-4px] active:scale-95 ${
                        n.type === 'reminder' ? 'border-[#2447d7]/20 shadow-[#2447d7]/5' : 'border-[#10b981]/20 shadow-[#10b981]/5'
                    }`} 
                    onClick={() => onRemove(n.id)}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                        n.type === 'reminder' ? 'bg-[#ebf0ff] text-[#2447d7]' : 'bg-[#ecfdf5] text-[#10b981]'
                    }`}>
                        {n.type === 'reminder' ? <IconBell size={20} /> : <IconInfo size={20} />}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <h4 className="text-[13px] font-black text-[#1a202c] uppercase tracking-wider">{n.title}</h4>
                        <p className="text-[12px] font-bold text-[#718096] leading-relaxed line-clamp-2">{n.message}</p>
                    </div>
                    <button className="text-[#cbd5e0] hover:text-[#1a202c] transition-colors text-xl font-black px-1 group-hover:scale-125 transition-transform">
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
};

const IconBell = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconInfo = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

export default NotificationTray;

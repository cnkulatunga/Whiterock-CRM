import React from 'react';

const LenderWorkflows = () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-[#f8fafc] min-h-[600px] text-center p-12 animate-fadeIn font-['Sora',sans-serif]">
        <div className="w-24 h-24 bg-[#ebf0ff] rounded-[2rem] flex items-center justify-center shadow-xl shadow-[#2447d7]/10 animate-pulse-slow">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                <rect x="2" y="3" width="6" height="6" rx="1" />
                <rect x="9" y="3" width="6" height="6" rx="1" />
                <rect x="16" y="3" width="6" height="6" rx="1" />
                <path d="M5 9v3m4-3v3m4-3v3" />
                <rect x="2" y="15" width="20" height="6" rx="1" />
            </svg>
        </div>
        <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-[#1a202c] tracking-tight">Lender Workflows</h2>
            <p className="text-[1.05rem] text-[#718096] font-medium max-w-[450px] leading-relaxed">
                Manage lender approval pipelines, intelligent deal routing, and enterprise-grade workflow automation.
            </p>
        </div>
        <span className="px-6 py-2.5 bg-white border-2 border-[#2447d7]/10 text-[#2447d7] text-[11px] font-black uppercase tracking-[0.25em] rounded-full shadow-sm">
            Module in Development
        </span>
    </div>
);

export default LenderWorkflows;

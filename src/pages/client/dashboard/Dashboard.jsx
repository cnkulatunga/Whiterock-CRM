import React from 'react';

const Dashboard = () => {
    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            {/* Header Section */}
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-[1.75rem] font-bold text-[#1a202c] tracking-tight sm:text-2xl">Application Summary</h1>
                <p className="text-[0.95rem] text-[#718096]">
                    Lead ID: <span className="font-bold text-[#4a5568]">#WR-882910</span> (Read-only)
                </p>
            </div>

            <div className="grid grid-cols-[1fr_360px] gap-8 lg:grid-cols-1">
                {/* Main Content Column */}
                <div className="flex flex-col gap-6">
                    {/* Progress Card */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-8 md:p-6 overflow-hidden">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider mb-2 block">CURRENT STAGE</span>
                                <h2 className="text-2xl font-bold text-[#1a202c] md:text-xl">Lender Selection</h2>
                            </div>
                            <span className="text-3xl font-extrabold text-[#2447d7] leading-none md:text-2xl">75%</span>
                        </div>

                        <div className="relative mb-12">
                            <div className="h-3 bg-[#f1f5f9] rounded-full overflow-hidden mb-8">
                                <div className="h-full bg-gradient-to-r from-[#2447d7] to-[#4c6ef5] transition-all duration-1000 ease-out rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <div className="flex justify-between relative">
                                <div className="flex flex-col items-center flex-1 relative group">
                                    <div className="w-5 h-5 rounded-full border-[3px] border-white shadow-[0_0_0_2px_#2447d7] bg-[#2447d7] mb-3 relative z-10 transition-transform duration-300 group-hover:scale-125"></div>
                                    <span className="text-[11px] font-bold text-[#2d3748] text-center max-w-[80px] leading-tight">Document Collection</span>
                                </div>
                                <div className="flex flex-col items-center flex-1 relative group">
                                    <div className="w-5 h-5 rounded-full border-[3px] border-white shadow-[0_0_0_2px_#2447d7] bg-[#2447d7] mb-3 relative z-10 transition-transform duration-300 group-hover:scale-125"></div>
                                    <span className="text-[11px] font-bold text-[#2d3748] text-center max-w-[80px] leading-tight">Verification</span>
                                </div>
                                <div className="flex flex-col items-center flex-1 relative group">
                                    <div className="w-5 h-5 rounded-full border-[3px] border-white shadow-[0_0_0_2px_#2447d7] bg-white animate-pulse mb-3 relative z-10 transition-transform duration-300 group-hover:scale-125"></div>
                                    <span className="text-[11px] font-bold text-[#2447d7] text-center max-w-[80px] leading-tight animate-bounce-subtle">Lender Selection</span>
                                </div>
                                <div className="flex flex-col items-center flex-1 relative group">
                                    <div className="w-5 h-5 rounded-full border-[3px] border-white shadow-[0_0_0_2px_#e2e8f0] bg-[#f8fafc] mb-3 relative z-10 transition-transform duration-300 group-hover:scale-125"></div>
                                    <span className="text-[11px] font-bold text-[#a0aec0] text-center max-w-[80px] leading-tight">Complete</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f0f4ff] border border-[#dbeafe] rounded-xl p-5 flex gap-4">
                            <div className="w-10 h-10 bg-white/60 text-[#2447d7] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[0.95rem] font-bold text-[#1e3a8a]">Next Step: Final Decision</h3>
                                <p className="text-[0.85rem] text-[#4b5563] font-medium leading-relaxed">We are currently matching your profile with the best available lenders. You will be notified once a match is confirmed.</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-1">
                        <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 flex items-center gap-5 hover:border-[#2447d7]/20 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-[#f0f9ff] text-[#0369a1] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#0369a1] group-hover:text-white transition-colors duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                    <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">REQUESTED LOAN AMOUNT</span>
                                <span className="text-xl font-extrabold text-[#1a202c]">$450,000.00</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 flex items-center gap-5 hover:border-[#2447d7]/20 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-[#fdf2f8] text-[#be185d] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#be185d] group-hover:text-white transition-colors duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">SUBMISSION DATE</span>
                                <span className="text-xl font-extrabold text-[#1a202c]">Oct 24, 2023</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="flex flex-col gap-6 lg:max-w-none">
                    {/* Agent Card */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2447d7]/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-[#2447d7]/10 transition-colors duration-500"></div>

                        <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider block relative z-10">ASSIGNED AGENT</span>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-16 h-16 rounded-2xl border-[3px] border-[#f0f4ff] p-0.5 group-hover:border-[#2447d7]/30 transition-colors duration-300 overflow-hidden shrink-0">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&h=150&auto=format&fit=crop" alt="Sarah Jenkins" className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-lg font-bold text-[#1a202c] leading-tight">Sarah Jenkins</h3>
                                <span className="text-[13px] font-medium text-[#718096]">Senior Loan Officer</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 py-2 relative z-10">
                            <div className="flex items-center gap-3 group/item">
                                <div className="w-8 h-8 bg-[#f8fafc] text-[#718096] rounded-lg flex items-center justify-center shrink-0 group-hover/item:text-[#2447d7] group-hover/item:bg-[#ebf0ff] transition-all duration-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-[#4a5568] font-medium truncate">s.jenkins@whiterock.com</span>
                            </div>
                            <div className="flex items-center gap-3 group/item">
                                <div className="w-8 h-8 bg-[#f8fafc] text-[#718096] rounded-lg flex items-center justify-center shrink-0 group-hover/item:text-[#2447d7] group-hover/item:bg-[#ebf0ff] transition-all duration-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-[#4a5568] font-medium">+1 (555) 092-8834</span>
                            </div>
                            <div className="flex items-center gap-3 group/item">
                                <div className="w-8 h-8 bg-[#f8fafc] text-[#718096] rounded-lg flex items-center justify-center shrink-0 group-hover/item:text-[#2447d7] group-hover/item:bg-[#ebf0ff] transition-all duration-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <span className="text-[13px] text-[#4a5568] font-medium">Mon - Fri, 9AM - 5PM EST</span>
                            </div>
                        </div>

                        <a
                            href="https://wa.me/15550928834"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2447d7] text-white py-3.5 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_8px_16px_-4px_rgba(36,71,215,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(36,71,215,0.5)] hover:bg-[#1732a3] hover:translate-y-[-2px] active:translate-y-[0] transition-all duration-300 relative z-10 no-underline"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            Message Sarah
                        </a>
                    </div>

                    {/* Documents Card */}
                    <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6">
                        <input
                            type="file"
                            id="dashboard-file-input"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    alert(`Ready to upload: ${e.target.files[0].name}`);
                                }
                            }}
                        />
                        <h3 className="text-base font-bold text-[#1a202c] mb-5">Required Documents</h3>
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex items-center justify-between p-3.5 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] group hover:bg-white hover:border-[#2447d7]/20 transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-[#edf2f7] flex items-center justify-center text-[#ffcc00] group-hover:bg-[#ffcc00] group-hover:text-white transition-colors duration-200 shadow-sm">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="19" cy="12" r="1" />
                                            <circle cx="5" cy="12" r="1" />
                                        </svg>
                                    </div>
                                    <span className="text-[13px] font-bold text-[#4a5568]">Bank Statement</span>
                                </div>
                                <span className="text-[10px] font-extrabold text-[#94a3b8] py-1 px-2.5 rounded-full bg-[#f1f5f9] group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors uppercase tracking-[0.05em]">REQUIRED</span>
                            </div>
                        </div>
                        <button
                            className="w-full bg-white border-2 border-dashed border-[#e2e8f0] text-[#718096] p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-3 hover:border-[#2447d7] hover:text-[#2447d7] hover:bg-[#f0f4ff] hover:shadow-inner transition-all duration-300"
                            onClick={() => document.getElementById('dashboard-file-input').click()}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload Bank Statement
                        </button>
                    </div>
                </div>
            </div>
            <style jsx="true">{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;

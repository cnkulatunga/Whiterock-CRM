import React, { useRef } from 'react';

const Documents = () => {
    const fileInputRef = useRef(null);

    const handleBrowse = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            console.log("Selected file:", files[0].name);
            // In a real app, you would handle the upload here
            alert(`Ready to upload: ${files[0].name}`);
        }
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png"
            />

            <header className="mb-10">
                <div className="bg-gradient-to-br from-[#f8fafc] via-white to-[#eef2ff] border border-[#e6ebf5] rounded-2xl p-6 shadow-[0_10px_30px_-20px_rgba(36,71,215,0.35)]">
                    <div className="flex items-start gap-4 sm:flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2447d7] to-[#1a38b8] text-white flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(36,71,215,0.6)] shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h1 className="text-[1.75rem] font-bold text-[#1a202c] sm:text-2xl tracking-tight">Document Center</h1>
                                <span className="bg-[#e8edff] text-[#2447d7] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-[1.4px]">Secure Portal</span>
                            </div>
                            <p className="text-[0.95rem] text-[#5a6b85]">Complete your profile by uploading the required verification files.</p>
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#94a3b8] bg-white px-2.5 py-1 rounded-full border border-[#e6ebf5]">PDF, JPG, PNG</span>
                                <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#94a3b8] bg-white px-2.5 py-1 rounded-full border border-[#e6ebf5]">Max 10MB</span>
                                <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#94a3b8] bg-white px-2.5 py-1 rounded-full border border-[#e6ebf5]">Encrypted Uploads</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider">Required Documents</h2>
                    <span className="bg-[#fff5f5] text-[#e53e3e] text-[10px] font-extrabold px-3 py-1 rounded-lg border border-[#fed7d7] uppercase tracking-wider">ACTION REQUIRED</span>
                </div>

                <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] p-6 flex items-center gap-6 md:flex-col md:items-stretch">
                    <div className="w-14 h-14 bg-[#ebf0ff] text-[#2447d7] rounded-2xl flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                            <rect x="3" y="10" width="18" height="12" rx="2" />
                            <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1 mr-auto md:mr-0">
                        <h3 className="text-lg font-bold text-[#1a202c] leading-tight">Bank Statement</h3>
                        <p className="text-[13px] text-[#718096] font-medium leading-relaxed">Most recent 3 months of banking history</p>
                    </div>
                    <button 
                        className="bg-[#2447d7] text-white p-[12px_24px] rounded-xl text-sm font-bold shadow-[0_8px_16px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center gap-2 group" 
                        onClick={handleBrowse}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="group-hover:translate-y-[-1px] transition-transform">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Browse & Upload
                    </button>
                </div>
            </section>

            <section className="mb-12">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider">Upload History</h2>
                    <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#94a3b8] bg-white px-2.5 py-1 rounded-full border border-[#e6ebf5]">Last 3 uploads</span>
                </div>
                <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1">
                    {/* Item 1 */}
                    <div className="bg-white rounded-2xl border border-[#e6ebf5] p-5 shadow-[0_10px_24px_-18px_rgba(36,71,215,0.45)] hover:shadow-[0_20px_32px_-20px_rgba(36,71,215,0.55)] hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[13px] font-bold text-[#2d3748] truncate">Bank_Statement_Jan.pdf</span>
                                    <span className="block text-[12px] font-medium text-[#94a3b8]">Uploaded on Jan 15, 2024</span>
                                </div>
                            </div>
                            <span className="bg-[#ecfdf5] text-[#067647] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border border-[#bbf7d0]">APPROVED</span>
                        </div>
                        <div className="mt-4 h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                            <div className="h-full w-[100%] bg-gradient-to-r from-[#10b981] to-[#34d399]" />
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-white rounded-2xl border border-[#e6ebf5] p-5 shadow-[0_10px_24px_-18px_rgba(36,71,215,0.45)] hover:shadow-[0_20px_32px_-20px_rgba(36,71,215,0.55)] hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[13px] font-bold text-[#2d3748] truncate">Bank_Statement_Dec.pdf</span>
                                    <span className="block text-[12px] font-medium text-[#94a3b8]">Uploaded on Dec 12, 2023</span>
                                </div>
                            </div>
                            <span className="bg-[#ecfdf5] text-[#067647] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border border-[#bbf7d0]">APPROVED</span>
                        </div>
                        <div className="mt-4 h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                            <div className="h-full w-[100%] bg-gradient-to-r from-[#10b981] to-[#34d399]" />
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-white rounded-2xl border border-[#e6ebf5] p-5 shadow-[0_10px_24px_-18px_rgba(36,71,215,0.45)] hover:shadow-[0_20px_32px_-20px_rgba(36,71,215,0.55)] hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[13px] font-bold text-[#2d3748] truncate">Bank_Statement_Feb.pdf</span>
                                    <span className="block text-[12px] font-medium text-[#94a3b8]">Uploaded on Feb 24, 2024</span>
                                </div>
                            </div>
                            <span className="bg-[#fef3c7] text-[#92400e] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border border-[#fde68a]">PENDING</span>
                        </div>
                        <div className="mt-4 h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                            <div className="h-full w-[60%] bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-4">
                <div className="bg-white rounded-3xl border-2 border-dashed border-[#e2e8f0] p-12 flex flex-col items-center gap-6 hover:border-[#2447d7] hover:bg-[#f0f4ff] hover:shadow-inner transition-all duration-500 group cursor-pointer" onClick={handleBrowse}>
                    <div className="w-16 h-16 bg-gradient-to-tr from-[#2447d7] to-[#4c6ef5] rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(36,71,215,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-center gap-1 group-hover:translate-y-[-2px] transition-transform duration-300">
                        <h3 className="text-xl font-bold text-[#1a202c]">Drag and drop files here</h3>
                        <p className="text-[#718096] text-[15px] font-medium">Support for PDF, JPG, PNG up to 10MB</p>
                    </div>
                    <button className="bg-white border-2 border-[#e2e8f0] text-[#4a5568] p-[10px_28px] rounded-xl text-[15px] font-bold hover:bg-[#2447d7] hover:text-white hover:border-[#2447d7] hover:shadow-lg active:scale-95 transition-all duration-300">Browse Files</button>
                </div>
            </section>
        </div>
    );
};

export default Documents;

import React, { useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const Documents = () => {
    const fileInputRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleBrowse = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            console.log("Selected file:", files[0].name);
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
                <div
                    className="rounded-2xl p-6 shadow-[0_10px_30px_-20px_rgba(36,71,215,0.35)]"
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, #1e2340, #252c50)'
                            : 'linear-gradient(135deg, #f8fafc, #ffffff, #eef2ff)',
                        border: `1px solid ${isDark ? '#36407a' : '#e6ebf5'}`,
                    }}
                >
                    <div className="flex items-start gap-4 sm:flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2447d7] to-[#1a38b8] text-white flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(36,71,215,0.6)] shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h1
                                    className="text-[1.75rem] font-bold sm:text-2xl tracking-tight"
                                    style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}
                                >
                                    Document Center
                                </h1>
                                <span
                                    className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-[1.4px]"
                                    style={{
                                        background: isDark ? 'rgba(36,71,215,0.25)' : '#e8edff',
                                        color: isDark ? '#93acff' : '#2447d7',
                                    }}
                                >
                                    Secure Portal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ color: isDark ? '#64748b' : '#a0aec0' }}
                    >
                        Required Documents
                    </h2>
                    <span
                        className="text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider"
                        style={{
                            background: isDark ? 'rgba(220,38,38,0.15)' : '#fff5f5',
                            color: isDark ? '#fc8181' : '#e53e3e',
                            border: `1px solid ${isDark ? 'rgba(220,38,38,0.3)' : '#fed7d7'}`,
                        }}
                    >
                        ACTION REQUIRED
                    </span>
                </div>

                <div
                    className="rounded-2xl p-6 flex items-center gap-6 md:flex-col md:items-stretch"
                    style={{
                        background: isDark ? '#1e2340' : '#ffffff',
                        border: `1px solid ${isDark ? '#2d3561' : '#edf2f7'}`,
                        boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.02)',
                    }}
                >
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{
                            background: isDark ? 'rgba(36,71,215,0.2)' : '#ebf0ff',
                            color: '#2447d7',
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                            <rect x="3" y="10" width="18" height="12" rx="2" />
                            <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1 mr-auto md:mr-0">
                        <h3
                            className="text-lg font-bold leading-tight"
                            style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}
                        >
                            Bank Statement
                        </h3>
                        <p
                            className="text-[13px] font-medium leading-relaxed"
                            style={{ color: isDark ? '#94a3b8' : '#718096' }}
                        >
                            Most recent 3 months of banking history
                        </p>
                    </div>
                    <button
                        className="bg-[#2447d7] text-white p-[12px_24px] rounded-xl text-sm font-bold shadow-[0_8px_16px_rgba(36,71,215,0.25)] hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center gap-2 group"
                        onClick={handleBrowse}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="group-hover:translate-y-[-1px] transition-transform">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Browse &amp; Upload
                    </button>
                </div>
            </section>

            <section className="mb-12">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <h2
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ color: isDark ? '#64748b' : '#a0aec0' }}
                    >
                        Upload History
                    </h2>
                    <span
                        className="text-[11px] font-bold uppercase tracking-[1.4px] px-2.5 py-1 rounded-full"
                        style={{
                            color: isDark ? '#64748b' : '#94a3b8',
                            background: isDark ? '#1e2340' : '#ffffff',
                            border: `1px solid ${isDark ? '#2d3561' : '#e6ebf5'}`,
                        }}
                    >
                        Last 3 uploads
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1">
                    {/* Item 1 */}
                    <div
                        className="rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300"
                        style={{
                            background: isDark ? '#1e2340' : '#ffffff',
                            border: `1px solid ${isDark ? '#2d3561' : '#e6ebf5'}`,
                            boxShadow: isDark
                                ? '0 10px_24px_-18px_rgba(36,71,215,0.45)'
                                : '0 10px 24px -18px rgba(36,71,215,0.45)',
                        }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5', color: '#10b981' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[13px] font-bold truncate" style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>Bank_Statement_Jan.pdf</span>
                                    <span className="block text-[12px] font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Uploaded on Jan 15, 2024</span>
                                </div>
                            </div>
                            <span
                                className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
                                style={{
                                    background: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                    color: isDark ? '#34d399' : '#067647',
                                    border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#bbf7d0'}`,
                                }}
                            >APPROVED</span>
                        </div>
                        <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? '#2d3561' : '#f1f5f9' }}>
                            <div className="h-full w-[100%] bg-gradient-to-r from-[#10b981] to-[#34d399]" />
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div
                        className="rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300"
                        style={{
                            background: isDark ? '#1e2340' : '#ffffff',
                            border: `1px solid ${isDark ? '#2d3561' : '#e6ebf5'}`,
                        }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5', color: '#10b981' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[13px] font-bold truncate" style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>Bank_Statement_Dec.pdf</span>
                                    <span className="block text-[12px] font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Uploaded on Dec 12, 2023</span>
                                </div>
                            </div>
                            <span
                                className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
                                style={{
                                    background: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                    color: isDark ? '#34d399' : '#067647',
                                    border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#bbf7d0'}`,
                                }}
                            >APPROVED</span>
                        </div>
                        <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? '#2d3561' : '#f1f5f9' }}>
                            <div className="h-full w-[100%] bg-gradient-to-r from-[#10b981] to-[#34d399]" />
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div
                        className="rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300"
                        style={{
                            background: isDark ? '#1e2340' : '#ffffff',
                            border: `1px solid ${isDark ? '#2d3561' : '#e6ebf5'}`,
                        }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: isDark ? 'rgba(180,83,9,0.2)' : '#fef3c7', color: '#b45309' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[13px] font-bold truncate" style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>Bank_Statement_Feb.pdf</span>
                                    <span className="block text-[12px] font-medium" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Uploaded on Feb 24, 2024</span>
                                </div>
                            </div>
                            <span
                                className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
                                style={{
                                    background: isDark ? 'rgba(180,83,9,0.2)' : '#fef3c7',
                                    color: isDark ? '#fbbf24' : '#92400e',
                                    border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#fde68a'}`,
                                }}
                            >PENDING</span>
                        </div>
                        <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? '#2d3561' : '#f1f5f9' }}>
                            <div className="h-full w-[60%] bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-4">
                <div
                    className="rounded-3xl border-2 border-dashed p-12 flex flex-col items-center gap-6 hover:shadow-inner transition-all duration-500 group cursor-pointer"
                    style={{
                        background: isDark ? '#1a1f3a' : '#ffffff',
                        borderColor: isDark ? '#2d3561' : '#e2e8f0',
                    }}
                    onClick={handleBrowse}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#2447d7';
                        e.currentTarget.style.background = isDark ? '#1e2447' : '#f0f4ff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = isDark ? '#2d3561' : '#e2e8f0';
                        e.currentTarget.style.background = isDark ? '#1a1f3a' : '#ffffff';
                    }}
                >
                    <div className="w-16 h-16 bg-gradient-to-tr from-[#2447d7] to-[#4c6ef5] rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(36,71,215,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-center gap-1 group-hover:translate-y-[-2px] transition-transform duration-300">
                        <h3 className="text-xl font-bold" style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}>Drag and drop files here</h3>
                        <p className="text-[15px] font-medium" style={{ color: isDark ? '#94a3b8' : '#718096' }}>Support for PDF, JPG, PNG up to 10MB</p>
                    </div>
                    <button
                        className="border-2 p-[10px_28px] rounded-xl text-[15px] font-bold hover:shadow-lg active:scale-95 transition-all duration-300"
                        style={{
                            background: isDark ? '#252c50' : '#ffffff',
                            borderColor: isDark ? '#3d4a7a' : '#e2e8f0',
                            color: isDark ? '#93acff' : '#4a5568',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#2447d7';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.borderColor = '#2447d7';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = isDark ? '#252c50' : '#ffffff';
                            e.currentTarget.style.color = isDark ? '#93acff' : '#4a5568';
                            e.currentTarget.style.borderColor = isDark ? '#3d4a7a' : '#e2e8f0';
                        }}
                    >
                        Browse Files
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Documents;

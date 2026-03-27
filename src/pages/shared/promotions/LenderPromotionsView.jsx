import React, { useState } from 'react';
import { usePromotions } from '../../../context/PromotionsContext';
import { useTheme } from '../../../context/ThemeContext';

/* ─── ICONS ────────────────────────────────────── */
const IconFile = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
    </svg>
);

const IconCalendar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const IconEye = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const IconDownload = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

/* ─── HELPER FUNCTIONS ─────────────────────────── */
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return hue;
};

const getMetadata = (fileName, fileData) => {
    if (!fileData || !fileData.startsWith('data:')) return null;
    
    let type = 'File';
    const mime = fileData.split(';')[0].split(':')[1] || '';
    
    const base64str = fileData.split(',')[1];
    let sizeStr = 'Unknown Size';
    if (base64str) {
        const padding = (base64str.match(/=/g) || []).length;
        const bytes = Math.round((base64str.length * 3) / 4) - padding;
        if (bytes < 1024) sizeStr = bytes + ' B';
        else if (bytes < 1024 * 1024) sizeStr = (bytes / 1024).toFixed(1) + ' KB';
        else sizeStr = (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    if (mime.includes('image/')) type = mime.replace('image/', '').toUpperCase() + ' Image';
    else if (mime.includes('pdf')) type = 'PDF Document';
    else if (mime.includes('spreadsheet') || mime.includes('excel')) type = 'Spreadsheet';
    else if (mime.includes('wordprocessing')) type = 'Word Document';
    else if (fileName) {
        const ext = fileName.split('.').pop().toUpperCase();
        type = ext + ' File';
    }

    return { type, size: sizeStr };
};

/* ─── PREVIEW MODAL ────────────────────────────── */
const DocumentPreviewModal = ({ file, onClose, isDark }) => {
    if (!file || !file.fileData) return null;
    
    const isImage = file.fileData.startsWith('data:image/');
    const isPdf = file.fileData.startsWith('data:application/pdf');

    return (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md z-[9999] flex items-center justify-center animate-fadeIn p-4" onClick={onClose}>
            <div className={`w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-slideUp ${isDark ? 'bg-[#1e2347] border border-[#2c3568]' : 'bg-white border border-[#edf2f7]'}`} onClick={e => e.stopPropagation()}>
                <div className={`px-6 py-4 flex justify-between items-center border-b shrink-0 ${isDark ? 'border-[#2c3568] bg-[#141829]' : 'border-[#edf2f7] bg-[#f8fafc]'}`}>
                    <h3 className={`font-bold flex items-center gap-3 ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#242b58] text-[#8ea0d4]' : 'bg-white shadow text-[#2447d7]'}`}>
                            <IconFile />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[14px] truncate">{file.fileName}</span>
                            <span className={`text-[11px] font-semibold mt-0.5 ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>Document Preview (Security Sandbox View)</span>
                        </div>
                    </h3>
                    <div className="flex gap-2 items-center">
                        <a href={file.fileData} download={file.fileName} className="flex items-center gap-2 px-4 py-2 bg-[#2447d7] text-white rounded-lg text-xs font-bold hover:bg-[#1a36b1] transition-all no-underline shadow-md">
                            <IconDownload /> Download File
                        </a>
                        <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors ml-2" onClick={onClose} title="Close Preview">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>
                <div className={`flex-1 overflow-auto flex items-center justify-center relative p-6 ${isDark ? 'bg-[#0f1222]' : 'bg-slate-100'}`} style={{ backgroundImage: isDark ? 'linear-gradient(#1e2347 1px, transparent 1px), linear-gradient(90deg, #1e2347 1px, transparent 1px)' : 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    {isImage ? (
                        <img src={file.fileData} alt={file.fileName} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl ring-4 ring-white/10" />
                    ) : isPdf ? (
                        <iframe src={file.fileData} className="w-full h-full rounded-xl shadow-2xl border-0 ring-4 ring-white/10" title="PDF Preview" />
                    ) : (
                        <div className={`text-center p-10 rounded-2xl max-w-md shadow-lg ${isDark ? 'bg-[#1e2347] border border-[#2c3568]' : 'bg-white border border-[#edf2f7]'}`}>
                            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isDark ? 'bg-[#141829] text-[#8ea0d4]' : 'bg-[#f8fafc] text-[#a0aec0]'}`}>
                                <IconFile />
                            </div>
                            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>Preview Not Available</h3>
                            <p className={`text-sm mb-6 ${isDark ? 'text-[#8ea0d4]' : 'text-[#718096]'}`}>This document format cannot be previewed securely within the browser. Please download it to view the contents.</p>
                            <a href={file.fileData} download={file.fileName} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2447d7] text-white rounded-xl text-sm font-bold shadow-lg hover:-translate-y-1 transition-all no-underline">
                                <IconDownload /> Download Document
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── MAIN COMPONENT ───────────────────────────── */
const LenderPromotionsView = () => {
    const { promotions } = usePromotions();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [previewFile, setPreviewFile] = useState(null);

    const activePromotions = promotions.filter(promo => {
        const today = new Date().toISOString().split('T')[0];
        return today >= promo.startDate && today <= promo.endDate;
    });

    return (
        <div className="flex flex-col h-full animate-fadeIn font-['Sora',sans-serif]">
            <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 pb-6 pt-2">
                <div className="grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-5 auto-rows-max">
                    {activePromotions.length === 0 ? (
                        <div className={`col-span-full py-24 flex flex-col items-center justify-center text-center rounded-3xl border-2 border-dashed transition-all ${isDark ? 'bg-[#1e2347]/50 border-[#2c3568] text-[#8ea0d4]' : 'bg-white border-[#edf2f7] text-[#a0aec0]'}`}>
                            <div className={`w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center shadow-inner ${isDark ? 'bg-[#141829]' : 'bg-[#f8fafc]'}`}>
                                <IconFile />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-[#1a202c] dark:text-[#e4ecff]">No Active Promotions</h3>
                            <p className="text-[13px] max-w-sm">We couldn't find any ongoing promotions right now. Please check back later.</p>
                        </div>
                    ) : (
                        activePromotions.map((promo) => {
                            const hue = stringToColor(promo.lenderName);
                            const badgeBg = isDark ? `hsla(${hue}, 80%, 65%, 0.15)` : `hsla(${hue}, 80%, 45%, 0.1)`;
                            const badgeText = isDark ? `hsl(${hue}, 90%, 80%)` : `hsl(${hue}, 80%, 40%)`;
                            
                            return (
                                <div key={promo.id} className={`flex flex-col h-full rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden group ${isDark ? 'bg-[#1e2347] border-[#2c3568] hover:border-[#3b82f6]/40 shadow-xl shadow-black/20' : 'bg-white border-[#e2e8f0] hover:border-[#3b82f6]/30 shadow-md'}`}>
                                    {/* Top Color Accent */}
                                    <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, hsl(${hue}, 80%, 60%), hsl(${(hue + 40) % 360}, 80%, 60%))` }}></div>
                                    
                                    <div className="p-5 flex flex-col flex-1 gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm" style={{ backgroundColor: badgeBg, color: badgeText }}>
                                                {promo.lenderName}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-[#10b981]/10 px-2 py-1 rounded-full border border-[#10b981]/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                                                <span className="text-[9px] font-black text-[#10b981] uppercase tracking-wider">promotion is active now</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className={`font-semibold text-[13px] leading-relaxed break-words ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>
                                                {promo.description}
                                            </h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl mt-auto" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc' }}>
                                            <div className="flex flex-col gap-1">
                                                <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>
                                                    <IconCalendar /> Start
                                                </div>
                                                <div className={`text-[11px] font-bold ${isDark ? 'text-[#c8d8ff]' : 'text-[#4a5568]'}`}>{promo.startDate}</div>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end text-right">
                                                <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-[#ef4444]' : 'text-[#e53e3e]'}`}>
                                                    <IconCalendar /> Ends
                                                </div>
                                                <div className={`text-[11px] font-bold ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>{promo.endDate}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom File Section */}
                                    {promo.fileData && (
                                        <div className={`flex flex-col gap-4 p-4 border-t mt-auto transition-colors ${
                                            isDark 
                                            ? 'bg-[#181c2e] border-[#2c3568] group-hover:bg-[#1a2244]' 
                                            : 'bg-[#f7fafc] border-[#edf2f7] group-hover:bg-[#eff6ff]'
                                        }`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#242b58] text-[#8ea0d4]' : 'bg-white shadow-sm border border-[#e2e8f0] text-[#4a5568]'}`}>
                                                    <IconFile />
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className={`text-[12px] font-bold truncate ${isDark ? 'text-[#c8d8ff]' : 'text-[#2d3748]'}`} title={promo.fileName}>
                                                        {promo.fileName}
                                                    </span>
                                                    {(() => {
                                                        const meta = getMetadata(promo.fileName, promo.fileData);
                                                        return meta ? (
                                                            <div className={`text-[10px] font-semibold mt-0.5 flex items-center gap-1.5 ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>
                                                                <span>{meta.type}</span>
                                                                <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
                                                                <span>{meta.size}</span>
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                <button
                                                    onClick={() => setPreviewFile(promo)}
                                                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                                        isDark ? 'bg-[#242b58] hover:bg-[#2c3568] border-[#2c3568] text-[#c8d8ff]' : 'bg-white hover:bg-slate-50 border-[#e2e8f0] text-[#4a5568] shadow-sm'
                                                    }`}
                                                >
                                                    <IconEye /> Preview
                                                </button>
                                                <a
                                                    href={promo.fileData}
                                                    download={promo.fileName}
                                                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#2447d7] hover:bg-[#1a36b1] text-white text-[10px] font-black uppercase tracking-wider transition-all transform hover:-translate-y-px shadow-[0_4px_10px_rgba(36,71,215,0.3)] shadow-sm no-underline"
                                                    title="Download Promotion Document"
                                                >
                                                    <IconDownload /> Download
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Document Preview Modal Component */}
            {previewFile && (
                <DocumentPreviewModal 
                    file={previewFile} 
                    onClose={() => setPreviewFile(null)} 
                    isDark={isDark} 
                />
            )}
        </div>
    );
};

export default LenderPromotionsView;


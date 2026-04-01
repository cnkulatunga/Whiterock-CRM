const fs = require('fs');

const modals = `
            {/* Lender Details Modal */}
            {selectedLenderDetails && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[9999] p-6 animate-fadeIn" onClick={() => setSelectedLenderDetails(null)}>
                    <div className="w-full max-w-lg bg-white dark:bg-[#1e2347] rounded-3xl shadow-2xl overflow-hidden animate-slideUp flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-[#141829]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] dark:bg-[#242b58] text-[#2447d7] dark:text-[#8ea0d4] flex items-center justify-center shadow-inner">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Lender Details</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lender Information</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedLenderDetails(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-[#2c3568] rounded-xl transition-colors text-slate-400">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[22px] font-black text-slate-900 dark:text-white">{selectedLenderDetails.name}</span>
                                <span className="text-[11px] font-black uppercase px-2 py-1 mt-1 self-start rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{selectedLenderDetails.type}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interest Rate</span>
                                    <span className="text-[15px] font-bold text-[#2447d7] dark:text-[#8ea0d4]">{selectedLenderDetails.interestRate || '—'}</span>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Max Loan Amount</span>
                                    <span className="text-[15px] font-bold text-[#2447d7] dark:text-[#8ea0d4]">{selectedLenderDetails.maxLoan || '—'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-[#141829] border-t border-slate-100 dark:border-white/5 flex justify-center">
                            <button onClick={() => setSelectedLenderDetails(null)} className="px-8 py-2.5 rounded-xl bg-slate-800 text-white text-[13px] font-bold hover:bg-slate-900 shadow-lg transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Promo Details Modal */}
            {selectedPromoDetails && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[9999] p-6 animate-fadeIn" onClick={() => setSelectedPromoDetails(null)}>
                    <div className="w-full max-w-lg bg-white dark:bg-[#1e2347] rounded-3xl shadow-2xl overflow-hidden animate-slideUp flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-blue-50 dark:bg-[#141829]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-[#242b58] text-blue-600 dark:text-[#8ea0d4] flex items-center justify-center shadow-inner">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Promotion Details</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Promotion</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPromoDetails(null)} className="p-2 hover:bg-blue-100 dark:hover:bg-[#2c3568] rounded-xl transition-colors text-slate-400">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[22px] font-black text-slate-900 dark:text-white">{selectedPromoDetails.lenderName}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-1 bg-[#10b981]/10 text-[#10b981] text-[10px] font-black uppercase tracking-wider rounded border border-[#10b981]/20">Active Now</span>
                                    <span className="text-[11px] font-bold text-slate-500">{selectedPromoDetails.startDate} → {selectedPromoDetails.endDate}</span>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                                <p className="text-[13px] text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">{selectedPromoDetails.description}</p>
                            </div>
                            {selectedPromoDetails.fileData && (
                                <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-[#1a2244]/50 border border-blue-100 dark:border-[#2c3568] rounded-2xl">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#242b58] text-[#2447d7] dark:text-[#8ea0d4] shadow-sm flex items-center justify-center border border-slate-100 dark:border-white/5 shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                                        </div>
                                        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 truncate">{selectedPromoDetails.fileName}</span>
                                    </div>
                                    <a href={selectedPromoDetails.fileData} download={selectedPromoDetails.fileName} className="shrink-0 ml-4 flex items-center gap-2 px-4 py-2 bg-[#2447d7] text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#1732a3] transition-all shadow-md no-underline">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-[#141829] border-t border-slate-100 dark:border-white/5 flex justify-center">
                            <button onClick={() => setSelectedPromoDetails(null)} className="px-8 py-2.5 rounded-xl bg-[#2447d7] text-white text-[13px] font-bold shadow-[0_4px_10px_rgba(36,71,215,0.3)] hover:bg-[#1732a3] transition-all">Close View</button>
                        </div>
                    </div>
                </div>
            )}
`;

const file = fs.readFileSync('src/pages/accounts_manager/dashboard/AMDashboard.jsx', 'utf8');
let newFile = file;

const searchStr = 'const [selectedTeam, setSelectedTeam] = useState(null);';
if (!newFile.includes('selectedLenderDetails')) {
    newFile = newFile.replace(searchStr, searchStr + '\n    const [selectedLenderDetails, setSelectedLenderDetails] = useState(null);\n    const [selectedPromoDetails, setSelectedPromoDetails] = useState(null);');
}

newFile = newFile.replace('<div key={promo.id} className="p-3 bg-blue-50/70', '<div key={promo.id} onClick={() => setSelectedPromoDetails(promo)} className="p-3 bg-blue-50/70');

newFile = newFile.replace('<div key={lender.id} onClick={() => onNavigate && onNavigate(\'lenders\')} className="p-3 bg-slate-50', '<div key={lender.id} onClick={() => setSelectedLenderDetails(lender)} className="p-3 bg-slate-50');

if (!newFile.includes('selectedPromoDetails && (')) {
    newFile = newFile.replace('            {/* Team Details Modal */}', modals + '\n            {/* Team Details Modal */}');
}

fs.writeFileSync('src/pages/accounts_manager/dashboard/AMDashboard.jsx', newFile);
console.log('Modals injected!');

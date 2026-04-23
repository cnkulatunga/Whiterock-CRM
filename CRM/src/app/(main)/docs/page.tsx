'use client';

const folders = [
    { name: 'Identity Docs', count: 42, icon: 'fa-id-card', color: 'indigo' },
    { name: 'Bank Statements', count: 128, icon: 'fa-building-columns', color: 'emerald' },
    { name: 'Loan Agreements', count: 56, icon: 'fa-file-signature', color: 'blue' },
    { name: 'Property Valuations', count: 31, icon: 'fa-house-chimney-check', color: 'amber' },
    { name: 'Compliance Logs', count: 15, icon: 'fa-shield-halved', color: 'slate' },
    { name: 'Archived Cases', count: 890, icon: 'fa-box-archive', color: 'rose' },
];

export default function DocsPage() {
    return (
        <div className="flex-1 flex flex-col p-6 bg-[#fafafa] overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Document Vault</h1>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Secure centralized storage for all loan documents</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all w-64"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400"></i>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">
                        <i className="fa-solid fa-cloud-arrow-up mr-2"></i> Upload
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
                {folders.map((folder) => (
                    <div key={folder.name} className="glass-card bg-white p-6 hover:border-indigo-500/30 transition-all cursor-pointer group">
                        <div className={`w-14 h-14 rounded-3xl bg-${folder.color}-50 flex items-center justify-center text-${folder.color}-600 text-2xl mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                            <i className={`fa-solid ${folder.icon}`}></i>
                        </div>
                        <h3 className="text-sm font-black text-slate-900 mb-1">{folder.name}</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{folder.count} Documents</p>

                        <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 border-2 border-white"></div>
                                <div className="w-6 h-6 rounded-lg bg-indigo-100 border-2 border-white"></div>
                            </div>
                            <button className="text-[8px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Open Vault <i className="fa-solid fa-chevron-right ml-1"></i></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';

interface AiSummaryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AiSummaryDrawer({ isOpen, onClose }: AiSummaryDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [aiState, setAiState] = useState<'idle' | 'loading' | 'done'>('idle');
    const [aiText, setAiText] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            fetch('/api/leads')
                .then(res => res.json())
                .then(data => setLeads(data))
                .catch(err => console.error(err));
        } else {
            setTimeout(() => {
                setIsVisible(false);
                setSearch('');
                setSelectedLeadId(null);
                setAiState('idle');
                setAiText('');
            }, 300);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    const filteredLeads = leads.filter(l => 
        (l.id + l.name + (l.company || l.business || '')).toLowerCase().includes(search.toLowerCase())
    );

    const selectedLead = leads.find(l => l.id === selectedLeadId);

    const generateSummary = () => {
        if (!selectedLead) return;
        setAiState('loading');
        setTimeout(() => {
            setAiText(`<strong>${selectedLead.name}</strong> (${selectedLead.id}) is a ${selectedLead.priority || 'medium'}-priority lead in the <strong>${selectedLead.status || selectedLead.stage}</strong> stage. Business <em>${selectedLead.company || selectedLead.business || 'N/A'}</em> is seeking ${selectedLead.amount}. Analysis indicates a high propensity for conversion if documentation for bank statements is expedited within the next 48 hours.`);
            setAiState('done');
        }, 1500);
    };

    return (
        <div
            className={`fixed inset-0 z-[2000] flex justify-end transition-all duration-300 ${isOpen ? 'bg-slate-900/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
        >
            <div
                className={`w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="h-[80px] px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-[#f8fafc]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#4f46e5] flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div>
                            <h2 className="text-[14px] font-black text-slate-900 leading-none">AI Lead Summary</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Intelligence Engine</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                    {/* Search & Selection */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Target Lead</h4>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{leads.length} Available</span>
                        </div>
                        
                        <div className="relative group">
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-indigo-500"></i>
                            <input 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by ID, Name or Business..."
                                className="w-10/12 h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>

                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl bg-slate-50/50">
                            {filteredLeads.map(l => (
                                <div 
                                    key={l.id}
                                    onClick={() => setSelectedLeadId(l.id)}
                                    className={`p-4 border-b border-slate-100 last:border-0 cursor-pointer transition-all flex items-center justify-between group ${selectedLeadId === l.id ? 'bg-white shadow-sm ring-1 ring-inset ring-indigo-500/20' : 'hover:bg-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${selectedLeadId === l.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {l.id.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className={`text-[11px] font-black transition-colors ${selectedLeadId === l.id ? 'text-indigo-600' : 'text-slate-900'}`}>{l.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{l.id} • {l.company || l.business || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedLeadId === l.id ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-indigo-300'}`}>
                                        {selectedLeadId === l.id && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* AI Summary Output */}
                    {selectedLead && (
                        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis Results</h4>
                                {aiState === 'done' && (
                                    <button onClick={generateSummary} className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-1.5 hover:underline">
                                        <i className="fa-solid fa-rotate-right"></i> Recalculate
                                    </button>
                                )}
                            </div>

                            {aiState === 'idle' && (
                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-[24px] text-center space-y-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                                        <i className="fa-solid fa-bolt-lightning text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-black text-slate-900">Lead Ready for Analysis</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1">Click below to generate an AI intelligence summary</p>
                                    </div>
                                    <button 
                                        onClick={generateSummary}
                                        className="h-11 px-8 bg-[#4f46e5] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
                                    >
                                        Generate Intelligence
                                    </button>
                                </div>
                            )}

                            {aiState === 'loading' && (
                                <div className="p-8 bg-slate-50 rounded-[24px] border border-slate-100 text-center space-y-4">
                                    <div className="relative w-12 h-12 mx-auto">
                                        <div className="absolute inset-0 rounded-2xl border-4 border-indigo-100"></div>
                                        <div className="absolute inset-0 rounded-2xl border-4 border-t-indigo-600 animate-spin"></div>
                                    </div>
                                    <p className="text-[11px] font-black text-slate-900 animate-pulse uppercase tracking-widest">Processing Lead Data...</p>
                                </div>
                            )}

                            {aiState === 'done' && (
                                <div className="space-y-4">
                                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[24px] relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <i className="fa-solid fa-quote-right text-4xl text-indigo-600"></i>
                                        </div>
                                        <p className="text-[13px] text-indigo-900 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: aiText }} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Conversion Chance</p>
                                            <p className="text-[12px] font-black text-emerald-600 flex items-center gap-1.5">
                                                High (84%) <i className="fa-solid fa-caret-up"></i>
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Risk Assessment</p>
                                            <p className="text-[12px] font-black text-amber-500 flex items-center gap-1.5">
                                                Low Risk <i className="fa-solid fa-shield-check"></i>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                <footer className="p-8 border-t border-slate-100 bg-[#f8fafc] flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 h-12 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                        Dismiss
                    </button>
                    {selectedLeadId && (
                        <button 
                            onClick={() => window.location.href = `/pipeline/${selectedLeadId}`}
                            className="flex-1 h-12 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                        >
                            Open Case File
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
}

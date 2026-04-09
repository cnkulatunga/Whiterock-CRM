import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { KNOWLEDGE_BASE_RESOURCES } from '../../data/dummyData';

const IconBook = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconPlus = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

const TAG_COLORS = {
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', dot: 'bg-teal-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', dot: 'bg-violet-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' },
};

const KBModal = ({ onClose, onAddClick, onEditClick, onDeleteClick, initialDoc = null, allDocs = [], hideAddButton = false }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selected, setSelected] = useState(initialDoc || null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [docToDelete, setDocToDelete] = useState(null);
    
    const validDocs = allDocs || [];
    const categories = ['All', ...new Set(validDocs.map(d => d.category))];
    const filtered = validDocs.filter(d =>
        (activeCategory === 'All' || d.category === activeCategory) &&
        (d.name?.toLowerCase().includes(search.toLowerCase()) || d.content?.toLowerCase().includes(search.toLowerCase()))
    );

    const renderPreview = (doc) => {
        return (
            <div className="flex flex-col gap-3">
                {doc.content && (
                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : `${TAG_COLORS[doc.tag || 'blue']?.bg || 'bg-blue-50'} ${TAG_COLORS[doc.tag || 'blue']?.border || 'border-blue-100'}`}`}>
                        <pre className={`text-[10px] leading-relaxed whitespace-pre-wrap font-['Sora',sans-serif] ${isDark ? 'text-[#94abda]' : 'text-slate-700'}`}>{doc.content}</pre>
                    </div>
                )}
                {doc.fileData && doc.fileType?.startsWith('image/') && (
                    <div className="rounded-xl border border-dashed border-slate-200 overflow-hidden">
                        <img src={doc.fileData} alt={doc.name} className="w-full h-auto object-contain max-h-[400px]" />
                    </div>
                )}
                {doc.fileData && doc.fileType === 'application/pdf' && (
                    <div className="h-[500px] border rounded-xl overflow-hidden">
                        <iframe src={doc.fileData} className="w-full h-full" title={doc.name} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center sm:items-end bg-black/50 backdrop-blur-sm p-4 sm:p-0" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`rounded-2xl sm:rounded-b-none sm:rounded-t-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn ${isDark ? 'bg-[#1e2347]' : 'bg-white'}`}>
                {/* header */}
                <div className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/60'}`}>
                    {/* drag handle on mobile */}
                    <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                            <IconBook width="14" height="14" className="text-teal-600" />
                        </div>
                        <div>
                            <p className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>Knowledge Base Repository</p>
                            <p className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{validDocs.length} resources available</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                        <IconX width="13" height="13" className={isDark ? 'text-[#94abda]' : 'text-slate-500'} />
                    </button>
                </div>
                {/* search + category filter */}
                <div className={`px-4 pt-3 pb-2 shrink-0 flex flex-col gap-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
                        className={`w-full text-[11px] px-3 py-2 rounded-xl border focus:outline-none transition-colors ${isDark ? 'bg-[#151932] border-white/10 text-[#e4ecff] placeholder-white/20 focus:border-teal-500' : 'bg-slate-50 border-slate-200 focus:border-teal-400 placeholder-slate-300'}`} />
                    <div className="flex gap-1.5 flex-wrap">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`text-[9px] font-bold px-2.5 py-1 rounded-full transition-colors ${activeCategory === cat ? 'bg-teal-600 text-white' : (isDark ? 'bg-white/5 text-[#94abda] hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                {/* body — side by side on desktop, stacked on mobile */}
                <div className="flex sm:flex-col flex-1 min-h-0">
                    {/* Document list */}
                    <div className={`w-56 sm:w-full shrink-0 border-r sm:border-r-0 sm:border-b overflow-y-auto p-2 flex flex-col gap-1 sm:max-h-[180px] ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        {filtered.map(doc => {
                            const c = TAG_COLORS[doc.tag || 'blue'] || TAG_COLORS.blue;
                            return (
                                <button key={doc.id} onClick={() => setSelected(doc)}
                                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${selected?.id === doc.id ? (isDark ? `bg-white/10 border-white/10` : `${c.bg} ${c.border} border`) : (isDark ? 'border-transparent hover:bg-white/5' : 'border-transparent hover:bg-slate-50')}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                                        <span className={`text-[8px] font-bold uppercase tracking-wider ${c.text}`}>{doc.category}</span>
                                    </div>
                                    <p className={`text-[10px] font-semibold leading-tight ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{doc.name}</p>
                                </button>
                            );
                        })}
                        {filtered.length === 0 && <p className={`text-[10px] text-center py-6 ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>No results</p>}
                    </div>
                    {/* Preview panel */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-slate-50/50 dark:bg-transparent">
                        {selected ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className={`text-[8px] font-bold uppercase tracking-wider ${TAG_COLORS[selected.tag || 'blue']?.text || 'text-blue-600'}`}>{selected.category}</span>
                                        <h3 className={`text-[13px] font-black mt-0.5 ${isDark ? 'text-[#e4ecff]' : 'text-slate-800'}`}>{selected.name}</h3>
                                    </div>
                                    {!hideAddButton && (
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {onEditClick && (
                                                <button onClick={() => onEditClick(selected)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`} title="Edit Resource">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                </button>
                                            )}
                                            {onDeleteClick && (
                                                <button onClick={() => setDocToDelete(selected)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`} title="Delete Resource">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {renderPreview(selected)}
                            </div>
                        ) : (
                            <div className={`h-full flex items-center justify-center text-[10px] text-center ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>
                                Select a document to preview
                            </div>
                        )}
                    </div>
                </div>
                {/* footer */}
                <div className={`px-4 py-2.5 border-t flex justify-between items-center shrink-0 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                    <span className={`text-[9px] ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>Platform Knowledge Base</span>
                    {!hideAddButton && onAddClick && (
                        <button onClick={onAddClick} className={`text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${isDark ? 'text-teal-400 bg-teal-500/15 hover:bg-teal-500/25' : 'text-teal-600 bg-teal-50 hover:bg-teal-100'}`}>
                            <IconPlus width="10" height="10" /> Add Resource
                        </button>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Popup */}
            {docToDelete && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-fadeIn ${isDark ? 'bg-[#1e2347] border border-white/10' : 'bg-white'}`}>
                        <h3 className={`text-lg font-black mb-2 leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Delete Resource?</h3>
                        <p className={`text-[13px] mb-6 font-medium ${isDark ? 'text-[#94abda]' : 'text-slate-500'}`}>
                            Are you sure you want to delete <strong className={isDark ? 'text-white' : 'text-slate-700'}>"{docToDelete.name}"</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 shrink-0">
                            <button onClick={() => setDocToDelete(null)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-[#94abda] hover:bg-white/5 border border-white/10' : 'text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>Cancel</button>
                            <button onClick={() => { onDeleteClick(docToDelete.id); setSelected(null); setDocToDelete(null); }} className="px-4 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wider bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/20">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KBModal;

import React, { useState, useMemo } from 'react';
import { useLeads } from '../../context/LeadsContext';
import { useTheme } from '../../context/ThemeContext';
import { useKnowledgeBase } from '../../context/KnowledgeBaseContext';
import { INITIAL_MEMBERSHIPS } from '../../data/dummyData';

/* ─── SVG ICONS ─── */
const IconRobot = (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" {...p}>
        <rect x="2" y="8" width="20" height="12" rx="2" />
        <path d="M7 11v1" />
        <path d="M17 11v1" />
        <path d="M9 16h6" />
        <path d="M12 2v6" />
        <circle cx="12" cy="2" r="1" />
    </svg>
);

const IconBank = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IconNote = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="15" y2="18" /></svg>;
const IconSearch = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;

const AIAssistant = () => {
    const { leads } = useLeads();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [showMenu, setShowMenu] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [summaryResult, setSummaryResult] = useState(null);
    const [error, setError] = useState(null);
    
    const { resources: kbResources } = useKnowledgeBase();
    
    // Derived Products from KB
    const products = useMemo(() => {
        return kbResources
            .filter(r => r.category === 'Products' || r.type === 'Product')
            .map(r => ({
                id: r.id,
                name: r.name,
                lender: r.productCategory || 'Global Lender',
                rate: r.rate || 'Varies',
                max: r.maxFunding || r.limit || '$1M+',
                content: r.content,
                fileData: r.fileData
            }));
    }, [kbResources]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [view, setView] = useState('menu'); // menu, summary, products, product_detail
    
    // Filterable lead list for dropdown
    const filteredLeads = useMemo(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role;
        const currentUserId = user.id;
        const currentUserName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();

        let baseLeads = leads || [];

        // Role-based filtering
        if (role === 'tele_agent') {
            baseLeads = baseLeads.filter(l => l.assignedStaffId === currentUserId || l.agentName === currentUserName);
        } else if (role === 'team_leader') {
            const teamMemberIds = (INITIAL_MEMBERSHIPS[currentUserId] || []).map(m => m.id);
            baseLeads = baseLeads.filter(l => 
                l.assignedStaffId === currentUserId || 
                l.tl === currentUserName || 
                teamMemberIds.includes(l.assignedStaffId)
            );
        }
        // manager and super_admin see all, no filtering needed

        if (!searchId) return baseLeads;
        return baseLeads.filter(l => 
            l.id.toLowerCase().includes(searchId.toLowerCase()) || 
            l.name.toLowerCase().includes(searchId.toLowerCase())
        );
    }, [leads, searchId]);

    const handleSummarize = () => {
        const lead = leads.find(l => l.id === selectedLeadId || l.id === searchId);
        if (lead) {
            setSummaryResult({
                name: lead.name,
                id: lead.id,
                amount: lead.loanAmount || '$250,000',
                stage: lead.stage || 'Document Collection',
                details: `Based on the latest record, this client has expressed high intent. Documents are ${Math.random() > 0.5 ? '75% complete' : 'awaiting verification'}. Last callback was 2 hours ago.`,
                suggestedType: lead.loanAmount && parseFloat(lead.loanAmount.replace(/[^0-9.]/g, '')) > 500000 ? 'Bridge' : 'Term'
            });
            setError(null);
        } else {
            setError("Lead not found. Please select or enter a valid Lead ID.");
        }
    };

    const resetSummarizer = () => {
        setSummaryResult(null);
        setSearchId('');
        setSelectedLeadId('');
    };

    // Global Trigger Listener
    React.useEffect(() => {
        const handleGlobalTrigger = (event) => {
            const { mode, leadId } = event.detail || {};
            setShowMenu(false);
            if (mode === 'product') {
                setShowProductModal(true);
                setShowSummaryModal(false);
            } else if (mode === 'summarizer') {
                setShowSummaryModal(true);
                setShowProductModal(false);
                if (leadId) {
                    setSelectedLeadId(leadId);
                    setSearchId(leadId);
                }
            }
        };

        window.addEventListener('OPEN_AI_ASSISTANT', handleGlobalTrigger);
        return () => window.removeEventListener('OPEN_AI_ASSISTANT', handleGlobalTrigger);
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
            {/* AI Menu */}
            {showMenu && !showSummaryModal && (
                <div className="bg-white dark:bg-[#1e2347] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/10 p-2 min-w-[220px] animate-slideUp overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 mb-1 bg-slate-50/50 dark:bg-white/2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">AI Core Assistant</span>
                    </div>
                    
                    <button 
                        onClick={() => { setShowProductModal(true); setShowMenu(false); }}
                        className="w-full text-left px-4 py-3.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <IconBank width="18" height="18" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">Product Info</span>
                            <span className="text-[9px] font-bold text-slate-400">Lender & Data Intel</span>
                        </div>
                    </button>

                    <button 
                        onClick={() => { setShowSummaryModal(true); setShowMenu(false); }}
                        className="w-full text-left px-4 py-3.5 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-2xl transition-all flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <IconNote width="18" height="18" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">Summarizing</span>
                            <span className="text-[9px] font-bold text-slate-400">Lead Analysis</span>
                        </div>
                    </button>
                </div>
            )}

            {/* Product Info Modal */}
            {showProductModal && (
                <div className="bg-white dark:bg-[#1e2347] rounded-[32px] shadow-2xl border border-slate-100 dark:border-white/10 w-[360px] animate-slideUp overflow-hidden flex flex-col max-h-[500px]">
                    <div className="flex justify-between items-center p-6 pb-4 shrink-0 bg-white dark:bg-[#1e2347] z-10">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Product Intel</h3>
                        <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-2">
                        <div className="space-y-3 pb-4">
                            {(products.length > 0 ? products : [
                                 { name: 'Bridge Loan Plus', lender: 'Alpha Capital', rate: '6.5%', max: '$5M' },
                                 { name: 'Term Loan Core', lender: 'Beta Funding', rate: '5.2%', max: '$2M' },
                                 { name: 'SBA 7(a) Preferred', lender: 'Major Bank Group', rate: '7.8%', max: '$10M' },
                            ]).map((prod, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-black text-slate-800 dark:text-white">{prod.name}</h4>
                                        <span className="text-[11px] font-black text-blue-600 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-lg">{prod.rate}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{prod.lender}</p>
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                        <span>Max Funding: <span className="text-slate-700 dark:text-slate-200">{prod.max}</span></span>
                                        <button 
                                            onClick={() => {
                                                if (prod.content || prod.fileData) {
                                                    setSelectedProduct(selectedProduct?.id === prod.id ? null : prod);
                                                }
                                            }}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {selectedProduct?.id === prod.id ? 'Close' : 'Details'}
                                        </button>
                                    </div>
                                    {selectedProduct?.id === prod.id && prod.content && (
                                        <div className="mt-3 p-3 bg-white dark:bg-black/40 rounded-xl border border-blue-200 dark:border-blue-500/30 animate-fadeIn">
                                            <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                                {prod.content}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 pt-2 shrink-0 bg-white dark:bg-[#1e2347]">
                        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                            <p className="text-[11px] leading-relaxed font-bold text-blue-600/70 italic text-center">
                                "AI identifies these products as the highest conversion matches for current open leads."
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Summarizing Tool Modal (Floating) */}
            {showSummaryModal && (
                <div className="bg-white dark:bg-[#1e2347] rounded-[32px] shadow-2xl border border-slate-100 dark:border-white/10 w-[360px] animate-slideUp overflow-hidden flex flex-col max-h-[500px]">
                    <div className="flex justify-between items-center p-6 pb-4 shrink-0 bg-white dark:bg-[#1e2347] z-10">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                            {summaryResult ? 'AI Summary' : 'Lead Summarizer'}
                        </h3>
                        <button onClick={() => { setShowSummaryModal(false); setSummaryResult(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                        {!summaryResult ? (
                            <div className="space-y-4 pt-2">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Search Lead Number</label>
                                    <div className="relative">
                                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text" 
                                            value={searchId}
                                            onChange={(e) => setSearchId(e.target.value)}
                                            placeholder="Enter Lead # (e.g. AF-001)" 
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-10 pr-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select from Pipeline</label>
                                    <select 
                                        value={selectedLeadId}
                                        onChange={(e) => setSelectedLeadId(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500 appearance-none transition-colors"
                                    >
                                        <option value="">-- Choose a Lead --</option>
                                        {filteredLeads.map(l => (
                                            <option key={l.id} value={l.id}>{l.id} - {l.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <button 
                                    onClick={handleSummarize}
                                    className="w-full py-4 bg-gradient-to-r from-[#2447d7] to-[#1732a3] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all mt-2"
                                >
                                    Generate Summary
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fadeIn pt-2">
                            <div className="bg-blue-50 dark:bg-blue-500/5 rounded-2xl p-4 mb-4 border border-blue-100 dark:border-blue-500/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-xs">
                                        {summaryResult.id.split('-')[1]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800 dark:text-white">{summaryResult.name}</h4>
                                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{summaryResult.id}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-[#141829] p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Loan Amount</p>
                                        <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{summaryResult.amount}</p>
                                    </div>
                                    <div className="bg-white dark:bg-[#141829] p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Current Stage</p>
                                        <p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{summaryResult.stage}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <IconRobot className="text-purple-500" width="16" height="16" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Intelligence Report</span>
                                </div>
                                <p className="text-[12px] leading-relaxed font-bold text-slate-600 dark:text-slate-300 italic">
                                    "{summaryResult.details}"
                                </p>
                                <button 
                                    onClick={() => { setShowProductModal(true); setShowSummaryModal(false); }}
                                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                                >
                                    <IconBank width="14" height="14" />
                                    View Suggested Products
                                </button>
                            </div>

                            <button 
                                onClick={resetSummarizer}
                                className="w-full py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                            >
                                Back to Search
                            </button>
                        </div>
                    )}
                </div>
            </div>
            )}

            {/* AI Custom Error Modal */}
            {error && (
                <div className="bg-white dark:bg-[#1e2347] rounded-[32px] shadow-2xl border border-red-100 dark:border-red-500/20 w-[360px] animate-slideUp overflow-hidden p-6 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="28" height="28"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">AI Notification</h3>
                    <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        {error}
                    </p>
                    <button 
                        onClick={() => setError(null)}
                        className="w-full py-4 bg-slate-900 dark:bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition-all"
                    >
                        Understood
                    </button>
                </div>
            )}

            {/* Main Robot FAB */}
            <button 
                onClick={() => {
                    if (showSummaryModal || showProductModal) {
                        setShowSummaryModal(false);
                        setShowProductModal(false);
                        setSummaryResult(null);
                    } else {
                        setShowMenu(!showMenu);
                    }
                }}
                className={`p-4 rounded-[22px] shadow-2xl transition-all duration-300 group flex items-center gap-2 border border-white/20 ${showMenu || showSummaryModal || showProductModal ? 'bg-red-500 text-white rotate-90 scale-90' : 'bg-gradient-to-br from-[#2447d7] via-[#2447d7] to-[#1732a3] text-white hover:scale-110 hover:-translate-y-1'}`}
            >
                {showMenu || showSummaryModal || showProductModal ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                ) : (
                    <IconRobot className="group-hover:animate-bounce" />
                )}
            </button>
        </div>
    );
};

export default AIAssistant;

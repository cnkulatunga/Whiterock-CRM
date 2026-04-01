import React, { useState, useMemo } from 'react';
import { WORKFLOW_STAGES_LIST, SHARED_INITIAL_USERS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';
import { useTheme } from '../../../context/ThemeContext';
import { IconDocs, IconAlert, IconCheck } from '../../../components/DocumentManagement/Icons';
import UploadModal from '../../../components/DocumentManagement/UploadModal';

const STAGES = WORKFLOW_STAGES_LIST.filter(s => s !== 'All Stages');
const PAGE_SIZE = 5;

const STAGE_META = {
  'Document Collection':        { color: '#2447d7', bg: '#eef2ff', icon: '📄' },
  'Document Verification Done': { color: '#f59e0b', bg: '#fffbeb', icon: '✓' },
  'Lender Selection':           { color: '#8b5cf6', bg: '#f5f3ff', icon: '🏦' },
  'Completed':                  { color: '#10b981', bg: '#ecfdf5', icon: '✅' },
  'Rejected':                   { color: '#ef4444', bg: '#fef2f2', icon: '✕' },
};

const AGENT_COLORS = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899','#0ea5e9'];
const agentColorMap = {};
SHARED_INITIAL_USERS.forEach((u, i) => { agentColorMap[u.name] = AGENT_COLORS[i % AGENT_COLORS.length]; });

/* ─── MAIN COMPONENT ─── */
const LeadMonitoring = ({ onViewDetails }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { leads, setLeads } = useLeads();
    
    // UI State
    const [search, setSearch] = useState('');
    const [agentFilter, setAgentFilter] = useState('All Agents');
    const [stageFilter, setStageFilter] = useState('All Stages');
    const [page, setPage] = useState(1);
    
    // Document Verification State
    const [selectedLeadForDocs, setSelectedLeadForDocs] = useState(null);
    const [showDocModal, setShowDocModal] = useState(false);
    const [uploadingDocs, setUploadingDocs] = useState({});

    const agentList = useMemo(() => ['All Agents', ...new Set(leads.map(l => l.agentName).filter(Boolean))], [leads]);

    // Combined KPI Stats
    const stats = useMemo(() => ({
        total: leads.length,
        inProgress: leads.filter(l => !['Completed', 'Rejected'].includes(l.stage)).length,
        completed: leads.filter(l => l.stage === 'Completed').length,
        rejected: leads.filter(l => l.stage === 'Rejected').length,
        pendingReview: leads.filter(l => l.documents?.some(d => d.status === 'Pending')).length,
        fullyVerified: leads.filter(l => l.documents?.length > 0 && l.documents.every(d => d.status === 'Approved')).length,
    }), [leads]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return leads.filter(l => {
            const matchSearch = !q || l.name.toLowerCase().includes(q) || l.leadId.toLowerCase().includes(q) || l.businessName?.toLowerCase().includes(q);
            const matchAgent = agentFilter === 'All Agents' || l.agentName === agentFilter;
            const matchStage = stageFilter === 'All Stages' || l.stage === stageFilter;
            
            // Special logic for verification tab: usually show all but maybe prioritize those with pending docs
            // For now, we use the same search/filters for both tabs for consistency
            return matchSearch && matchAgent && matchStage;
        });
    }, [leads, search, agentFilter, stageFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilterChange = (setter) => (e) => { setter(e.target.value); setPage(1); };

    /* ─── Document Handlers ─── */
    const handleOpenDocModal = (lead) => {
        setSelectedLeadForDocs(lead);
        setShowDocModal(true);
    };

    const handleApproveDoc = (leadId, docId) => {
        setLeads(prev => prev.map(lead => {
            if (lead.id !== leadId) return lead;
            const newDocs = lead.documents.map(doc =>
                doc.id === docId ? { ...doc, status: 'Approved' } : doc
            );
            const allApproved = newDocs.length > 0 && newDocs.every(d => d.status === 'Approved');
            const updatedLead = {
                ...lead,
                documents: newDocs,
                ...(allApproved && lead.stage === 'Document Collection' ? {
                    stage: 'Document Verification Done',
                    status: 'Document Verification Done',
                    progress: 40,
                } : {}),
            };
            if (selectedLeadForDocs?.id === leadId) setSelectedLeadForDocs(updatedLead);
            return updatedLead;
        }));
    };

    const handleRejectDoc = (leadId, docId, reason) => {
        setLeads(prev => prev.map(lead => {
            if (lead.id !== leadId) return lead;
            const newDocs = lead.documents.map(doc =>
                doc.id === docId ? { ...doc, status: 'Rejected', note: reason } : doc
            );
            const updatedLead = { ...lead, documents: newDocs };
            if (selectedLeadForDocs?.id === leadId) setSelectedLeadForDocs(updatedLead);
            return updatedLead;
        }));
    };

    const handleUploadClick = (leadId, docId, docName, file) => {
        if (!file) return;
        const targetDocId = docId || Date.now();
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
        const fileName = file.name;

        setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress: 0, file, previewUrl } }));

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                finishUpload(leadId, targetDocId, docName, previewUrl, fileName);
            } else {
                setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress } }));
            }
        }, 150);
    };

    const handleDeleteDocument = (leadId, docId) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, documents: (l.documents || []).filter(d => d.id !== docId) } : l));
        setSelectedLeadForDocs(prev => prev && prev.id === leadId ? { ...prev, documents: (prev.documents || []).filter(d => d.id !== docId) } : prev);
    };

    const finishUpload = (leadId, targetDocId, docName, previewUrl, fileName) => {
        const today = new Date().toISOString().split('T')[0];
        const buildDoc = (existing) => existing
            ? { ...existing, status: 'Pending', date: today, url: previewUrl, fileName }
            : { id: targetDocId, type: docName, status: 'Pending', note: '', date: today, url: previewUrl, fileName };

        const updateDocList = (docs = []) => {
            const idx = docs.findIndex(d => d.id === targetDocId);
            return idx >= 0
                ? docs.map(d => d.id === targetDocId ? buildDoc(d) : d)
                : [...docs, buildDoc(null)];
        };

        setLeads(prev => prev.map(l =>
            l.id === leadId ? { ...l, documents: updateDocList(l.documents) } : l
        ));
        setSelectedLeadForDocs(prev =>
            prev?.id === leadId ? { ...prev, documents: updateDocList(prev.documents) } : prev
        );

        setTimeout(() => {
            setUploadingDocs(prev => { const n = { ...prev }; delete n[targetDocId]; return n; });
        }, 500);
    };

    return (
        <div className={`flex flex-col gap-8 animate-fadeIn font-['Sora',sans-serif]`}>
            {/* ── KPI Tiles ── */}
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1">
                {[
                    { 
                        label: 'Total Leads', 
                        value: stats.total.toString().padStart(2, '0'), 
                        colorClass: 'text-blue-700 dark:text-blue-300',
                        bgClass: 'bg-blue-100/40 dark:bg-[#1c2340]',
                        borderClass: 'border-blue-200 dark:border-blue-500/30',
                        iconBg: 'bg-blue-600 shadow-blue-600/20',
                        icon: <IconDocs width="22" height="22" />, 
                    },
                    { 
                        label: 'Pending Docs', 
                        value: stats.pendingReview.toString().padStart(2, '0'), 
                        colorClass: 'text-orange-700 dark:text-orange-300',
                        bgClass: 'bg-orange-100/40 dark:bg-[#2a1f1a]',
                        borderClass: 'border-orange-200 dark:border-orange-500/30',
                        iconBg: 'bg-orange-500 shadow-orange-500/20',
                        icon: <div className="animate-spin-slow"><IconAlert width="22" height="22" /></div>, 
                    },
                    { 
                        label: 'Fully Verified', 
                        value: stats.fullyVerified.toString().padStart(2, '0'), 
                        colorClass: 'text-emerald-700 dark:text-emerald-300',
                        bgClass: 'bg-emerald-100/40 dark:bg-[#182724]',
                        borderClass: 'border-emerald-200 dark:border-emerald-500/30',
                        iconBg: 'bg-emerald-500 shadow-emerald-500/20',
                        icon: <IconCheck width="22" height="22" strokeWidth={3} />, 
                    },
                    { 
                        label: 'Lead Pipeline', 
                        value: stats.inProgress.toString().padStart(2, '0'), 
                        colorClass: 'text-rose-700 dark:text-rose-300',
                        bgClass: 'bg-rose-100/40 dark:bg-[#2a1a1c]',
                        borderClass: 'border-rose-200 dark:border-rose-500/30',
                        iconBg: 'bg-rose-600 shadow-rose-600/20',
                        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><path d="M2 17L12 22L22 17M2 12L12 17L22 12M12 2L2 7L12 12L22 7L12 2Z"/></svg>, 
                    },
                ].map((card, i) => (
                    <div
                        key={card.label}
                        className={`rounded-2xl border ${card.borderClass} p-6 flex flex-col justify-center items-center gap-1.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-default text-center ${card.bgClass}`}
                    >
                        <div className={`w-11 h-11 rounded-full ${card.iconBg} text-white flex items-center justify-center mb-1 shadow-md`}>
                            {card.icon}
                        </div>
                        <h2 className={`text-3xl font-black leading-none ${card.colorClass} tracking-tight`}>
                            {card.value}
                        </h2>
                        <span className={`text-[11px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? card.colorClass + ' opacity-80' : card.colorClass}`}>
                            {card.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Filter Bar ── */}
            <div className={`flex items-center justify-between gap-4 p-4 rounded-3xl ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-100'} border shadow-sm`}>
                <div className="flex items-center gap-4 flex-1 md:flex-col md:items-stretch">
                    <div className={`flex items-center gap-3 px-4 py-3 border rounded-xl w-full max-w-md shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 ${isDark ? 'bg-slate-800 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="2.5" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME, ID, OR BUSINESS..."
                            className={`bg-transparent border-none outline-none text-[13px] w-full font-bold tracking-tight ${isDark ? 'text-white placeholder:text-slate-500/80' : 'text-slate-700 placeholder:text-slate-400'}`}
                            value={search}
                            onChange={handleFilterChange(setSearch)}
                        />
                    </div>

                    <div className="flex items-center gap-3 md:grid md:grid-cols-2">
                        <div className="relative min-w-[160px]">
                            <select
                                className={`w-full px-4 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer pr-9 shadow-sm focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-slate-800 border-white/5 text-slate-300 border-none' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                                value={agentFilter}
                                onChange={handleFilterChange(setAgentFilter)}
                            >
                                {agentList.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>

                        <div className="relative min-w-[180px]">
                            <select
                                className={`w-full px-4 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer pr-9 shadow-sm focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-slate-800 border-white/5 text-slate-300 border-none' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                                value={stageFilter}
                                onChange={handleFilterChange(setStageFilter)}
                            >
                                {['All Stages', ...STAGES].map(s => <option key={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Unified Table Container ── */}
            <div className={`rounded-3xl border shadow-sm overflow-hidden animate-slideUp ${isDark ? 'bg-[#1e2347] border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`bg-[#f8f9fa] dark:bg-slate-800/80 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead / Client</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Phone No.</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Agent</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Document Status</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {paginated.length > 0 ? paginated.map((lead, i) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => onViewDetails?.(lead)}
                                    className={`group transition-all duration-200 cursor-pointer ${isDark ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/40'}`}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={`text-[10px] font-black font-mono tracking-wider ${isDark ? 'text-blue-400' : 'text-[#0061ff]'}`}>{lead.leadId}</span>
                                            <span className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.name}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        {lead.businessName ? (
                                            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${isDark ? 'bg-[#1a1f35] text-slate-400 border-[#2c3568]' : 'bg-[#f8faff] text-slate-600 border-slate-100'}`}>
                                                {lead.businessName}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-medium italic text-slate-400">Personal Lead</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className={`text-[12px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lead.email || '-'}</span>
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <span className={`text-[12px] font-black font-mono tracking-tighter ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{lead.phone || '-'}</span>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md`}
                                                style={{ background: agentColorMap[lead.agentName] || '#64748b' }}
                                            >
                                                {lead.agentName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className={`text-[13px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lead.agentName}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        {(() => {
                                            const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                                            const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0;
                                            const docCount = lead.documents?.length || 0;
                                            const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;

                                            if (hasRejected) {
                                                return (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/30">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        Docs Rejected
                                                    </span>
                                                );
                                            }
                                            if (isAllVerified) {
                                                return (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                                                        <IconCheck size={10} strokeWidth={4} />
                                                        Fully Verified
                                                    </span>
                                                );
                                            }
                                            return (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    Checking ({approvedCount}/{docCount})
                                                </span>
                                            );
                                        })()}
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDocModal(lead);
                                                }}
                                                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm text-center ${isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white' : 'bg-[#0061ff] text-white hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/20'}`}
                                            >
                                                Manage Docs
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 animate-fadeIn">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-slate-300 ${isDark ? 'bg-[#1a1f35]' : 'bg-slate-50'}`}>
                                                <IconDocs width={32} height={32} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className={`text-[15px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No matching leads</h3>
                                                <p className={`text-[11px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Try adjusting your filters or search search term</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer ── */}
                <div className={`px-6 py-5 border-t flex items-center justify-between md:flex-col md:gap-4 ${isDark ? 'bg-[#141829]/50 border-white/5' : 'bg-[#fcfdfd] border-slate-50'}`}>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        Showing <span className={isDark ? 'text-white' : 'text-slate-900'}>{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className={isDark ? 'text-white' : 'text-slate-900'}>{filtered.length}</span> Records
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${isDark ? 'border-[#2c3568] bg-[#1a1f35] text-slate-400 hover:text-white disabled:opacity-20' : 'border-slate-100 bg-white text-slate-400 hover:text-[#0061ff] disabled:opacity-40'}`}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 rounded-xl text-[11px] font-black transition-all border ${page === i + 1 ? 'bg-[#0061ff] text-white border-[#0061ff] shadow-lg shadow-blue-500/30' : (isDark ? 'border-[#2c3568] bg-[#1a1f35] text-slate-400 hover:border-blue-500' : 'border-slate-100 bg-white text-slate-400 hover:border-blue-500')}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${isDark ? 'border-[#2c3568] bg-[#1a1f35] text-slate-400 hover:text-white disabled:opacity-20' : 'border-slate-100 bg-white text-slate-400 hover:text-[#0061ff] disabled:opacity-40'}`}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Document Modal ── */}
            {showDocModal && (
                <UploadModal
                    isOpen={showDocModal}
                    onClose={() => setShowDocModal(false)}
                    client={selectedLeadForDocs}
                    onUpload={handleUploadClick}
                    onDelete={handleDeleteDocument}
                    onApprove={handleApproveDoc}
                    onReject={handleRejectDoc}
                    uploadingDocs={uploadingDocs}
                    isDark={isDark}
                    isTeamLeader={true}
                />
            )}
        </div>
    );
};

export default LeadMonitoring;

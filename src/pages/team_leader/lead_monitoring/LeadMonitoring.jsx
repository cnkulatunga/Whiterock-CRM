import React, { useState, useMemo } from 'react';
import { WORKFLOW_STAGES_LIST, SHARED_INITIAL_USERS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';
import { useTheme } from '../../../context/ThemeContext';
import { useTasks } from '../../../context/TasksContext';
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
    const { tasks } = useTasks();
    
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
        <div className={`flex flex-col gap-5 animate-fadeIn font-['Sora',sans-serif]`}>
            {/* ── KPI Tiles ── */}
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
                {[
                    { label: 'Total Leads',   value: stats.total,         colorClass: 'text-blue-700 dark:text-blue-300',    bgClass: 'bg-blue-50 dark:bg-blue-500/10',    borderClass: 'border-blue-100 dark:border-blue-500/20',    iconBg: 'bg-blue-600',    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
                    { label: 'Pending Docs',  value: stats.pendingReview, colorClass: 'text-orange-700 dark:text-orange-300', bgClass: 'bg-orange-50 dark:bg-orange-500/10', borderClass: 'border-orange-100 dark:border-orange-500/20', iconBg: 'bg-orange-500',  icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
                    { label: 'Fully Verified',value: stats.fullyVerified, colorClass: 'text-emerald-700 dark:text-emerald-300',bgClass: 'bg-emerald-50 dark:bg-emerald-500/10',borderClass: 'border-emerald-100 dark:border-emerald-500/20',iconBg: 'bg-emerald-500', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
                    { label: 'Lead Pipeline', value: stats.inProgress,    colorClass: 'text-rose-700 dark:text-rose-300',    bgClass: 'bg-rose-50 dark:bg-rose-500/10',    borderClass: 'border-rose-100 dark:border-rose-500/20',    iconBg: 'bg-rose-600',    icon: <><path d="M2 17L12 22L22 17M2 12L12 17L22 12M12 2L2 7L12 12L22 7L12 2Z"/></> },
                ].map((card, i) => (
                    <div key={card.label} className={`rounded-xl border ${card.borderClass} p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group ${card.bgClass}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0 ${card.iconBg}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">{card.icon}</svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{card.label}</div>
                                <div className={`text-base font-black leading-none ${card.colorClass}`}>{card.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filter Bar ── */}
            <div className={`rounded-2xl border overflow-hidden animate-slideUp [animation-delay:150ms] [animation-fill-mode:both] ${isDark ? 'bg-[#1e2347] border-white/5 shadow-2xl' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                <div className={`p-4 flex justify-between items-center border-b flex-wrap gap-3 ${isDark ? 'border-white/5' : 'border-[#f7fafc]'}`}>
                    <h2 className={`text-[13px] font-black uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-[#1a202c]'}`}>Lead Monitoring</h2>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative">
                            <select className={`appearance-none rounded-[12px] px-4 py-2 text-[12px] font-bold outline-none cursor-pointer border transition-all pr-10 ${isDark ? 'bg-[#141829] border-white/10 text-slate-300' : 'bg-[#f7fafc] border-[#edf2f7] text-[#4a5568]'}`} value={agentFilter} onChange={handleFilterChange(setAgentFilter)}>
                                {agentList.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        <div className="relative">
                            <select className={`appearance-none rounded-[12px] px-4 py-2 text-[12px] font-bold outline-none cursor-pointer border transition-all pr-10 ${isDark ? 'bg-[#141829] border-white/10 text-slate-300' : 'bg-[#f7fafc] border-[#edf2f7] text-[#4a5568]'}`} value={stageFilter} onChange={handleFilterChange(setStageFilter)}>
                                {['All Stages', ...STAGES].map(s => <option key={s}>{s}</option>)}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        <div className={`flex items-center gap-2.5 px-4 py-2 border rounded-[12px] w-[280px] transition-all ${isDark ? 'bg-[#1e2347] border-[#36407a] focus-within:border-[#5b6aaa]' : 'bg-[#f7fafc] border-[#edf2f7] focus-within:border-[#2447d7]/30'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#4a5a8a' : '#a0aec0'} strokeWidth="2.5" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input type="text" placeholder="Search by name, ID or business..." className={`bg-transparent border-none outline-none text-[12px] font-medium w-full ${isDark ? 'text-slate-200 placeholder-slate-500' : 'text-[#4a5568] placeholder-[#a0aec0]'}`} value={search} onChange={handleFilterChange(setSearch)} />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className={`${isDark ? 'bg-[#141829]/50' : 'bg-[#fbfeff]'}`}>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Lead / Client</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Business</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Email</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Phone</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Agent</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Doc Status</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Last Note</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-[#f7fafc]'}`}>
                            {paginated.length > 0 ? paginated.map((lead, i) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => onViewDetails?.(lead)}
                                    className={`transition-colors border-b last:border-0 cursor-pointer ${isDark ? 'hover:bg-white/5 border-white/5' : 'hover:bg-[#fcfdfe] border-[#f7fafc]'}`}
                                >
                                    <td className="px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0`} style={{ background: agentColorMap[lead.agentName] || '#64748b' }}>
                                                {lead.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-[11px] font-black truncate max-w-[110px] ${isDark ? 'text-white' : 'text-[#1a202c]'}`}>{lead.name}</span>
                                                <span className={`text-[9px] font-bold tracking-tighter ${isDark ? 'text-blue-400' : 'text-[#0061ff]'}`}>#{lead.leadId}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {lead.businessName ? (
                                            <span className={`text-[10px] font-black uppercase tracking-tight truncate max-w-[120px] block ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>{lead.businessName}</span>
                                        ) : (
                                            <span className="text-[10px] font-medium italic text-slate-400">Personal</span>
                                        )}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <span className={`text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{lead.email || '-'}</span>
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <span className={`text-[10px] font-black font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{lead.phone || '-'}</span>
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0" style={{ background: agentColorMap[lead.agentName] || '#64748b' }}>
                                                {lead.agentName?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                                            </div>
                                            <span className={`text-[11px] font-bold truncate max-w-[90px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lead.agentName}</span>
                                        </div>
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {(() => {
                                            const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                                            const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0;
                                            const docCount = lead.documents?.length || 0;
                                            const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;
                                            if (hasRejected) return (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 whitespace-nowrap">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />Rejected
                                                </span>
                                            );
                                            if (isAllVerified) return (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 whitespace-nowrap">
                                                    <IconCheck size={9} strokeWidth={4} />Verified
                                                </span>
                                            );
                                            return (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 whitespace-nowrap">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{approvedCount}/{docCount}
                                                </span>
                                            );
                                        })()}
                                    </td>

                                    <td className="px-3 py-2.5 w-[160px]">
                                        {(() => {
                                            const leadName = lead.name.toLowerCase();
                                            const leadTasks = (tasks || []).filter(t =>
                                                t.leadId?.toString() === lead.id?.toString() ||
                                                t.lead?.toLowerCase() === leadName
                                            );
                                            const lastTask = [...leadTasks].sort((a, b) =>
                                                new Date(b.date || b.updatedAt || 0) - new Date(a.date || a.updatedAt || 0)
                                            )[0];
                                            const note = lastTask?.notes || lastTask?.message;
                                            if (!note) return <span className="text-[10px] text-slate-500 italic">No preview</span>;
                                            return (
                                                <div className="flex items-start gap-1.5 max-w-[150px]">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11" className="text-blue-500 shrink-0 mt-0.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                                    <span className={`text-[10px] font-medium leading-tight line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{note}</span>
                                                </div>
                                            );
                                        })()}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenDocModal(lead); }}
                                            className={`p-1.5 rounded-lg transition-all border ${isDark ? 'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'border-[#ebf0ff] bg-[#f0f4ff] text-[#2447d7] hover:bg-[#2447d7] hover:text-white'}`}
                                            title="Manage Documents"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 animate-fadeIn">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-slate-300 ${isDark ? 'bg-[#1a1f35]' : 'bg-slate-50'}`}>
                                                <IconDocs width={24} height={24} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className={`text-[13px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No matching leads</h3>
                                                <p className={`text-[11px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Try adjusting your filters or search term</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer ── */}
                <div className={`p-4 flex items-center justify-between sm:flex-col sm:gap-4 border-t ${isDark ? 'bg-[#141829]/30 border-white/5' : 'bg-[#fdfdfd] border-[#f7fafc]'}`}>
                    <span className={`text-[12px] font-bold ${isDark ? 'text-slate-500' : 'text-[#718096]'}`}>
                        Showing <span className={isDark ? 'text-white' : 'text-[#1a202c]'}>{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className={isDark ? 'text-white' : 'text-[#1a202c]'}>{filtered.length}</span> records
                    </span>
                    <div className="flex gap-2 sm:w-full">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={`px-4 py-2 rounded-xl text-[12px] font-black transition-all border disabled:opacity-30 disabled:cursor-not-allowed sm:flex-1 ${isDark ? 'bg-[#141829] border-white/10 text-slate-300 hover:bg-[#1e2347]' : 'bg-white border-[#e2e8f0] text-[#4a5568] hover:bg-[#f7fafc]'}`}>PREVIOUS</button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`px-4 py-2 rounded-xl text-[12px] font-black transition-all border disabled:opacity-30 disabled:cursor-not-allowed sm:flex-1 ${isDark ? 'bg-[#141829] border-white/10 text-slate-300 hover:bg-[#1e2347]' : 'bg-white border-[#e2e8f0] text-[#4a5568] hover:bg-[#f7fafc]'}`}>NEXT</button>
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

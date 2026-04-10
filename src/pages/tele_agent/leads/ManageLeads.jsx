import React, { useState, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import UploadModal from '../../../components/DocumentManagement/UploadModal';
import EditLeadModal from './EditLeadModal';
const IconUpload = ({ size = 18 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const IconCheck = ({ size = 16 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><polyline points="20 6 9 17 4 12" /></svg>;
const IconAlert = ({ size = 16 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const IconTrash = ({ size = 18 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
const IconUsers = ({ size = 18 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><path d="M17 21v-2a4 4 0 0 0-3-3H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconMail = ({ size = 14 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconPhone = ({ size = 14 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconDollar = ({ size = 14 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconFileText = ({ size = 14 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;

import { INITIAL_MEMBERSHIPS, MOCK_LEAD_COUNTS } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';
import { useTasks } from '../../../context/TasksContext';

const ITEMS_PER_PAGE = 5;

const ManageLeads = ({ onViewDetails, onSelectLender, isAccountsManager = false }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { users } = useUsers() || {};
    const { leads, setLeads, updateLead } = useLeads() || { leads: [] };
    const { tasks } = useTasks() || { tasks: [] };
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [ownershipFilter, setOwnershipFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [leadToReassign, setLeadToReassign] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState(null);
    const [uploadContext, setUploadContext] = useState(null);
    const [uploadingDocs, setUploadingDocs] = useState({});

    const activeUser = JSON.parse(localStorage.getItem('user') || '{}');
    const activeUserRole = activeUser.role || '';
    const activeUserName = activeUser.name || `${activeUser.first_name || ''} ${activeUser.last_name || ''}`.trim();
    const isSuperOrAM = isAccountsManager || activeUserRole === 'Accounts Manager' || activeUserRole === 'accounts_manager' || activeUserRole === 'Super Admin' || activeUserRole === 'super_admin';
    const isLeader = activeUserRole === 'Team Leader' || activeUserRole === 'team_leader';
    const myTeamMemberIds = isLeader ? (INITIAL_MEMBERSHIPS[activeUser.id] || []).map(m => m.id) : [];

    const filteredLeads = leads.filter(lead => {
        let hasPermission = false;
        if (isSuperOrAM) {
            hasPermission = true;
        } else if (isLeader) {
            hasPermission = lead.assignedStaffId === activeUser.id || 
                            myTeamMemberIds.includes(lead.assignedStaffId) || 
                            lead.agentName === activeUserName || 
                            lead.createdBy === activeUserName || 
                            lead.tl === activeUserName;
        } else {
            hasPermission = lead.assignedStaffId === activeUser.id || 
                            lead.agentName === activeUserName || 
                            lead.createdBy === activeUserName;
        }

        if (!hasPermission) return false;

        // Apply ownership filter for Leaders
        if (isLeader && ownershipFilter !== 'All') {
            const isMine = lead.assignedStaffId === activeUser.id || lead.agentName === activeUserName || lead.createdBy === activeUserName || lead.tl === activeUserName;
            // Note: If they created the lead but assigned it to someone else, it might still have their footprint. Let's just use assignedStaffId to be strict or the explicit footprint.
            const strictlyMine = lead.assignedStaffId === activeUser.id || lead.agentName === activeUserName || lead.createdBy === activeUserName;
            
            if (ownershipFilter === 'My Leads' && !strictlyMine) return false;
            if (ownershipFilter === 'Team Leads' && strictlyMine) return false;
        }

        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
        const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && (lead.documents?.length || 0) > 0;
        
        let matchesStatus = statusFilter === 'All';
        if (!matchesStatus) {
            if (statusFilter === 'Document Verification Done') {
                matchesStatus = (lead.stage || lead.status) === 'Document Verification Done' && isAllVerified;
            } else if (statusFilter === 'Document Rejected') {
                matchesStatus = (lead.stage || lead.status) === 'Document Verification Done' && hasRejected;
            } else {
                matchesStatus = (lead.stage || lead.status) === statusFilter;
            }
        }
        
        return matchesSearch && matchesStatus;
    });

    const STATUS_ORDER = { Hot: 0, Warm: 1, Cool: 2 };

    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedLeads = [...filteredLeads]
        .sort((a, b) => (STATUS_ORDER[a.leadStatus] ?? 1) - (STATUS_ORDER[b.leadStatus] ?? 1))
        .slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const handleOpenModal = (lead) => {
        setSelectedLead(lead);
        setShowModal(true);
    };

    const handleUploadClick = (leadId, docId, docName, file) => {
        if (!file) return;
        const targetDocId = docId || Date.now();
        // Capture file info in local variables — avoids stale-closure bug when reading state later
        const previewUrl = URL.createObjectURL(file);
        const fileName = file.name;
        const fileType = file.type;

        setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress: 0, file, previewUrl } }));

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                // Pass captured values directly
                finishUpload(leadId, targetDocId, docName, previewUrl, fileName, fileType);
            } else {
                setUploadingDocs(prev => ({ ...prev, [targetDocId]: { progress } }));
            }
        }, 150);
    };

    const finishUpload = (leadId, targetDocId, docName, previewUrl, fileName, fileType) => {
        const today = new Date().toISOString().split('T')[0];
        const buildDoc = (existing) => existing
            ? { ...existing, status: 'Pending', date: today, url: previewUrl, fileName, fileType }
            : { id: targetDocId, type: docName, status: 'Pending', note: '', date: today, url: previewUrl, fileName, fileType };

        const updateDocList = (docs = []) => {
            const idx = docs.findIndex(d => d.id === targetDocId);
            return idx >= 0
                ? docs.map(d => d.id === targetDocId ? buildDoc(d) : d)
                : [...docs, buildDoc(null)];
        };

        const currentLead = leads.find(l => l.id === leadId);
        if (currentLead) {
            const updatedDocs = updateDocList(currentLead.documents);
            updateLead(leadId, { documents: updatedDocs });
        }

        setSelectedLead(prev =>
            prev?.id === leadId ? { ...prev, documents: updateDocList(prev.documents) } : prev
        );

        setTimeout(() => {
            setUploadingDocs(prev => { const n = { ...prev }; delete n[targetDocId]; return n; });
        }, 500);
    };

    const handleDeleteDocument = (leadId, docId) => {
        const currentLead = leads.find(l => l.id === leadId);
        if (currentLead) {
            updateLead(leadId, { documents: currentLead.documents.filter(d => d.id !== docId) });
        }
        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: prev.documents.filter(d => d.id !== docId) } : prev);
    };

    const handleReassign = (leadId, newStaffId) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignedStaffId: parseInt(newStaffId) } : l));
        setShowReassignModal(false);
        setLeadToReassign(null);
    };

    const handleEditLead = (lead) => {
        setLeadToEdit(lead);
        setShowEditModal(true);
    };

    const handleSaveEditedLead = (updatedLead) => {
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
        setShowEditModal(false);
        setLeadToEdit(null);
    };

    const handleDeleteLead = (lead) => {
        setLeadToDelete(lead);
        setShowDeleteModal(true);
    };

    const confirmDeleteLead = () => {
        if (leadToDelete) {
            setLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
            setShowDeleteModal(false);
            setLeadToDelete(null);
        }
    };

    const totalLeads = leads.length;
    const docsVerified = leads.filter(l => l.documents?.length > 0 && l.documents?.every(d => d.status === 'Approved')).length;
    const docsPending = leads.filter(l => !l.documents || l.documents.length === 0 || l.documents.some(d => d.status !== 'Approved')).length;
    const sentToLenders = leads.filter(l => (l.selectedLenders?.length || 0) > 0).length;

    const pipelineStats = [
        { label: 'Total Leads',               value: totalLeads,    bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',       iconBg: 'bg-blue-600',    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
        { label: 'Document Verification Done', value: docsVerified, bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20', iconBg: 'bg-emerald-600', icon: <polyline points="20 6 9 17 4 12" /> },
        { label: 'Document Pending',           value: docsPending,  bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',     iconBg: 'bg-amber-500',   icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
        ...(isSuperOrAM ? [{ label: 'Sent to Lenders', value: sentToLenders, bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20', iconBg: 'bg-purple-600', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> }] : [])
    ];

    return (
        <>
            {/* Pipeline KPI Cards */}
            <div className={`grid ${pipelineStats.length === 4 ? 'grid-cols-4 md:grid-cols-2' : 'grid-cols-3 md:grid-cols-2'} sm:grid-cols-1 gap-3 lg:gap-4 animate-fadeIn font-['Sora',sans-serif] mb-4`}>
                {pipelineStats.map((stat, i) => (
                    <div key={i} className={`rounded-xl border p-2.5 sm:p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group ${stat.bg}`}>
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0 ${stat.iconBg}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="sm:w-4 sm:h-4">{stat.icon}</svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</div>
                                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-none">{stat.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`rounded-2xl border overflow-hidden animate-slideUp [animation-delay:150ms] [animation-fill-mode:both] ${isDark ? 'bg-[#1e2347] border-white/5 shadow-2xl' : 'bg-white border-[#edf2f7] shadow-sm'}`}>
                <div className={`p-4 sm:p-3 flex flex-col lg:flex-row justify-between lg:items-center border-b gap-3 sm:gap-2 ${isDark ? 'border-white/5' : 'border-[#f7fafc]'}`}>
                    <h2 className={`text-sm font-black uppercase tracking-widest sm:hidden ${isDark ? 'text-blue-400' : 'text-[#1a202c]'}`}>Lead Directory</h2>
                    <div className="flex items-center gap-2 flex-nowrap w-full">
                        {/* Status Filter */}
                        <div className="relative shrink-0">
                            <select
                                className={`appearance-none rounded-xl px-3 py-2 text-[11px] sm:text-[10px] font-bold outline-none cursor-pointer border transition-all pr-7 ${isDark ? 'bg-[#141829] border-white/10 text-slate-300 focus:border-blue-500/50' : 'bg-[#f7fafc] border-[#edf2f7] text-[#4a5568] focus:border-[#2447d7]/30'}`}
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="All">All Status</option>
                                <option value="Document Collection">Collection</option>
                                <option value="Document Verification Done">Verified</option>
                                <option value="Document Rejected">Rejected</option>
                                <option value="Lender Selection">Lender Select</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        
                        {/* Ownership Filter */}
                        {isLeader && (
                            <div className="relative shrink-0">
                                <select
                                    className={`appearance-none rounded-xl px-3 py-2 text-[11px] sm:text-[10px] font-bold outline-none cursor-pointer border transition-all pr-7 ${isDark ? 'bg-[#141829] border-white/10 text-slate-300 focus:border-blue-500/50' : 'bg-[#f7fafc] border-[#edf2f7] text-[#4a5568] focus:border-[#2447d7]/30'}`}
                                    value={ownershipFilter}
                                    onChange={(e) => {
                                        setOwnershipFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="All">All Leads</option>
                                    <option value="My Leads">My Leads</option>
                                    <option value="Team Leads">Team Leads</option>
                                </select>
                                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        )}
                        
                        {/* Search Bar */}
                        <div className={`flex items-center gap-2 px-3 py-2 border rounded-xl flex-1 min-w-0 transition-all ${isDark ? 'bg-[#1e2347] border-[#36407a] focus-within:border-[#5b6aaa]' : 'bg-[#f7fafc] border-[#edf2f7] focus-within:border-[#2447d7]/30'}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#4a5a8a' : '#a0aec0'} strokeWidth="2.5" width="13" height="13" className="shrink-0">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                className={`bg-transparent border-none outline-none text-[11px] sm:text-[10px] font-medium w-full min-w-0 ${isDark ? 'text-slate-200 placeholder-slate-500' : 'text-[#4a5568] placeholder-[#a0aec0]'}`}
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
                {/* Mobile Card View */}
                <div className="hidden sm:flex flex-col gap-3 p-3">
                    {displayedLeads.map((lead, idx) => {
                        const isDecisionMade = ['Loan Confirmed', 'Loan Rejected', 'Lender Selection'].includes(lead.status);
                        const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                        const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && (lead.documents?.length || 0) > 0;
                        const docCount = lead.documents?.length || 0;
                        const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;

                        return (
                            <div 
                                key={lead.id} 
                                onClick={() => onViewDetails(lead)}
                                className={`p-4 rounded-2xl border transition-all active:scale-[0.98] animate-rowIn flex flex-col gap-3 ${isDark ? 'bg-white/[0.03] border-white/5 shadow-xl' : 'bg-white border-[#edf2f7] shadow-sm'}`}
                                style={{ animationDelay: `${550 + idx * 50}ms`, animationFillMode: 'both' }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black shadow-inner shrink-0 ${isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-[#f0f4ff] text-[#2447d7]'}`}>
                                            {lead.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[14px] font-black leading-tight ${isDark ? 'text-white' : 'text-[#1a202c]'}`}>{lead.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest mt-0.5 uppercase">ID: #{lead.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[14px] font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>${(lead.loanAmount || 0).toLocaleString()}</span>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Loan Amount</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business</span>
                                        <span className="text-[11px] font-bold text-blue-500 dark:text-blue-400 line-clamp-1">{lead.businessName || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Info</span>
                                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">{lead.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lead Visibility</span>
                                        {(() => {
                                            const ls = lead.leadStatus || 'Warm';
                                            const cfg = {
                                                Hot:  { cls: `bg-red-50 text-red-600 border-red-100 ${isDark ? 'dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : ''}`, dot: 'bg-red-500' },
                                                Warm: { cls: `bg-orange-50 text-orange-600 border-orange-100 ${isDark ? 'dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' : ''}`, dot: 'bg-orange-500' },
                                                Cool: { cls: `bg-blue-50 text-blue-600 border-blue-100 ${isDark ? 'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : ''}`, dot: 'bg-blue-500' },
                                            }[ls];
                                            return (
                                                <div className="relative inline-block" onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={ls}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            updateLead(lead.id, { leadStatus: e.target.value });
                                                        }}
                                                        className={`appearance-none pl-5 pr-7 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border cursor-pointer outline-none transition-all ${cfg.cls}`}
                                                    >
                                                        <option value="Hot">Hot</option>
                                                        <option value="Warm">Warm</option>
                                                        <option value="Cool">Cool</option>
                                                    </select>
                                                    <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${cfg.dot}`} />
                                                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="9" height="9">
                                                        <polyline points="6 9 12 15 18 9"/>
                                                    </svg>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Process Stage</span>
                                        {(() => {
                                            if (hasRejected || lead.status === 'Loan Rejected' || lead.status === 'Rejected') {
                                                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"><IconAlert size={10} /> {hasRejected ? 'Docs Rejected' : lead.status}</span>;
                                            }
                                            if (lead.status === 'Loan Confirmed' || isAllVerified) {
                                                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20"><IconCheck size={10} strokeWidth={3} /> {isAllVerified && (lead.status === 'Document Verification Done' || lead.status === 'Document Verifications') ? 'Verified' : lead.status}</span>;
                                            }
                                            if (lead.status === 'Lender Selection') {
                                                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20"><IconCheck size={10} strokeWidth={3} /> {lead.status}</span>;
                                            }
                                            if (docCount > 0) {
                                                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(36,71,215,0.4)]" /> {lead.status === 'Document Collected' ? 'Docs' : lead.status} ({approvedCount}/{docCount})</span>;
                                            }
                                            return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-white/10">{lead.status}</span>;
                                        })()}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                                    {!(lead.status === 'Document Verifications' && isAllVerified) && !isAccountsManager && (
                                        <button 
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isDark ? 'border-blue-500/30 bg-blue-500/10 text-blue-400 active:bg-blue-500/20' : 'border-[#ebf0ff] bg-[#f0f4ff] text-[#2447d7] active:bg-[#2447d7] active:text-white'}`}
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(lead); }}
                                        >
                                            <IconUpload size={14} /> Upload Documents
                                        </button>
                                    )}
                                    {isAccountsManager && (
                                        <div className="flex gap-2 w-full">
                                            {['Document Verification Done', 'Lender Selection'].includes(lead.stage) && onSelectLender && (
                                                <button
                                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isDark ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' : 'border-[#e9d5ff] bg-[#f5f3ff] text-[#7c3aed]'}`}
                                                    onClick={(e) => { e.stopPropagation(); onSelectLender(lead); }}
                                                >
                                                    Select Lender
                                                </button>
                                            )}
                                            <button
                                                className={`p-2.5 rounded-xl border ${isDark ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-[#ebf0ff] bg-[#f0f4ff] text-[#2447d7]'}`}
                                                onClick={(e) => { e.stopPropagation(); setLeadToReassign(lead); setShowReassignModal(true); }}
                                            >
                                                <IconUsers size={16} />
                                            </button>
                                            <button
                                                className={`p-2.5 rounded-xl border ${isDark ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-[#fee2e2] bg-[#fef2f2] text-[#ef4444]'}`}
                                                onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead); }}
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {displayedLeads.length === 0 && (
                        <div className="py-12 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl">
                            No leads matching criteria
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="sm:hidden overflow-x-auto scrollbar-thin">
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead>
                            <tr className={`${isDark ? 'bg-[#141829]/50' : 'bg-[#fbfeff]'}`}>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[180px] ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>ID / Client</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[150px] sm:hidden ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Business</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[100px] sm:hidden ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Amount</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[180px] sm:hidden ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Email / Phone</th>
                                {isAccountsManager && <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[120px] ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Staff</th>}
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[160px] sm:hidden ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Last Note</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[110px] ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Status</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[90px] ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Lead Status</th>
                                <th className={`text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.15em] border-b w-[130px] ${isDark ? 'border-white/5 text-slate-500' : 'border-[#f7fafc] text-[#a0aec0]'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedLeads.map((lead, idx) => (
                                <tr 
                                    key={lead.id} 
                                    onClick={() => onViewDetails(lead)}
                                    className={`transition-colors border-b last:border-0 animate-rowIn cursor-pointer ${isDark ? 'hover:bg-white/5 border-white/5' : 'hover:bg-[#fcfdfe] border-[#f7fafc]'}`} 
                                    style={{ animationDelay: `${550 + idx * 50}ms`, animationFillMode: 'both' }}
                                >
                                    <td className="px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shadow-inner shrink-0 ${isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-[#f0f4ff] text-[#2447d7]'}`}>
                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-[11px] font-black truncate max-w-[110px] ${isDark ? 'text-white' : 'text-[#1a202c]'}`}>{lead.name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 tracking-tighter">#{lead.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2.5 sm:hidden">
                                        <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-tight truncate max-w-[120px] block">{lead.businessName || 'N/A'}</span>
                                    </td>
                                    <td className="px-3 py-2.5 sm:hidden">
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>${(lead.loanAmount || 0).toLocaleString()}</span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Loan</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2.5 sm:hidden">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                <IconMail size={11} className="text-slate-400" />
                                                <span className="truncate max-w-[120px]">{lead.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                <IconPhone size={11} className="text-slate-400" />
                                                <span className="whitespace-nowrap">{lead.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {isAccountsManager && (
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const staff = users?.find(u => u.id === lead.assignedStaffId);
                                                    if (!staff) return <span className="text-[10px] text-slate-500 italic">Unassigned</span>;
                                                    const bgColor = staff.color || staff.bgColor || '#2447d7';
                                                    return (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-sm" style={{ backgroundColor: bgColor }}>
                                                                {staff.initials}
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className={`text-[11px] font-black truncate max-w-[80px] ${isDark ? 'text-white' : 'text-[#1a202c]'}`}>{staff.name}</span>
                                                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate">{staff.role}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-3 py-2.5 sm:hidden">
                                        {(() => {
                                            const leadIdStr = lead.id.toString();
                                            const leadName = lead.name.toLowerCase();
                                            
                                            // Filter tasks by Lead ID OR Lead Name
                                            const leadTasks = (tasks || []).filter(t => 
                                                t.leadId?.toString() === leadIdStr || 
                                                t.lead?.toLowerCase() === leadName
                                            );
                                            
                                            // Sort by date (handles 'date' field from new tasks and 'updatedAt' from legacy/mock)
                                            const lastTask = [...leadTasks].sort((a, b) => {
                                                const dateA = new Date(a.date || a.updatedAt || a.dueDate || 0);
                                                const dateB = new Date(b.date || b.updatedAt || b.dueDate || 0);
                                                return dateB - dateA;
                                            })[0];
                                            
                                            const taskNote = lastTask?.notes || lastTask?.message;
                                            
                                            if (!lastTask || !taskNote) return <span className="text-[10px] text-slate-500 italic">No preview</span>;
                                            
                                            return (
                                                <div className="flex items-start gap-1.5 group max-w-[200px]">
                                                    <IconFileText size={12} className="text-blue-500 shrink-0 mt-0.5" />
                                                    <span className={`text-[11px] font-medium leading-tight line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        {taskNote}
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <div className="flex items-center">
                                            {(() => {
                                                const isDecisionMade = ['Loan Confirmed', 'Loan Rejected', 'Lender Selection'].includes(lead.status);
                                                const hasRejected = lead.documents?.some(d => d.status === 'Rejected');
                                                const isAllVerified = lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0;
                                                const docCount = lead.documents?.length || 0;
                                                const approvedCount = lead.documents?.filter(d => d.status === 'Approved').length || 0;

                                                // 1. Critical Rejection (Document or Loan level)
                                                if (hasRejected || lead.status === 'Loan Rejected' || lead.status === 'Rejected') {
                                                    const label = hasRejected ? 'Document Rejected' : lead.status;
                                                    return (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 shadow-sm whitespace-nowrap">
                                                            <IconAlert size={10} /> {label === 'Document Verifications' ? 'Docs Rejected' : label}
                                                        </span>
                                                    );
                                                }

                                                // 2. Success / Post-Verification Stage
                                                if (lead.status === 'Loan Confirmed' || isAllVerified) {
                                                    const label = isAllVerified && (lead.status === 'Document Verification Done' || lead.status === 'Document Verifications') ? 'Document Verified' : lead.status;
                                                    return (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20 shadow-sm whitespace-nowrap">
                                                            <IconCheck size={10} strokeWidth={3} /> {label}
                                                        </span>
                                                    );
                                                }

                                                // 3. Selection / Advanced Stage
                                                if (lead.status === 'Lender Selection') {
                                                    return (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 shadow-sm whitespace-nowrap">
                                                            <IconCheck size={10} strokeWidth={3} /> {lead.status}
                                                        </span>
                                                    );
                                                }

                                                // 4. Collection / Pending Stage
                                                if (docCount > 0) {
                                                    return (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm whitespace-nowrap">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(36,71,215,0.4)]" />
                                                            {lead.status === 'Document Collected' ? 'Docs' : lead.status} ({approvedCount}/{docCount})
                                                        </span>
                                                    );
                                                }

                                                // 5. Default / Missing Docs Stage
                                                return (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-white/10 whitespace-nowrap">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                        {lead.status}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                    {/* Lead Status */}
                                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                                        {(() => {
                                            const ls = lead.leadStatus || 'Warm';
                                            const cfg = {
                                                Hot:  { cls: `bg-red-50 text-red-600 border-red-100 ${isDark ? 'dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : ''}`, dot: 'bg-red-500' },
                                                Warm: { cls: `bg-orange-50 text-orange-600 border-orange-100 ${isDark ? 'dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' : ''}`, dot: 'bg-orange-500' },
                                                Cool: { cls: `bg-blue-50 text-blue-600 border-blue-100 ${isDark ? 'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : ''}`, dot: 'bg-blue-500' },
                                            }[ls] || { cls: 'bg-slate-50 text-slate-500 border-slate-100', dot: 'bg-slate-400' };
                                            return (
                                                <div className="relative inline-block">
                                                    <select
                                                        value={ls}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            updateLead(lead.id, { leadStatus: e.target.value });
                                                        }}
                                                        className={`appearance-none pl-5 pr-6 py-1 rounded-full text-[8px] font-black uppercase tracking-wide border whitespace-nowrap cursor-pointer outline-none hover:opacity-80 transition-opacity ${cfg.cls}`}
                                                    >
                                                        <option value="Hot">Hot</option>
                                                        <option value="Warm">Warm</option>
                                                        <option value="Cool">Cool</option>
                                                    </select>
                                                    <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${cfg.dot}`} />
                                                    <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8">
                                                        <polyline points="6 9 12 15 18 9"/>
                                                    </svg>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <div className="flex items-center gap-1">
                                            {!(lead.status === 'Document Verifications' && lead.documents?.every(d => d.status === 'Approved') && lead.documents?.length > 0) && !isAccountsManager && (
                                                <button 
                                                    className={`p-1.5 rounded-lg transition-all border ${isDark ? 'border-white/10 text-blue-400 hover:bg-blue-500/10' : 'border-[#edf2f7] text-[#2447d7] hover:bg-[#2447d7] hover:text-white'}`}
                                                    title="Upload Documents"
                                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(lead); }}
                                                >
                                                    <IconUpload size={13} />
                                                </button>
                                            )}
                                            {isAccountsManager && (
                                                <>
                                                     {['Document Verification Done', 'Lender Selection'].includes(lead.stage) && onSelectLender && (
                                                        <button
                                                            className={`p-1.5 rounded-lg transition-all border ${isDark ? 'border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' : 'border-[#e9d5ff] bg-[#f5f3ff] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white'}`}
                                                            title="Select Lender"
                                                            onClick={(e) => { e.stopPropagation(); onSelectLender(lead); }}
                                                        >
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                        </button>
                                                    )}
                                                    <button
                                                        className={`p-1.5 rounded-lg transition-all border ${isDark ? 'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'border-[#ebf0ff] bg-[#f0f4ff] text-[#2447d7] hover:bg-[#2447d7] hover:text-white'}`}
                                                        title="Reassign Lead"
                                                        onClick={(e) => { e.stopPropagation(); setLeadToReassign(lead); setShowReassignModal(true); }}
                                                    >
                                                        <IconUsers size={13} />
                                                    </button>
                                                    <button
                                                        className={`p-1.5 rounded-lg transition-all border ${isDark ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'border-[#fee2e2] bg-[#fef2f2] text-[#ef4444] hover:bg-[#ef4444] hover:text-white'}`}
                                                        title="Delete Lead"
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead); }}
                                                    >
                                                        <IconTrash size={13} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className={`p-4 flex justify-between items-center border-t sm:flex-col sm:gap-4 ${isDark ? 'bg-[#141829]/30 border-white/5' : 'bg-[#fdfdfd] border-[#f7fafc]'}`}>
                    <span className={`text-[12px] font-bold ${isDark ? 'text-slate-500' : 'text-[#718096]'}`}>
                        Showing <span className={isDark ? 'text-white' : 'text-[#1a202c]'}>{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredLeads.length)}</span> of <span className={isDark ? 'text-white' : 'text-[#1a202c]'}>{filteredLeads.length}</span> records
                    </span>
                    <div className="flex gap-2 sm:w-full">
                        <button 
                            className={`px-4 py-2 rounded-xl text-[12px] font-black transition-all border disabled:opacity-30 disabled:cursor-not-allowed sm:flex-1 ${isDark ? 'bg-[#141829] border-white/10 text-slate-300 hover:bg-[#1e2347]' : 'bg-white border-[#e2e8f0] text-[#4a5568] hover:bg-[#f7fafc]'}`}
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1 || filteredLeads.length === 0}
                        >
                            PREVIOUS
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-xl text-[12px] font-black transition-all border disabled:opacity-30 disabled:cursor-not-allowed sm:flex-1 ${isDark ? 'bg-[#141829] border-white/10 text-slate-300 hover:bg-[#1e2347]' : 'bg-white border-[#e2e8f0] text-[#4a5568] hover:bg-[#f7fafc]'}`}
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages || filteredLeads.length === 0}
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <UploadModal 
                    client={selectedLead}
                    onClose={() => setShowModal(false)}
                    onUpload={handleUploadClick}
                    onDelete={handleDeleteDocument}
                    onApprove={(leadId, docId) => {
                        const currentLead = leads.find(l => l.id === leadId);
                        if (currentLead) updateLead(leadId, { documents: (currentLead.documents || []).map(d => d.id === docId ? { ...d, status: 'Approved' } : d) });
                        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: (prev.documents || []).map(d => d.id === docId ? { ...d, status: 'Approved' } : d) } : prev);
                    }}
                    onReject={(leadId, docId, reason) => {
                        const currentLead = leads.find(l => l.id === leadId);
                        if (currentLead) updateLead(leadId, { documents: (currentLead.documents || []).map(d => d.id === docId ? { ...d, status: 'Rejected', note: reason } : d) });
                        setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, documents: (prev.documents || []).map(d => d.id === docId ? { ...d, status: 'Rejected', note: reason } : d) } : prev);
                    }}
                    uploadingDocs={uploadingDocs}
                    isDark={isDark}
                    isAccountsManager={isAccountsManager}
                />
            )}
            {showReassignModal && leadToReassign && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn" onClick={() => setShowReassignModal(false)}>
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-[#f1f5f9] flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[#1a202c]">Reassign Lead</h3>
                            <button onClick={() => setShowReassignModal(false)} className="text-[#a0aec0] hover:text-[#1a202c] transition-colors text-2xl font-light">&times;</button>
                        </div>
                        <div className="p-8">
                            <p className="text-sm text-[#718096] mb-6">Assign <span className="font-bold text-[#1a202c]">{leadToReassign.name}</span> to a Team:</p>
                            <div className="flex flex-col gap-6">
                                <div className="max-h-[400px] overflow-y-auto flex flex-col gap-8 pr-2 custom-scrollbar">
                                    {users?.filter(u => u.role === 'Team Leader').map(leader => {
                                        const teamMembers = INITIAL_MEMBERSHIPS[leader.id] || [];
                                        return (
                                            <div key={leader.id} className="flex flex-col gap-3">
                                                {/* Team Leader Header */}
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-[#2447d7] uppercase tracking-[2px] bg-[#f0f4ff] px-2 py-0.5 rounded">Team: {leader.name}</span>
                                                    <div className="h-[1px] flex-1 bg-[#f1f5f9]"></div>
                                                </div>

                                                {/* Leader Card */}
                                                <button
                                                    onClick={() => handleReassign(leadToReassign.id, leader.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${leadToReassign.assignedStaffId === leader.id ? 'border-[#2447d7] bg-[#f0f4ff] shadow-sm' : 'border-[#f1f5f9] hover:border-[#2447d7]/30 hover:bg-[#fcfdfe]'}`}
                                                >
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-white shadow-sm" style={{ backgroundColor: leader.color || leader.bgColor || '#2447d7' }}>
                                                        {leader.initials}
                                                    </div>
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <span className={`text-[14px] font-black truncate ${leadToReassign.assignedStaffId === leader.id ? 'text-[#2447d7]' : 'text-[#1a202c]'}`}>{leader.name}</span>
                                                        <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">Team Leader</span>
                                                    </div>
                                                    {leadToReassign.assignedStaffId === leader.id && (
                                                        <div className="w-6 h-6 bg-[#2447d7] text-white rounded-full flex items-center justify-center">
                                                            <IconCheck size={14} strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </button>

                                                {/* Team Members Grid */}
                                                <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-[#f1f5f9]">
                                                    {teamMembers.map(member => (
                                                        <button
                                                            key={member.id}
                                                            onClick={() => handleReassign(leadToReassign.id, member.id)}
                                                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left group ${leadToReassign.assignedStaffId === member.id ? 'border-[#2447d7] bg-[#f0f4ff]' : 'border-transparent hover:bg-[#f8fafc]'}`}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: member.color || '#94a3b8' }}>
                                                                {member.initials}
                                                            </div>
                                                            <div className="flex flex-col min-w-0 flex-1">
                                                                <span className={`text-[13px] font-bold truncate ${leadToReassign.assignedStaffId === member.id ? 'text-[#2447d7]' : 'text-[#4a5568]'}`}>{member.name}</span>
                                                                <span className="text-[9px] font-semibold text-[#a0aec0] uppercase">Tele Agent</span>
                                                            </div>
                                                            {leadToReassign.assignedStaffId === member.id && (
                                                                <div className="w-5 h-5 bg-[#2447d7] text-white rounded-full flex items-center justify-center">
                                                                    <IconCheck size={12} strokeWidth={3} />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f8fafc] border-t border-[#f1f5f9] flex justify-end gap-3">
                            <button onClick={() => setShowReassignModal(false)} className="px-5 py-2 rounded-xl text-sm font-bold text-[#718096] hover:bg-white transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && leadToDelete && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn" onClick={() => setShowDeleteModal(false)}>
                    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp text-center" onClick={e => e.stopPropagation()}>
                        <div className="p-8 pb-6 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                                <IconTrash size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1a202c] mb-2">Delete Lead?</h3>
                                <p className="text-sm text-[#718096]">
                                    Are you sure you want to delete <strong className="text-[#1a202c]">{leadToDelete.name}</strong>? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f8fafc] border-t border-[#f1f5f9] flex justify-center gap-3">
                            <button 
                                onClick={() => setShowDeleteModal(false)} 
                                className="flex-1 px-5 py-2.5 rounded-xl text-sm font-bold text-[#4a5568] border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDeleteLead} 
                                className="flex-1 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <EditLeadModal 
                isOpen={showEditModal} 
                onClose={() => {
                    setShowEditModal(false);
                    setLeadToEdit(null);
                }} 
                lead={leadToEdit} 
                onSave={handleSaveEditedLead} 
            />
        </>
    );
};

export default ManageLeads;

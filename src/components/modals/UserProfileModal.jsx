import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
    WORKFLOW_STAGES_LIST, 
    AUDIT_LOG_ENTRIES,
    SHARED_INITIAL_USERS,
    INITIAL_MEMBERSHIPS,
    AM_MEMBERSHIPS
} from '../../data/dummyData';
import { useLeads } from '../../context/LeadsContext';
import { useTheme } from '../../context/ThemeContext';

const UserProfileModal = ({ user, onClose, onUserClick }) => {
    const navigate = useNavigate();
    const { leads } = useLeads();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = React.useState('leads');

    useEffect(() => {
        setActiveTab('leads');
    }, [user?.id]);

    if (!user) return null;

    // Filter leads based on user's role and name
    const userLeads = leads.filter(l => {
        const userName = user.name.toLowerCase();
        const leadManager = l.manager?.toLowerCase() || '';
        const leadTl = l.tl?.toLowerCase() || '';
        const leadAgent = l.agentName?.toLowerCase() || l.agent?.toLowerCase() || '';

        if (user.role === 'Accounts Manager') return leadManager === userName;
        if (user.role === 'Team Leader') return leadTl === userName;
        if (user.role === 'Tele Agent') return leadAgent === userName;
        return false;
    });

    const calculateProgress = (stage) => {
        const stages = WORKFLOW_STAGES_LIST.filter(s => s !== 'All Stages');
        const index = stages.indexOf(stage);
        if (index === -1) return 0;
        return Math.min(Math.round(((index + 1) / stages.length) * 100), 100);
    };

    const getHierarchyContext = () => {
        if (user.role === 'Tele Agent') {
            const tlId = Object.keys(INITIAL_MEMBERSHIPS).find(key => 
                INITIAL_MEMBERSHIPS[key].some(a => a.id === user.id)
            );
            const tl = SHARED_INITIAL_USERS.find(u => u.id?.toString() === tlId?.toString());
            return tl ? { reportsTo: tl, type: 'Team Leader' } : null;
        }
        if (user.role === 'Team Leader') {
            const members = INITIAL_MEMBERSHIPS[user.id] || [];
            return { members, type: 'Team Leader' };
        }
        // Account Managers do not handle teams in this model
        return null;
    };

    const hierarchy = getHierarchyContext();

    const handleLeadClick = (lead) => {
        onClose(); // Close performance popup first
        navigate('/super-admin/operational-flow', { state: { selectedLead: lead } });
    };

    // Dark mode adaptive colors (falling back to Tailwind classes for existing light mode style)
    const overlayBg = isDark ? 'bg-[#000000]/60' : 'bg-[#090b14]/60';
    const modalBg = isDark ? 'bg-[#1e2347] border-[#2c3568]' : 'bg-white border-white/20';
    const headerBg = isDark ? 'bg-[#151932] border-[#2c3568]' : 'bg-gradient-to-r from-gray-50/50 to-white border-gray-100';
    const textPrimary = isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]';
    const textSecondary = isDark ? 'text-[#94abda]' : 'text-gray-400';
    const closeBtnHover = isDark ? 'hover:bg-red-500/10 hover:text-red-400 text-[#546298]' : 'hover:bg-red-50 hover:text-red-500 text-gray-400';
    const sectionBg = isDark ? 'bg-[#242b50] border-[#2c3568]' : 'bg-white border-gray-100';
    const cardHover = isDark ? 'hover:border-[#2563eb]/50 hover:bg-[#2a3258]' : 'hover:border-[#2563eb]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]';
    const progressBg = isDark ? 'bg-[#151932]' : 'bg-gray-100';
    const emptyBorder = isDark ? 'border-[#2c3568] bg-[#1e2347]/50' : 'border-gray-100 bg-gray-50/30';
    const footerBg = isDark ? 'bg-[#151932] border-[#2c3568]' : 'bg-gray-50 border-gray-50';
    const timelineLine = isDark ? 'bg-[#2c3568]' : 'bg-gray-100';
    const activeBadge = isDark ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-[#dcfce7] text-[#16a34a]';

    return createPortal(
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${overlayBg} backdrop-blur-xl animate-fadeIn transition-all duration-500`}>
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>
            
            {/* Modal Content */}
            <div className={`relative ${modalBg} rounded-[24px] w-full max-w-[700px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp border`} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={`p-5 border-b flex justify-between items-start ${headerBg}`}>
                    <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-xl transform transition-transform duration-500 hover:rotate-2 flex-shrink-0"
                             style={{ background: user.color || '#2563eb', boxShadow: `0 10px 20px ${user.color || '#2563eb'}30` }}>
                            {user.initials || user.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                            <h2 className={`text-xl font-black tracking-tight ${textPrimary}`}>{user.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.status === 'Active' ? activeBadge : 'bg-[#2563eb]/10 text-[#2563eb]'}`}>
                                    {user.role} {user.status === 'Active' ? '• Active' : ''}
                                </span>
                                <span className={`text-[11px] font-bold ${textSecondary}`}>{user.email}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-xl transition-all ${closeBtnHover}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 pt-5 custom-scrollbar">
                    <div className="flex flex-col gap-4">
                        {/* Tab Switcher if has team */}
                        {hierarchy?.members && hierarchy.members.length > 0 && (
                            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-100 dark:border-white/5 mb-2">
                                <button 
                                    onClick={() => setActiveTab('leads')}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white dark:bg-[#2563eb] text-[#2563eb] dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Active Leads ({userLeads.length})
                                </button>
                                <button 
                                    onClick={() => setActiveTab('team')}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'team' ? 'bg-white dark:bg-[#2563eb] text-[#2563eb] dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Direct Reports ({hierarchy.members.length})
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {activeTab === 'leads' ? (
                                <>
                                    {(!hierarchy?.members || hierarchy.members.length === 0) && (
                                        <div className="flex items-center justify-between px-1">
                                            <h3 className={`text-[11px] font-black uppercase tracking-widest ${textPrimary}`}>Active Leads</h3>
                                            <span className="text-[10px] font-bold text-[#2563eb] bg-[#2563eb]/10 px-2.5 py-0.5 rounded-full">{userLeads.length} Cases</span>
                                        </div>
                                    )}
                            
                            <div className="bg-white rounded-2xl border border-[#edf2f7] overflow-hidden shadow-sm">
                                <div className="overflow-x-auto overflow-y-auto max-h-[380px] custom-scrollbar">
                                    <table className="w-full border-collapse text-left">
                                        <thead>
                                            <tr className={`${headerBg} border-b`}>
                                                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400">CLIENT</th>
                                                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400">STATUS</th>
                                                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">LOAN AMT</th>
                                                <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">PROGRESS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f7fafc]">
                                            {userLeads.length > 0 ? (
                                                userLeads.map((lead) => {
                                                    const progress = calculateProgress(lead.stage || lead.status);
                                                    return (
                                                        <tr 
                                                            key={lead.id} 
                                                            onClick={() => handleLeadClick(lead)}
                                                            className="hover:bg-[#f8faff] transition-colors cursor-pointer group"
                                                        >
                                                            <td className="px-4 py-2.5 min-w-[200px]">
                                                                <div className="flex flex-col">
                                                                    <span className={`text-[12px] font-bold group-hover:text-[#2563eb] transition-colors truncate ${textPrimary}`}>{lead.clientName || lead.name}</span>
                                                                    <span className="text-[9px] font-bold text-slate-400 tracking-tight uppercase leading-none mt-0.5">#{lead.id}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-wider whitespace-nowrap bg-blue-50/50 text-[#2563eb] border-blue-100/50`}>
                                                                    {lead.status || lead.stage}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2.5 text-center whitespace-nowrap">
                                                                <span className={`text-[11px] font-black ${textPrimary}`}>{lead.loanAmount || lead.amount || '—'}</span>
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                <div className="flex items-center justify-end gap-2.5">
                                                                    <div className={`w-16 h-1.5 rounded-full overflow-hidden ${progressBg}`}>
                                                                        <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${progress}%` }} />
                                                                    </div>
                                                                    <span className="text-[10px] font-black text-[#2563eb] w-7 text-right">{progress}%</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr><td colSpan={4} className="py-16 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">No Leads Managed</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                                </>
                            ) : (
                                <div className="bg-white rounded-2xl border border-[#edf2f7] overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto overflow-y-auto max-h-[380px] custom-scrollbar">
                                        <table className="w-full border-collapse text-left">
                                            <thead>
                                                <tr className={`${headerBg} border-b`}>
                                                    <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400">TEAM MEMBER</th>
                                                    <th className="px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f7fafc]">
                                                {hierarchy?.members?.map((m) => (
                                                    <tr 
                                                        key={m.id} 
                                                        onClick={() => onUserClick && onUserClick(m)}
                                                        className="hover:bg-[#f8faff] transition-colors cursor-pointer group"
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm" style={{ background: m.color }}>
                                                                    {m.initials}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className={`text-[13px] font-black group-hover:text-[#2563eb] transition-colors ${textPrimary}`}>{m.name}</span>
                                                                    <span className="text-[10px] font-bold text-slate-400">{m.email}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-[10px] font-black text-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">View Profile →</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer: Compact Team Context + Action */}
                <div className={`p-4 px-6 border-t flex justify-between items-center ${footerBg}`}>
                    <div className="flex items-center gap-6">
                        {hierarchy?.reportsTo && (
                            <div 
                                className="flex items-center gap-2.5 group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-1 px-2 rounded-xl transition-all"
                                onClick={() => onUserClick && onUserClick(hierarchy.reportsTo)}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ background: hierarchy.reportsTo.color }}>
                                    {hierarchy.reportsTo.initials}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[9px] font-bold text-[#2563eb] uppercase tracking-widest leading-none mb-0.5">Team Leader</p>
                                    <p className={`text-[11px] font-black group-hover:text-blue-600 transition-colors ${textPrimary}`}>{hierarchy.reportsTo.name}</p>
                                </div>
                            </div>
                        )}
                        {hierarchy?.members && hierarchy.members.length > 0 && (
                            <div 
                                className="flex items-center gap-3 pl-4 border-l border-[#edf2f7] group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-1 px-2 rounded-xl transition-all"
                                onClick={() => setActiveTab('team')}
                            >
                                <div className="flex -space-x-2">
                                    {hierarchy.members.slice(0, 3).map((m, i) => (
                                        <div key={i} className="w-7 h-7 rounded-lg border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm ring-1 ring-black/5" style={{ background: m.color, zIndex: 10 - i }}>
                                            {m.initials}
                                        </div>
                                    ))}
                                    {hierarchy.members.length > 3 && (
                                        <div className="w-7 h-7 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 shadow-sm ring-1 ring-black/5" style={{ zIndex: 0 }}>
                                            +{hierarchy.members.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <p className={`text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 transition-colors ${activeTab === 'team' ? 'text-[#2563eb]' : 'text-slate-400'}`}>Team Size</p>
                                    <p className={`text-[11px] font-black ${textPrimary}`}>{hierarchy.members.length} Agents</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={onClose} className="px-6 py-2.5 bg-[#2563eb] text-white rounded-xl text-[12px] font-black hover:bg-[#1d4ed8] transition-all shadow-lg active:scale-95 uppercase tracking-wider">
                        Close Profile
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UserProfileModal;

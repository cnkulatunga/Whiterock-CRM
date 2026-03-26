import React from 'react';
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

const UserProfileModal = ({ user, onClose }) => {
    const navigate = useNavigate();
    const { leads } = useLeads();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
            const amId = Object.keys(AM_MEMBERSHIPS).find(key => 
                AM_MEMBERSHIPS[key].includes(user.id)
            );
            const am = SHARED_INITIAL_USERS.find(u => u.id?.toString() === amId?.toString());
            const members = INITIAL_MEMBERSHIPS[user.id] || [];
            return { reportsTo: am, members, type: 'Account Manager' };
        }
        if (user.role === 'Accounts Manager') {
            const tlIds = AM_MEMBERSHIPS[user.id] || [];
            const members = SHARED_INITIAL_USERS.filter(u => tlIds.includes(u.id));
            return { members, type: 'Team Leaders' };
        }
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
    const cardHover = isDark ? 'hover:border-[#6366f1]/50 hover:bg-[#2a3258]' : 'hover:border-[#6366f1]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]';
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
            <div className={`relative ${modalBg} rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp border`} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={`p-8 border-b flex justify-between items-start ${headerBg}`}>
                    <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-2xl transform transition-transform duration-500 hover:rotate-3 flex-shrink-0"
                             style={{ background: user.color || '#6366f1', boxShadow: `0 20px 40px ${user.color || '#6366f1'}40` }}>
                            {user.initials || user.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                            <h2 className={`text-3xl font-black tracking-tight ${textPrimary}`}>{user.name}</h2>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? activeBadge : 'bg-[#6366f1]/10 text-[#6366f1]'}`}>
                                    {user.role} {user.status === 'Active' ? '• Active' : ''}
                                </span>
                                <span className={`text-[12px] font-bold ${textSecondary}`}>{user.email}</span>
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
                <div className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
                    <div className="grid grid-cols-[1.5fr_1fr] gap-8">
                        {/* Left Column: Leads */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h3 className={`text-sm font-black uppercase tracking-widest ${textPrimary}`}>Active Leads</h3>
                                <span className="text-[11px] font-bold text-[#6366f1] bg-[#6366f1]/10 px-3 py-1 rounded-full">{userLeads.length} Cases</span>
                            </div>
                            
                            <div className="grid gap-3">
                                {userLeads.length > 0 ? (
                                    userLeads.map((lead) => {
                                        const progress = calculateProgress(lead.stage || lead.status);
                                        return (
                                            <div 
                                                key={lead.id} 
                                                onClick={() => handleLeadClick(lead)}
                                                className={`p-5 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${sectionBg} ${cardHover}`}
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`text-[15px] font-black group-hover:text-[#6366f1] transition-colors ${textPrimary}`}>{lead.clientName || lead.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>{lead.stage || lead.status}</span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>{lead.loanAmount || lead.amount || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[13px] font-black text-[#6366f1]">{progress}%</span>
                                                </div>
                                                
                                                <div className={`w-full h-1.5 rounded-full overflow-hidden ${progressBg}`}>
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-1000 ease-out rounded-full"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className={`py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-[32px] ${emptyBorder}`}>
                                        <span className={`text-[11px] font-bold uppercase tracking-widest text-center px-4 ${textSecondary}`}>No Leads Currently Managed By This Profile</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Activities */}
                        <div className="space-y-6">
                            <h3 className={`text-sm font-black uppercase tracking-widest px-1 ${textPrimary}`}>Recent Activities</h3>
                            <div className="space-y-4">
                                {(AUDIT_LOG_ENTRIES || []).filter(entry => entry.name === user.name).length > 0 ? (
                                    AUDIT_LOG_ENTRIES
                                        .filter(entry => entry.name === user.name)
                                        .slice(0, 10) // Show up to 10 recent activities
                                        .map((activity, idx, arr) => (
                                            <div key={idx} className="flex gap-4 group">
                                                <div className="relative flex flex-col items-center">
                                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${activity.actionIcon === 'reject' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : (activity.actionIcon === 'verify' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-[#6366f1] shadow-[0_0_8px_#6366f1]')}`} />
                                                    {idx !== arr.length - 1 && (
                                                        <div className={`w-px flex-1 my-1 ${timelineLine}`} />
                                                    )}
                                                </div>
                                                <div className="pb-6 space-y-1">
                                                    <p className={`text-[12px] font-bold leading-tight ${textPrimary}`}>
                                                        {activity.actionText} <span className="text-[#6366f1]">#{activity.refId}</span>
                                                    </p>
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>{activity.date} • {activity.time}</p>
                                                    {activity.actionIcon === 'reject' && activity.note && (
                                                        <div className={`mt-2 p-2 rounded-lg text-[10px] font-bold ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100/50 text-red-600'} border`}>
                                                            Reason: {activity.note}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className={`py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-[32px] ${emptyBorder}`}>
                                        <span className={`text-[11px] font-bold uppercase tracking-widest text-center px-4 ${textSecondary}`}>No Recorded History</span>
                                    </div>
                                )}
                            </div>

                            {/* Hierarchy Context */}
                            {hierarchy && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className={`text-sm font-black uppercase tracking-widest px-1 mb-6 ${textPrimary}`}>Team Context</h3>
                                    <div className="space-y-4">
                                        {hierarchy.reportsTo && (
                                            <div className={`p-4 rounded-2xl border ${sectionBg} flex items-center justify-between`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ background: hierarchy.reportsTo.color }}>
                                                        {hierarchy.reportsTo.initials}
                                                    </div>
                                                    <div>
                                                        <p className={`text-[11px] font-bold ${textPrimary}`}>{hierarchy.reportsTo.name}</p>
                                                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Reports To ({hierarchy.type})</p>
                                                    </div>
                                                </div>
                                                <button className="text-[10px] font-bold text-[#6366f1] hover:underline uppercase">View</button>
                                            </div>
                                        )}
                                        {hierarchy.members && hierarchy.members.length > 0 && (
                                            <div className="space-y-2">
                                                <p className={`text-[10px] font-black uppercase tracking-widest px-1 ${textSecondary}`}>Direct Reports ({hierarchy.members.length})</p>
                                                <div className="grid gap-2">
                                                    {hierarchy.members.map(m => (
                                                        <div key={m.id} className={`p-3 rounded-xl border ${sectionBg} flex items-center justify-between group hover:border-[#6366f1]/30 transition-all`}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: m.color }}>
                                                                    {m.initials}
                                                                </div>
                                                                <span className={`text-[11px] font-bold ${textPrimary}`}>{m.name}</span>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-[#94a3b8] group-hover:text-[#6366f1] transition-colors">ACTIVE →</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-6 border-t flex justify-end items-center ${footerBg}`}>
                    <button onClick={onClose} className="px-10 py-3.5 bg-[#6366f1] text-white rounded-2xl text-sm font-bold hover:bg-[#4f46e5] transition-all shadow-[0_4px_14px_rgba(99,102,241,0.3)]">
                        Close Profile
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UserProfileModal;

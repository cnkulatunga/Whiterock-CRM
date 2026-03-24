import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { SHARED_INITIAL_USERS, INITIAL_MEMBERSHIPS, AM_MEMBERSHIPS, TL_AGENT_PERFORMANCE, WORKFLOW_STAGES_LIST } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

const PerformanceModal = ({ user, onClose, leads }) => {
    const navigate = useNavigate();
    if (!user) return null;

    // Filter leads based on user's role and name
    const userLeads = leads.filter(l => {
        if (user.role === 'Accounts Manager') return l.manager === user.name;
        if (user.role === 'Team Leader') return l.tl === user.name;
        if (user.role === 'Tele Agent') return l.agentName === user.name || l.agent === user.name;
        return false;
    });

    const calculateProgress = (stage) => {
        const stages = WORKFLOW_STAGES_LIST.filter(s => s !== 'All Stages');
        const index = stages.indexOf(stage);
        if (index === -1) return 0;
        return Math.min(Math.round(((index + 1) / stages.length) * 100), 100);
    };

    const handleLeadClick = (lead) => {
        onClose(); // Close performance popup first
        navigate('/super-admin/operational-flow', { state: { selectedLead: lead } });
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#090b14]/50 backdrop-blur-2xl animate-fadeIn transition-all duration-500">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp border border-white/20">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex gap-5 items-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
                             style={{ background: user.color || '#6366f1' }}>
                            {user.initials}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#1a202c] tracking-tight">{user.name}</h2>
                            <p className="text-sm font-bold text-[#6366f1] uppercase tracking-wider">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar pt-0">
                    {/* Leads Table */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-[#1a202c] uppercase tracking-wider mb-2">Active Portfolio</h3>
                        {userLeads.length > 0 ? (
                            userLeads.map(lead => {
                                const progress = calculateProgress(lead.stage);
                                return (
                                    <div 
                                        key={lead.id} 
                                        onClick={() => handleLeadClick(lead)}
                                        className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#6366f1]/30 hover:shadow-lg transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[14px] font-black text-[#1a202c] group-hover:text-[#6366f1] transition-colors">{lead.clientName || lead.name}</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{lead.stage}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[13px] font-black text-[#6366f1]">{progress}%</span>
                                            </div>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-1000 ease-out rounded-full"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-[#64748b]">ID: {lead.id}</span>
                                            <span className="text-[11px] font-black text-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                View Details <span className="text-sm">→</span>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                <span className="text-[13px] text-[#a0aec0] font-medium">No leads currently assigned to this portfolio</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-8 py-3 bg-[#1a202c] text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                        Close Profile
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const HierarchyCard = ({ title, items, selectedId, onSelect, onViewPerformance, emptyText }) => {
    // Determine header labels based on title to keep it flexible
    const isAgentTable = title.toLowerCase().includes('agent');
    const isTlTable = title.toLowerCase().includes('team leader');
    
    const nameHeader = isAgentTable ? 'AGENT NAME' : (isTlTable ? 'LEADER NAME' : 'MANAGER NAME');
    const stat1Header = 'ACTIVE LEADS';
    const stat2Header = 'CLOSED DEALS';

    return (
        <div className="bg-white rounded-[24px] border border-[#f1f5f9] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full min-h-[450px]">
            <h3 className="text-[15px] font-black text-[#1a202c] mb-6 tracking-tight">{title}</h3>
            
            {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[13px] text-[#a0aec0] italic">
                    {emptyText}
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[2fr_1fr_1fr] pb-4 px-2 border-b border-gray-50 mb-2">
                        <span className="text-[10px] font-black text-[#94a3b8] tracking-[0.1em]">{nameHeader}</span>
                        <span className="text-[10px] font-black text-[#94a3b8] tracking-[0.1em] text-center">{stat1Header}</span>
                        <span className="text-[10px] font-black text-[#94a3b8] tracking-[0.1em] text-center">{stat2Header}</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 custom-scrollbar">
                        {items.map((item) => {
                            const isSelected = selectedId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    className={`grid grid-cols-[2fr_1fr_1fr] items-center p-3 rounded-2xl transition-all duration-300 group ${
                                        isSelected 
                                        ? 'bg-[#f8faff] shadow-[0_4px_20px_rgba(36,71,215,0.08)]' 
                                        : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {/* Name Column */}
                                    <div className="flex items-center gap-4">
                                        <div 
                                            onClick={() => onSelect && onSelect(item.id)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[13px] font-black shrink-0 shadow-sm cursor-${onSelect ? 'pointer' : 'default'} transform transition-transform group-hover:scale-110`}
                                            style={{ 
                                                background: item.color || '#e2e8f0', 
                                                color: item.textColor || '#ffffff',
                                                boxShadow: `0 4px 12px ${item.color}40`
                                            }}>
                                            {item.initials}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span 
                                                onClick={() => onViewPerformance && onViewPerformance(item)}
                                                className="text-[14px] font-black text-[#1a202c] truncate cursor-pointer hover:text-[#6366f1] transition-colors"
                                            >
                                                {item.name}
                                            </span>
                                            <button 
                                                onClick={() => onViewPerformance && onViewPerformance(item)}
                                                className="text-[11px] font-bold text-[#94a3b8] flex items-center gap-1 hover:text-[#6366f1] transition-colors mt-0.5"
                                            >
                                                View leads <span className="text-[12px]">→</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stat 1: Ongoing */}
                                    <div className="text-center">
                                        <span className={`text-[15px] font-black ${isSelected ? 'text-[#2447d7]' : 'text-[#475569]'}`}>
                                            {item.ongoing}
                                        </span>
                                    </div>

                                    {/* Stat 2: Confirmed */}
                                    <div className="text-center">
                                        <span className={`text-[15px] font-black ${isSelected ? 'text-[#2447d7]' : 'text-[#475569]'}`}>
                                            {item.confirmed}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const StaffHierarchy = () => {
    // 1. Prepare Data
    const accountsManagers = SHARED_INITIAL_USERS.filter(u => u.role === 'Accounts Manager');
    const teamLeaders = SHARED_INITIAL_USERS.filter(u => u.role === 'Team Leader');

    const getAgentStats = (name) => {
        const perf = TL_AGENT_PERFORMANCE.find(p => p.name === name);
        if (perf) return { ongoing: perf.activeLeads, confirmed: perf.closedDeals };
        return { ongoing: Math.floor(name.length * 4.5), confirmed: Math.floor(name.length * 1.5) };
    };

    const getTlStats = (tlId) => {
        const agents = INITIAL_MEMBERSHIPS[tlId] || [];
        let ongoing = 0; let confirmed = 0;
        agents.forEach(a => {
            const st = getAgentStats(a.name);
            ongoing += st.ongoing;
            confirmed += st.confirmed;
        });
        if (agents.length === 0) { ongoing = 18; confirmed = 6; }
        return { ongoing, confirmed };
    };

    const getAmStats = (amId) => {
        let ongoing = 0; let confirmed = 0;
        const tlIds = AM_MEMBERSHIPS[amId] || [];
        tlIds.forEach(id => {
            const st = getTlStats(id);
            ongoing += st.ongoing;
            confirmed += st.confirmed;
        });
        return { ongoing, confirmed };
    };

    // Enhance original arrays with calculated stats
    const amList = accountsManagers.map(am => ({
        ...am,
        textColor: '#1a202c',
        ...getAmStats(am.id)
    }));

    const tlList = teamLeaders.map(tl => ({
        ...tl,
        textColor: '#1a202c',
        ...getTlStats(tl.id)
    }));

    // 2. State
    const [selectedAm, setSelectedAm] = useState(amList[0]?.id || null);

    // All TLs visible regardless of selected AM
    const currentTls = tlList;

    // Auto-select first TL on load
    const [selectedTl, setSelectedTl] = useState(tlList[0]?.id || null);

    // Get Agents for selected TL
    const rawAgents = selectedTl ? (INITIAL_MEMBERSHIPS[selectedTl] || []) : [];
    const currentAgents = rawAgents.map(ag => {
        const stats = getAgentStats(ag.name);
        return {
            ...ag,
            textColor: '#1a202c',
            ongoing: stats.ongoing,
            confirmed: stats.confirmed
        };
    });

    // 4. Handlers
    const handleAmSelect = (id) => {
        setSelectedAm(id);
        // Keep current TL selection — all TLs always visible
    };

    const handleTlSelect = (id) => {
        setSelectedTl(id);
    };

    const { leads } = useLeads();
    const [performanceUser, setPerformanceUser] = useState(null);

    return (
        <section className="animate-slideUp [animation-delay:600ms] [animation-fill-mode:both] mt-6">
            <div className="mb-4">
                <h2 className="text-[16px] font-bold text-[#1a202c]">Organization Hierarchy</h2>
                <p className="text-[12px] text-[#718096]">Drill down to view team leads and performance</p>
            </div>
            
            <div className="grid grid-cols-3 gap-5 xl:grid-cols-1">
                {/* Level 1: Account Managers */}
                <div className="animate-fadeIn">
                    <HierarchyCard 
                        title="1. Account Managers" 
                        items={amList} 
                        selectedId={selectedAm} 
                        onSelect={handleAmSelect} 
                        onViewPerformance={setPerformanceUser}
                        emptyText="No Account Managers found."
                    />
                </div>

                {/* Level 2: Team Leaders */}
                <div className="animate-fadeIn [animation-delay:100ms] [animation-fill-mode:both]">
                    <HierarchyCard 
                        title="2. Team Leaders" 
                        items={currentTls} 
                        selectedId={selectedTl} 
                        onSelect={handleAmSelect ? handleTlSelect : null} 
                        onViewPerformance={setPerformanceUser}
                        emptyText={selectedAm ? "No Team Leaders found for this manager." : "Select an Account Manager first."}
                    />
                </div>

                {/* Level 3: Tele Agents */}
                <div className="animate-fadeIn [animation-delay:200ms] [animation-fill-mode:both]">
                    <HierarchyCard 
                        title="3. Tele Agents" 
                        items={currentAgents} 
                        selectedId={null} 
                        onSelect={null} 
                        onViewPerformance={setPerformanceUser}
                        emptyText={selectedTl ? "No Tele Agents in this team." : "Select a Team Leader first."}
                    />
                </div>
            </div>

            {/* Performance Modal */}
            {performanceUser && (
                <PerformanceModal 
                    user={performanceUser} 
                    onClose={() => setPerformanceUser(null)} 
                    leads={leads}
                />
            )}
        </section>
    );
};

export default StaffHierarchy;

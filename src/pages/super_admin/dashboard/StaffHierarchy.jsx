import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { SHARED_INITIAL_USERS, INITIAL_MEMBERSHIPS, AM_MEMBERSHIPS, TL_AGENT_PERFORMANCE, WORKFLOW_STAGES_LIST, AUDIT_LOG_ENTRIES } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';

import UserProfileModal from '../../../components/modals/UserProfileModal';

const HierarchyCard = ({ title, items, selectedId, onSelect, onViewPerformance, emptyText }) => {
    const isAgentTable = title.toLowerCase().includes('agent');
    const isTlTable = title.toLowerCase().includes('team leader');
    
    const nameHeader = isAgentTable ? 'AGENT NAME' : (isTlTable ? 'LEADER NAME' : 'MANAGER NAME');
    const stat1Header = 'ACTIVE LEADS';
    const stat2Header = 'CLOSED DEALS';

    return (
        <div className="bg-white rounded-xl border border-[#f1f5f9] p-4 shadow-sm flex flex-col h-full min-h-[320px]">
            <h3 className="text-[13px] font-bold text-[#1a202c] mb-4 tracking-tight uppercase">{title}</h3>
            
            {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[13px] text-[#a0aec0] italic">
                    {emptyText}
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
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
                                    className={`grid grid-cols-[2fr_1fr_1fr] items-center p-2 rounded-xl transition-all duration-300 group ${
                                        isSelected 
                                        ? 'bg-[#f8faff] shadow-sm' 
                                        : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div 
                                            onClick={() => onSelect && onSelect(item.id)}
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm cursor-${onSelect ? 'pointer' : 'default'} transform transition-transform group-hover:scale-105`}
                                            style={{ 
                                                background: item.color || '#e2e8f0', 
                                                color: item.textColor || '#ffffff',
                                            }}>
                                            {item.initials}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span 
                                                onClick={() => onViewPerformance && onViewPerformance(item)}
                                                className="text-[12px] font-bold text-[#1a202c] truncate cursor-pointer hover:text-[#6366f1] transition-colors"
                                            >
                                                {item.name}
                                            </span>
                                            <button 
                                                onClick={() => onViewPerformance && onViewPerformance(item)}
                                                className="text-[10px] font-semibold text-[#94a3b8] flex items-center gap-1 hover:text-[#6366f1] transition-colors"
                                            >
                                                View <span className="text-[11px]">→</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <span className={`text-[13px] font-bold ${isSelected ? 'text-[#2447d7]' : 'text-[#475569]'}`}>
                                            {item.ongoing}
                                        </span>
                                    </div>

                                    <div className="text-center">
                                        <span className={`text-[13px] font-bold ${isSelected ? 'text-[#2447d7]' : 'text-[#475569]'}`}>
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
    const [users, setUsers] = useState(SHARED_INITIAL_USERS);
    const { leads } = useLeads();
    const [performanceUser, setPerformanceUser] = useState(null);

    const accountsManagers = users.filter(u => u.role === 'Accounts Manager');
    const teamLeaders = users.filter(u => u.role === 'Team Leader');

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

    const [selectedAm, setSelectedAm] = useState(amList[0]?.id || null);
    const [selectedTl, setSelectedTl] = useState(tlList[0]?.id || null);

    const currentTls = tlList;
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

    const handleAmSelect = (id) => setSelectedAm(id);
    const handleTlSelect = (id) => setSelectedTl(id);

    return (
        <section className="animate-slideUp [animation-delay:600ms] [animation-fill-mode:both] mt-4">
            <div className="mb-3 border-l-2 border-[#2447d7] pl-3">
                <h2 className="text-[14px] font-bold text-[#1a202c]">Organization Hierarchy</h2>
                <p className="text-[10px] text-[#718096]">Drill down to view team leads and performance</p>
            </div>
            
            <div className="grid grid-cols-3 gap-5 xl:grid-cols-1">
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

                <div className="animate-fadeIn [animation-delay:100ms] [animation-fill-mode:both]">
                    <HierarchyCard 
                        title="2. Team Leaders" 
                        items={currentTls} 
                        selectedId={selectedTl} 
                        onSelect={handleTlSelect} 
                        onViewPerformance={setPerformanceUser}
                        emptyText={selectedAm ? "No Team Leaders found for this manager." : "Select an Account Manager first."}
                    />
                </div>

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

            {performanceUser && (
                <UserProfileModal 
                    user={performanceUser} 
                    onClose={() => setPerformanceUser(null)} 
                />
            )}
        </section>
    );
};

export default StaffHierarchy;

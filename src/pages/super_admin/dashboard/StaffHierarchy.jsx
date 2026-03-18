import React, { useState } from 'react';
import { SHARED_INITIAL_USERS, INITIAL_MEMBERSHIPS, AM_MEMBERSHIPS, TL_AGENT_PERFORMANCE } from '../../../data/dummyData';

const HierarchyCard = ({ title, items, selectedId, onSelect, emptyText }) => {
    return (
        <div className="bg-white rounded-2xl border border-[#edf2f7] p-5 shadow-sm flex flex-col h-full min-h-[350px]">
            <h3 className="text-[14px] font-bold text-[#1a202c] mb-4">{title}</h3>
            {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[13px] text-[#a0aec0] italic">
                    {emptyText}
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
                    {items.map((item) => {
                        const isSelected = selectedId === item.id;
                        return (
                            <div
                                key={item.id}
                                onClick={() => onSelect && onSelect(item.id)}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-${onSelect ? 'pointer' : 'default'} ${
                                    isSelected 
                                    ? 'bg-[#f0f4ff] border-[#2447d7] shadow-md scale-[1.02]' 
                                    : 'bg-white border-[#f1f5f9] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                                         style={{ 
                                             background: item.color || '#e2e8f0', 
                                             color: item.textColor || '#1a202c' 
                                         }}>
                                        {item.initials}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold text-[#1a202c]">{item.name}</span>
                                        <span className="text-[11px] text-[#718096] font-medium">{item.role}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 text-right">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-[#a0aec0] uppercase font-semibold">Ongoing</span>
                                        <span className={`text-[13px] font-bold ${isSelected ? 'text-[#2447d7]' : 'text-[#4a5568]'}`}>
                                            {item.ongoing}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-[#a0aec0] uppercase font-semibold">Confirmed</span>
                                        <span className="text-[13px] font-bold text-[#059669]">
                                            {item.confirmed}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
    
    // Derived selected AM's TLs
    const currentTlIds = selectedAm ? (AM_MEMBERSHIPS[selectedAm] || []) : [];
    const currentTls = currentTlIds.map(id => tlList.find(tl => tl.id === id)).filter(Boolean);

    // Automatically select the first TL for the AM to make UI lively, or null to wait for click
    // Adjust when selectedAm changes
    const [selectedTl, setSelectedTl] = useState(null);

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
        setSelectedTl(null); // reset TL when AM changes
    };

    const handleTlSelect = (id) => {
        setSelectedTl(id);
    };

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
                        emptyText={selectedTl ? "No Tele Agents in this team." : "Select a Team Leader first."}
                    />
                </div>
            </div>
        </section>
    );
};

export default StaffHierarchy;

import React, { useState } from 'react';
import { MOCK_LEADS, WORKFLOW_STAGES_LIST as STAGES, SHARED_INITIAL_USERS } from '../../../data/dummyData';

const STAGE_META = {
    'Document Collection': { color: '#2447d7', bg: '#f0f4ff' },
    'Document Verification Done': { color: '#10b981', bg: '#ecfdf5' },
    'Lender Selection': { color: '#8b5cf6', bg: '#f5f3ff' },
    'Final Review': { color: '#f59e0b', bg: '#fffbeb' },
    'Completed': { color: '#059669', bg: '#f0fdf4' },
    'Rejected': { color: '#dc2626', bg: '#fef2f2' },
};

/* ─── COMPONENTS ─── */
const StageBadge = ({ stage }) => {
    const meta = STAGE_META[stage] || { color: '#718096', bg: '#f7fafc' };
    return (
        <span 
            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
            style={{ color: meta.color, backgroundColor: meta.bg, borderColor: `${meta.color}20` }}
        >
            {stage}
        </span>
    );
};

const StageProgressBar = ({ stage, progress }) => {
    const meta = STAGE_META[stage] || { color: '#cbd5e0' };
    return (
        <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
            <div className="flex justify-between items-center text-[9px] font-bold text-[#a0aec0]">
                <span>PROGRESS</span>
                <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                <div 
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: meta.color }}
                />
            </div>
        </div>
    );
};

const LeadRow = ({ lead, idx }) => {
    const initials = lead.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const agent = SHARED_INITIAL_USERS.find(u => u.id === lead.assignedStaffId) || { name: lead.agentName || 'Unknown', color: '#64748b' };
    const agentInitials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    return (
        <tr className="border-b border-[#f7fafc] last:border-0 hover:bg-[#fcfdfe] transition-colors animate-rowIn" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
            <td className="py-4 px-6 md:px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f0f4ff] border border-[#d9e8ff] flex items-center justify-center text-[13px] font-black text-[#2447d7] shadow-sm">
                        {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-[#1a202c] truncate">{lead.name}</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-[#2447d7] tracking-wider uppercase font-mono">{lead.leadId}</span>
                            <span className="text-[10px] text-[#cbd5e1]">•</span>
                            <span className="text-[10px] font-bold text-[#718096] truncate">{lead.businessName}</span>
                        </div>
                    </div>
                </div>
            </td>
            
            <td className="py-4 px-6 md:hidden">
                <div className="flex items-center gap-2.5">
                    <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                        style={{ backgroundColor: agent.color || '#2447d7', boxShadow: `0 4px 10px ${(agent.color || '#2447d7')}33` }}
                    >
                        {agentInitials}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#4a5568]">{agent.name}</span>
                        <span className="text-[9px] font-black text-[#a0aec0] uppercase tracking-tighter">TELE AGENT</span>
                    </div>
                </div>
            </td>

            <td className="py-4 px-6 sm:hidden">
                <StageBadge stage={lead.stage} />
            </td>

            <td className="py-4 px-6 lg:hidden">
                <StageProgressBar stage={lead.stage} progress={lead.progress} />
            </td>

            <td className="py-4 px-6 text-right">
                <button className="p-2 rounded-lg bg-[#f8faff] text-[#2447d7] hover:bg-[#2447d7] hover:text-white border border-[#ebf0ff] transition-all duration-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

/* ─── MAIN PAGE ─── */
const LeadMonitoring = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('All Agents');
    const [selectedStage, setSelectedStage] = useState('All Stages');

    const agentList = ['All Agents', ...new Set(MOCK_LEADS.map(l => l.agentName).filter(Boolean))];

    const filteredLeads = MOCK_LEADS.filter(lead => {
        const nameMatch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
        const idMatch = lead.leadId.toLowerCase().includes(searchTerm.toLowerCase());
        const bizMatch = lead.businessName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSearch = nameMatch || idMatch || bizMatch;
        const matchesAgent = selectedAgent === 'All Agents' || lead.agentName === selectedAgent;
        const matchesStage = selectedStage === 'All Stages' || lead.stage === selectedStage;
        
        return matchesSearch && matchesAgent && matchesStage;
    });

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">
            
            {/* ── HEADER ── */}
            <header className="flex flex-col gap-1 animate-headerDrop">
                <h1 className="text-[1.6rem] font-black text-[#1a202c]">Lead Status Monitoring</h1>
                <p className="text-sm text-[#718096] font-medium">Real-time tracking of all active leads across the operational pipeline.</p>
            </header>

            {/* ── FILTERS ── */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] p-6 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.02)] flex flex-col gap-6 animate-slideUp">
                <div className="flex justify-between items-center gap-4 lg:flex-col lg:items-stretch">
                    
                    <div className="flex-1 flex items-center gap-3 bg-[#f8fafc] border border-[#edf2f7] px-4 py-2.5 rounded-xl transition-all focus-within:border-[#2447d7] focus-within:bg-white focus-within:shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2.5" width="18" height="18">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search by name, ID or business..."
                            className="bg-transparent border-none outline-none text-[13px] font-medium text-[#1a202c] w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 sm:flex-col">
                        <div className="relative group min-w-[180px]">
                            <select 
                                className="w-full bg-white border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5568] appearance-none cursor-pointer outline-none hover:border-[#2447d7]/30 transition-all shadow-sm"
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                            >
                                {agentList.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-hover:text-[#2447d7] transition-colors">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>

                        <div className="relative group min-w-[180px]">
                            <select 
                                className="w-full bg-white border border-[#edf2f7] px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5568] appearance-none cursor-pointer outline-none hover:border-[#2447d7]/30 transition-all shadow-sm"
                                value={selectedStage}
                                onChange={(e) => setSelectedStage(e.target.value)}
                            >
                                {['All Stages', ...STAGES].map(s => <option key={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a0aec0] group-hover:text-[#2447d7] transition-colors">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex items-center justify-between border-t border-[#f7fafc] pt-5 sm:flex-col sm:items-start sm:gap-6">
                    <div className="flex items-center gap-6 md:gap-4 flex-wrap">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#a0aec0] uppercase tracking-wider">TOTAL ACTIVE</span>
                            <span className="text-lg font-black text-[#1a202c]">{filteredLeads.length}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-[#edf2f7] sm:hidden"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#a0aec0] uppercase tracking-wider">ON TRACK</span>
                            <span className="text-lg font-black text-[#10b981]">{filteredLeads.filter(l => l.progress > 40).length}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-[#edf2f7] sm:hidden"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#a0aec0] uppercase tracking-wider">NEEDS ATTENTION</span>
                            <span className="text-lg font-black text-[#dc2626]">{filteredLeads.filter(l => l.progress && l.progress < 20).length}</span>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 bg-[#1a202c] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold hover:bg-[#2d3748] transition-all shadow-lg active:scale-95">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Export Report
                    </button>
                </div>
            </section>

            {/* ── TABLE ── */}
            <section className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] overflow-hidden animate-slideUp [animation-delay:200ms] [animation-fill-mode:both]">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#fcfdfe] border-b border-[#f7fafc]">
                                <th className="text-left py-4 px-6 text-[10px] font-black text-[#a0aec0] uppercase tracking-widest md:px-4">LEAD IDENTITY</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black text-[#a0aec0] uppercase tracking-widest md:hidden">ASSIGNED AGENT</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black text-[#a0aec0] uppercase tracking-widest sm:hidden">WORKFLOW STAGE</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black text-[#a0aec0] uppercase tracking-widest lg:hidden">COMPLETION</th>
                                <th className="text-right py-4 px-6 text-[10px] font-black text-[#a0aec0] uppercase tracking-widest">VIEW</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.length > 0 ? (
                                filteredLeads.map((lead, idx) => (
                                    <LeadRow key={lead.id} lead={lead} idx={idx} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-[#f8fafc] rounded-full flex items-center justify-center text-[#cbd5e1]">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                            </div>
                                            <span className="text-sm font-bold text-[#a0aec0]">No leads found matching your criteria</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <footer className="p-6 bg-[#fcfdfe] border-t border-[#f7fafc] flex justify-between items-center sm:flex-col sm:gap-4">
                    <span className="text-[12px] font-medium text-[#718096]">Showing <span className="text-[#1a202c] font-black">{filteredLeads.length}</span> active operational records</span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg border border-[#edf2f7] flex items-center justify-center text-[#a0aec0] hover:bg-white hover:text-[#2447d7] transition-all disabled:opacity-30" disabled>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-[#2447d7] flex items-center justify-center text-white text-[11px] font-black shadow-md shadow-[#2447d7]/20">1</div>
                        <button className="w-8 h-8 rounded-lg border border-[#edf2f7] flex items-center justify-center text-[#a0aec0] hover:bg-white hover:text-[#2447d7] transition-all disabled:opacity-30" disabled>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                </footer>
            </section>

        </div>
    );
};

export default LeadMonitoring;

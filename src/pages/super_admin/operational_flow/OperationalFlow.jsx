import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';
import { WORKFLOW_STAGES } from '../../../data/dummyData';
import { useLeads } from '../../../context/LeadsContext';
import LeadDetails from '../../tele_agent/leads/LeadDetails';
import { useTasks } from '../../../context/TasksContext';

// Map CRM workflow stages to the 4 operational flow buckets
const STAGE_TO_OP = {
    'Document Collection': 'lead_gather',
    'Document Verification Done': 'doc_collect',
    'Lender Selection': 'lender_select',
    'Completed': 'closed',
    'Rejected': 'rejected',
};


/* ─── STYLES & ANIMATIONS ─────────────────────── */
const STYLES = `
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
@keyframes pulse { 0% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.05); opacity: 0.8 } 100% { transform: scale(1); opacity: 1 } }
@keyframes lineGrow { from { width: 0 } to { width: 100% } }

.flow-node { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.flow-node:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(99,102,241,0.25); }

.flow-step-line { position: absolute; top: 50%; height: 2px; background: linear-gradient(90deg, #6366f1, #10b981); z-index: 0; animation: lineGrow 0.8s ease-out; }

.glass-card { 
    backdrop-filter: blur(12px); 
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
}

.of-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
}

.of-table th {
    padding: 12px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
}

.of-table tr {
    transition: all 0.2s ease;
}

.of-table td {
    padding: 16px 20px;
    background: var(--row-bg);
    border-top: 1px solid var(--row-border);
    border-bottom: 1px solid var(--row-border);
}

.of-table td:first-child {
    border-left: 1px solid var(--row-border);
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
}

.of-table td:last-child {
    border-right: 1px solid var(--row-border);
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
}

@media (max-width: 768px) {
    .of-table td, .of-table th {
        padding: 12px 14px;
        font-size: 12px;
    }
    .pipeline-container {
        padding: 20px !important;
    }
    .pipeline-item {
        width: 80px !important;
    }
    .pipeline-circle {
        width: 40px !important;
        height: 40px !important;
        font-size: 14px !important;
    }
    .pipeline-label {
        font-size: 11px !important;
    }
    .pipeline-desc {
        display: none !important;
    }
}
.of-table tr:hover td {
    background: var(--row-hover-bg);
    border-color: var(--row-hover-border);
    transform: translateY(-1px);
}
`;

if (typeof document !== 'undefined' && !document.getElementById('of-flow-styles')) {
    const s = document.createElement('style');
    s.id = 'of-flow-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
}


/* ─── COMPONENTS ──────────────────────────────── */


const StageBadge = ({ stageId, isDark, compact = false }) => {
    let stage = WORKFLOW_STAGES.find(s => s.id === stageId);
    let label = stage?.label;
    let color = stage?.color;

    if (stageId === 'won' || stageId === 'closed') {
        label = 'Confirmed';
        color = '#10b981';
    } else if (stageId === 'rejected') {
        label = 'Rejected';
        color = '#ef4444';
    }

    if (!stage && stageId !== 'won' && stageId !== 'rejected') {
        stage = WORKFLOW_STAGES[0];
        label = stage.label;
        color = stage.color;
    }

    return (
        <span style={{ 
            fontSize: compact ? '9px' : '10px', 
            fontWeight: 900, 
            padding: compact ? '2px 6px' : '3px 10px', 
            borderRadius: '999px', 
            background: isDark ? `${color}20` : `${color}15`,
            color: color,
            border: `1px solid ${isDark ? `${color}40` : `${color}30`}`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-block',
            whiteSpace: 'nowrap'
        }}>
            {label}
        </span>
    );
};

const FlowArrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" style={{ color: '#94a3b8' }}>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const OperationalFlow = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { leads } = useLeads();
    const { tasks, setTasks } = useTasks();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [filterStage, setFilterStage] = useState('All');
    const [viewMode, setViewMode] = useState(window.innerWidth > 768 ? 'table' : 'grid');
    const [selectedClient, setSelectedClient] = useState(null);

    // Auto-select lead if passed from navigation state (e.g., from Performance Popup)
    useEffect(() => {
        if (location.state?.selectedLead) {
            setSelectedClient(location.state.selectedLead);
            // Clear state after reading to avoid re-selection on refresh if not desired, 
            // though usually it's fine.
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Filter leads directly since we removed mapLeadToOp
    const filteredClients = leads.filter(c => {
        const matchesSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
                             (c.agentName || c.agent || '').toLowerCase().includes(search.toLowerCase()) ||
                             (c.tl || '').toLowerCase().includes(search.toLowerCase()) ||
                             (c.businessName && c.businessName.toLowerCase().includes(search.toLowerCase()));
        
        const mappedStage = STAGE_TO_OP[c.stage] || 'lead_gather';
        let matchesStage = filterStage === 'All' || mappedStage === filterStage;
        if (filterStage === 'closed') {
            matchesStage = mappedStage === 'won' || mappedStage === 'rejected';
        }

        return matchesSearch && matchesStage;
    });

    if (selectedClient) {
        return (
            <div className="animate-fadeIn">
                <LeadDetails 
                    lead={selectedClient} 
                    onBack={() => setSelectedClient(null)} 
                    tasks={tasks}
                    setTasks={setTasks}
                />
            </div>
        );
    }


    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '32px', 
            fontFamily: "'Sora', sans-serif", 
            animation: 'fadeIn 0.4s ease-out',
            '--row-bg': isDark ? '#1e2347' : '#fff',
            '--row-border': isDark ? '#2c3568' : '#e8edf5',
            '--row-hover-bg': isDark ? '#242b58' : '#f8faff',
            '--row-hover-border': isDark ? '#3d4a8f' : '#cbd5e1',
        }}>
            {/* Header Area */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: window.innerWidth > 768 ? 'flex-start' : 'stretch', 
                flexDirection: window.innerWidth > 768 ? 'row' : 'column',
                gap: '20px' 
            }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#e4ecff' : '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                        Operational Flow
                    </h1>
                    <p style={{ fontSize: '15px', color: isDark ? '#94abda' : '#64748b', fontWeight: 500, margin: '6px 0 0' }}>
                        Monitor the complete lifecycle of client engagement.
                    </p>
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    alignItems: 'center',
                    flexDirection: window.innerWidth > 768 ? 'row' : 'column-reverse',
                    width: window.innerWidth > 768 ? 'auto' : '100%'
                }}>
                    {/* View Toggle */}
                    <div style={{ 
                        background: isDark ? '#1e2347' : '#fff', 
                        padding: '4px', 
                        borderRadius: '12px', 
                        border: `1px solid ${isDark ? '#2c3568' : '#e2e8f0'}`,
                        display: 'flex',
                        gap: '4px',
                        width: window.innerWidth > 768 ? 'auto' : '100%'
                    }}>
                        <button 
                            onClick={() => setViewMode('grid')}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: viewMode === 'grid' ? (isDark ? '#2c3568' : '#f1f5f9') : 'transparent',
                                color: viewMode === 'grid' ? (isDark ? '#fff' : '#0f172a') : '#94a3b8',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 700,
                                transition: 'all 0.2s'
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                            Grid
                        </button>
                        <button 
                            onClick={() => setViewMode('table')}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: viewMode === 'table' ? (isDark ? '#2c3568' : '#f1f5f9') : 'transparent',
                                color: viewMode === 'table' ? (isDark ? '#fff' : '#0f172a') : '#94a3b8',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 700,
                                transition: 'all 0.2s'
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                            Table
                        </button>
                    </div>

                    <div style={{ position: 'relative', width: '100%' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search client, agent or TL..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                background: isDark ? '#1e2347' : '#fff',
                                border: `2px solid ${isDark ? '#2c3568' : '#e2e8f0'}`,
                                borderRadius: '14px',
                                padding: '12px 16px 12px 48px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: isDark ? '#e4ecff' : '#0f172a',
                                outline: 'none',
                                width: '100%',
                                maxWidth: window.innerWidth > 768 ? '320px' : 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Workflow Progress Visualizer */}
            <div className="pipeline-container" style={{ 
                background: isDark ? 'linear-gradient(135deg, #1e2347 0%, #161a35 100%)' : '#fff',
                borderRadius: '24px',
                padding: '32px',
                border: `1px solid ${isDark ? '#2c3568' : '#e8edf5'}`,
                boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 10px 30px rgba(99,102,241,0.05)',
                overflowX: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: window.innerWidth > 768 ? '900px' : 'auto', position: 'relative' }}>
                    {/* Background Line */}
                    <div style={{ position: 'absolute', top: window.innerWidth > 768 ? '24px' : '20px', left: '50px', right: '50px', height: '4px', background: isDark ? '#2c3568' : '#f1f5f9', borderRadius: '2px', zIndex: 0 }} />
                    
                    {WORKFLOW_STAGES.map((stage, idx) => {
                        const isActive = filterStage === stage.id;
                        return (
                            <div key={stage.id} className="pipeline-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 1, width: '120px', cursor: 'pointer' }} onClick={() => setFilterStage(stage.id === filterStage ? 'All' : stage.id)}>
                                <div className="pipeline-circle" style={{ 
                                    width: '52px', 
                                    height: '52px', 
                                    borderRadius: '18px', 
                                    background: isActive ? stage.color : (isDark ? '#1e2347' : '#fff'),
                                    border: `4px solid ${isActive ? (isDark ? '#2c3568' : '#fff') : (isDark ? '#2c3568' : '#f1f5f9')}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isActive ? '#fff' : (isDark ? '#546298' : '#94a3b8'),
                                    boxShadow: isActive ? `0 8px 24px ${stage.color}60` : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    position: 'relative'
                                }}>
                                    <span style={{ fontWeight: 900, fontSize: '18px' }}>{idx + 1}</span>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="pipeline-label" style={{ fontSize: '13px', fontWeight: 800, color: isActive ? stage.color : (isDark ? '#e4ecff' : '#0f172a') }}>{stage.label}</div>
                                    <div className="pipeline-desc" style={{ fontSize: '10px', fontWeight: 600, color: isDark ? '#546298' : '#adb5bd', marginTop: '2px', lineHeight: 1.2 }}>{stage.description}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px' }}>
                    {filteredClients.map((client, idx) => (
                        <div key={client.id} className="flow-node" style={{
                            background: isDark ? '#1e2347' : '#fff',
                            borderRadius: '20px',
                            border: `1px solid ${isDark ? '#2c3568' : '#e8edf5'}`,
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            animation: `slideUp 0.4s ease-out ${idx * 0.1}s both`
                        }}>
                            {/* Client Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 900, color: '#2447d7', letterSpacing: '0.05em', marginBottom: '2px', display: 'block' }}>Client Lead</span>
                                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#e4ecff' : '#1a202c', margin: 0, letterSpacing: '-0.3px' }}>{client.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                        <div style={{ fontSize: '11px', color: '#a0aec0', fontWeight: 600 }}>Active {client.lastActive}</div>
                                        {client.businessName && (
                                            <>
                                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e0' }} />
                                                <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{client.businessName}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <StageBadge stageId={STAGE_TO_OP[client.stage]} isDark={isDark} />
                            </div>

                            <div style={{ 
                                display: 'grid',
                                gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr 1fr' : '1fr',
                                gap: '12px', 
                                padding: '16px', 
                                background: isDark ? 'rgba(99,102,241,0.05)' : '#f8faff', 
                                borderRadius: '16px',
                                border: `1px solid ${isDark ? 'rgba(99,102,241,0.1)' : '#eff2ff'}`,
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '9px', color: '#a0aec0', fontWeight: 900, textTransform: 'uppercase', trackingWidest: '0.05em' }}>Tele Agent</span>
                                    <span style={{ fontSize: '12px', color: isDark ? '#e4ecff' : '#1a202c', fontWeight: 700 }}>{client.agentName || client.agent}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '9px', color: '#a0aec0', fontWeight: 900, textTransform: 'uppercase', trackingWidest: '0.05em' }}>Team Leader</span>
                                    <span style={{ fontSize: '12px', color: isDark ? '#e4ecff' : '#1a202c', fontWeight: 700 }}>{client.tl}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '9px', color: '#a0aec0', fontWeight: 900, textTransform: 'uppercase', trackingWidest: '0.05em' }}>Account Mgr</span>
                                    <span style={{ fontSize: '12px', color: isDark ? '#e4ecff' : '#1a202c', fontWeight: 700 }}>{client.manager}</span>
                                </div>
                            </div>

                            {/* Progress Tracker */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#a0aec0', textTransform: 'uppercase', trackingWidest: '0.05em' }}>Loan Progress</span>
                                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#2447d7' }}>{client.progress}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: isDark ? '#2c3568' : '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${client.progress}%`, 
                                        height: '100%', 
                                        background: 'linear-gradient(90deg, #6366f1, #10b981)', 
                                        borderRadius: '4px',
                                        transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)'
                                    }} />
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div style={{ display: 'flex', marginTop: '4px' }}>
                                <button 
                                    onClick={() => setSelectedClient(client)}
                                    style={{ 
                                        flex: 1, 
                                        padding: '12px', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
                                        color: '#fff', 
                                        fontSize: '13px', 
                                        fontWeight: 700, 
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ overflowX: 'auto', padding: '0 4px 20px' }}>
                    <table className="of-table">
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: isDark ? '#1e2347' : '#fff' }}>
                             <tr>
                                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client Name</th>
                                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Name</th>
                                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personnel Flow</th>
                                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</th>
                                <th style={{ padding: '20px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client, idx) => (
                                <tr key={client.id} style={{ animation: `slideUp 0.3s ease-out ${idx * 0.05}s both` }}>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 800, color: isDark ? '#e4ecff' : '#0f172a', fontSize: '14px' }}>{client.name}</span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>ID: {client.id}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {client.businessName ? (
                                            <span style={{ 
                                                fontSize: '11px', 
                                                fontWeight: 800, 
                                                color: isDark ? '#6366f1' : '#4f46e5', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '0.05em',
                                                background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'}`
                                            }}>
                                                {client.businessName}
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '11px', color: '#a0aec0', fontStyle: 'italic', fontWeight: 600 }}>Personal Lead</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#e4ecff' : '#0f172a' }}>{client.agentName || client.agent}</span>
                                                <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Agent</span>
                                            </div>
                                            <FlowArrow />
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#e4ecff' : '#0f172a' }}>{client.tl}</span>
                                                <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Leader</span>
                                            </div>
                                            <FlowArrow />
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94abda' : '#475569' }}>{client.manager}</span>
                                                <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Manager</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ minWidth: '160px', textAlign: 'left' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '120px', height: '6px', background: isDark ? '#2c3568' : '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${client.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '3px' }} />
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: 900, color: '#6366f1', minWidth: '35px' }}>{client.progress}%</span>
                                            </div>
                                            <StageBadge stageId={STAGE_TO_OP[client.stage]} isDark={isDark} compact />
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => setSelectedClient(client)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '10px',
                                                border: `1px solid ${isDark ? '#3d4a8f' : '#e2e8f0'}`,
                                                background: isDark ? '#2c3568' : '#fff',
                                                color: isDark ? '#e4ecff' : '#0f172a',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredClients.length === 0 && (
                 <div style={{ 
                    padding: '80px 24px', 
                    textAlign: 'center', 
                    background: isDark ? '#1e2347' : '#fff', 
                    borderRadius: '24px', 
                    border: `2px dashed ${isDark ? '#2c3568' : '#e2e8f0'}`,
                    color: '#94a3b8'
                }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48" style={{ marginBottom: '16px' }}>
                        <circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#e4ecff' : '#0f172a', margin: '0 0 8px' }}>No clients found</h3>
                    <p style={{ fontSize: '14px', margin: 0 }}>Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            )}

        </div>
    );
};

export default OperationalFlow;

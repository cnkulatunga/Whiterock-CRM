import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useUsers } from '../../../context/UsersContext';

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

/* ─── MOCK WORKFLOW DATA ──────────────────────── */
const WORKFLOW_STAGES = [
    { id: 'lead_gather', label: 'Lead Detail Gather', color: '#6366f1', description: 'Tele Agent gathering core info' },
    { id: 'doc_collect', label: 'Collect Document', color: '#8b5cf6', description: 'Team Leader collecting records' },
    { id: 'lender_select', label: 'Lender Selection', color: '#ec4899', description: 'Manager selecting best partner' },
    { id: 'closed', label: 'Won / Rejected', color: '#10b981', description: 'Final process outcome' },
];

const MOCK_CLIENTS = [
    { 
        id: 1, name: 'Global Tech Solutions', manager: 'Sarah Chen', tl: 'Cody Lane', agent: 'Priya Sharma', stage: 'lead_gather', progress: 25, lastActive: '2h ago',
        leadDetails: { 
            phone: '+1 (555) 012-3456', email: 'corp@globaltech.com', source: 'Direct Website', 
            amount: '$250,000', purpose: 'Working Capital', nic: '772910293-TX',
            residentialAddress: '88 Tech Plaza, Austin, TX 78701',
            notes: 'Client is looking for rapid funding to cover a sudden Q3 inventory spike. High priority.'
        },
        lenderDetails: { partner: 'Pending', rate: 'N/A', status: 'Analysis Stage', terms: 'N/A' }
    },
    { 
        id: 2, name: 'Apex Industries', manager: 'Sarah Chen', tl: 'Cody Lane', agent: 'Jake Morrison', stage: 'doc_collect', progress: 50, lastActive: '45m ago',
        leadDetails: { 
            phone: '+1 (555) 987-6543', email: 'fin@apexind.io', source: 'Premium Referral', 
            amount: '$1.2M', purpose: 'Equipment Finance', nic: '992010294-NY',
            residentialAddress: '15 Industrial Blvd, Rochester, NY 14623',
            notes: 'Requires heavy machinery leasing. Documents are partially submitted.'
        },
        lenderDetails: { partner: 'Pending', rate: 'N/A', status: 'Document Verification', terms: 'N/A' }
    },
    { 
        id: 3, name: 'Blue Sky Ventures', manager: 'Michael Ross', tl: 'Leo Kumar', agent: 'Nina Hassan', stage: 'lender_select', progress: 75, lastActive: '1d ago',
        leadDetails: { 
            phone: '+1 (555) 444-2222', email: 'hello@bluesky.vc', source: 'LinkedIn Campaign', 
            amount: '$500,000', purpose: 'Expansion Loan', nic: '448291039-SF',
            residentialAddress: '22 Venture Way, San Francisco, CA 94105',
            notes: 'Seed-stage startup looking for non-dilutive capital. Financials look strong.'
        },
        lenderDetails: { partner: 'Capital One', rate: '4.2%', status: 'Offer Received', terms: '60 Months' }
    },
    { 
        id: 4, name: 'Summit Realty', manager: 'Michael Ross', tl: 'Elena Vasquez', agent: 'Sophie Tan', stage: 'won', progress: 100, lastActive: '3h ago',
        leadDetails: { 
            phone: '+1 (555) 333-1111', email: 'ops@summitrealty.com', source: 'Cold Outreach', 
            amount: '$750,000', purpose: 'Bridge Loan', nic: '331029384-FL',
            residentialAddress: '55 Ocean Dr, Miami, FL 33139',
            notes: 'Urgent bridge loan for a real estate acquisition closing in 2 weeks.'
        },
        lenderDetails: { partner: 'Chase Business', rate: '3.8%', status: 'Funded', terms: '48 Months' }
    },
    { 
        id: 5, name: 'Phoenix Corp', manager: 'Sarah Chen', tl: 'Jake Morrison', agent: 'Omar Khalil', stage: 'won', progress: 100, lastActive: '10m ago',
        leadDetails: { 
            phone: '+1 (555) 777-8888', email: 'finance@phoenix.io', source: 'Email Marketing', 
            amount: '$300,000', purpose: 'Inventory Purchase', nic: '772930485-WA',
            residentialAddress: '7 Phoenix Center, Seattle, WA 98101',
            notes: 'Repeat client. High trust score. Fast tracked for inventory expansion.'
        },
        lenderDetails: { partner: 'Wells Fargo', rate: '4.1%', status: 'Funded', terms: '36 Months' }
    },
    { 
        id: 6, name: 'Nova Logistics', manager: 'Michael Ross', tl: 'Leo Kumar', agent: 'Nina Hassan', stage: 'rejected', progress: 100, lastActive: '5h ago',
        leadDetails: { 
            phone: '+1 (555) 111-9999', email: 'admin@novalogistics.com', source: 'Direct Website', 
            amount: '$150,000', purpose: 'Vehicle Lease', nic: '112039485-IL',
            residentialAddress: '33 Logistics Park, Chicago, IL 60607',
            notes: 'Rejected due to low credit score and high debt-to-income ratio.'
        },
        lenderDetails: { partner: 'HSBC', rate: 'N/A', status: 'Credit Denied', terms: 'N/A' }
    },
    { 
        id: 7, name: 'Stellar Dynamics', manager: 'Sarah Chen', tl: 'Cody Lane', agent: 'Priya Sharma', stage: 'rejected', progress: 100, lastActive: '2d ago',
        leadDetails: { 
            phone: '+1 (555) 222-0000', email: 'contact@stellar.space', source: 'Event Networking', 
            amount: '$2M', purpose: 'Major Acquisition', nic: '221039485-CA',
            residentialAddress: '99 Orbital Way, Los Angeles, CA 90001',
            notes: 'Client failed to provide verified business tax returns for the last 3 years.'
        },
        lenderDetails: { partner: 'Citi Bank', rate: 'N/A', status: 'Incomplete Docs', terms: 'N/A' }
    },
];

/* ─── COMPONENTS ──────────────────────────────── */

const ClientDetailModal = ({ client, onClose, isDark }) => {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'lead', 'lender'

    if (!client) return null;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'lead', label: 'Lead Details' },
        { id: 'lender', label: 'Lender Selection' }
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', animation: 'fadeIn 0.3s ease-out'
        }} onClick={onClose}>
            <div style={{
                background: isDark ? '#1e2347' : '#fff', borderRadius: '28px',
                width: '100%', maxWidth: '850px', maxHeight: '90vh',
                overflow: 'hidden', border: `1px solid ${isDark ? '#2c3568' : '#e8edf5'}`,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                position: 'relative', display: 'flex', flexDirection: 'column',
                animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }} onClick={e => e.stopPropagation()}>
                
                {/* Close Button */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '24px', right: '24px',
                    background: isDark ? '#2c3568' : '#f1f5f9', border: 'none',
                    borderRadius: '50%', width: '36px', height: '36px',
                    cursor: 'pointer', color: isDark ? '#94abda' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Header */}
                <div style={{ padding: '40px 40px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        <h2 style={{ fontSize: '26px', fontWeight: 900, color: isDark ? '#e4ecff' : '#0f172a', margin: 0 }}>{client.name}</h2>
                        <StageBadge stageId={client.stage} isDark={isDark} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>ID: #WC-{client.id}092 • {client.lastActive}</span>

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', gap: '24px', marginTop: '32px', borderBottom: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}` }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '12px 4px',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? `3px solid #6366f1` : '3px solid transparent',
                                    color: activeTab === tab.id ? (isDark ? '#e4ecff' : '#0f172a') : '#94a3b8',
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '32px 40px 40px', overflowY: 'auto', flex: 1 }}>
                    {activeTab === 'overview' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '40px' }}>
                            {/* Workflow */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#e4ecff' : '#0f172a', margin: 0 }}>Project Roadmap</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '32px' }}>
                                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '7px', width: '2px', background: isDark ? '#2c3568' : '#f1f5f9' }} />
                                    {WORKFLOW_STAGES.map((stage, idx) => {
                                        const stageMap = { 'lead_gather': 1, 'doc_collect': 2, 'lender_select': 3, 'closed': 4 };
                                        const clientStageMap = { 'lead_gather': 1, 'doc_collect': 2, 'lender_select': 3, 'won': 4, 'rejected': 4 };
                                        const currentIdx = clientStageMap[client.stage];
                                        const stepIdx = stageMap[stage.id];
                                        const isCompleted = stepIdx < currentIdx;
                                        const isCurrent = stepIdx === currentIdx;
                                        
                                        let circleColor = isDark ? '#2c3568' : '#f1f5f9';
                                        let textColor = isDark ? '#546298' : '#94a3b8';
                                        if (isCompleted || isCurrent) {
                                            circleColor = stage.color;
                                            textColor = isDark ? '#e4ecff' : '#0f172a';
                                        }
                                        if (isCurrent && client.stage === 'rejected') circleColor = '#ef4444';

                                        return (
                                            <div key={stage.id} style={{ position: 'relative' }}>
                                                <div style={{ 
                                                    position: 'absolute', left: '-32px', top: '4px', width: '16px', height: '16px', 
                                                    borderRadius: '50%', background: circleColor,
                                                    border: `3px solid ${isDark ? '#1e2347' : '#fff'}`, zIndex: 1
                                                }} />
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: 800, color: textColor }}>{stage.label}</div>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>{stage.description}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Personnel */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ 
                                    background: isDark ? 'rgba(99,102,241,0.05)' : '#f8faff', 
                                    padding: '24px', borderRadius: '20px', border: `1px solid ${isDark ? '#2c3568' : '#eff2ff'}` 
                                }}>
                                    <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>Personnel Flow</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {[
                                            { label: 'Tele Agent', name: client.agent },
                                            { label: 'Team Leader', name: client.tl },
                                            { label: 'Account Manager', name: client.manager }
                                        ].map((person, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ 
                                                    width: '36px', height: '36px', borderRadius: '10px', 
                                                    background: isDark ? '#2c3568' : '#fff', display: 'flex', 
                                                    alignItems: 'center', justifyContent: 'center', fontWeight: 900, 
                                                    color: '#6366f1', border: `1px solid ${isDark ? '#3d4a8f' : '#e2e8f0'}`,
                                                    fontSize: '14px'
                                                }}>
                                                    {person.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: 800, color: isDark ? '#e4ecff' : '#0f172a' }}>{person.name}</div>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{person.label}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'lead' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {[
                                    { label: 'NIC / National ID', value: client.leadDetails.nic, icon: '🪪' },
                                    { label: 'Contact Number', value: client.leadDetails.phone, icon: '📞' },
                                    { label: 'Email Address', value: client.leadDetails.email, icon: '✉️' },
                                    { label: 'Residential Address', value: client.leadDetails.residentialAddress, icon: '🏠' },
                                    { label: 'Requested Amount', value: client.leadDetails.amount, icon: '💰' },
                                    { label: 'Loan Purpose', value: client.leadDetails.purpose, icon: '📋' },
                                    { label: 'Submission Date', value: 'Oct 24, 2023', icon: '📅' }
                                ].map((item, i) => (
                                    <div key={i} style={{ 
                                        padding: '20px', borderRadius: '16px', 
                                        background: isDark ? '#161a35' : '#f8faff',
                                        border: `1px solid ${isDark ? '#2c3568' : '#eff2ff'}`,
                                        display: 'flex', gap: '16px', alignItems: 'center',
                                        gridColumn: item.label === 'Residential Address' ? 'span 2' : 'span 1'
                                    }}>
                                        <div style={{ fontSize: '20px' }}>{item.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>{item.label}</div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#e4ecff' : '#0f172a' }}>{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Notes Section */}
                            <div style={{ 
                                padding: '24px', borderRadius: '20px', 
                                background: isDark ? 'rgba(99,102,241,0.05)' : '#f8faff',
                                border: `1px solid ${isDark ? '#2c3568' : '#eff2ff'}`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '16px' }}>📝</span>
                                    <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Additional Commentary</h4>
                                </div>
                                <p style={{ 
                                    fontSize: '14px', color: isDark ? '#94abda' : '#64748b', 
                                    lineHeight: '1.6', margin: 0, fontStyle: 'italic'
                                }}>
                                    "{client.leadDetails.notes}"
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'lender' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ 
                                padding: '32px', borderRadius: '24px', 
                                background: isDark ? 'linear-gradient(135deg, #161a35, #1e2347)' : '#f8faff',
                                border: `1px solid ${isDark ? '#2c3568' : '#eff2ff'}`,
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏦</div>
                                <h4 style={{ fontSize: '20px', fontWeight: 900, color: isDark ? '#e4ecff' : '#0f172a', margin: '0 0 8px' }}>
                                    {client.lenderDetails.partner}
                                </h4>
                                <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: isDark ? '#6366f120' : '#6366f110', color: '#6366f1', fontSize: '13px', fontWeight: 800 }}>
                                    {client.lenderDetails.status}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ padding: '20px', borderRadius: '16px', background: isDark ? '#161a35' : '#f8faff', border: `1px solid ${isDark ? '#2c3568' : '#eff2ff'}` }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Interest Rate</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>{client.lenderDetails.rate}</div>
                                </div>
                                <div style={{ padding: '20px', borderRadius: '16px', background: isDark ? '#161a35' : '#f8faff', border: `1px solid ${isDark ? '#2c3568' : '#eff2ff'}` }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Approved Terms</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: isDark ? '#e4ecff' : '#0f172a' }}>{client.lenderDetails.terms}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div style={{ 
                    padding: '24px 40px', borderTop: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`,
                    display: 'flex', justifyContent: 'flex-end'
                }}>
                    <button 
                        onClick={onClose}
                        style={{
                            padding: '12px 32px', borderRadius: '14px', border: 'none',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
                            fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(99,102,241,0.3)'
                        }}
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

const StageBadge = ({ stageId, isDark, compact = false }) => {
    let stage = WORKFLOW_STAGES.find(s => s.id === stageId);
    let label = stage?.label;
    let color = stage?.color;

    if (stageId === 'won') {
        label = 'Won';
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
            fontSize: compact ? '10px' : '11px', 
            fontWeight: 800, 
            padding: compact ? '2px 8px' : '4px 12px', 
            borderRadius: '999px', 
            background: isDark ? `${color}20` : `${color}15`,
            color: color,
            border: `1px solid ${isDark ? `${color}40` : `${color}30`}`,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
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
    const [search, setSearch] = useState('');
    const [filterStage, setFilterStage] = useState('All');
    const [viewMode, setViewMode] = useState(window.innerWidth > 768 ? 'table' : 'grid');
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth > 768;
            setViewMode(isDesktop ? 'table' : 'grid');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredClients = MOCK_CLIENTS.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                             c.agent.toLowerCase().includes(search.toLowerCase()) ||
                             c.tl.toLowerCase().includes(search.toLowerCase());
        
        let matchesStage = filterStage === 'All' || c.stage === filterStage;
        if (filterStage === 'closed') {
            matchesStage = c.stage === 'won' || c.stage === 'rejected';
        }

        return matchesSearch && matchesStage;
    });

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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {filteredClients.map((client, idx) => (
                        <div key={client.id} className="flow-node" style={{
                            background: isDark ? '#1e2347' : '#fff',
                            borderRadius: '24px',
                            border: `1px solid ${isDark ? '#2c3568' : '#e8edf5'}`,
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            animation: `slideUp 0.4s ease-out ${idx * 0.1}s both`
                        }}>
                            {/* Client Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: isDark ? '#e4ecff' : '#0f172a', margin: 0, letterSpacing: '-0.2px' }}>{client.name}</h3>
                                    <div style={{ fontSize: '12px', color: isDark ? '#546298' : '#94a3b8', fontWeight: 600, marginTop: '4px' }}>Active since {client.lastActive}</div>
                                </div>
                                <StageBadge stageId={client.stage} isDark={isDark} />
                            </div>

                            {/* Hierarchy Flow */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: window.innerWidth > 768 ? 'center' : 'stretch', 
                                gap: '12px', 
                                padding: '16px', 
                                background: isDark ? 'rgba(99,102,241,0.05)' : '#f8faff', 
                                borderRadius: '16px',
                                border: `1px solid ${isDark ? 'rgba(99,102,241,0.1)' : '#eff2ff'}`,
                                flexDirection: window.innerWidth > 768 ? 'row' : 'column'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Tele Agent</span>
                                    <span style={{ fontSize: '13px', color: isDark ? '#e4ecff' : '#0f172a', fontWeight: 700 }}>{client.agent}</span>
                                </div>
                                {window.innerWidth > 768 && <FlowArrow />}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Leader</span>
                                    <span style={{ fontSize: '13px', color: isDark ? '#e4ecff' : '#0f172a', fontWeight: 700 }}>{client.tl}</span>
                                </div>
                                {window.innerWidth > 768 && <FlowArrow />}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Account Manager</span>
                                    <span style={{ fontSize: '13px', color: isDark ? '#e4ecff' : '#0f172a', fontWeight: 700 }}>{client.manager}</span>
                                </div>
                            </div>

                            {/* Progress Tracker */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 800, color: isDark ? '#94abda' : '#475569' }}>Overall Progress</span>
                                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#6366f1' }}>{client.progress}%</span>
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
                                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Stage</th>
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
                                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>ID: #WC-{client.id}092</span>
                                        </div>
                                    </td>
                                    <td>
                                        <StageBadge stageId={client.stage} isDark={isDark} compact />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#e4ecff' : '#0f172a' }}>{client.agent}</span>
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
                                    <td style={{ minWidth: '140px', textAlign: 'left' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '120px', height: '6px', background: isDark ? '#2c3568' : '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${client.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '3px' }} />
                                            </div>
                                            <span style={{ fontSize: '12px', fontWeight: 900, color: '#6366f1', minWidth: '35px' }}>{client.progress}%</span>
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

            {/* Modal Overlay */}
            {selectedClient && (
                <ClientDetailModal 
                    client={selectedClient} 
                    onClose={() => setSelectedClient(null)} 
                    isDark={isDark} 
                />
            )}
        </div>
    );
};

export default OperationalFlow;

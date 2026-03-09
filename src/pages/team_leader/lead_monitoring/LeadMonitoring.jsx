import React, { useState } from 'react';
import './LeadMonitoring.css';

// --- Data ---
const LEADS_DATA = [
    {
        id: 'WR-2024-8812',
        customer: 'Jonathan Vane',
        agent: { name: 'Sarah Johnson', avatar: 'Sarah Johnson' },
        progress: 20,
        stage: 'Document Collection',
    },
    {
        id: 'WR-2024-8845',
        customer: 'Amara Okafor',
        agent: { name: 'Michael Smith', avatar: 'Michael Smith' },
        progress: 100,
        stage: 'Completed',
    },
    {
        id: 'WR-2024-8901',
        customer: 'Robert Taylor',
        agent: { name: 'Elena Rodriguez', avatar: 'Elena Rodriguez' },
        progress: 40,
        stage: 'Document Verification',
    },
    {
        id: 'WR-2024-8722',
        customer: 'Li Wei',
        agent: { name: 'Sarah Johnson', avatar: 'Sarah Johnson' },
        progress: 60,
        stage: 'Lender Selection',
    },
    {
        id: 'WR-2024-8735',
        customer: 'Patricia Moore',
        agent: { name: 'Michael Smith', avatar: 'Michael Smith' },
        progress: 80,
        stage: 'Final Review',
    },
    {
        id: 'WR-2024-8744',
        customer: 'Kevin Adams',
        agent: { name: 'Elena Rodriguez', avatar: 'Elena Rodriguez' },
        progress: 100,
        stage: 'Rejected',
    },
    {
        id: 'WR-2024-8756',
        customer: 'David Lee',
        agent: { name: 'Elena Rodriguez', avatar: 'Elena Rodriguez' },
        progress: 20,
        stage: 'Document Collection',
    },
    {
        id: 'WR-2024-8770',
        customer: 'Fatima Al-Hassan',
        agent: { name: 'Sarah Johnson', avatar: 'Sarah Johnson' },
        progress: 60,
        stage: 'Lender Selection',
    },
    {
        id: 'WR-2024-8785',
        customer: 'Carlos Rivera',
        agent: { name: 'Michael Smith', avatar: 'Michael Smith' },
        progress: 40,
        stage: 'Document Verification',
    },
];

const AGENTS_LIST = ['All Agents', 'Sarah Johnson', 'Michael Smith', 'Elena Rodriguez'];
const STAGES_LIST = ['All Stages', 'Document Collection', 'Document Verification', 'Lender Selection', 'Final Review', 'Completed', 'Rejected'];

const STAGE_COLORS = {
    'Document Collection': '#2447d7',
    'Document Verification': '#f59e0b',
    'Lender Selection': '#8b5cf6',
    'Final Review': '#06b6d4',
    'Completed': '#10b981',
    'Rejected': '#ef4444',
};

const ITEMS_PER_PAGE = 4;
const TOTAL_PAGES = 12;

// --- Stage Progress Bar Component ---
const StageProgressBar = ({ progress, stage }) => {
    const segments = 5;
    const filledSegments = Math.round((progress / 100) * segments);
    const isRejected = stage === 'Rejected';

    return (
        <div className="lm-progress-group">
            <div className="lm-progress-segments">
                {Array.from({ length: segments }, (_, i) => (
                    <div
                        key={i}
                        className={`lm-progress-seg ${i < filledSegments ? 'filled' : ''} ${isRejected ? 'rejected' : ''}`}
                    />
                ))}
            </div>
            <span className={`lm-progress-label ${isRejected ? 'rejected' : ''}`}>
                {isRejected ? 'REJECTED' : `${progress}% COMPLETE`}
            </span>
        </div>
    );
};

// --- Lead Row Component ---
const LeadRow = ({ lead }) => {
    const stageColor = STAGE_COLORS[lead.stage] || '#2447d7';

    return (
        <div className="lm-lead-row">
            <div className="lm-lead-id-col">
                <span className="lm-lead-id">{lead.id}</span>
                <span className="lm-lead-customer">{lead.customer}</span>
            </div>
            <div className="lm-agent-col">
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(lead.agent.name)}&background=2447d7&color=fff&size=36`}
                    alt={lead.agent.name}
                    className="lm-agent-avatar"
                />
                <span className="lm-agent-name">{lead.agent.name}</span>
            </div>
            <div className="lm-progress-col">
                <StageProgressBar progress={lead.progress} stage={lead.stage} />
            </div>
            <div className="lm-stage-col">
                <span className="lm-stage-dot" style={{ background: stageColor }} />
                <span className="lm-stage-text">{lead.stage}</span>
            </div>
        </div>
    );
};

// --- Main Component ---
const LeadMonitoring = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('All Agents');
    const [selectedStage, setSelectedStage] = useState('All Stages');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredLeads = LEADS_DATA.filter(lead => {
        const matchesSearch =
            searchTerm === '' ||
            lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAgent = selectedAgent === 'All Agents' || lead.agent.name === selectedAgent;
        const matchesStage = selectedStage === 'All Stages' || lead.stage === selectedStage;
        return matchesSearch && matchesAgent && matchesStage;
    });

    const pagedLeads = filteredLeads.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalFiltered = filteredLeads.length;
    const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, totalFiltered);
    const showingStart = totalFiltered === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

    const handleExportCSV = () => {
        const headers = ['ID', 'Customer', 'Agent', 'Progress', 'Stage'];
        const rows = LEADS_DATA.map(l => [l.id, l.customer, l.agent.name, `${l.progress}%`, l.stage]);
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads_export.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const visiblePages = [1, 2, 3, '...', TOTAL_PAGES];

    return (
        <div className="lm-page">
            {/* Page Header */}
            <div className="lm-page-header">
                <div className="lm-header-left">
                    <h1 className="lm-page-title">Active Pipeline</h1>
                    <p className="lm-page-subtitle">
                        Real-time status of all leads currently in{' '}
                        <span className="lm-subtitle-highlight">doc collection</span> or{' '}
                        <span className="lm-subtitle-highlight">lender processing</span>.
                    </p>
                </div>
                <div className="lm-header-actions">
                    <button className="lm-export-btn" onClick={handleExportCSV}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="lm-card">
                {/* Filters Row */}
                <div className="lm-filters-row">
                    <div className="lm-filter-group lm-search-group">
                        <label className="lm-filter-label">SEARCH LEAD</label>
                        <div className="lm-search-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                className="lm-search-input"
                                placeholder="Search name or ID..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>

                    <div className="lm-filter-group">
                        <label className="lm-filter-label">AGENT</label>
                        <div className="lm-select-wrapper">
                            <select
                                className="lm-select"
                                value={selectedAgent}
                                onChange={(e) => { setSelectedAgent(e.target.value); setCurrentPage(1); }}
                            >
                                {AGENTS_LIST.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <svg className="lm-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>

                    <div className="lm-filter-group">
                        <label className="lm-filter-label">CURRENT STAGE</label>
                        <div className="lm-select-wrapper">
                            <select
                                className="lm-select"
                                value={selectedStage}
                                onChange={(e) => { setSelectedStage(e.target.value); setCurrentPage(1); }}
                            >
                                {STAGES_LIST.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <svg className="lm-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>


                </div>


                {/* Table Content */}
                <div className="lm-table-container">
                    {/* Table Header */}
                    <div className="lm-table-header">
                        <div className="lm-th lm-th-id">ID &amp; CUSTOMER</div>
                        <div className="lm-th lm-th-agent">ASSIGNED AGENT</div>
                        <div className="lm-th lm-th-progress">STAGE PROGRESSION</div>
                        <div className="lm-th lm-th-stage">STAGE</div>
                    </div>

                    {/* Table Body */}
                    <div className="lm-table-body">
                        {pagedLeads.length === 0 ? (
                            <div className="lm-empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <p>No leads match your search criteria.</p>
                            </div>
                        ) : (
                            pagedLeads.map((lead, idx) => (
                                <LeadRow key={lead.id} lead={lead} />
                            ))
                        )}
                    </div>
                </div>


                {/* Table Footer / Pagination */}
                <div className="lm-table-footer">
                    <span className="lm-showing-text">
                        Showing {showingStart} to {showingEnd} of {totalFiltered} leads
                    </span>
                    <div className="lm-pagination">
                        <button
                            className="lm-page-btn lm-page-nav"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        {visiblePages.map((page, idx) =>
                            page === '...' ? (
                                <span key={`ellipsis-${idx}`} className="lm-ellipsis">…</span>
                            ) : (
                                <button
                                    key={page}
                                    className={`lm-page-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            )
                        )}
                        <button
                            className="lm-page-btn lm-page-nav"
                            onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
                            disabled={currentPage === TOTAL_PAGES}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Stats Row */}
            <div className="lm-stats-row">
                {/* Total Leads */}
                <div className="lm-stat-card">
                    <span className="lm-stat-label">TOTAL LEADS</span>
                    <div className="lm-stat-value-row">
                        <span className="lm-stat-value">1,284</span>
                    </div>
                    <div className="lm-stat-trend positive">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                        +12% this month
                    </div>
                </div>

                {/* Avg Lead Time */}
                <div className="lm-stat-card">
                    <span className="lm-stat-label">AVG. LEAD TIME</span>
                    <div className="lm-stat-value-row">
                        <span className="lm-stat-value">4.2 <span className="lm-stat-unit">days</span></span>
                    </div>
                    <div className="lm-stat-trend neutral">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Stable
                    </div>
                </div>

                {/* Rejected Leads */}
                <div className="lm-stat-card lm-stat-card--danger">
                    <span className="lm-stat-label">REJECTED LEADS</span>
                    <div className="lm-stat-value-row">
                        <span className="lm-stat-value lm-stat-value--danger">14</span>
                    </div>
                    <div className="lm-stat-trend danger">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Final Disposition Required
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadMonitoring;

import React, { useState } from 'react';
import './DraftDashboard.css';

const DRAFTS = [
    { id: '#LD-99105', client: 'Marcus Reed',       amount: '$320,000.00', stage: 'Loan Details',    lastEdited: 'Oct 24, 2023', progress: 30 },
    { id: '#LD-99089', client: 'Priya Nair',        amount: '$875,000.00', stage: 'Lender Selection',lastEdited: 'Oct 23, 2023', progress: 65 },
    { id: '#LD-99074', client: 'James Whitfield',   amount: '$150,000.00', stage: 'Document Review', lastEdited: 'Oct 22, 2023', progress: 50 },
    { id: '#LD-99061', client: 'TechBridge Corp',   amount: '$2,400,000.00',stage: 'Loan Details',   lastEdited: 'Oct 21, 2023', progress: 20 },
    { id: '#LD-99040', client: 'Sandra Okonkwo',    amount: '$430,000.00', stage: 'Lender Selection',lastEdited: 'Oct 20, 2023', progress: 70 },
];

const STAGE_COLOR = {
    'Loan Details':     { bg: '#dbeafe', color: '#1d4ed8' },
    'Lender Selection': { bg: '#e0e7ff', color: '#4338ca' },
    'Document Review':  { bg: '#fef9c3', color: '#854d0e' },
};

const DraftDashboard = ({ onNavigate }) => {
    const [search, setSearch] = useState('');

    const filtered = DRAFTS.filter(d =>
        d.client.toLowerCase().includes(search.toLowerCase()) ||
        d.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dd-page">
            {/* Header */}
            <div className="dd-header">
                <div>
                    <h1 className="dd-title">Draft Dashboard</h1>
                    <p className="dd-subtitle">All in-progress leads saved as drafts â€” resume anytime.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="dd-stat-row">
                <div className="dd-stat-card">
                    <div className="dd-stat-icon" style={{ background: '#eff6ff' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </div>
                    <div>
                        <div className="dd-stat-value">5</div>
                        <div className="dd-stat-label">Total Drafts</div>
                    </div>
                </div>
                <div className="dd-stat-card">
                    <div className="dd-stat-icon" style={{ background: '#fff7ed' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div>
                        <div className="dd-stat-value">2</div>
                        <div className="dd-stat-label">Awaiting Action</div>
                    </div>
                </div>
                <div className="dd-stat-card">
                    <div className="dd-stat-icon" style={{ background: '#f0fdf4' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    </div>
                    <div>
                        <div className="dd-stat-value">48%</div>
                        <div className="dd-stat-label">Avg. Completion</div>
                    </div>
                </div>
                <div className="dd-stat-card">
                    <div className="dd-stat-icon" style={{ background: '#fef2f2' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div>
                        <div className="dd-stat-value">$4.2M</div>
                        <div className="dd-stat-label">Total Draft Value</div>
                    </div>
                </div>
            </div>

            {/* Table card */}
            <div className="dd-table-card">
                <div className="dd-table-top">
                    <h3>In-Progress Leads</h3>
                    <div className="dd-search-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search drafts..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="dd-table">
                    <thead>
                        <tr>
                            <th>LEAD ID</th>
                            <th>CLIENT NAME</th>
                            <th>AMOUNT</th>
                            <th>STAGE</th>
                            <th>PROGRESS</th>
                            <th>LAST EDITED</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((draft) => {
                            const sc = STAGE_COLOR[draft.stage] || { bg: '#f1f5f9', color: '#4a5568' };
                            return (
                                <tr key={draft.id}>
                                    <td className="dd-lead-id">{draft.id}</td>
                                    <td className="dd-client">{draft.client}</td>
                                    <td className="dd-amount">{draft.amount}</td>
                                    <td>
                                        <span className="dd-stage-badge" style={{ background: sc.bg, color: sc.color }}>
                                            {draft.stage}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="dd-progress-wrap">
                                            <div className="dd-progress-bar">
                                                <div className="dd-progress-fill" style={{ width: `${draft.progress}%` }} />
                                            </div>
                                            <span className="dd-progress-pct">{draft.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="dd-date">{draft.lastEdited}</td>
                                    <td>
                                        <button
                                            className="dd-resume-btn"
                                            onClick={() => onNavigate && onNavigate('lender_selection')}
                                        >
                                            Resume
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="dd-empty">No drafts found matching your search.</div>
                )}
            </div>
        </div>
    );
};

export default DraftDashboard;


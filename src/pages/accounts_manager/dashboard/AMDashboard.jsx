import React from 'react';
import './AMDashboard.css';

const STAT_CARDS = [
    {
        label: 'Verified Clients',
        value: '1,284',
        change: '+12%',
        changeLabel: 'vs last month',
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        iconBg: '#ebf0ff',
    },
    {
        label: 'Pending Loans',
        value: '42',
        change: '+8%',
        changeLabel: 'vs last week',
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
            </svg>
        ),
        iconBg: '#fff7ed',
    },
    {
        label: 'Commission Rate',
        value: '2.4%',
        change: '+0.2%',
        changeLabel: 'avg growth',
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <line x1="19" y1="5" x2="5" y2="19" />
                <circle cx="6.5" cy="6.5" r="2.5" />
                <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
        ),
        iconBg: '#f5f3ff',
    },
    {
        label: 'Approved vs Rejected',
        value: '85% / 15%',
        change: '+3%',
        changeLabel: 'approval rate',
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
        ),
        iconBg: '#f0fdf4',
    },
];

const LEADS = [
    { id: '#LD-99021', client: 'Sarah Jenkins', amount: '$250,000.00', stage: 'DOCUMENT COLLECTION', stageClass: 'stage-doc', date: 'Oct 24, 2023' },
    { id: '#LD-98912', client: 'TechStream Solutions', amount: '$1,200,000.00', stage: 'LENDER SELECTION', stageClass: 'stage-lender', date: 'Oct 23, 2023' },
    { id: '#LD-98845', client: 'Marcus Aurelius', amount: '$75,000.00', stage: 'COMPLETE', stageClass: 'stage-complete', date: 'Oct 22, 2023' },
    { id: '#LD-98712', client: 'Peak Dynamics', amount: '$540,000.00', stage: 'REJECTED', stageClass: 'stage-rejected', date: 'Oct 21, 2023' },
];

const PENDING_APPROVALS = [
    {
        deal: 'DEAL-4492',
        priority: 'PRIORITY',
        priorityClass: 'priority-high',
        company: 'Quantum Capital Fund',
        type: 'Institutional Mortgage Loan',
        avatars: ['QC', 'RP'],
    },
    {
        deal: 'DEAL-4488',
        priority: 'STANDARD',
        priorityClass: 'priority-std',
        company: 'Global Trade Bank',
        type: 'Cross-border Financing Proof',
        avatars: ['3'],
        avatarCount: true,
    },
    {
        deal: 'DEAL-4475',
        priority: 'URGENT',
        priorityClass: 'priority-urgent',
        company: 'Prime Wealth Trust',
        type: 'Asset Allocation Verification',
        avatars: ['GT', 'PW'],
        extra: '+1',
    },
];

const AMDashboard = ({ onNavigate }) => {
    return (
        <div className="am-dashboard">
            {/* Header */}
            <div className="am-dash-header">
                <div>
                    <h1 className="am-dash-title">Accounts Manager Dashboard</h1>
                    <p className="am-dash-subtitle">Real-time overview of financial processing and lender governance.</p>
                </div>
                <button className="am-export-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export Report
                </button>
            </div>

            {/* Stat Cards */}
            <div className="am-stat-grid">
                {STAT_CARDS.map((card) => (
                    <div className="am-stat-card" key={card.label}>
                        <div className="am-stat-top">
                            <span className="am-stat-label">{card.label}</span>
                            <div className="am-stat-icon" style={{ background: card.iconBg }}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="am-stat-value">{card.value}</div>
                        <div className="am-stat-change">
                            <span className={`am-stat-badge ${card.positive ? 'positive' : 'negative'}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    <polyline points="17 6 23 6 23 12" />
                                </svg>
                                {card.change}
                            </span>
                            <span className="am-stat-change-label">{card.changeLabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="am-bottom-grid">
                {/* Recent Lead List */}
                <div className="am-leads-card">
                    <div className="am-card-header">
                        <div className="am-card-title-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <h2 className="am-card-title">Recent Lead List</h2>
                        </div>
                        <button className="am-view-all" onClick={() => onNavigate && onNavigate('lender_selection')}>
                            View All
                        </button>
                    </div>

                    <table className="am-leads-table">
                        <thead>
                            <tr>
                                <th>LEAD ID</th>
                                <th>CLIENT NAME</th>
                                <th>AMOUNT</th>
                                <th>STAGE</th>
                                <th>DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LEADS.map((lead) => (
                                <tr key={lead.id}>
                                    <td className="am-lead-id">{lead.id}</td>
                                    <td className="am-lead-client">{lead.client}</td>
                                    <td className="am-lead-amount">{lead.amount}</td>
                                    <td>
                                        <span className={`am-stage-badge ${lead.stageClass}`}>{lead.stage}</span>
                                    </td>
                                    <td className="am-lead-date">{lead.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="am-load-more">Load more leads</button>
                </div>

                {/* Pending Lender Approvals */}
                <div className="am-approvals-card">
                    <div className="am-card-header">
                        <div className="am-card-title-row">
                            <div className="am-approvals-icon-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h2 className="am-card-title">Pending Lender Approvals</h2>
                        </div>
                    </div>

                    <div className="am-approvals-list">
                        {PENDING_APPROVALS.map((item) => (
                            <div className="am-approval-item" key={item.deal}>
                                <div className="am-approval-top">
                                    <span className="am-approval-deal">{item.deal}</span>
                                    <span className={`am-approval-priority ${item.priorityClass}`}>{item.priority}</span>
                                </div>
                                <div className="am-approval-company">{item.company}</div>
                                <div className="am-approval-type">{item.type}</div>
                                <div className="am-approval-avatars">
                                    {item.avatarCount ? (
                                        <div className="am-avatar am-avatar-count">{item.avatars[0]}</div>
                                    ) : (
                                        item.avatars.map((av, i) => (
                                            <div className="am-avatar" key={i}>{av}</div>
                                        ))
                                    )}
                                    {item.extra && <div className="am-avatar am-avatar-extra">{item.extra}</div>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="am-lender-workflow-btn" onClick={() => onNavigate && onNavigate('lender_selection')}>
                        Go to Lender Workflow
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AMDashboard;

import React, { useState } from 'react';
import './LenderSelector.css';

const LEADS = [
    {
        id: '#LD-10021', name: 'Jonathan Doe', email: 'jonathan.doe@email.com',
        phone: '+1 (555) 201-4432', source: 'Referral', status: 'New',
        lastContact: 'Oct 24, 2023', loanAmount: '$500,000.00',
    },
    {
        id: '#LD-10018', name: 'Priya Nair', email: 'priya.nair@email.com',
        phone: '+1 (555) 318-9901', source: 'Website', status: 'Contacted',
        lastContact: 'Oct 23, 2023', loanAmount: '$875,000.00',
    },
    {
        id: '#LD-10015', name: 'Marcus Reed', email: 'marcus.reed@email.com',
        phone: '+1 (555) 442-7712', source: 'Cold Call', status: 'Qualified',
        lastContact: 'Oct 22, 2023', loanAmount: '$320,000.00',
    },
    {
        id: '#LD-10009', name: 'TechBridge Corp', email: 'contact@techbridge.com',
        phone: '+1 (555) 670-3348', source: 'Partner', status: 'Qualified',
        lastContact: 'Oct 21, 2023', loanAmount: '$2,400,000.00',
    },
    {
        id: '#LD-10003', name: 'Sandra Okonkwo', email: 'sandra.o@email.com',
        phone: '+1 (555) 899-1120', source: 'Referral', status: 'New',
        lastContact: 'Oct 20, 2023', loanAmount: '$430,000.00',
    },
    {
        id: '#LD-09998', name: 'James Whitfield', email: 'j.whitfield@email.com',
        phone: '+1 (555) 504-2291', source: 'Website', status: 'Contacted',
        lastContact: 'Oct 19, 2023', loanAmount: '$150,000.00',
    },
];

const LenderSelector = ({ onNavigate }) => {
    const [search, setSearch] = useState('');

    const filtered = LEADS.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.id.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectLender = (lead) => {
        onNavigate && onNavigate('lender_selection', lead);
    };

    return (
        <div className="ls2-page">
            {/* Header */}
            <div className="ls2-header">
                <div>
                    <h1 className="ls2-title">Lender Selector</h1>
                    <p className="ls2-subtitle">Review tele-agent submitted leads and assign them to financial lenders.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="ls2-stat-row">
                <div className="ls2-stat-card">
                    <div className="ls2-stat-icon" style={{ background: '#ebf0ff' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div>
                        <div className="ls2-stat-value">{LEADS.length}</div>
                        <div className="ls2-stat-label">Total Leads</div>
                    </div>
                </div>
                <div className="ls2-stat-card">
                    <div className="ls2-stat-icon" style={{ background: '#dcfce7' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div>
                        <div className="ls2-stat-value">{LEADS.filter(l => l.status === 'Qualified').length}</div>
                        <div className="ls2-stat-label">Qualified</div>
                    </div>
                </div>
                <div className="ls2-stat-card">
                    <div className="ls2-stat-icon" style={{ background: '#dbeafe' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div>
                        <div className="ls2-stat-value">{LEADS.filter(l => l.status === 'Contacted').length}</div>
                        <div className="ls2-stat-label">Contacted</div>
                    </div>
                </div>
                <div className="ls2-stat-card">
                    <div className="ls2-stat-icon" style={{ background: '#fef9c3' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#854d0e" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div>
                        <div className="ls2-stat-value">{LEADS.filter(l => l.status === 'New').length}</div>
                        <div className="ls2-stat-label">New</div>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="ls2-table-card">
                <div className="ls2-table-top">
                    <h3>Tele-Agent Leads</h3>
                    <div className="ls2-search-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, ID or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="ls2-table">
                    <thead>
                        <tr>
                            <th>LEAD ID</th>
                            <th>CLIENT NAME</th>
                            <th>CONTACT</th>
                            <th>LOAN AMOUNT</th>
                            <th>SOURCE</th>
                            <th>LAST CONTACT</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((lead) => {
                            const isSubmitted = lead.status === 'Qualified';
                            return (
                                <tr key={lead.id}>
                                    <td className="ls2-lead-id">{lead.id}</td>
                                    <td className="ls2-client">{lead.name}</td>
                                    <td>
                                        <div className="ls2-contact-cell">
                                            <span className="ls2-email">{lead.email}</span>
                                            <span className="ls2-phone">{lead.phone}</span>
                                        </div>
                                    </td>
                                    <td className="ls2-amount">{lead.loanAmount}</td>
                                    <td className="ls2-source">{lead.source}</td>
                                    <td className="ls2-date">{lead.lastContact}</td>
                                    <td>
                                        {isSubmitted ? (
                                            <span className="ls2-action-submitted">Lender Selected</span>
                                        ) : (
                                            <button
                                                className="ls2-select-btn"
                                                onClick={() => handleSelectLender(lead)}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                    strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                </svg>
                                                Select Lender
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="ls2-empty">No leads match your search.</div>
                )}

                <div className="ls2-footer-info">
                    Showing {filtered.length} of {LEADS.length} leads
                </div>
            </div>
        </div>
    );
};

export default LenderSelector;

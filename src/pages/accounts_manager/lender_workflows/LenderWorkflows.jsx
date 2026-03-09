import React from 'react';
import '../AMPlaceholder.css';

const LenderWorkflows = () => (
    <div className="am-placeholder">
        <div className="am-placeholder-icon" style={{ background: '#ebf0ff' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                <rect x="2" y="3" width="6" height="6" rx="1" />
                <rect x="9" y="3" width="6" height="6" rx="1" />
                <rect x="16" y="3" width="6" height="6" rx="1" />
                <path d="M5 9v3m4-3v3m4-3v3" />
                <rect x="2" y="15" width="20" height="6" rx="1" />
            </svg>
        </div>
        <h2>Lender Workflows</h2>
        <p>Manage lender approval pipelines, deal routing, and workflow automation.</p>
        <span className="am-placeholder-badge">Coming Soon</span>
    </div>
);

export default LenderWorkflows;

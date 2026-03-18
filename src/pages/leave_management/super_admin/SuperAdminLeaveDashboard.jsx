import React, { useState } from 'react';
import { useLeave } from '../../../context/LeaveContext';
import { useTheme } from '../../../context/ThemeContext';
import { SHARED_INITIAL_USERS } from '../../../data/dummyData';

const STATUS_CONFIG = {
    Pending:  { bg: 'rgba(237,137,54,0.12)',  text: '#dd6b20', border: 'rgba(237,137,54,0.3)'  },
    Approved: { bg: 'rgba(56,161,105,0.12)',  text: '#38a169', border: 'rgba(56,161,105,0.3)'  },
    Rejected: { bg: 'rgba(229,62,62,0.12)',   text: '#e53e3e', border: 'rgba(229,62,62,0.3)'   },
};

const TYPE_CONFIG = {
    Annual: { bg: 'rgba(36,71,215,0.1)',  text: '#2447d7', border: 'rgba(36,71,215,0.2)'  },
    Sick:   { bg: 'rgba(128,90,213,0.1)', text: '#805ad5', border: 'rgba(128,90,213,0.2)' },
};

const SuperAdminLeaveDashboard = ({ user }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { leaveRequests, leaveBalances } = useLeave();

    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [filterAgent, setFilterAgent] = useState('All');
    const [expandedRow, setExpandedRow] = useState(null);

    const teleAgents = SHARED_INITIAL_USERS.filter(u => u.role === 'Tele Agent');
    const sorted = [...leaveRequests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filtered = sorted.filter(r => {
        if (filterStatus !== 'All' && r.status !== filterStatus) return false;
        if (filterType !== 'All' && r.type !== filterType) return false;
        if (filterAgent !== 'All' && r.agentName !== filterAgent) return false;
        return true;
    });

    const totalApproved = leaveRequests.filter(r => r.status === 'Approved').length;
    const totalRejected = leaveRequests.filter(r => r.status === 'Rejected').length;
    const totalPending = leaveRequests.filter(r => r.status === 'Pending').length;
    const totalAnnualDays = leaveRequests.filter(r => r.status === 'Approved' && r.type === 'Annual').reduce((s, r) => s + r.days, 0);
    const totalSickDays = leaveRequests.filter(r => r.status === 'Approved' && r.type === 'Sick').reduce((s, r) => s + r.days, 0);

    const stats = [
        { label: 'Total Requests', value: leaveRequests.length, color: '#6080f8', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
        { label: 'Pending', value: totalPending, color: '#dd6b20', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg> },
        { label: 'Approved', value: totalApproved, color: '#38a169', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="20 6 9 17 4 12" /></svg> },
        { label: 'Rejected', value: totalRejected, color: '#e53e3e', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> },
        { label: 'Annual Days Used', value: totalAnnualDays, color: '#2447d7', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
        { label: 'Sick Days Used', value: totalSickDays, color: '#805ad5', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg> },
    ];

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Leave Overview</h1>
                    <p className="text-sm mt-0.5" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                        Company-wide leave requests — read only view.
                    </p>
                </div>
                <div
                    className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold"
                    style={{ background: 'rgba(36,71,215,0.1)', color: '#2447d7', border: '1px solid rgba(36,71,215,0.2)' }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    View Only
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-6 gap-4 lg:grid-cols-3 sm:grid-cols-2">
                {stats.map(s => (
                    <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-2"
                        style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#e6ebf5'}` }}>
                        <div className="flex items-center justify-between">
                            <span style={{ color: s.color, opacity: 0.8 }}>{s.icon}</span>
                        </div>
                        <div className="text-2xl font-extrabold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{s.value}</div>
                        <div className="text-[0.68rem] font-semibold" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Agent Balance Summary */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#e6ebf5'}` }}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf0fb'}` }}>
                    <h2 className="text-[0.95rem] font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Agent Leave Balances</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ background: isDark ? '#1a1f3c' : '#f8fafc' }}>
                                {['Agent', 'Team Leader', 'Annual Used', 'Annual Remaining', 'Sick Used', 'Sick Remaining'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[0.68rem] font-bold uppercase tracking-wider whitespace-nowrap"
                                        style={{ color: isDark ? '#546298' : '#7d8eb6' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {teleAgents.map(agent => {
                                const bal = leaveBalances.find(b => b.userId === agent.id) || { annualTotal: 7, annualUsed: 0, sickTotal: 7, sickUsed: 0 };
                                const tlReq = leaveRequests.find(r => r.agentId === agent.id);
                                const tlName = tlReq?.teamLeaderName || '—';
                                return (
                                    <tr key={agent.id} style={{ borderTop: `1px solid ${isDark ? '#232a52' : '#f0f3fb'}` }}>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2855e8] to-[#1a38b8] flex items-center justify-center text-white text-[0.58rem] font-bold shrink-0">
                                                    {agent.initials}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{agent.name}</div>
                                                    <div className="text-[0.6rem]" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>{agent.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>{tlName}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{bal.annualUsed}</span>
                                                <div className="flex-1 h-1.5 rounded-full min-w-[40px]" style={{ background: isDark ? '#2c3568' : '#edf0fb' }}>
                                                    <div className="h-full rounded-full" style={{ width: `${(bal.annualUsed / bal.annualTotal) * 100}%`, background: '#2447d7' }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs font-bold" style={{ color: '#2447d7' }}>{bal.annualTotal - bal.annualUsed} / {bal.annualTotal}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{bal.sickUsed}</span>
                                                <div className="flex-1 h-1.5 rounded-full min-w-[40px]" style={{ background: isDark ? '#2c3568' : '#edf0fb' }}>
                                                    <div className="h-full rounded-full" style={{ width: `${(bal.sickUsed / bal.sickTotal) * 100}%`, background: '#805ad5' }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs font-bold" style={{ color: '#805ad5' }}>{bal.sickTotal - bal.sickUsed} / {bal.sickTotal}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* All Requests Table */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#e6ebf5'}` }}>
                <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4" style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf0fb'}` }}>
                    <h2 className="text-[0.95rem] font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>
                        All Leave Requests
                        <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: isDark ? '#242b58' : '#f0f3ff', color: isDark ? '#8ea0d4' : '#4b5a8a' }}>
                            {filtered.length} shown
                        </span>
                    </h2>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: 'Status', value: filterStatus, set: setFilterStatus, options: ['All', 'Pending', 'Approved', 'Rejected'] },
                            { label: 'Type', value: filterType, set: setFilterType, options: ['All', 'Annual', 'Sick'] },
                            { label: 'Agent', value: filterAgent, set: setFilterAgent, options: ['All', ...teleAgents.map(a => a.name)] },
                        ].map(f => (
                            <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold outline-none"
                                style={{ background: isDark ? '#242b58' : '#f5f7ff', border: `1.5px solid ${isDark ? '#2c3568' : '#e1e8f5'}`, color: isDark ? '#e4ecff' : '#090e28' }}>
                                {f.options.map(o => <option key={o} value={o}>{f.label === 'Status' || f.label === 'Type' ? o : o === 'All' ? 'All Agents' : o}</option>)}
                            </select>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                        <p className="text-sm font-medium" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>No results match your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: isDark ? '#1a1f3c' : '#f8fafc' }}>
                                    {['ID', 'Agent', 'Type', 'Duration', 'Date(s)', 'Days', 'Team Leader', 'Accounts Mgr', 'Status', 'Reviewed By', 'Note'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[0.68rem] font-bold uppercase tracking-wider whitespace-nowrap"
                                            style={{ color: isDark ? '#546298' : '#7d8eb6' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(req => {
                                    const s = STATUS_CONFIG[req.status] || STATUS_CONFIG.Pending;
                                    const t = TYPE_CONFIG[req.type] || TYPE_CONFIG.Annual;
                                    const isExpanded = expandedRow === req.id;
                                    return (
                                        <tr key={req.id}
                                            style={{ borderTop: `1px solid ${isDark ? '#232a52' : '#f0f3fb'}`, cursor: 'pointer' }}
                                            onClick={() => setExpandedRow(isExpanded ? null : req.id)}
                                            className={`transition-colors ${isExpanded ? (isDark ? 'bg-[#242b58]' : 'bg-blue-50') : ''}`}
                                        >
                                            <td className="px-4 py-3.5 font-mono text-xs font-semibold whitespace-nowrap" style={{ color: isDark ? '#6080f8' : '#2447d7' }}>{req.id}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2855e8] to-[#1a38b8] flex items-center justify-center text-white text-[0.55rem] font-bold shrink-0">
                                                        {req.agentName.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-xs font-semibold whitespace-nowrap" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{req.agentName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-bold" style={{ background: t.bg, color: t.text, border: `1px solid ${t.border}` }}>{req.type}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>
                                                {req.duration}{req.halfDayPeriod ? ` (${req.halfDayPeriod})` : ''}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>
                                                {req.startDate === req.endDate ? req.startDate : `${req.startDate} → ${req.endDate}`}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs font-bold text-center" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{req.days}</td>
                                            <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>{req.teamLeaderName}</td>
                                            <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>{req.accountManagerName}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-bold whitespace-nowrap" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{req.status}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>{req.reviewedBy || '—'}</td>
                                            <td className="px-4 py-3.5 text-xs max-w-[160px]" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                                                {req.reviewNote ? <span className="italic truncate block max-w-[140px]" title={req.reviewNote}>{req.reviewNote}</span> : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminLeaveDashboard;

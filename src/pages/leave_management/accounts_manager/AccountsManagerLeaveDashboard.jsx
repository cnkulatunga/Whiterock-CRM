import React, { useState } from 'react';
import { useLeave } from '../../../context/LeaveContext';
import { useTheme } from '../../../context/ThemeContext';
import { AM_MEMBERSHIPS, INITIAL_MEMBERSHIPS, SHARED_INITIAL_USERS } from '../../../data/dummyData';

const STATUS_CONFIG = {
    Pending:  { bg: 'rgba(237,137,54,0.12)',  text: '#dd6b20', border: 'rgba(237,137,54,0.3)'  },
    Approved: { bg: 'rgba(56,161,105,0.12)',  text: '#38a169', border: 'rgba(56,161,105,0.3)'  },
    Rejected: { bg: 'rgba(229,62,62,0.12)',   text: '#e53e3e', border: 'rgba(229,62,62,0.3)'   },
};

const TYPE_CONFIG = {
    Annual: { bg: 'rgba(36,71,215,0.1)',  text: '#2447d7', border: 'rgba(36,71,215,0.2)'  },
    Sick:   { bg: 'rgba(128,90,213,0.1)', text: '#805ad5', border: 'rgba(128,90,213,0.2)' },
};

const ReviewModal = ({ request, onClose, onSubmit, isDark }) => {
    const [note, setNote] = useState('');
    const [action, setAction] = useState('Approved');

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
            <div className="w-full max-w-[480px] rounded-[22px] overflow-hidden shadow-2xl"
                style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#e1e8f5'}` }}>
                <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#f0f3fb'}` }}>
                    <h3 className="font-bold text-base" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Review Leave Request</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#546298' : '#a0aec0' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: isDark ? '#242b58' : '#f5f7ff', border: `1px solid ${isDark ? '#2c3568' : '#e1e8f5'}` }}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2855e8] to-[#1a38b8] flex items-center justify-center text-white text-[0.6rem] font-bold">
                                {request.agentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-bold text-sm" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{request.agentName}</span>
                            <span className="text-[0.65rem]" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>via {request.teamLeaderName}</span>
                            <span className="text-[0.65rem] font-mono font-bold ml-auto" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>{request.id}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            <div><span style={{ color: isDark ? '#546298' : '#7d8eb6' }}>Type: </span><span className="font-semibold" style={{ color: isDark ? '#c4d0f0' : '#2d3748' }}>{request.type}</span></div>
                            <div><span style={{ color: isDark ? '#546298' : '#7d8eb6' }}>Duration: </span><span className="font-semibold" style={{ color: isDark ? '#c4d0f0' : '#2d3748' }}>{request.duration}{request.halfDayPeriod ? ` (${request.halfDayPeriod})` : ''}</span></div>
                            <div><span style={{ color: isDark ? '#546298' : '#7d8eb6' }}>Date(s): </span><span className="font-semibold" style={{ color: isDark ? '#c4d0f0' : '#2d3748' }}>{request.startDate === request.endDate ? request.startDate : `${request.startDate} → ${request.endDate}`}</span></div>
                            <div><span style={{ color: isDark ? '#546298' : '#7d8eb6' }}>Days: </span><span className="font-bold" style={{ color: isDark ? '#c4d0f0' : '#2d3748' }}>{request.days}</span></div>
                        </div>
                        <div className="text-xs mt-1"><span style={{ color: isDark ? '#546298' : '#7d8eb6' }}>Reason: </span><span style={{ color: isDark ? '#c4d0f0' : '#2d3748' }}>{request.reason}</span></div>
                    </div>

                    <div>
                        <label className="block text-[0.7rem] font-bold mb-2 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>Decision</label>
                        <div className="flex gap-3">
                            {['Approved', 'Rejected'].map(a => {
                                const active = action === a;
                                const color = a === 'Approved' ? '#38a169' : '#e53e3e';
                                return (
                                    <button key={a} type="button" onClick={() => setAction(a)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border"
                                        style={{
                                            background: active ? (a === 'Approved' ? 'rgba(56,161,105,0.15)' : 'rgba(229,62,62,0.15)') : (isDark ? '#242b58' : '#f5f7ff'),
                                            borderColor: active ? color : (isDark ? '#2c3568' : '#e1e8f5'),
                                            color: active ? color : (isDark ? '#8ea0d4' : '#6b7eb8'),
                                            cursor: 'pointer',
                                        }}>
                                        {a === 'Approved' ? '✓ Approve' : '✕ Reject'}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                            Note <span className="normal-case font-normal">(optional)</span>
                        </label>
                        <textarea value={note} onChange={e => setNote(e.target.value)}
                            placeholder={action === 'Approved' ? 'e.g. Approved. Well deserved!' : 'e.g. Business needs require coverage on those dates.'}
                            rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                            style={{ background: isDark ? '#242b58' : '#f5f7ff', border: `1.5px solid ${isDark ? '#2c3568' : '#e1e8f5'}`, color: isDark ? '#e4ecff' : '#090e28' }} />
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                            style={{ background: isDark ? '#313a6e' : '#f7f8ff', border: `1px solid ${isDark ? '#3e4a88' : '#e1e6f5'}`, color: isDark ? '#94abda' : '#4b5681' }}>
                            Cancel
                        </button>
                        <button type="button" onClick={() => onSubmit(action, note)}
                            className="flex-1 py-3 rounded-xl font-bold text-sm text-white cursor-pointer transition-all hover:-translate-y-0.5"
                            style={{ background: action === 'Approved' ? '#38a169' : '#e53e3e', border: 'none', boxShadow: action === 'Approved' ? '0 4px 12px rgba(56,161,105,0.3)' : '0 4px 12px rgba(229,62,62,0.3)' }}>
                            Confirm {action === 'Approved' ? 'Approval' : 'Rejection'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccountsManagerLeaveDashboard = ({ user }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { leaveRequests, reviewLeaveRequest } = useLeave();

    // Find all agents under this AM's TLs
    const myTlIds = AM_MEMBERSHIPS[user.id] || [];
    const myAgentIds = myTlIds.flatMap(tlId => (INITIAL_MEMBERSHIPS[tlId] || []).map(a => a.id));
    const myTlNames = myTlIds.map(id => {
        const tl = SHARED_INITIAL_USERS.find(u => u.id === id);
        return tl ? tl.name : '';
    }).filter(Boolean);

    const myRequests = leaveRequests
        .filter(r => r.accountManagerId === user.id || myAgentIds.includes(r.agentId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const pending = myRequests.filter(r => r.status === 'Pending');
    const reviewed = myRequests.filter(r => r.status !== 'Pending');

    const [reviewTarget, setReviewTarget] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    const [filterTl, setFilterTl] = useState('All');

    const handleReview = (status, note) => {
        reviewLeaveRequest(reviewTarget.id, status, note, user.name);
        setReviewTarget(null);
        setSuccessMsg(`Leave request ${status.toLowerCase()} successfully.`);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const filterRequests = (list) => filterTl === 'All' ? list : list.filter(r => r.teamLeaderName === filterTl);

    const stats = [
        { label: 'Total', value: myRequests.length, color: '#6080f8' },
        { label: 'Pending', value: pending.length, color: '#dd6b20' },
        { label: 'Approved', value: myRequests.filter(r => r.status === 'Approved').length, color: '#38a169' },
        { label: 'Rejected', value: myRequests.filter(r => r.status === 'Rejected').length, color: '#e53e3e' },
    ];

    const RequestRow = ({ req }) => {
        const s = STATUS_CONFIG[req.status] || STATUS_CONFIG.Pending;
        const t = TYPE_CONFIG[req.type] || TYPE_CONFIG.Annual;
        return (
            <tr style={{ borderTop: `1px solid ${isDark ? '#232a52' : '#f0f3fb'}` }}>
                <td className="px-4 py-3.5 font-mono text-xs font-semibold whitespace-nowrap" style={{ color: isDark ? '#6080f8' : '#2447d7' }}>{req.id}</td>
                <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2855e8] to-[#1a38b8] flex items-center justify-center text-white text-[0.58rem] font-bold shrink-0">
                            {req.agentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="text-xs font-semibold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{req.agentName}</div>
                            <div className="text-[0.6rem]" style={{ color: isDark ? '#546298' : '#7d8eb6' }}>via {req.teamLeaderName}</div>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-bold" style={{ background: t.bg, color: t.text, border: `1px solid ${t.border}` }}>{req.type}</span>
                </td>
                <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>
                    {req.duration}{req.halfDayPeriod ? ` (${req.halfDayPeriod})` : ''}
                </td>
                <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>
                    {req.startDate === req.endDate ? req.startDate : `${req.startDate} → ${req.endDate}`}
                </td>
                <td className="px-4 py-3.5 text-xs font-bold text-center" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{req.days}</td>
                <td className="px-4 py-3.5 text-xs max-w-[140px]" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                    <span title={req.reason} className="line-clamp-2">{req.reason}</span>
                </td>
                <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-bold whitespace-nowrap" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{req.status}</span>
                </td>
                <td className="px-4 py-3.5 text-xs" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                    {req.reviewedBy ? <div><div className="font-medium">{req.reviewedBy}</div>{req.reviewNote && <div className="opacity-60 text-[0.6rem] mt-0.5 max-w-[100px] truncate">{req.reviewNote}</div>}</div> : '—'}
                </td>
                <td className="px-4 py-3.5">
                    {req.status === 'Pending' && (
                        <button onClick={() => setReviewTarget(req)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap"
                            style={{ background: 'linear-gradient(135deg, #2447d7, #1a38b8)', border: 'none', cursor: 'pointer' }}>
                            Review
                        </button>
                    )}
                </td>
            </tr>
        );
    };

    const displayList = activeTab === 'pending' ? filterRequests(pending) : filterRequests(reviewed);

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Leave Requests — All Teams</h1>
                <p className="text-sm mt-0.5" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                    Review and manage leave requests across your supervised teams.
                    {myTlNames.length > 0 && <span className="ml-1">Teams: <strong>{myTlNames.join(', ')}</strong></span>}
                </p>
            </div>

            {successMsg && (
                <div className="px-5 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                    style={{ background: 'rgba(56,161,105,0.12)', color: '#38a169', border: '1px solid rgba(56,161,105,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12" /></svg>
                    {successMsg}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
                {stats.map(s => (
                    <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-1"
                        style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#e6ebf5'}` }}>
                        <div className="text-2xl font-extrabold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{s.value}</div>
                        <div className="text-xs font-medium" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>{s.label}</div>
                        <div className="h-1 rounded-full mt-1" style={{ background: s.color, opacity: 0.5 }} />
                    </div>
                ))}
            </div>

            {/* Tabs + Filter */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? '#242b58' : '#f0f3ff' }}>
                    {[['pending', `Pending (${pending.length})`], ['history', `History (${reviewed.length})`]].map(([tab, label]) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
                            style={{
                                background: activeTab === tab ? (isDark ? '#1e2347' : '#ffffff') : 'transparent',
                                color: activeTab === tab ? (isDark ? '#e4ecff' : '#090e28') : (isDark ? '#8ea0d4' : '#6b7eb8'),
                                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                                border: 'none', cursor: 'pointer',
                            }}>
                            {label}
                        </button>
                    ))}
                </div>

                {myTlNames.length > 1 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>Filter by TL:</span>
                        <select
                            value={filterTl}
                            onChange={e => setFilterTl(e.target.value)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold outline-none"
                            style={{ background: isDark ? '#242b58' : '#f5f7ff', border: `1.5px solid ${isDark ? '#2c3568' : '#e1e8f5'}`, color: isDark ? '#e4ecff' : '#090e28' }}
                        >
                            <option value="All">All Teams</option>
                            {myTlNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: isDark ? '#1e2347' : '#ffffff', border: `1px solid ${isDark ? '#2c3568' : '#e6ebf5'}` }}>
                {displayList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <p className="text-sm font-medium" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                            {activeTab === 'pending' ? 'No pending requests.' : 'No reviewed requests yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: isDark ? '#1a1f3c' : '#f8fafc' }}>
                                    {['ID', 'Agent', 'Type', 'Duration', 'Date(s)', 'Days', 'Reason', 'Status', 'Reviewed By', 'Action'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[0.68rem] font-bold uppercase tracking-wider whitespace-nowrap"
                                            style={{ color: isDark ? '#546298' : '#7d8eb6' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayList.map(req => <RequestRow key={req.id} req={req} />)}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {reviewTarget && (
                <ReviewModal request={reviewTarget} isDark={isDark} onClose={() => setReviewTarget(null)} onSubmit={handleReview} />
            )}
        </div>
    );
};

export default AccountsManagerLeaveDashboard;

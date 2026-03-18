import React, { useState } from 'react';
import { useLeave } from '../../../context/LeaveContext';
import { useTheme } from '../../../context/ThemeContext';

const STATUS_CONFIG = {
    Pending:  { bg: 'rgba(237,137,54,0.12)',  text: '#dd6b20', border: 'rgba(237,137,54,0.3)'  },
    Approved: { bg: 'rgba(56,161,105,0.12)',  text: '#38a169', border: 'rgba(56,161,105,0.3)'  },
    Rejected: { bg: 'rgba(229,62,62,0.12)',   text: '#e53e3e', border: 'rgba(229,62,62,0.3)'   },
};

const TYPE_CONFIG = {
    Annual: { bg: 'rgba(36,71,215,0.1)',  text: '#2447d7', border: 'rgba(36,71,215,0.2)'  },
    Sick:   { bg: 'rgba(128,90,213,0.1)', text: '#805ad5', border: 'rgba(128,90,213,0.2)' },
};

const calcDays = (startDate, endDate, duration) => {
    if (duration === 'Half Day') return 0.5;
    const start = new Date(startDate);
    const end = new Date(endDate || startDate);
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diff);
};

const TeleAgentLeaveDashboard = ({ user }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { leaveRequests, createLeaveRequest, getBalanceForAgent } = useLeave();

    const myRequests = leaveRequests.filter(r => r.agentId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const balance = getBalanceForAgent(user.id);

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        type: 'Annual',
        duration: 'Full Day',
        halfDayPeriod: 'Morning',
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [formError, setFormError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleFormChange = (field, value) => {
        setForm(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'duration' && value === 'Half Day') updated.endDate = updated.startDate;
            if (field === 'startDate' && prev.duration === 'Half Day') updated.endDate = value;
            return updated;
        });
        setFormError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.startDate) { setFormError('Please select a start date.'); return; }
        if (form.duration === 'Full Day' && !form.endDate) { setFormError('Please select an end date.'); return; }
        if (!form.reason.trim()) { setFormError('Please provide a reason.'); return; }

        const days = calcDays(form.startDate, form.endDate || form.startDate, form.duration);
        const remaining = form.type === 'Annual'
            ? balance.annualTotal - balance.annualUsed
            : balance.sickTotal - balance.sickUsed;

        if (days > remaining) {
            setFormError(`Insufficient ${form.type} leave balance. You have ${remaining} day(s) remaining.`);
            return;
        }

        createLeaveRequest({
            agentId: user.id,
            agentName: user.name,
            type: form.type,
            duration: form.duration,
            halfDayPeriod: form.duration === 'Half Day' ? form.halfDayPeriod : null,
            startDate: form.startDate,
            endDate: form.duration === 'Half Day' ? form.startDate : form.endDate,
            days,
            reason: form.reason.trim(),
        });

        setSuccessMsg('Leave request submitted successfully!');
        setShowForm(false);
        setForm({ type: 'Annual', duration: 'Full Day', halfDayPeriod: 'Morning', startDate: '', endDate: '', reason: '' });
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const card = (label, value, total, color, icon) => (
        <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
                background: isDark ? '#1e2347' : '#ffffff',
                border: `1px solid ${isDark ? '#2c3568' : '#e6ebf5'}`,
                boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(36,71,215,0.05)',
            }}
        >
            <div className="flex items-center justify-between">
                <span className="text-[0.75rem] font-bold uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>{label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '22' }}>
                    {icon}
                </div>
            </div>
            <div>
                <div className="text-3xl font-extrabold mb-0.5" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{total - value}</div>
                <div className="text-xs" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                    {value} used · {total} total
                </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? '#2c3568' : '#edf0fb' }}>
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${total > 0 ? ((total - value) / total) * 100 : 0}%`, background: color }}
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>
                        My Leave
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                        Welcome back, {user.first_name}. Manage your leave requests here.
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setFormError(''); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #2447d7, #1a38b8)',
                        boxShadow: '0 6px 16px rgba(36,71,215,0.25)',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="16" height="16">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Request Leave
                </button>
            </div>

            {/* Success Banner */}
            {successMsg && (
                <div className="px-5 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                    style={{ background: 'rgba(56,161,105,0.12)', color: '#38a169', border: '1px solid rgba(56,161,105,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12" /></svg>
                    {successMsg}
                </div>
            )}

            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                {card('Annual Leave Remaining', balance.annualUsed, balance.annualTotal, '#2447d7',
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                )}
                {card('Sick Leave Remaining', balance.sickUsed, balance.sickTotal, '#805ad5',
                    <svg viewBox="0 0 24 24" fill="none" stroke="#805ad5" strokeWidth="2" width="18" height="18"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                )}
            </div>

            {/* Leave History Table */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: isDark ? '#1e2347' : '#ffffff',
                    border: `1px solid ${isDark ? '#2c3568' : '#e6ebf5'}`,
                    boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(36,71,215,0.05)',
                }}
            >
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf0fb'}` }}>
                    <h2 className="text-[0.95rem] font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>My Leave Requests</h2>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: isDark ? '#242b58' : '#f0f3ff', color: isDark ? '#8ea0d4' : '#4b5a8a' }}>
                        {myRequests.length} total
                    </span>
                </div>

                {myRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: isDark ? '#242b58' : '#f0f3ff' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? '#6080f8' : '#2447d7'} strokeWidth="1.5" width="28" height="28">
                                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>No leave requests yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs" style={{ minWidth: '860px' }}>
                            <thead>
                                <tr style={{ background: isDark ? '#1a1f3c' : '#f8fafc' }}>
                                    {['ID', 'Type', 'Duration', 'Date(s)', 'Days', 'Reason', 'TL', 'AM', 'Status', 'Reviewed By'].map(h => (
                                        <th key={h} className="px-3 py-2.5 text-left text-[0.65rem] font-bold uppercase tracking-wider whitespace-nowrap"
                                            style={{ color: isDark ? '#546298' : '#7d8eb6' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {myRequests.map((req) => {
                                    const s = STATUS_CONFIG[req.status] || STATUS_CONFIG.Pending;
                                    const t = TYPE_CONFIG[req.type] || TYPE_CONFIG.Annual;
                                    return (
                                        <tr
                                            key={req.id}
                                            style={{ borderTop: `1px solid ${isDark ? '#232a52' : '#f0f3fb'}` }}
                                        >
                                            <td className="px-3 py-3 font-mono font-semibold whitespace-nowrap" style={{ color: isDark ? '#6080f8' : '#2447d7', fontSize: '0.7rem' }}>{req.id}</td>
                                            <td className="px-3 py-3">
                                                <span className="px-2 py-0.5 rounded-full font-bold whitespace-nowrap" style={{ fontSize: '0.65rem', background: t.bg, color: t.text, border: `1px solid ${t.border}` }}>
                                                    {req.type}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>
                                                {req.duration}
                                                {req.halfDayPeriod && <span className="ml-1 opacity-60">({req.halfDayPeriod})</span>}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>
                                                {req.startDate === req.endDate ? req.startDate : `${req.startDate} → ${req.endDate}`}
                                            </td>
                                            <td className="px-3 py-3 font-bold text-center" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>{req.days}</td>
                                            <td className="px-3 py-3" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8', maxWidth: '120px' }}>
                                                <span className="block truncate" title={req.reason}>{req.reason}</span>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>{req.teamLeaderName}</td>
                                            <td className="px-3 py-3 whitespace-nowrap" style={{ color: isDark ? '#c4d0f0' : '#3a4b7c' }}>{req.accountManagerName}</td>
                                            <td className="px-3 py-3">
                                                <span className="px-2 py-0.5 rounded-full font-bold whitespace-nowrap" style={{ fontSize: '0.65rem', background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8', minWidth: '110px' }}>
                                                {req.reviewedBy ? (
                                                    <div>
                                                        <div className="font-semibold whitespace-nowrap">{req.reviewedBy}</div>
                                                        {req.reviewNote && <div className="opacity-60 mt-0.5 truncate" style={{ maxWidth: '110px', fontSize: '0.62rem' }} title={req.reviewNote}>{req.reviewNote}</div>}
                                                    </div>
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Request Leave Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
                    <div
                        className="w-full max-w-[520px] rounded-[22px] overflow-hidden shadow-2xl"
                        style={{
                            background: isDark ? '#1e2347' : '#ffffff',
                            border: `1px solid ${isDark ? '#2c3568' : '#e1e8f5'}`,
                        }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${isDark ? '#2c3568' : '#f0f3fb'}` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(36,71,215,0.12)' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#2447d7" strokeWidth="2" width="18" height="18">
                                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
                                    </svg>
                                </div>
                                <h3 className="text-[1rem] font-bold" style={{ color: isDark ? '#e4ecff' : '#090e28' }}>Request Leave</h3>
                            </div>
                            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#546298' : '#a0aec0' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                            {/* Leave Type */}
                            <div>
                                <label className="block text-[0.7rem] font-bold mb-2 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>Leave Type</label>
                                <div className="flex gap-3">
                                    {['Annual', 'Sick'].map(t => {
                                        const remaining = t === 'Annual' ? balance.annualTotal - balance.annualUsed : balance.sickTotal - balance.sickUsed;
                                        const active = form.type === t;
                                        return (
                                            <button
                                                key={t} type="button"
                                                onClick={() => handleFormChange('type', t)}
                                                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all border"
                                                style={{
                                                    background: active ? (isDark ? '#1e3278' : '#e0e7ff') : (isDark ? '#242b58' : '#f5f7ff'),
                                                    borderColor: active ? '#2447d7' : (isDark ? '#2c3568' : '#e1e8f5'),
                                                    color: active ? (isDark ? '#7a96fa' : '#2447d7') : (isDark ? '#8ea0d4' : '#6b7eb8'),
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {t}
                                                <span className="ml-2 text-[0.65rem] opacity-70">({remaining} left)</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-[0.7rem] font-bold mb-2 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>Duration</label>
                                <div className="flex gap-3">
                                    {['Full Day', 'Half Day'].map(d => {
                                        const active = form.duration === d;
                                        return (
                                            <button
                                                key={d} type="button"
                                                onClick={() => handleFormChange('duration', d)}
                                                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all border"
                                                style={{
                                                    background: active ? (isDark ? '#1e3278' : '#e0e7ff') : (isDark ? '#242b58' : '#f5f7ff'),
                                                    borderColor: active ? '#2447d7' : (isDark ? '#2c3568' : '#e1e8f5'),
                                                    color: active ? (isDark ? '#7a96fa' : '#2447d7') : (isDark ? '#8ea0d4' : '#6b7eb8'),
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {d}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Half Day Period */}
                            {form.duration === 'Half Day' && (
                                <div>
                                    <label className="block text-[0.7rem] font-bold mb-2 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>Period</label>
                                    <div className="flex gap-3">
                                        {['Morning', 'Afternoon'].map(p => {
                                            const active = form.halfDayPeriod === p;
                                            return (
                                                <button
                                                    key={p} type="button"
                                                    onClick={() => handleFormChange('halfDayPeriod', p)}
                                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border"
                                                    style={{
                                                        background: active ? (isDark ? '#1e3278' : '#e0e7ff') : (isDark ? '#242b58' : '#f5f7ff'),
                                                        borderColor: active ? '#2447d7' : (isDark ? '#2c3568' : '#e1e8f5'),
                                                        color: active ? (isDark ? '#7a96fa' : '#2447d7') : (isDark ? '#8ea0d4' : '#6b7eb8'),
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Dates */}
                            <div className={`grid gap-4 ${form.duration === 'Full Day' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                <div>
                                    <label className="block text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>
                                        {form.duration === 'Half Day' ? 'Date' : 'Start Date'}
                                    </label>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={e => handleFormChange('startDate', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                        style={{ background: isDark ? '#242b58' : '#f5f7ff', border: `1.5px solid ${isDark ? '#2c3568' : '#e1e8f5'}`, color: isDark ? '#e4ecff' : '#090e28' }}
                                    />
                                </div>
                                {form.duration === 'Full Day' && (
                                    <div>
                                        <label className="block text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>End Date</label>
                                        <input
                                            type="date"
                                            value={form.endDate}
                                            min={form.startDate || new Date().toISOString().split('T')[0]}
                                            onChange={e => handleFormChange('endDate', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                            style={{ background: isDark ? '#242b58' : '#f5f7ff', border: `1.5px solid ${isDark ? '#2c3568' : '#e1e8f5'}`, color: isDark ? '#e4ecff' : '#090e28' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider" style={{ color: isDark ? '#8ea0d4' : '#6b7eb8' }}>Reason</label>
                                <textarea
                                    value={form.reason}
                                    onChange={e => handleFormChange('reason', e.target.value)}
                                    placeholder="Briefly describe your reason for leave..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                                    style={{ background: isDark ? '#242b58' : '#f5f7ff', border: `1.5px solid ${isDark ? '#2c3568' : '#e1e8f5'}`, color: isDark ? '#e4ecff' : '#090e28' }}
                                />
                            </div>

                            {/* Days preview */}
                            {form.startDate && (
                                <div className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                                    style={{ background: isDark ? '#242b58' : '#f0f3ff', color: isDark ? '#8ea0d4' : '#4b5a8a', border: `1px solid ${isDark ? '#2c3568' : '#dde5f5'}` }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                                    {calcDays(form.startDate, form.endDate || form.startDate, form.duration)} day(s) will be deducted from your {form.type} leave balance
                                </div>
                            )}

                            {formError && (
                                <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(229,62,62,0.1)', color: '#e53e3e', border: '1px solid rgba(229,62,62,0.2)' }}>
                                    {formError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                                    style={{ background: isDark ? '#313a6e' : '#f7f8ff', border: `1px solid ${isDark ? '#3e4a88' : '#e1e6f5'}`, color: isDark ? '#94abda' : '#4b5681' }}>
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white cursor-pointer hover:-translate-y-0.5 transition-all"
                                    style={{ background: 'linear-gradient(135deg, #2447d7, #1a38b8)', boxShadow: '0 4px 12px rgba(36,71,215,0.3)', border: 'none' }}>
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeleAgentLeaveDashboard;

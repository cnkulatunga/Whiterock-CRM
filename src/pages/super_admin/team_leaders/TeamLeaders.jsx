import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

/* ─── GLOBAL KEYFRAMES ────────────────────────── */
const KEYFRAMES = `
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: translateY(0) } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px) } to { opacity: 1; transform: translateY(0) } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.93) } to { opacity: 1; transform: scale(1) } }
@keyframes expandIn { from { opacity: 0; max-height: 0; transform: translateY(-8px) } to { opacity: 1; max-height: 1000px; transform: translateY(0) } }
@keyframes memberSlide { from { opacity: 0; transform: translateX(-16px) } to { opacity: 1; transform: translateX(0) } }
@keyframes pulse { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.6; transform: scale(1.35) } }
@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes avatarPop { 0% { transform: scale(0.7) rotate(-10deg); opacity: 0 } 60% { transform: scale(1.12) rotate(3deg) } 100% { transform: scale(1) rotate(0deg); opacity: 1 } }
@keyframes headerDrop { from { opacity: 0; transform: translateY(-20px) } to { opacity: 1; transform: translateY(0) } }
@keyframes kpiPop { 0% { opacity: 0; transform: scale(0.8) translateY(14px) } 70% { transform: scale(1.04) translateY(-2px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
@keyframes tabSlide { from { opacity: 0; transform: translateX(-10px) } to { opacity: 1; transform: translateX(0) } }
@keyframes ringPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4) } 50% { box-shadow: 0 0 0 8px rgba(99,102,241,0) } }
@keyframes countUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
@keyframes spinOnce { from { transform: rotate(-90deg) scale(0.8); opacity: 0 } to { transform: rotate(0deg) scale(1); opacity: 1 } }
`;

if (typeof document !== 'undefined' && !document.getElementById('tl-keyframes')) {
    const s = document.createElement('style');
    s.id = 'tl-keyframes';
    s.textContent = KEYFRAMES;
    document.head.appendChild(s);
}

/* ─── ANIMATED NUMBER ─────────────────────────── */
const AnimatedNumber = ({ value }) => {
    const [display, setDisplay] = useState(0);
    const prev = useRef(0);
    useEffect(() => {
        const start = prev.current;
        const end = value;
        if (start === end) return;
        const duration = 600;
        const startTime = performance.now();
        const tick = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(start + (end - start) * eased));
            if (t < 1) requestAnimationFrame(tick);
            else prev.current = end;
        };
        requestAnimationFrame(tick);
    }, [value]);
    return <>{display}</>;
};
import { useUsers } from '../../../context/UsersContext';

/* ─── INITIAL TEAM MEMBERSHIPS ────────────────── */
const INITIAL_MEMBERSHIPS = {
    2: [
        { id: 3,  name: 'Cody Lane',     email: 'cody.l@whiterock.crm',      phone: '', status: 'Active' },
        { id: 11, name: 'Priya Sharma',  email: 'p.sharma@whiterock.crm',    phone: '', status: 'Active' },
    ],
    5: [
        { id: 6,  name: 'Leo Kumar',     email: 'leo.k@whiterock.crm',       phone: '', status: 'Active' },
        { id: 7,  name: 'Nina Hassan',   email: 'nina.h@whiterock.crm',      phone: '', status: 'Inactive' },
        { id: 13, name: 'Elena Vasquez', email: 'e.vasquez@whiterock.crm',   phone: '', status: 'Active' },
    ],
    8: [
        { id: 12, name: 'Jake Morrison', email: 'j.morrison@whiterock.crm',  phone: '', status: 'Active' },
        { id: 15, name: 'Sophie Tan',    email: 's.tan@whiterock.crm',       phone: '', status: 'Active' },
    ],
    9: [
        { id: 14, name: 'Omar Khalil',   email: 'o.khalil@whiterock.crm',    phone: '', status: 'Inactive' },
    ],
    10: [],
};

/* ─── AVATAR COLORS ───────────────────────────── */
const AVATAR_COLORS = [
    { bg: 'linear-gradient(135deg,#6366f1,#4f46e5)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#10b981,#059669)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#f59e0b,#d97706)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#ef4444,#dc2626)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#0ea5e9,#0284c7)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#ec4899,#db2777)', text: '#fff' },
    { bg: 'linear-gradient(135deg,#14b8a6,#0d9488)', text: '#fff' },
];

const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ─── ICONS ───────────────────────────────────── */
const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconChevron = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14"
        style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IconUsers = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconUserSingle = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const IconTeams = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
    </svg>
);
const IconBan = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);
const IconActivate = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
    </svg>
);
const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconFilter = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

/* ─── USER PICKER MODAL ───────────────────────── */
const UserPickerModal = ({ title, subtitle, iconWrapStyle, confirmLabel, confirmBtnStyle, excludeIds, onClose, onSelect }) => {
    const { users } = useUsers();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState('');

    const available = users.filter(u =>
        !excludeIds.includes(u.id) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()))
    );

    const toggle = (u) => {
        setError('');
        setSelected(prev =>
            prev.find(s => s.id === u.id) ? prev.filter(s => s.id !== u.id) : [...prev, u]
        );
    };

    const allVisibleSelected = available.length > 0 && available.every(u => selected.find(s => s.id === u.id));

    const toggleAll = () => {
        if (allVisibleSelected) {
            setSelected(prev => prev.filter(s => !available.find(u => u.id === s.id)));
        } else {
            const toAdd = available.filter(u => !selected.find(s => s.id === u.id));
            setSelected(prev => [...prev, ...toAdd]);
        }
        setError('');
    };

    const handle = () => {
        if (selected.length === 0) { setError('Please select at least one user.'); return; }
        onSelect(selected);
        onClose();
    };

    return ReactDOM.createPortal(
        <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeIn 0.2s ease' }}
            onClick={onClose}
        >
            <div
                style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 32px 80px rgba(36,71,215,0.18)', width: '100%', maxWidth: '480px', overflow: 'hidden', animation: 'slideUp 0.25s ease' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...iconWrapStyle }}>
                            <IconUsers />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>{title}</h3>
                            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0', fontWeight: 500 }}>
                                {selected.length > 0 ? `${selected.length} user${selected.length > 1 ? 's' : ''} selected` : subtitle}
                            </p>
                        </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', borderRadius: '8px', display: 'flex' }} onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div style={{ padding: '20px 28px' }}>
                    {/* Search + Select All row */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><IconSearch /></span>
                            <input
                                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', padding: '12px 14px 12px 40px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setError(''); }}
                                autoFocus
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                        {available.length > 0 && (
                            <button
                                onClick={toggleAll}
                                style={{ flexShrink: 0, padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${allVisibleSelected ? '#6366f1' : '#e2e8f0'}`, background: allVisibleSelected ? '#eef2ff' : '#f8fafc', color: allVisibleSelected ? '#4f46e5' : '#64748b', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                            >
                                {allVisibleSelected ? 'Deselect All' : 'Select All'}
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {available.length === 0 ? (
                            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{search ? 'No users match your search.' : 'No users available.'}</div>
                            </div>
                        ) : available.map(u => {
                            const av = getAvatarColor(u.id);
                            const isSel = !!selected.find(s => s.id === u.id);
                            return (
                                <div
                                    key={u.id}
                                    onClick={() => toggle(u)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${isSel ? '#6366f1' : '#f1f5f9'}`, background: isSel ? '#eef2ff' : '#fafafa', cursor: 'pointer', transition: 'all 0.15s' }}
                                >
                                    {/* Checkbox */}
                                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${isSel ? '#6366f1' : '#cbd5e1'}`, background: isSel ? '#6366f1' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                                        {isSel && <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>}
                                    </div>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', background: av.bg, color: av.text, flexShrink: 0 }}>{getInitials(u.name)}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: isSel ? '#4f46e5' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>{u.email}</div>
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: u.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: u.status === 'Active' ? '#16a34a' : '#64748b' }}>{u.status}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected chips */}
                    {selected.length > 0 && (
                        <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {selected.map(u => (
                                <div key={u.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px 4px 8px', background: '#eef2ff', border: '1.5px solid #c7d2fe', borderRadius: '999px', fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>
                                    <div style={{ width: '18px', height: '18px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '9px', background: getAvatarColor(u.id).bg, color: '#fff', flexShrink: 0 }}>{getInitials(u.name)}</div>
                                    {u.name}
                                    <button onClick={e => { e.stopPropagation(); toggle(u); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', padding: 0, display: 'flex', lineHeight: 1 }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px', fontWeight: 700, borderRadius: '10px', textAlign: 'center' }}>{error}</div>}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                    <button style={{ flex: 1, padding: '12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#64748b', cursor: 'pointer', transition: 'all 0.15s' }} onClick={onClose}>Cancel</button>
                    <button style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#fff', border: 'none', cursor: selected.length > 0 ? 'pointer' : 'not-allowed', opacity: selected.length > 0 ? 1 : 0.5, transition: 'all 0.15s', ...confirmBtnStyle }} onClick={handle} disabled={selected.length === 0}>
                        {selected.length > 1 ? `${confirmLabel} (${selected.length})` : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

/* ─── ADD TELE AGENT MODAL ────────────────────── */
const AddAgentModal = ({ leaderName, existingMemberIds, onClose, onAdd }) => (
    <UserPickerModal
        title="Add Tele Agent"
        subtitle={`Assign a user to ${leaderName}'s team`}
        iconWrapStyle={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff' }}
        confirmLabel="Add to Team"
        confirmBtnStyle={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
        excludeIds={existingMemberIds}
        onClose={onClose}
        onSelect={onAdd}
    />
);

/* ─── STAT PILL ───────────────────────────────── */
const StatPill = ({ label, value, accent }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '10px 20px', background: '#f8fafc', borderRadius: '12px', minWidth: '80px' }}>
        <span style={{ fontSize: '22px', fontWeight: 900, color: accent || '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{value}</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
);

/* ─── TEAM LEADER CARD ────────────────────────── */
const LeaderCard = ({ leader, onAddAgent, onToggleLeader, onToggleAgent, onRemoveAgent }) => {
    const [expanded, setExpanded] = useState(false);
    const [showAddAgent, setShowAddAgent] = useState(false);
    const av = getAvatarColor(leader.id);
    const activeMembers = leader.members.filter(m => m.status === 'Active').length;
    const totalMembers = leader.members.length;
    const fillPct = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;
    const isActive = leader.status === 'Active';

    return (
        <>
            <div style={{
                background: '#fff',
                borderRadius: '20px',
                border: '1px solid #e8edf5',
                boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
                overflow: 'hidden',
                transition: 'box-shadow 0.25s, transform 0.25s',
                opacity: isActive ? 1 : 0.72,
                fontFamily: "'Sora', sans-serif",
            }}
            onMouseEnter={e => { if (isActive) { e.currentTarget.style.boxShadow = '0 8px 36px rgba(99,102,241,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                {/* Main content */}
                <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '20px', color: av.text, background: av.bg, flexShrink: 0, boxShadow: '0 4px 16px rgba(99,102,241,0.2)', animation: 'avatarPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both', transition: 'box-shadow 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.25), 0 4px 16px rgba(99,102,241,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.2)'; }}
                    >
                        {getInitials(leader.name)}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>{leader.name}</span>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                                background: isActive ? '#dcfce7' : '#f1f5f9',
                                color: isActive ? '#16a34a' : '#64748b',
                                border: `1px solid ${isActive ? '#bbf7d0' : '#e2e8f0'}`
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? '#22c55e' : '#94a3b8', display: 'inline-block', animation: isActive ? 'pulse 2s infinite' : 'none' }} />
                                {leader.status}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
                            <IconMail />
                            {leader.email}
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                        <StatPill label="Total Agents" value={totalMembers} />
                        <div style={{ width: '1px', height: '40px', background: '#e8edf5' }} />
                        <StatPill label="Active" value={activeMembers} accent="#10b981" />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                            onClick={() => onToggleLeader(leader.id)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '9px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                                cursor: 'pointer', border: `1.5px solid ${isActive ? '#fecaca' : '#bfdbfe'}`,
                                background: isActive ? '#fef2f2' : '#eff6ff',
                                color: isActive ? '#dc2626' : '#2563eb', transition: 'all 0.15s'
                            }}
                        >
                            {isActive ? <><IconBan /> Deactivate</> : <><IconActivate /> Activate</>}
                        </button>
                        <button
                            onClick={() => setShowAddAgent(true)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '9px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                                cursor: 'pointer', border: '1.5px solid #d1fae5',
                                background: '#ecfdf5', color: '#059669', transition: 'all 0.15s'
                            }}
                        >
                            <IconPlus /> Add Agent
                        </button>
                        <button
                            onClick={() => setExpanded(e => !e)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '9px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                                cursor: 'pointer', border: 'none',
                                background: expanded ? '#1e293b' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
                                color: '#fff', transition: 'all 0.2s',
                                boxShadow: expanded ? '0 2px 8px rgba(30,41,59,0.2)' : '0 4px 14px rgba(99,102,241,0.3)'
                            }}
                        >
                            View Team ({totalMembers}) <IconChevron open={expanded} />
                        </button>
                    </div>
                </div>



                {/* ── Expanded Members ── */}
                {expanded && (
                    <div style={{ borderTop: '1px solid #f1f5f9', background: '#fafbff', animation: 'expandIn 0.35s cubic-bezier(0.22,1,0.36,1) both', overflow: 'hidden' }}>
                        {/* Section label */}
                        <div style={{ padding: '18px 28px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '3px', height: '18px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', borderRadius: '999px' }} />
                                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                    Tele Agents — {leader.name}'s Team
                                </span>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>{totalMembers} member{totalMembers !== 1 ? 's' : ''}</span>
                        </div>

                        {leader.members.length === 0 ? (
                            <div style={{ padding: '40px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><IconUsers /></div>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>No agents assigned yet.</span>
                                <button style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowAddAgent(true)}>
                                    + Add the first agent
                                </button>
                            </div>
                        ) : (
                            <div style={{ padding: '0 28px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {leader.members.map((member, mi) => {
                                    const mav = getAvatarColor(member.id);
                                    const mActive = member.status === 'Active';
                                    return (
                                        <div key={member.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '14px',
                                            padding: '14px 18px', background: '#fff', borderRadius: '14px',
                                            border: '1px solid #e8edf5', opacity: mActive ? 1 : 0.65,
                                            transition: 'box-shadow 0.2s, opacity 0.2s',
                                            animation: `memberSlide 0.3s ease ${mi * 0.06}s both`,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                                        >
                                            {/* Avatar */}
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', background: mav.bg, color: mav.text, flexShrink: 0 }}>
                                                {getInitials(member.name)}
                                            </div>
                                            {/* Info */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{member.name}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><IconMail />{member.email}</div>
                                            </div>
                                            {/* Status badge */}
                                            <span style={{
                                                fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                                                background: mActive ? '#dcfce7' : '#f1f5f9',
                                                color: mActive ? '#16a34a' : '#64748b',
                                                border: `1px solid ${mActive ? '#bbf7d0' : '#e2e8f0'}`
                                            }}>{member.status}</span>
                                            {/* Action buttons */}
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button
                                                    title={mActive ? 'Deactivate agent' : 'Activate agent'}
                                                    onClick={() => onToggleAgent(leader.id, member.id)}
                                                    style={{ width: '34px', height: '34px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1.5px solid ${mActive ? '#fecaca' : '#bbf7d0'}`, background: mActive ? '#fef2f2' : '#dcfce7', color: mActive ? '#dc2626' : '#16a34a', transition: 'all 0.15s' }}
                                                >
                                                    {mActive ? <IconBan /> : <IconActivate />}
                                                </button>
                                                <button
                                                    title="Remove from team"
                                                    onClick={() => onRemoveAgent(leader.id, member.id)}
                                                    style={{ width: '34px', height: '34px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fecaca'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showAddAgent && (
                <AddAgentModal
                    leaderName={leader.name}
                    existingMemberIds={leader.members.map(m => m.id)}
                    onClose={() => setShowAddAgent(false)}
                    onAdd={users => onAddAgent(leader.id, users)}
                />
            )}
        </>
    );
};

/* ─── MAIN PAGE ───────────────────────────────── */
const TeamLeaders = ({ onNavigate }) => {
    const { users, setUsers } = useUsers();
    const [memberships, setMemberships] = useState(INITIAL_MEMBERSHIPS);
    const [search, setSearch] = useState('');
    const [filterTab, setFilterTab] = useState('All'); // All | Active | Inactive

    const leaders = users
        .filter(u => u.role === 'Team Leader')
        .map(u => ({
            ...u,
            phone: u.phone || '',
            members: memberships[u.id] || [],
        }));

    const totalLeaders = leaders.length;
    const totalAgents = leaders.reduce((sum, l) => sum + l.members.length, 0);
    const activeTeams = leaders.filter(l => l.status === 'Active').length;

    const filtered = leaders.filter(l => {
        const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
        const matchTab = filterTab === 'All' || l.status === filterTab;
        return matchSearch && matchTab;
    });

    const handleAddAgent = (leaderId, users) => {
        const arr = Array.isArray(users) ? users : [users];
        setMemberships(prev => ({
            ...prev,
            [leaderId]: [
                ...(prev[leaderId] || []),
                ...arr.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone || '', status: u.status })),
            ],
        }));
    };

    const handleToggleLeader = (leaderId) => {
        setUsers(prev => prev.map(u => u.id === leaderId
            ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
            : u
        ));
    };

    const handleToggleAgent = (leaderId, memberId) => {
        setMemberships(prev => ({
            ...prev,
            [leaderId]: (prev[leaderId] || []).map(m => m.id === memberId
                ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' }
                : m
            ),
        }));
    };

    const handleRemoveAgent = (leaderId, memberId) => {
        setMemberships(prev => ({
            ...prev,
            [leaderId]: (prev[leaderId] || []).filter(m => m.id !== memberId),
        }));
    };

    const TABS = ['All', 'Active', 'Inactive'];
    const tabCounts = {
        All: leaders.length,
        Active: leaders.filter(l => l.status === 'Active').length,
        Inactive: leaders.filter(l => l.status === 'Inactive').length,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: "'Sora', sans-serif", animation: 'fadeIn 0.25s ease' }}>

            {/* ── MOBILE HEADER PORTAL ── */}
            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="p-4 px-6 fixed top-[60px] left-0 right-0 bg-white border-b border-[#edf2f7] z-40 flex items-center gap-4">
                    <div className="relative group flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#6366f1] transition-colors">
                            <IconSearch />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 pl-12 rounded-2xl text-sm font-bold text-[#0f172a] outline-none focus:bg-white focus:border-[#6366f1]/20 transition-all"
                            placeholder="Search leaders..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="w-12 h-12 bg-[#6366f1] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all" onClick={() => onNavigate('user-management')}>
                        <IconPlus />
                    </button>
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            {/* ── PAGE HEADER ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', animation: 'headerDrop 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Team Leaders</h1>
                    <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, margin: '5px 0 0', animation: 'fadeIn 0.6s 0.15s both' }}>Manage team leaders and their tele agent members.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Search bar */}
                    <div className="lg:hidden" style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><IconSearch /></span>
                        <input
                            style={{ background: '#fff', border: '1.5px solid #e2e8f0', padding: '10px 14px 10px 38px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none', width: '240px', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                            type="text"
                            placeholder="Search team leaders..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <button
                        onClick={() => onNavigate('user-management')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)'; }}
                    >
                        <IconPlus /> Add Team Leader
                    </button>
                </div>
            </div>

            {/* ── KPI CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="lg:grid-cols-1">
                {[
                    { icon: <IconUsers />, value: totalLeaders, label: 'Total Leaders', grad: 'linear-gradient(135deg,#6366f1,#4f46e5)', light: '#eef2ff', soft: '#c7d2fe' },
                    { icon: <IconUserSingle />, value: totalAgents, label: 'Total Tele Agents', grad: 'linear-gradient(135deg,#10b981,#059669)', light: '#ecfdf5', soft: '#a7f3d0' },
                    { icon: <IconTeams />, value: activeTeams, label: 'Active Teams', grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', light: '#f5f3ff', soft: '#ddd6fe' },
                ].map((kpi, i) => (
                    <div key={i} style={{
                        background: '#fff', borderRadius: '18px', border: '1px solid #e8edf5',
                        padding: '24px', display: 'flex', alignItems: 'center', gap: '18px',
                        boxShadow: '0 2px 10px rgba(15,23,42,0.05)', transition: 'box-shadow 0.25s, transform 0.25s',
                        cursor: 'default',
                        animation: `kpiPop 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.1}s both`,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.14)';
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
                        e.currentTarget.querySelector('.kpi-icon').style.transform = 'scale(1.12) rotate(-6deg)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(15,23,42,0.05)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.querySelector('.kpi-icon').style.transform = 'scale(1) rotate(0deg)';
                    }}
                    >
                        <div className="kpi-icon" style={{ width: '56px', height: '56px', borderRadius: '16px', background: kpi.light, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${kpi.soft}`, color: kpi.grad.includes('6366f1') ? '#6366f1' : kpi.grad.includes('10b981') ? '#059669' : '#7c3aed', transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
                            {kpi.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, animation: 'countUp 0.4s ease both', animationDelay: `${0.2 + i * 0.1}s` }}>
                                <AnimatedNumber value={kpi.value} />
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginTop: '4px', letterSpacing: '0.02em' }}>{kpi.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── FILTER TABS ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e8edf5', paddingBottom: '0', animation: 'tabSlide 0.4s 0.3s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px', color: '#94a3b8' }}><IconFilter /></div>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilterTab(tab)}
                        style={{
                            padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                            color: filterTab === tab ? '#6366f1' : '#64748b',
                            borderBottom: `2.5px solid ${filterTab === tab ? '#6366f1' : 'transparent'}`,
                            transition: 'all 0.2s', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        {tab}
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '1px 7px', borderRadius: '999px', background: filterTab === tab ? '#eef2ff' : '#f1f5f9', color: filterTab === tab ? '#6366f1' : '#94a3b8' }}>
                            {tabCounts[tab]}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── LEADERS LIST ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><IconUsers /></div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>No results found</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '380px', margin: 0 }}>{search ? 'Try refining your search or clearing the filter.' : 'Begin by adding your first team leader.'}</p>
                        {!search && filterTab === 'All' && (
                            <button
                                onClick={() => onNavigate('user-management')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)', marginTop: '4px' }}
                            >
                                <IconPlus /> Add Team Leader
                            </button>
                        )}
                    </div>
                ) : (
                    filtered.map((leader, i) => (
                        <div key={leader.id} style={{ animation: `slideUp 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both` }}>
                            <LeaderCard
                                leader={leader}
                                onAddAgent={handleAddAgent}
                                onToggleLeader={handleToggleLeader}
                                onToggleAgent={handleToggleAgent}
                                onRemoveAgent={handleRemoveAgent}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamLeaders;

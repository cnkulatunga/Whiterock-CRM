import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../../../context/ThemeContext';
import UserProfileModal from '../../../components/modals/UserProfileModal';

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

/* ─── RESPONSIVE STYLES ───────────────────────── */
const RESPONSIVE = `
.tl-page-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom: -10px; }
.tl-kpi-grid    { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.tl-tabs        { display:flex; align-items:center; gap:6px; border-bottom:1px solid var(--tl-border); }
.tl-card-body   { padding:14px 20px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.tl-card-stats  { display:flex; gap:6px; align-items:center; flex-shrink:0; }
.tl-card-actions{ display:flex; align-items:center; gap:6px; flex-shrink:0; }
@media (max-width:1100px) {
  .tl-kpi-grid { grid-template-columns:repeat(2,1fr) !important; }
}
@media (max-width:900px) {
  .tl-kpi-grid { grid-template-columns:repeat(2,1fr) !important; }
}
@media (max-width:640px) {
  .tl-page-header { flex-direction:column; }
  .tl-kpi-grid { grid-template-columns:repeat(2,1fr) !important; gap:6px !important; }
  .tl-tabs { overflow-x:auto; padding-bottom:0; -webkit-overflow-scrolling:touch; justify-content:flex-start !important; }
  .tl-tabs-search { display:none !important; }
  .tl-card-body { padding:12px !important; gap:10px !important; }
  .tl-card-stats { order:3; width:100%; border-top:1px solid #f1f5f9; padding-top:10px; }
  .tl-card-actions { order:4; width:100% !important; flex-wrap:wrap; }
  .tl-btn-deactivate { flex:1 1 calc(50% - 4px) !important; justify-content:center !important; }
  .tl-btn-add { flex:1 1 calc(50% - 4px) !important; justify-content:center !important; }
  .tl-btn-view { flex:1 1 100% !important; justify-content:center !important; }
  .tl-section-hdr { padding:12px 14px 8px !important; }
  .tl-members-list { padding:0 14px 14px !important; }
  .tl-member-row { padding:10px 10px !important; }
  .tl-empty-team { padding:24px 14px !important; }
}
@media (max-width:420px) {
  .tl-card-body { padding:12px !important; }
  .tl-stat-pill { padding:6px 8px !important; min-width:60px !important; }
  .tl-stat-val  { font-size:16px !important; }
  .tl-leader-name { font-size:13px !important; }
}
`;
if (typeof document !== 'undefined') {
    let style = document.getElementById('tl-responsive');
    if (!style) {
        style = document.createElement('style');
        style.id = 'tl-responsive';
        document.head.appendChild(style);
    }
    style.innerHTML = RESPONSIVE;
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
import { INITIAL_MEMBERSHIPS, ALL_STATUSES as TABS } from '../../../data/dummyData';

/* ─── AVATAR COLORS ───────────────────────────── */
const AVATAR_COLORS = [
    { bg: '#6366f1', text: '#ffffff', grad: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
    { bg: '#8b5cf6', text: '#ffffff', grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
    { bg: '#10b981', text: '#ffffff', grad: 'linear-gradient(135deg,#10b981,#059669)' },
    { bg: '#f59e0b', text: '#ffffff', grad: 'linear-gradient(135deg,#f59e0b,#d97706)' },
    { bg: '#14b8a6', text: '#ffffff', grad: 'linear-gradient(135deg,#14b8a6,#0d9488)' },
    { bg: '#ef4444', text: '#ffffff', grad: 'linear-gradient(135deg,#ef4444,#dc2626)' },
    { bg: '#0ea5e9', text: '#ffffff', grad: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
    { bg: '#ec4899', text: '#ffffff', grad: 'linear-gradient(135deg,#ec4899,#db2777)' },
];

const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);


const getAvatarColor = (id) => {
    const color = AVATAR_COLORS[id % AVATAR_COLORS.length];
    return { bg: color.bg, text: color.text };
};

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
const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.88 12.88 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const modalBg = isDark ? '#1f2347' : '#fff';
    const borderCol = isDark ? '#2c3568' : '#f1f5f9';
    const inputBg = isDark ? '#242b50' : '#f8fafc';
    const inputBorderCol = isDark ? '#36407a' : '#e2e8f0';
    const textPrimary = isDark ? '#e4ecff' : '#0f172a';
    const textMuted = isDark ? '#546298' : '#94a3b8';
    const rowBg = isDark ? '#2a3258' : '#fafafa';
    const cancelBg = isDark ? '#313a6e' : '#f8fafc';
    const cancelBorder = isDark ? '#3e4a88' : '#e2e8f0';
    const cancelColor = isDark ? '#94abda' : '#64748b';
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
                style={{ background: modalBg, borderRadius: '24px', boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.5)' : '0 32px 80px rgba(36,71,215,0.18)', width: '100%', maxWidth: '480px', overflow: 'hidden', animation: 'slideUp 0.25s ease' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ padding: '28px 28px 20px', borderBottom: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...iconWrapStyle }}>
                            <IconUsers />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '17px', fontWeight: 800, color: textPrimary, margin: 0, letterSpacing: '-0.3px' }}>{title}</h3>
                            <p style={{ fontSize: '13px', color: textMuted, margin: '4px 0 0', fontWeight: 500 }}>
                                {selected.length > 0 ? `${selected.length} user${selected.length > 1 ? 's' : ''} selected` : subtitle}
                            </p>
                        </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', borderRadius: '8px', display: 'flex' }} onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div style={{ padding: '20px 28px' }}>
                    {/* Search + Select All row */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><IconSearch /></span>
                            <input
                                style={{ width: '100%', background: inputBg, border: `1.5px solid ${inputBorderCol}`, padding: '12px 14px 12px 40px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: textPrimary, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setError(''); }}
                                autoFocus
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = inputBorderCol}
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
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${isSel ? '#6366f1' : (isDark ? '#36407a' : '#f1f5f9')}`, background: isSel ? (isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff') : rowBg, cursor: 'pointer', transition: 'all 0.15s' }}
                                >
                                    {/* Checkbox */}
                                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${isSel ? '#6366f1' : (isDark ? '#3e4a88' : '#cbd5e1')}`, background: isSel ? '#6366f1' : (isDark ? '#242b50' : '#fff'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                                        {isSel && <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" width="10" height="10"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </div>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', background: av.bg, color: av.text, flexShrink: 0 }}>{getInitials(u.name)}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: isSel ? '#818cf8' : textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                        <div style={{ fontSize: '11px', color: textMuted, fontWeight: 500 }}>{u.email}</div>
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
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px', fontWeight: 700, borderRadius: '10px', textAlign: 'center' }}>{error}</div>}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 28px 24px', borderTop: `1px solid ${borderCol}`, display: 'flex', gap: '12px' }}>
                    <button style={{ flex: 1, padding: '12px', background: cancelBg, border: `1.5px solid ${cancelBorder}`, borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: cancelColor, cursor: 'pointer', transition: 'all 0.15s' }} onClick={onClose}>Cancel</button>
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
const StatPill = ({ label, value, accent, isDark }) => (
    <div className="tl-stat-pill" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', padding: '6px 14px', background: isDark ? 'rgba(99,102,241,0.06)' : '#f8fafc', borderRadius: '10px', minWidth: '70px', border: `1px solid ${isDark ? 'rgba(99,102,241,0.12)' : '#f1f5f9'}` }}>
        <span className="tl-stat-val" style={{ fontSize: '18px', fontWeight: 900, color: accent || (isDark ? '#e4ecff' : '#1e293b'), letterSpacing: '-0.3px', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: '9px', fontWeight: 800, color: isDark ? '#94abda' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
);

/* ─── TEAM LEADER CARD ────────────────────────── */
const LeaderCard = ({ leader, onAddAgent, onToggleLeader, onToggleAgent, onRemoveAgent, onClick, setProfileLeader, isDark }) => {
    const [expanded, setExpanded] = useState(false);
    const [showAddAgent, setShowAddAgent] = useState(false);
    const [profileAgent, setProfileAgent] = useState(null);
    const activeMembers = leader.members.filter(m => m.status === 'Active').length;
    const totalMembers = leader.members.length;
    const isActive = leader.status === 'Active';

    return (
        <>
            <div style={{
                background: isDark ? '#1e2347' : '#fff',
                borderRadius: '16px',
                border: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`,
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 2px 8px rgba(15,23,42,0.04)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isActive ? 1 : 0.72,
                fontFamily: "'Sora', sans-serif",
            }}
                onMouseEnter={e => {
                    if (isActive) {
                        e.currentTarget.style.boxShadow = isDark ? '0 12px 32px rgba(99,102,241,0.2)' : '0 8px 24px rgba(99,102,241,0.08)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = isDark ? '#4f46e5' : '#6366f190';
                    }
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 2px 8px rgba(15,23,42,0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isDark ? '#2c3568' : '#f1f5f9';
                }}
            >
                {/* Main content */}
                <div className="tl-card-body">
                    {/* Avatar & Info (Clickable) */}
                    <div 
                        onClick={() => setProfileLeader(leader)}
                        style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0, cursor: 'pointer' }}
                        className="tl-card-info-wrap"
                    >
                        {/* Avatar */}
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '15px', color: leader.textColor, background: leader.color, flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.15)', animation: 'avatarPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both', transition: 'box-shadow 0.25s' }}>
                            {getInitials(leader.name)}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '1px' }}>
                                <span className="tl-leader-name" style={{ fontSize: '14px', fontWeight: 800, color: isDark ? '#e4ecff' : '#1e293b', letterSpacing: '-0.2px' }}>{leader.name}</span>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px',
                                    background: isActive ? (isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5') : (isDark ? 'rgba(148,163,184,0.1)' : '#f8fafc'),
                                    color: isActive ? '#10b981' : '#64748b',
                                    border: `1px solid ${isActive ? (isDark ? 'rgba(16,185,129,0.2)' : '#d1fae5') : (isDark ? 'rgba(148,163,184,0.2)' : '#e2e8f0')}`,
                                    textTransform: 'uppercase', letterSpacing: '0.04em'
                                }}>
                                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isActive ? '#22c55e' : '#94a3b8', display: 'inline-block', animation: isActive ? 'pulse 2s infinite' : 'none' }} />
                                    {leader.status}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
                                <IconMail />
                                {leader.email}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="tl-card-stats">
                        <StatPill label="Total Agents" value={totalMembers} isDark={isDark} />
                        <div style={{ width: '1px', height: '32px', background: isDark ? '#36407a' : '#f1f5f9' }} />
                        <StatPill label="Active" value={activeMembers} accent="#10b981" isDark={isDark} />
                    </div>

                    {/* Actions */}
                    <div className="tl-card-actions">
                        <button
                            className="tl-btn-deactivate"
                            onClick={() => onToggleLeader(leader.id)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '8px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800,
                                cursor: 'pointer', border: `1.5px solid ${isActive ? (isDark ? '#5c2d2d' : '#fee2e2') : (isDark ? '#2d3d5c' : '#dbeafe')}`,
                                background: isActive ? (isDark ? 'rgba(239, 68, 68, 0.08)' : '#fffafb') : (isDark ? 'rgba(37, 99, 235, 0.08)' : '#f5f9ff'),
                                color: isActive ? '#f87171' : '#60a5fa', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.04em'
                            }}
                        >
                            {isActive ? <><IconBan /> Deactivate</> : <><IconActivate /> Activate</>}
                        </button>
                        <button
                            className="tl-btn-add"
                            onClick={() => setShowAddAgent(true)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '8px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800,
                                cursor: 'pointer', border: `1.5px solid ${isDark ? '#1a4d36' : '#d1fae5'}`,
                                background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4',
                                color: '#10b981', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.04em'
                            }}
                        >
                            <IconPlus /> Add Agent
                        </button>
                        <button
                            className="tl-btn-view"
                            onClick={() => setExpanded(e => !e)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '8px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 800,
                                cursor: 'pointer', border: 'none',
                                background: expanded ? (isDark ? '#2c3568' : '#334155') : 'linear-gradient(135deg,#6366f1,#4f46e5)',
                                color: '#fff', transition: 'all 0.2s',
                                boxShadow: expanded ? 'none' : '0 4px 12px rgba(99,102,241,0.25)',
                                textTransform: 'uppercase', letterSpacing: '0.04em'
                            }}
                        >
                            Team ({totalMembers}) <IconChevron open={expanded} />
                        </button>
                    </div>
                </div>



                {/* ── Expanded Members ── */}
                {expanded && (
                    <div style={{ borderTop: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`, background: isDark ? '#1e2245' : '#fdfdff', animation: 'expandIn 0.35s cubic-bezier(0.22,1,0.36,1) both', overflow: 'hidden' }}>
                        {/* Section label */}
                        <div className="tl-section-hdr" style={{ padding: '12px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '2px', height: '14px', background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', borderRadius: '999px' }} />
                                <span style={{ fontSize: '10px', fontWeight: 900, color: isDark ? '#94abda' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Tele Agents — {leader.name}'s Team
                                </span>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>{totalMembers} member{totalMembers !== 1 ? 's' : ''}</span>
                        </div>

                        {leader.members.length === 0 ? (
                            <div className="tl-empty-team" style={{ padding: '40px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><IconUsers /></div>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>No agents assigned yet.</span>
                                <button style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowAddAgent(true)}>
                                    + Add the first agent
                                </button>
                            </div>
                        ) : (
                            <div className="tl-members-list" style={{ padding: '0 28px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {leader.members.map((member, mi) => {
                                    const mActive = member.status === 'Active';
                                    return (
                                        <div key={member.id} className="tl-member-row" style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '8px 14px', background: isDark ? 'rgba(99,102,241,0.03)' : '#fff', borderRadius: '12px',
                                            border: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`, opacity: mActive ? 1 : 0.65,
                                            transition: 'all 0.2s ease', cursor: 'pointer',
                                            animation: `memberSlide 0.3s ease ${mi * 0.06}s both`,
                                        }}
                                            onClick={() => setProfileAgent(member)}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = isDark ? '#4f46e5' : '#6366f170';
                                                e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.06)' : '#f8faff';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = isDark ? '#2c3568' : '#f1f5f9';
                                                e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.03)' : '#fff';
                                            }}
                                        >
                                            {/* Avatar */}
                                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', background: member.color, color: member.textColor || '#ffffff', flexShrink: 0 }}>
                                                {getInitials(member.name)}
                                            </div>
                                            {/* Info: name + email + status badge stacked */}
                                            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#e4ecff' : '#334155' }}>{member.name}</span>
                                                    <span style={{
                                                        fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px',
                                                        background: mActive ? (isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5') : (isDark ? 'rgba(148,163,184,0.1)' : '#f1f5f9'),
                                                        color: mActive ? '#10b981' : '#64748b',
                                                        border: `1px solid ${mActive ? (isDark ? 'rgba(16,185,129,0.2)' : '#bbf7d0') : '#e2e8f0'}`,
                                                        textTransform: 'uppercase', flexShrink: 0
                                                    }}>{member.status}</span>
                                                </div>
                                                <div style={{ fontSize: '11px', color: isDark ? '#546298' : '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                                                    <IconMail />
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</span>
                                                </div>
                                            </div>
                                            {/* Action buttons */}
                                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <button
                                                    title={mActive ? 'Deactivate agent' : 'Activate agent'}
                                                    onClick={() => onToggleAgent(leader.id, member.id)}
                                                    style={{
                                                        width: '28px', height: '28px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                        border: `1px solid ${mActive ? (isDark ? '#5c2d2d' : '#fee2e2') : (isDark ? '#1a4d36' : '#dcfce7')}`,
                                                        background: mActive ? (isDark ? 'rgba(239, 68, 68, 0.08)' : '#fffafb') : (isDark ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4'),
                                                        color: mActive ? '#f87171' : '#10b981', transition: 'all 0.15s'
                                                    }}
                                                >
                                                    {mActive ? <IconBan /> : <IconActivate />}
                                                </button>
                                                <button
                                                    title="Remove from team"
                                                    onClick={() => onRemoveAgent(leader.id, member.id)}
                                                    style={{ width: '28px', height: '28px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${isDark ? '#36407a' : '#f1f5f9'}`, background: isDark ? '#1e2347' : '#f8fafc', color: isDark ? '#94abda' : '#94a3b8', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = isDark ? 'rgba(239, 68, 68, 0.08)' : '#fee2e2';
                                                        e.currentTarget.style.color = '#f87171';
                                                        e.currentTarget.style.borderColor = isDark ? '#5c2d2d' : '#fecaca';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = isDark ? '#1e2347' : '#f8fafc';
                                                        e.currentTarget.style.color = isDark ? '#94abda' : '#94a3b8';
                                                        e.currentTarget.style.borderColor = isDark ? '#36407a' : '#f1f5f9';
                                                    }}
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
            {profileAgent && (
                <UserProfileModal
                    user={profileAgent}
                    onClose={() => setProfileAgent(null)}
                />
            )}
        </>
    );
};

/* ─── LEADER DETAILS ─────────────────────────── */
const LeaderDetails = ({ leader, onBack, onAddAgent, onToggleLeader, onToggleAgent, onRemoveAgent, isDark }) => {
    const activeMembers = leader.members.filter(m => m.status === 'Active').length;
    const totalMembers = leader.members.length;
    const isActive = leader.status === 'Active';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
            {/* Header / Back */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                    onClick={onBack}
                    style={{ 
                        width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        background: isDark ? '#2a3258' : '#f8fafc', border: `1px solid ${isDark ? '#36407a' : '#f1f5f9'}`, color: isDark ? '#94abda' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' 
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#36407a' : '#f1f5f9'; e.currentTarget.style.color = '#6366f1'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#2a3258' : '#f8fafc'; e.currentTarget.style.color = isDark ? '#94abda' : '#64748b'; }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, color: isDark ? '#e4ecff' : '#1e293b', margin: 0, letterSpacing: '-0.2px' }}>Leader Details</h2>
                        <button 
                            onClick={() => setProfileLeader(leader)}
                            style={{ 
                                padding: '3px 8px', borderRadius: '6px', background: isDark ? 'rgba(99,102,241,0.08)' : '#f5f7ff', 
                                border: `1px solid ${isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff'}`, color: '#6366f1', fontSize: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(99, 102, 241, 0.08)' : '#f5f7ff'; e.currentTarget.style.color = '#6366f1'; }}
                        >
                            View Profile
                        </button>
                    </div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0', fontWeight: 500 }}>Profile and Team Overview</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }} className="tl-details-grid">
                {/* Left: Profile Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ 
                        background: isDark ? '#1e2347' : '#fff', borderRadius: '20px', border: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`, overflow: 'hidden',
                        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 2px 8px rgba(15,23,42,0.04)'
                    }}>
                        <div style={{ height: '60px', background: leader.grad || 'linear-gradient(135deg,#6366f1,#4f46e5)' }} />
                        <div style={{ padding: '0 20px 20px', marginTop: '-30px', textAlign: 'center' }}>
                            <div style={{ 
                                width: '64px', height: '64px', borderRadius: '18px', background: leader.color, color: leader.textColor, margin: '0 auto 12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, border: `3px solid ${isDark ? '#1e2347' : '#fff'}`,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                {getInitials(leader.name)}
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, color: isDark ? '#e4ecff' : '#1e293b', margin: '0 0 4px', letterSpacing: '-0.2px' }}>{leader.name}</h3>
                            <span style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 10px', borderRadius: '999px', fontSize: '9px', fontWeight: 800,
                                background: isActive ? (isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5') : (isDark ? 'rgba(148,163,184,0.1)' : '#f8fafc'), color: isActive ? '#10b981' : '#64748b', border: `1px solid ${isActive ? (isDark ? 'rgba(16,185,129,0.2)' : '#d1fae5') : (isDark ? 'rgba(148,163,184,0.2)' : '#e2e8f0')}`, textTransform: 'uppercase'
                            }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isActive ? '#10b981' : '#94a3b8' }} />
                                {leader.status}
                            </span>

                            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: isDark ? 'rgba(99,102,241,0.04)' : '#f8faff', borderRadius: '12px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isDark ? '#2a3258' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}><IconMail /></div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#e4ecff' : '#334155', textOverflow: 'ellipsis', overflow: 'hidden' }}>{leader.email}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: isDark ? 'rgba(99,102,241,0.04)' : '#f8faff', borderRadius: '12px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isDark ? '#2a3258' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}><IconPhone /></div>
                                    <div>
                                        <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone</div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#e4ecff' : '#334155' }}>{leader.phone || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onToggleLeader(leader.id)}
                                style={{
                                    width: '100%', marginTop: '16px', padding: '10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer',
                                    border: `1.5px solid ${isActive ? (isDark ? '#5c2d2d' : '#fee2e2') : (isDark ? '#2d3d5c' : '#dbeafe')}`, background: isActive ? (isDark ? 'rgba(239, 68, 68, 0.08)' : '#fffafa') : (isDark ? 'rgba(37, 99, 235, 0.08)' : '#f5f9ff'), color: isActive ? '#f87171' : '#60a5fa', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.04em'
                                }}
                            >
                                {isActive ? 'Deactivate Account' : 'Activate Account'}
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div style={{ background: isDark ? '#1e2347' : '#fff', borderRadius: '20px', border: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`, padding: '18px 20px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 2px 8px rgba(15,23,42,0.04)' }}>
                        <h4 style={{ fontSize: '11px', fontWeight: 900, color: isDark ? '#e4ecff' : '#64748b', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <IconTeams /> Team Overview
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ padding: '12px', background: isDark ? 'rgba(99,102,241,0.04)' : '#f8faff', borderRadius: '12px', textAlign: 'center', border: `1px solid ${isDark ? 'rgba(99,102,241,0.08)' : '#f1f5f9'}` }}>
                                <div style={{ fontSize: '20px', fontWeight: 900, color: '#6366f1' }}>{totalMembers}</div>
                                <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.04em' }}>Agents</div>
                            </div>
                            <div style={{ padding: '12px', background: isDark ? 'rgba(16,185,129,0.04)' : '#f0fdf4', borderRadius: '12px', textAlign: 'center', border: `1px solid ${isDark ? 'rgba(16,185,129,0.08)' : '#d1fae5'}` }}>
                                <div style={{ fontSize: '20px', fontWeight: 900, color: '#10b981' }}>{activeMembers}</div>
                                <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.04em' }}>Active</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Team Members List */}
                <div style={{ background: isDark ? '#1e2347' : '#fff', borderRadius: '20px', border: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 2px 8px rgba(15,23,42,0.04)' }}>
                    <div style={{ padding: '16px 20px', borderBottom: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDark ? 'rgba(99,102,241,0.02)' : '#f8faff' }}>
                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 900, color: isDark ? '#e4ecff' : '#334155', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tele Agent Members</h4>
                            <p style={{ fontSize: '10px', color: '#94a3b8', margin: '1px 0 0', fontWeight: 500 }}>Manage access and roles for this team</p>
                        </div>
                        <button 
                            onClick={() => onAddAgent(leader.id)}
                            style={{ padding: '8px 14px', borderRadius: '10px', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none', fontSize: '11px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            <IconPlus /> Add Agent
                        </button>
                    </div>

                    <div style={{ padding: '14px 20px', flex: 1 }}>
                        {leader.members.length === 0 ? (
                            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600 }}>No agents assigned yet.</div>
                                <button style={{ fontSize: '11px', fontWeight: 800, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '6px' }} onClick={() => onAddAgent(leader.id)}>Assign first agent</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {leader.members.map((member, mi) => (
                                    <div key={member.id} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', 
                                        background: isDark ? 'rgba(99,102,241,0.03)' : '#fff', border: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}`,
                                        animation: `memberSlide 0.3s ease ${mi * 0.05}s both`
                                    }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0, background: member.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                                            {getInitials(member.name)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#e4ecff' : '#334155' }}>{member.name}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}><IconMail /> {member.email}</div>
                                        </div>
                                        <span style={{ 
                                            fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase',
                                            background: member.status === 'Active' ? (isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5') : (isDark ? 'rgba(148,163,184,0.1)' : '#f1f5f9'), color: member.status === 'Active' ? '#10b981' : '#64748b', border: `1px solid ${member.status === 'Active' ? (isDark ? 'rgba(16,185,129,0.2)' : '#bbf7d0') : '#e2e8f0'}`
                                        }}>{member.status}</span>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={() => onToggleAgent(leader.id, member.id)} style={{ width: '28px', height: '28px', borderRadius: '7px', border: 'none', background: member.status === 'Active' ? (isDark ? 'rgba(239, 68, 68, 0.08)' : '#fffafa') : (isDark ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4'), color: member.status === 'Active' ? '#f87171' : '#10b981', cursor: 'pointer', border: `1px solid ${member.status === 'Active' ? (isDark ? '#5c2d2d' : '#fee2e2') : (isDark ? '#1a4d36' : '#d1fae5')}` }}>
                                                {member.status === 'Active' ? <IconBan /> : <IconActivate />}
                                            </button>
                                            <button onClick={() => onRemoveAgent(leader.id, member.id)} style={{ width: '28px', height: '28px', borderRadius: '7px', border: 'none', background: isDark ? '#1e2347' : '#fff', color: '#94a3b8', cursor: 'pointer', border: `1px solid ${isDark ? '#2c3568' : '#f1f5f9'}` }}>
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── MAIN PAGE ───────────────────────────────── */
const TeamLeaders = ({ onNavigate }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { users, setUsers } = useUsers();
    const [memberships, setMemberships] = useState(INITIAL_MEMBERSHIPS);
    const [search, setSearch] = useState('');
    const [filterTab, setFilterTab] = useState('All'); // All | Active | Inactive
    const [selectedLeader, setSelectedLeader] = useState(null);
    const [profileLeader, setProfileLeader] = useState(null);

    const tlTABS = ['All', 'Active', 'Inactive'];

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

    // TABS imported from dummyData
    const tabCounts = {
        All: leaders.length,
        Active: leaders.filter(l => l.status === 'Active').length,
        Inactive: leaders.filter(l => l.status === 'Inactive').length,
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            fontFamily: "'Sora', sans-serif",
            animation: 'fadeIn 0.25s ease',
            '--tl-border': isDark ? '#2c3568' : '#e8edf5'
        }}>

            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="p-4 px-6 fixed top-[60px] left-0 right-0 z-40 flex items-center gap-4" style={{
                    background: isDark ? '#1e2347' : '#ffffff',
                    borderBottom: `1px solid ${isDark ? '#2c3568' : '#edf2f7'}`
                }}>
                    <div className="relative group flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#6366f1] transition-colors">
                            <IconSearch />
                        </div>
                        <input
                            type="text"
                            className="w-full border-2 border-transparent p-3 pl-12 rounded-2xl text-sm font-bold outline-none transition-all"
                            style={{
                                background: isDark ? '#2a3258' : '#f1f5f9',
                                color: isDark ? '#e4ecff' : '#0f172a'
                            }}
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

            <div className="tl-page-header" style={{ justifyContent: 'flex-end', animation: 'headerDrop 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
                <div />
            </div>

            {/* ── CONDITIONAL CONTENT ── */}
            {selectedLeader ? (
                <LeaderDetails
                    leader={selectedLeader}
                    onBack={() => setSelectedLeader(null)}
                    onAddAgent={handleAddAgent}
                    onToggleLeader={handleToggleLeader}
                    onToggleAgent={handleToggleAgent}
                    onRemoveAgent={handleRemoveAgent}
                    isDark={isDark}
                />
            ) : (
                <>
                    {/* ── KPI CARDS ── */}
                    <div className="tl-kpi-grid">
                        {[
                            { icon: <IconUsers width={18} height={18} />, value: totalLeaders, label: 'Total Leaders', color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-100/40 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20', iconBg: 'bg-indigo-600' },
                            { icon: <IconUserSingle width={18} height={18} />, value: totalAgents, label: 'Total Tele Agents', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100/40 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', iconBg: 'bg-emerald-500' },
                            { icon: <IconTeams width={18} height={18} />, value: activeTeams, label: 'Active Teams', color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-100/40 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/20', iconBg: 'bg-violet-600' },
                        ].map((kpi, i) => (
                            <div key={i} className={`${kpi.bg} ${kpi.border} border rounded-2xl sm:rounded-xl p-4 sm:p-2 flex items-center gap-4 sm:gap-2 shadow-sm hover:-translate-y-1 transition-all duration-300 animate-kpiPop`}
                                style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: 'both' }}>
                                <div className={`w-11 h-11 sm:w-8 sm:h-8 rounded-full ${kpi.iconBg} text-white flex-shrink-0 flex items-center justify-center shadow-md`}>
                                    {kpi.icon}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className={`text-[10px] sm:text-[7px] font-black ${kpi.color} uppercase tracking-widest leading-none mb-1 opacity-70`}>{kpi.label}</span>
                                    <h2 className={`text-[26px] sm:text-sm font-black leading-none tracking-tight ${kpi.color}`}>
                                        <AnimatedNumber value={kpi.value} />
                                    </h2>
                                </div>
                            </div>
                        ))}

                        {/* Add Team Leader Action Card */}
                        <button
                            onClick={() => onNavigate('user-management', { openCreate: true })}
                            className="bg-rose-100/40 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 border rounded-2xl sm:rounded-xl p-4 sm:p-2 flex items-center gap-4 sm:gap-2 shadow-sm hover:-translate-y-1 transition-all duration-300 animate-kpiPop group"
                            style={{ animationDelay: '340ms', animationFillMode: 'both' }}
                        >
                            <div className="w-11 h-11 sm:w-8 sm:h-8 rounded-full bg-rose-600 text-white flex-shrink-0 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                <IconPlus width={20} height={20} />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] sm:text-[7px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1 opacity-70">Quick Action</span>
                                <h2 className="text-[16px] sm:text-sm font-black leading-none text-rose-700 dark:text-rose-400 uppercase tracking-tighter">Add Leader</h2>
                            </div>
                        </button>
                    </div>

                    {/* ── FILTER TABS + SEARCH ── */}
                    <div className="tl-tabs" style={{ animation: 'tabSlide 0.4s 0.3s both', gap: '4px', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px', color: '#94a3b8' }}><IconFilter /></div>
                            {tlTABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterTab(tab)}
                                    style={{
                                        padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 800,
                                        color: filterTab === tab ? '#6366f1' : '#64748b',
                                        borderBottom: `2px solid ${filterTab === tab ? '#6366f1' : 'transparent'}`,
                                        transition: 'all 0.2s', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '5px',
                                        textTransform: 'uppercase', letterSpacing: '0.04em'
                                    }}
                                >
                                    {tab}
                                    <span style={{ 
                                        fontSize: '9px', 
                                        fontWeight: 900, 
                                        padding: '1px 6px', 
                                        borderRadius: '999px', 
                                        background: filterTab === tab ? (isDark ? 'rgba(99,102,241,0.12)' : '#f0f4ff') : (isDark ? '#2a3258' : '#f8fafc'), 
                                        color: filterTab === tab ? '#818cf8' : '#94a3b8',
                                        border: `1px solid ${filterTab === tab ? (isDark ? 'rgba(99,102,241,0.2)' : '#e0e7ff') : 'transparent'}`
                                    }}>
                                        {tabCounts[tab]}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {/* Search — desktop only, inline with tabs */}
                        <div className="tl-tabs-search" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '4px' }}>
                            <div style={{ position: 'relative' }}>
                                <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <input
                                    type="text"
                                    style={{
                                        paddingLeft: '30px', paddingRight: '12px', paddingTop: '5px', paddingBottom: '5px',
                                        borderRadius: '10px', border: `1px solid ${isDark ? '#2c3568' : '#e2e8f0'}`,
                                        background: isDark ? '#151932' : '#f8fafc',
                                        fontSize: '12px', fontWeight: 600, outline: 'none', width: '180px',
                                        color: isDark ? '#e4ecff' : '#0f172a',
                                        transition: 'border-color 0.2s, width 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.width = '220px'; }}
                                    onBlur={e => { e.target.style.borderColor = isDark ? '#2c3568' : '#e2e8f0'; e.target.style.width = '180px'; }}
                                    placeholder="Search leaders..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── LEADERS LIST ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filtered.length === 0 ? (
                            <div style={{ 
                                padding: '60px 24px', 
                                textAlign: 'center', 
                                background: isDark ? '#1e2347' : '#fff', 
                                borderRadius: '20px', 
                                border: `2px dashed ${isDark ? '#2c3568' : '#e2e8f0'}`, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '16px' 
                            }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isDark ? '#2a3258' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#4b5563' : '#cbd5e1' }}><IconUsers /></div>
                                <h3 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#e4ecff' : '#0f172a', margin: 0 }}>No results found</h3>
                                <p style={{ fontSize: '14px', color: isDark ? '#94abda' : '#64748b', maxWidth: '380px', margin: 0 }}>{search ? 'Try refining your search or clearing the filter.' : 'Begin by adding your first team leader.'}</p>
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
                                        onClick={setSelectedLeader}
                                        setProfileLeader={setProfileLeader}
                                        isDark={isDark}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
            {profileLeader && (
                <UserProfileModal
                    user={profileLeader}
                    onClose={() => setProfileLeader(null)}
                />
            )}
        </div>
    );
};

export default TeamLeaders;

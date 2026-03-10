import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useUsers } from '../../../context/UsersContext';

/* ─── INITIAL TEAM MEMBERSHIPS (leaderId → members[]) ── */
const INITIAL_MEMBERSHIPS = {
    2: [ // Marcus Smith's team
        { id: 3, name: 'Cody Lane', email: 'cody.l@whiterock.crm', phone: '', status: 'Active' },
    ],
    5: [ // Diana Fernandez's team
        { id: 6, name: 'Leo Kumar', email: 'leo.k@whiterock.crm', phone: '', status: 'Active' },
        { id: 7, name: 'Nina Hassan', email: 'nina.h@whiterock.crm', phone: '', status: 'Inactive' },
    ],
};

/* ─── AVATAR COLORS ───────────────────────────── */
const AVATAR_COLORS = [
    { bg: '#ebf0ff', text: '#2447d7' },
    { bg: '#f3e8ff', text: '#7c3aed' },
    { bg: '#ecfdf5', text: '#059669' },
    { bg: '#fffbeb', text: '#d97706' },
    { bg: '#fef2f2', text: '#dc2626' },
    { bg: '#e0f2fe', text: '#0ea5e9' },
    { bg: '#fdf2f8', text: '#db2777' },
    { bg: '#f8fafc', text: '#475569' },
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
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16"
        className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
const IconUsers = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconUserSingle = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const IconTeams = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
    </svg>
);
const IconBan = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);
const IconActivate = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
    </svg>
);

/* ─── SHARED: USER PICKER MODAL ───────────────── */
const UserPickerModal = ({ title, subtitle, iconWrapClass, confirmLabel, confirmBtnClass, excludeIds, onClose, onSelect }) => {
    const { users } = useUsers();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState('');

    const available = users.filter(u =>
        !excludeIds.includes(u.id) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()))
    );

    const handle = () => {
        if (!selected) { setError('Please select a user.'); return; }
        onSelect(selected);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fadeIn p-6" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[500px] overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 border-b border-[#f1f5f9] flex justify-between items-start">
                    <div className="flex gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${iconWrapClass}`}>
                            <IconUsers />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-black text-[#1a202c] tracking-tight">{title}</h3>
                            <p className="text-[13px] font-medium text-[#718096] leading-relaxed">{subtitle}</p>
                        </div>
                    </div>
                    <button className="text-[#a0aec0] hover:text-[#1a202c] transition-colors p-2" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="p-8">
                    <div className="relative group mb-6">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                            <IconSearch />
                        </div>
                        <input
                            className="w-full bg-[#f8fafc] border-2 border-[#edf2f7] p-4 pl-14 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all"
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setError(''); }}
                            autoFocus
                        />
                    </div>

                    <div className="max-h-[320px] overflow-y-auto flex flex-col gap-3 pr-2 custom-scrollbar">
                        {available.length === 0 ? (
                            <div className="py-12 text-center flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#cbd5e0]">
                                    <IconSearch />
                                </div>
                                <span className="text-[14px] font-bold text-[#cbd5e0]">{search ? 'No users match your search.' : 'No users available to assign.'}</span>
                            </div>
                        ) : (
                            available.map((u) => {
                                const av = getAvatarColor(u.id);
                                const isSelected = selected?.id === u.id;
                                return (
                                    <div
                                        key={u.id}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${isSelected ? 'border-[#2447d7] bg-[#f0f4ff]' : 'border-transparent bg-[#f8fafc] hover:bg-white hover:border-[#edf2f7] hover:shadow-md'}`}
                                        onClick={() => { setSelected(u); setError(''); }}
                                    >
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[13px] shadow-sm transform transition-transform group-hover:scale-110" style={{ background: av.bg, color: av.text }}>
                                            {getInitials(u.name)}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className={`text-[14px] font-black truncate tracking-tight ${isSelected ? 'text-[#2447d7]' : 'text-[#1a202c]'}`}>{u.name}</span>
                                            <span className="text-[11px] font-bold text-[#a0aec0] truncate">{u.email}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${u.status === 'Active' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]'}`}>
                                            <div className={`w-1 h-1 rounded-full ${u.status === 'Active' ? 'bg-[#059669]' : 'bg-[#64748b]'}`} />
                                            {u.status}
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-[#2447d7] flex items-center justify-center text-white scale-125 animate-popIn">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {error && <div className="mt-4 p-3 bg-[#fef2f2] border border-[#fee2e2] text-[#dc2626] text-[12px] font-black uppercase tracking-wider text-center rounded-xl animate-shake">{error}</div>}
                </div>

                <div className="p-8 bg-[#fcfdff] border-t border-[#f1f5f9] flex gap-4">
                    <button className="flex-1 p-4 bg-white border-2 border-[#edf2f7] rounded-2xl text-[14px] font-black text-[#718096] hover:bg-[#f8fafc] transition-all active:scale-95" onClick={onClose}>Cancel</button>
                    <button className={`flex-1 p-4 rounded-2xl text-[14px] font-black text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${confirmBtnClass}`} onClick={handle} disabled={!selected}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── MODAL: ADD TELE AGENT ───────────────────── */
const AddAgentModal = ({ leaderName, existingMemberIds, onClose, onAdd }) => (
    <UserPickerModal
        title="Add Tele Agent"
        subtitle={`Select a user to assign to ${leaderName}'s team`}
        iconWrapClass="bg-[#ebfef5] text-[#059669]"
        confirmLabel="Add to Team"
        confirmBtnClass="bg-[#10b981] shadow-[#10b981]/20 hover:bg-[#059669]"
        excludeIds={existingMemberIds}
        onClose={onClose}
        onSelect={onAdd}
    />
);

/* ─── TEAM LEADER CARD ────────────────────────── */
const LeaderCard = ({ leader, onAddAgent, onToggleLeader, onToggleAgent, onRemoveAgent }) => {
    const [expanded, setExpanded] = useState(false);
    const [showAddAgent, setShowAddAgent] = useState(false);
    const av = getAvatarColor(leader.id);
    const activeMembers = leader.members.filter(m => m.status === 'Active').length;

    return (
        <>
            <div className={`bg-white rounded-[2.5rem] border border-[#edf2f7] shadow-sm overflow-hidden transition-all duration-500 flex flex-col group ${leader.status === 'Inactive' ? 'opacity-70 grayscale-[0.5]' : 'hover:shadow-2xl hover:translate-y-[-4px]'}`}>
                {/* ── Card Header ── */}
                <div className="p-8 flex items-center justify-between lg:flex-col lg:items-start lg:gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center font-black text-2xl shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3"
                            style={{ background: av.bg, color: av.text }}>
                            {getInitials(leader.name)}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-black text-[#1a202c] tracking-tight">{leader.name}</span>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${leader.status === 'Active' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${leader.status === 'Active' ? 'bg-[#059669] animate-pulse' : 'bg-[#64748b]'}`} />
                                    {leader.status}
                                </div>
                            </div>
                            <span className="text-[14px] font-bold text-[#cbd5e0]">{leader.email}</span>
                            {leader.phone && <span className="text-[12px] font-black text-[#cbd5e0] font-mono">{leader.phone}</span>}
                        </div>
                    </div>

                    <div className="flex items-center gap-8 bg-[#fcfdff] p-6 rounded-[2rem] border border-[#f1f5f9] shadow-inner lg:w-full lg:justify-center">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-[#1a202c] tracking-tighter">{leader.members.length}</span>
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] mt-1">Total Agents</span>
                        </div>
                        <div className="w-[1.5px] h-10 bg-[#f1f5f9]" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-[#10b981] tracking-tighter">{activeMembers}</span>
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em] mt-1">Active Now</span>
                        </div>
                    </div>
                </div>

                {/* ── Card Actions ── */}
                <div className="px-8 py-6 bg-[#fbfeff] border-t border-[#f7fafc] mt-auto flex justify-between items-center sm:flex-col sm:gap-6">
                    <div className="flex items-center">
                        <button
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider border-2 transition-all active:scale-95 ${leader.status === 'Active' ? 'text-[#e53e3e] border-[#fee2e2] bg-white hover:bg-[#fff5f5]' : 'text-[#2447d7] border-[#d9e8ff] bg-white hover:bg-[#f0f7ff]'}`}
                            onClick={() => onToggleLeader(leader.id)}
                        >
                            {leader.status === 'Active' ? <><IconBan /> Deactivate</> : <><IconActivate /> Activate</>}
                        </button>
                    </div>
                    <div className="flex items-center gap-3 w-full justify-end sm:justify-center">
                        <button className="flex items-center gap-2.5 bg-white border border-[#edf2f7] text-[#10b981] px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-[#f0fdf4] transition-all shadow-sm active:scale-95" onClick={() => setShowAddAgent(true)}>
                            <IconPlus /> Add Agent
                        </button>
                        <button className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 ${expanded ? 'bg-[#1a202c] text-white shadow-[#1a202c]/20' : 'bg-[#2447d7] text-white shadow-[#2447d7]/20 hover:bg-[#1732a3]'}`} onClick={() => setExpanded(e => !e)}>
                            View Team ({leader.members.length})
                            <IconChevron open={expanded} />
                        </button>
                    </div>
                </div>

                {/* ── Expanded Members List ── */}
                {expanded && (
                    <div className="p-8 pt-4 bg-[#fcfdff] border-t border-[#f7fafc] animate-slideDown overflow-hidden">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[#2447d7] rounded-full" />
                            <span className="text-[11px] font-black text-[#1a202c] uppercase tracking-[0.2em]">Tele Agents — {leader.name}'s Team</span>
                        </div>
                        {leader.members.length === 0 ? (
                            <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-[#edf2f7] flex flex-col items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#cbd5e0] rotate-12 group-hover:rotate-0 transition-transform">
                                    <IconUsers />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[14px] font-bold text-[#cbd5e0]">No agents assigned yet.</span>
                                    <button className="text-[12px] font-black text-[#2447d7] hover:underline" onClick={() => setShowAddAgent(true)}>
                                        + Add the first agent to this team
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {leader.members.map((member) => {
                                    const mav = getAvatarColor(member.id);
                                    return (
                                        <div key={member.id} className={`flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-[#edf2f7] shadow-sm hover:shadow-md transition-all group/member ${member.status === 'Inactive' ? 'opacity-60 grayscale-[0.3]' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[14px] shadow-sm transform transition-transform group-hover/member:rotate-6"
                                                    style={{ background: mav.bg, color: mav.text }}>
                                                    {getInitials(member.name)}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[15px] font-black text-[#1a202c] tracking-tight">{member.name}</span>
                                                    <span className="text-[12px] font-bold text-[#cbd5e0]">{member.email}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 lg:flex-wrap lg:justify-end">
                                                {member.phone && <span className="text-[12px] font-bold text-[#cbd5e0] font-mono bg-[#f8fafc] px-2.5 py-1 rounded-lg lg:hidden">{member.phone}</span>}
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${member.status === 'Active' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]' : 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]'}`}>
                                                    <div className={`w-1 h-1 rounded-full ${member.status === 'Active' ? 'bg-[#059669]' : 'bg-[#64748b]'}`} />
                                                    {member.status}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all active:scale-90 ${member.status === 'Active' ? 'bg-[#fff5f5] text-[#e53e3e] border-[#fee2e2]' : 'bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]'}`}
                                                        title={member.status === 'Active' ? 'Deactivate agent' : 'Activate agent'}
                                                        onClick={() => onToggleAgent(leader.id, member.id)}
                                                    >
                                                        {member.status === 'Active' ? <IconBan /> : <IconActivate />}
                                                    </button>
                                                    <button
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#f8fafc] text-[#cbd5e0] border border-[#f1f5f9] hover:bg-[#fff5f5] hover:text-[#e53e3e] hover:border-[#fee2e2] transition-all active:scale-90 group/trash"
                                                        title="Remove from team"
                                                        onClick={() => onRemoveAgent(leader.id, member.id)}
                                                    >
                                                       <IconTrash />
                                                    </button>
                                                </div>
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
                    onAdd={(user) => onAddAgent(leader.id, user)}
                />
            )}
        </>
    );
};

/* ─── MAIN PAGE ───────────────────────────────── */
const TeamLeaders = ({ onNavigate }) => {
    const { users, setUsers } = useUsers();
    const [memberships, setMemberships] = useState(INITIAL_MEMBERSHIPS); // { leaderId: members[] }
    const [search, setSearch] = useState('');

    /* Leaders = users with role "Team Leader" */
    const leaders = users
        .filter(u => u.role === 'Team Leader')
        .map(u => ({
            ...u,
            phone: u.phone || '',
            members: memberships[u.id] || [],
        }));

    /* KPI stats */
    const totalLeaders = leaders.length;
    const totalAgents = leaders.reduce((sum, l) => sum + l.members.length, 0);
    const activeTeams = leaders.filter(l => l.status === 'Active').length;

    /* Search filter */
    const filtered = leaders.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase())
    );

    /* Add agent to leader */
    const handleAddAgent = (leaderId, user) => {
        setMemberships(prev => ({
            ...prev,
            [leaderId]: [...(prev[leaderId] || []), { id: user.id, name: user.name, email: user.email, phone: user.phone || '', status: user.status }],
        }));
    };

    const handleToggleLeader = (leaderId) => {
        setUsers(prev => prev.map(u => u.id === leaderId
            ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
            : u
        ));
    };

    /* Toggle agent status */
    const handleToggleAgent = (leaderId, memberId) => {
        setMemberships(prev => ({
            ...prev,
            [leaderId]: (prev[leaderId] || []).map(m => m.id === memberId
                ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' }
                : m
            ),
        }));
    };

    /* Remove agent */
    const handleRemoveAgent = (leaderId, memberId) => {
        setMemberships(prev => ({
            ...prev,
            [leaderId]: (prev[leaderId] || []).filter(m => m.id !== memberId),
        }));
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">

            {/* ── MOBILE HEADER PORTAL ── */}
            {document.getElementById('mobile-header-portal') && ReactDOM.createPortal(
                <div className="p-4 px-6 fixed top-[60px] left-0 right-0 bg-white border-b border-[#edf2f7] z-40 flex items-center gap-4">
                    <div className="relative group flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                            <IconSearch />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-[#f1f5f9] border-2 border-transparent p-3 pl-12 rounded-2xl text-sm font-bold text-[#1a202c] outline-none focus:bg-white focus:border-[#2447d7]/20 transition-all"
                            placeholder="Search leaders..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="w-12 h-12 bg-[#2447d7] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#2447d7]/20 active:scale-90 transition-all" onClick={() => onNavigate('user-management')}>
                        <IconPlus />
                    </button>
                </div>,
                document.getElementById('mobile-header-portal')
            )}

            <div className="flex flex-col gap-8">

                {/* Page heading */}
                <header className="flex justify-between items-end gap-6 flex-wrap lg:items-start lg:flex-col sm:mb-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[1.75rem] font-black text-[#1a202c] tracking-tight sm:text-2xl">Team Management</h1>
                        <p className="text-[0.95rem] text-[#718096] font-medium leading-relaxed">Oversee team leaders and their designated tele agent cohorts.</p>
                    </div>
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full max-w-[500px] sm:max-w-none">
                         <div className="relative group flex-1 min-w-[280px] lg:hidden">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aec0] group-focus-within:text-[#2447d7] transition-colors">
                                <IconSearch />
                            </div>
                            <input
                                className="w-full bg-white border border-[#edf2f7] p-3 pl-12 rounded-2xl text-[14px] font-bold text-[#1a202c] outline-none focus:border-[#2447d7] transition-all shadow-sm"
                                type="text"
                                placeholder="Search team leaders..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2.5 bg-[#2447d7] text-white px-6 py-3 rounded-2xl text-sm font-black tracking-tight hover:bg-[#1732a3] hover:translate-y-[-2px] transition-all shadow-xl shadow-[#2447d7]/20 active:scale-95 whitespace-nowrap" onClick={() => onNavigate('user-management')}>
                            <IconPlus /> Add Leader
                        </button>
                    </div>
                </header>

                {/* KPI Summary */}
                <div className="grid grid-cols-3 gap-6 lg:grid-cols-1">
                    <div className="bg-white rounded-[2rem] border border-[#edf2f7] p-8 shadow-sm flex items-center gap-6 hover:shadow-xl hover:translate-y-[-2px] transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-[#ebf0ff] text-[#2447d7] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:bg-[#2447d7] group-hover:text-white transition-all"><IconUsers /></div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-3xl font-black text-[#1a202c] tracking-tighter">{totalLeaders}</span>
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em]">Total Leaders</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-[#edf2f7] p-8 shadow-sm flex items-center gap-6 hover:shadow-xl hover:translate-y-[-2px] transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:bg-[#10b981] group-hover:text-white transition-all"><IconUserSingle /></div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-3xl font-black text-[#1a202c] tracking-tighter">{totalAgents}</span>
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em]">Active Agents</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-[#edf2f7] p-8 shadow-sm flex items-center gap-6 hover:shadow-xl hover:translate-y-[-2px] transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-[#f3e8ff] text-[#7c3aed] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:bg-[#7c3aed] group-hover:text-white transition-all"><IconTeams /></div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-3xl font-black text-[#1a202c] tracking-tighter">{activeTeams}</span>
                            <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-[0.2em]">Total Squads</span>
                        </div>
                    </div>
                </div>

                {/* Leaders List */}
                <div className="mt-4">
                    {filtered.length === 0 ? (
                        <div className="py-24 flex flex-col items-center gap-8 justify-center bg-white rounded-[3rem] border-2 border-dashed border-[#edf2f7]">
                            <div className="w-24 h-24 rounded-[2rem] bg-[#f8fafc] flex items-center justify-center text-[#cbd5e0] shadow-inner mb-4">
                                <IconUsers />
                            </div>
                            <div className="text-center flex flex-col gap-2">
                                <h3 className="text-2xl font-black text-[#1a202c] tracking-tight">No match found</h3>
                                <p className="text-[15px] font-medium text-[#718096] max-w-[400px] leading-relaxed">{search ? 'Try refining your search text or adding a new leader to the system.' : 'It seems your leadership roster is empty. Begin by onboarding your first team leader.'}</p>
                            </div>
                            {!search && (
                                <button className="flex items-center gap-3 bg-[#2447d7] text-white px-8 py-4 rounded-2xl text-md font-black hover:bg-[#1732a3] shadow-2xl shadow-[#2447d7]/20 transition-all active:scale-95" onClick={() => onNavigate('user-management')}>
                                    <IconPlus /> Add Team Leader
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {filtered.map((leader) => (
                                <LeaderCard
                                    key={leader.id}
                                    leader={leader}
                                    onAddAgent={handleAddAgent}
                                    onToggleLeader={handleToggleLeader}
                                    onToggleAgent={handleToggleAgent}
                                    onRemoveAgent={handleRemoveAgent}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TeamLeaders;

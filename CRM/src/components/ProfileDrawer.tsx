'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Session {
    access: string;
    id?: string | number;
    name?: string;
    email?: string;
    role?: string;
}

function authHeader(token: string): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function initials(name: string) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
}

function roleColor(role: string) {
    if (role === 'Super Admin') return { bg: '#4f46e5', text: '#fff' };
    if (role === 'Admin') return { bg: '#0f172a', text: '#fff' };
    if (role === 'Team Lead') return { bg: '#0369a1', text: '#fff' };
    if (role === 'Tele Agent') return { bg: '#065f46', text: '#fff' };
    return { bg: '#334155', text: '#fff' };
}

export default function ProfileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'details' | 'password'>('details');

    // Session / profile state
    const [session, setSession] = useState<Session | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    // Save details state
    const [detailSaving, setDetailSaving] = useState(false);
    const [detailMsg, setDetailMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

    // Password state
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

    // Load session on open
    useEffect(() => {
        if (!isOpen) return;
        try {
            const raw = sessionStorage.getItem('crm_session');
            if (!raw) return;
            const s: Session = JSON.parse(raw);
            setSession(s);
            setName(s.name || '');
            setEmail(s.email || '');
            setRole(s.role || '');
        } catch { /* ignore */ }
        setDetailMsg(null);
        setPwMsg(null);
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        setActiveTab('details');
    }, [isOpen]);

    const saveDetails = async () => {
        if (!session?.id || !session?.access) {
            setDetailMsg({ type: 'err', text: 'Session expired — please log in again.' });
            return;
        }
        setDetailSaving(true);
        setDetailMsg(null);
        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { ...authHeader(session.access), 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: session.id, name, email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setDetailMsg({ type: 'err', text: data.error || 'Update failed.' });
                return;
            }
            // Sync back to session storage
            const updated = { ...session, name: data.name || name, email: data.email || email };
            sessionStorage.setItem('crm_session', JSON.stringify(updated));
            setSession(updated);
            setDetailMsg({ type: 'ok', text: 'Profile updated successfully.' });
        } catch {
            setDetailMsg({ type: 'err', text: 'Network error — could not save changes.' });
        } finally {
            setDetailSaving(false);
        }
    };

    const changePassword = async () => {
        setPwMsg(null);
        if (!newPw || newPw.length < 8) {
            setPwMsg({ type: 'err', text: 'New password must be at least 8 characters.' });
            return;
        }
        if (newPw !== confirmPw) {
            setPwMsg({ type: 'err', text: 'New passwords do not match.' });
            return;
        }
        if (!session?.id || !session?.access) {
            setPwMsg({ type: 'err', text: 'Session expired — please log in again.' });
            return;
        }
        setPwSaving(true);
        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { ...authHeader(session.access), 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: session.id, current_password: currentPw, password: newPw }),
            });
            const data = await res.json();
            if (!res.ok) {
                setPwMsg({ type: 'err', text: data.error || 'Password update failed.' });
                return;
            }
            setPwMsg({ type: 'ok', text: 'Password changed successfully.' });
            setCurrentPw(''); setNewPw(''); setConfirmPw('');
        } catch {
            setPwMsg({ type: 'err', text: 'Network error — could not update password.' });
        } finally {
            setPwSaving(false);
        }
    };

    const handleSignOut = () => {
        sessionStorage.removeItem('crm_session');
        onClose();
        router.push('/login');
    };

    const rc = roleColor(role);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 z-[998] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-screen w-[360px] z-[999] shadow-2xl transition-transform duration-300 flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ background: '#0f172a' }}
            >
                {/* Header */}
                <div style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <i className="fa-solid fa-circle-user" style={{ color: '#818cf8', fontSize: 13 }}></i>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>My Profile</p>
                        <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>Account Settings</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', flexShrink: 0 }}
                    >
                        <i className="fa-solid fa-xmark text-[11px]"></i>
                    </button>
                </div>

                {/* Avatar card */}
                <div style={{ padding: '16px 16px 0' }}>
                    <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: rc.text, flexShrink: 0, letterSpacing: '-.02em' }}>
                            {initials(name || 'User')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 900, margin: 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name || '—'}</p>
                            <p style={{ color: '#64748b', fontSize: 10, fontWeight: 600, margin: '4px 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email || '—'}</p>
                            <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, background: rc.bg, color: rc.text, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em' }}>{role || 'User'}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', padding: '12px 16px 0', gap: 4 }}>
                    {(['details', 'password'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em', transition: 'all .15s',
                                background: activeTab === tab ? '#fff' : 'rgba(255,255,255,.05)',
                                color: activeTab === tab ? '#0f172a' : '#64748b',
                            }}
                        >
                            {tab === 'details' ? 'Profile' : 'Password'}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
                    {activeTab === 'details' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Field label="Full Name">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Your full name"
                                    style={inputStyle}
                                />
                            </Field>
                            <Field label="Email Address">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    style={inputStyle}
                                />
                            </Field>
                            <Field label="Role">
                                <input
                                    type="text"
                                    value={role}
                                    disabled
                                    style={{ ...inputStyle, opacity: .45, cursor: 'not-allowed' }}
                                />
                            </Field>

                            {detailMsg && (
                                <div style={{ padding: '8px 12px', borderRadius: 8, background: detailMsg.type === 'ok' ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${detailMsg.type === 'ok' ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)'}`, color: detailMsg.type === 'ok' ? '#34d399' : '#f87171', fontSize: 11, fontWeight: 700 }}>
                                    <i className={`fa-solid ${detailMsg.type === 'ok' ? 'fa-circle-check' : 'fa-circle-exclamation'} mr-1.5`}></i>
                                    {detailMsg.text}
                                </div>
                            )}

                            <button
                                onClick={saveDetails}
                                disabled={detailSaving}
                                style={{ width: '100%', height: 36, borderRadius: 8, border: 'none', background: detailSaving ? '#334155' : '#4f46e5', color: '#fff', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em', cursor: detailSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            >
                                {detailSaving
                                    ? <><i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i> Saving...</>
                                    : <><i className="fa-solid fa-floppy-disk text-[10px]"></i> Save Changes</>
                                }
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.15)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <i className="fa-solid fa-shield-halved" style={{ color: '#fbbf24', fontSize: 12, marginTop: 1, flexShrink: 0 }}></i>
                                <p style={{ color: '#fde68a', fontSize: 10, fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                                    Use at least 8 characters including uppercase letters, numbers and symbols.
                                </p>
                            </div>

                            <Field label="Current Password">
                                <PasswordInput value={currentPw} onChange={setCurrentPw} show={showCurrent} toggle={() => setShowCurrent(v => !v)} placeholder="Enter current password" />
                            </Field>
                            <Field label="New Password">
                                <PasswordInput value={newPw} onChange={setNewPw} show={showNew} toggle={() => setShowNew(v => !v)} placeholder="Enter new password" />
                            </Field>
                            <Field label="Confirm New Password">
                                <PasswordInput value={confirmPw} onChange={setConfirmPw} show={showConfirm} toggle={() => setShowConfirm(v => !v)} placeholder="Repeat new password" />
                            </Field>

                            {/* Strength indicator */}
                            {newPw && (
                                <PasswordStrength password={newPw} />
                            )}

                            {pwMsg && (
                                <div style={{ padding: '8px 12px', borderRadius: 8, background: pwMsg.type === 'ok' ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${pwMsg.type === 'ok' ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)'}`, color: pwMsg.type === 'ok' ? '#34d399' : '#f87171', fontSize: 11, fontWeight: 700 }}>
                                    <i className={`fa-solid ${pwMsg.type === 'ok' ? 'fa-circle-check' : 'fa-circle-exclamation'} mr-1.5`}></i>
                                    {pwMsg.text}
                                </div>
                            )}

                            <button
                                onClick={changePassword}
                                disabled={pwSaving}
                                style={{ width: '100%', height: 36, borderRadius: 8, border: 'none', background: pwSaving ? '#334155' : '#4f46e5', color: '#fff', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em', cursor: pwSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            >
                                {pwSaving
                                    ? <><i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i> Updating...</>
                                    : <><i className="fa-solid fa-lock text-[10px]"></i> Update Password</>
                                }
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer — sign out */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
                    <button
                        onClick={handleSignOut}
                        style={{ width: '100%', height: 34, borderRadius: 8, border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.08)', color: '#f87171', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                        <i className="fa-solid fa-right-from-bracket text-[10px]"></i> Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 36,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,.1)',
    background: 'rgba(255,255,255,.06)',
    color: '#f1f5f9',
    fontSize: 11,
    fontWeight: 600,
    padding: '0 12px',
    outline: 'none',
    boxSizing: 'border-box',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p style={{ color: '#475569', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>{label}</p>
            {children}
        </div>
    );
}

function PasswordInput({ value, onChange, show, toggle, placeholder }: {
    value: string; onChange: (v: string) => void; show: boolean; toggle: () => void; placeholder: string;
}) {
    return (
        <div style={{ position: 'relative' }}>
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ ...inputStyle, paddingRight: 36 }}
            />
            <button
                type="button"
                onClick={toggle}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 11, padding: 0 }}
            >
                <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
        </div>
    );
}

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

    return (
        <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= score ? colors[score] : 'rgba(255,255,255,.08)', transition: 'background .3s' }} />
                ))}
            </div>
            <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em', color: colors[score], margin: 0 }}>{labels[score]}</p>
        </div>
    );
}

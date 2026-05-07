'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function getStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
    return { score, label: labels[score] || '', color: colors[score] || '#e2e8f0' };
}

const REQUIREMENTS = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Uppercase letter (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter (a–z)', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Number (0–9)', test: (p: string) => /\d/.test(p) },
    { label: 'Special character (!@#$…)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function SetPasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const session = sessionStorage.getItem('crm_session');
        if (!session) { router.replace('/login'); return; }
        const parsed = JSON.parse(session);
        if (!parsed.must_set_password) {
            router.replace(parsed.landing ?? '/dashboard/tele_agent');
            return;
        }
        setUserName(parsed.name || '');
    }, [router]);

    const strength = getStrength(newPassword);
    const allMet = REQUIREMENTS.every(r => r.test(newPassword));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!allMet) { setError('Password does not meet all requirements.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

        setLoading(true);
        try {
            const session = sessionStorage.getItem('crm_session');
            const token = session ? JSON.parse(session).access : null;

            const res = await fetch('/api/auth/set-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ new_password: newPassword }),
            });

            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Failed to set password.'); return; }

            // Clear must_set_password flag in session and redirect
            const parsed = JSON.parse(sessionStorage.getItem('crm_session') || '{}');
            parsed.must_set_password = false;
            sessionStorage.setItem('crm_session', JSON.stringify(parsed));
            router.replace(parsed.landing ?? '/dashboard/tele_agent');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full h-screen overflow-hidden bg-[#f8fafc]">
            {/* Left panel */}
            <div className="w-[420px] shrink-0 bg-[#0f172a] hidden md:flex flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                <div className="flex items-center gap-3 relative z-10">
                    <Image src="/alpha.png" alt="Alpha Funding" width={32} height={32} className="object-contain" />
                    <div>
                        <div className="text-[15px] font-black text-white">Alpha Funding CRM</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Enterprise Edition</div>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
                        <i className="fa-solid fa-shield-halved text-indigo-400 text-xl" />
                    </div>
                    <h1 className="text-3xl font-black text-white leading-[1.2] mb-3 tracking-tighter">Secure your account.</h1>
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed max-w-[320px]">
                        Your administrator has created your account. Set a strong personal password to continue — this replaces the temporary credentials.
                    </p>
                    <ul className="mt-8 space-y-3">
                        {REQUIREMENTS.map((r, i) => (
                            <li key={i} className="flex items-center gap-3 text-[12px] font-bold" style={{ color: r.test(newPassword) ? '#10b981' : '#475569' }}>
                                <i className={`fa-solid ${r.test(newPassword) ? 'fa-circle-check' : 'fa-circle'} text-[10px]`} />
                                {r.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-[10px] font-bold text-slate-600 relative z-10">
                    © 2026 Alpha Funding CRM. Secure Enterprise Access.
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-[400px]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {userName ? `Welcome, ${userName.split(' ')[0]}` : 'Set your password'}
                        </h2>
                        <p className="text-[12px] text-slate-400 font-bold mt-1">
                            Create a strong password to secure your account
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[11px] font-bold text-red-600">
                            <i className="fa-solid fa-circle-exclamation" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New password */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">New Password</label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-[13px] font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                    placeholder="Create a strong password"
                                    required
                                />
                                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <i className={`fa-solid ${showNew ? 'fa-eye-slash' : 'fa-eye'} text-[11px]`} />
                                </button>
                            </div>

                            {/* Strength bar */}
                            {newPassword.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= strength.score ? strength.color : '#e2e8f0' }} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-bold" style={{ color: strength.color }}>{strength.label}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <i className="fa-solid fa-lock-open absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-[13px] font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                    placeholder="Re-enter your password"
                                    required
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <i className={`fa-solid ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} text-[11px]`} />
                                </button>
                            </div>
                            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                                <p className="text-[10px] font-bold text-red-500 mt-1">Passwords do not match</p>
                            )}
                            {confirmPassword.length > 0 && newPassword === confirmPassword && (
                                <p className="text-[10px] font-bold text-emerald-500 mt-1"><i className="fa-solid fa-check mr-1" />Passwords match</p>
                            )}
                        </div>

                        {/* Mobile requirements checklist */}
                        <div className="md:hidden bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                            {REQUIREMENTS.map((r, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] font-bold" style={{ color: r.test(newPassword) ? '#10b981' : '#94a3b8' }}>
                                    <i className={`fa-solid ${r.test(newPassword) ? 'fa-circle-check' : 'fa-circle'} text-[9px]`} />
                                    {r.label}
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !allMet || newPassword !== confirmPassword}
                            className="w-full bg-slate-900 text-white rounded-xl py-3 text-[12px] font-black uppercase tracking-widest mt-2 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <><i className="fa-solid fa-circle-notch fa-spin text-[10px]" /> Saving...</>
                            ) : (
                                <><i className="fa-solid fa-shield-check text-[10px]" /> Set Password & Continue</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

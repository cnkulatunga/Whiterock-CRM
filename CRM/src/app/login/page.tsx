'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [locked, setLocked] = useState(false);
    const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
    const [countdown, setCountdown] = useState('');
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!lockedUntil) return;
        const tick = () => {
            const now = new Date();
            const diff = Math.max(0, Math.floor((lockedUntil.getTime() - now.getTime()) / 1000));
            if (diff === 0) {
                setLocked(false);
                setLockedUntil(null);
                setCountdown('');
                setError('');
                if (timerRef.current) clearInterval(timerRef.current);
                return;
            }
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            setCountdown(h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
        };
        tick();
        timerRef.current = setInterval(tick, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [lockedUntil]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (locked) return;
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.locked) {
                    setLocked(true);
                    if (data.locked_until) setLockedUntil(new Date(data.locked_until));
                    setError(data.error || data.detail || 'Account locked.');
                } else {
                    setError(data.error || data.detail || 'Authentication failed');
                }
                return;
            }

            const roleDashMap: Record<string, string> = {
                'Super Admin': '/dashboard/super_admin',
                'Admin': '/dashboard/super_admin',
                'Accounts Manager': '/dashboard/accounts_manager',
                'Team Leader': '/dashboard/team_lead',
                'Tele Agent': '/dashboard/tele_agent',
            };
            const landingPath = roleDashMap[data.role] ?? '/dashboard/tele_agent';
            const session = { ...data, landing: landingPath };
            sessionStorage.setItem('crm_session', JSON.stringify(session));

            if (data.must_set_password) {
                router.push('/set-password');
            } else {
                router.push(landingPath);
            }
        } catch {
            setError('Unable to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full h-screen overflow-hidden bg-[#f8fafc]">
            {/* Left Panel */}
            <div className="w-[420px] shrink-0 bg-[#0f172a] hidden md:flex flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

                <div className="flex items-center gap-3 relative z-10">
                    <Image src="/alpha.png" alt="Alpha Funding" width={32} height={32} className="object-contain" />
                    <div>
                        <div className="text-[15px] font-black text-white letter-spacing-[-0.02em]">Alpha Funding CRM</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Enterprise Edition</div>
                    </div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-white leading-[1.2] mb-3 tracking-tighter">Precision Lending, Simplified.</h1>
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed max-w-[320px]">
                        The all-in-one platform for managing leads, loans, teams and documents — built for modern finance brokers.
                    </p>
                    <ul className="mt-8 space-y-3">
                        {[
                            { label: 'Real-time Pipeline Intelligence', color: '#6366f1' },
                            { label: 'Role-Based Access Control', color: '#10b981' },
                            { label: 'Automated Document Vault', color: '#f59e0b' },
                            { label: 'Live Team Activity Monitor', color: '#ec4899' },
                        ].map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-[12px] font-bold text-slate-400">
                                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: f.color }}></div>
                                {f.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-[10px] font-bold text-slate-600 relative z-10">
                    © 2026 Alpha Funding CRM. Secure Enterprise Access.
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-[400px]">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
                    <p className="text-[12px] text-slate-400 font-bold mt-1">Sign in to your account to continue</p>

                    {/* Lockout banner */}
                    {locked && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <i className="fa-solid fa-lock text-red-500 text-[12px]"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[12px] font-black text-red-700 mb-1">Account Temporarily Locked</p>
                                    <p className="text-[11px] font-medium text-red-500 leading-relaxed">
                                        Too many failed login attempts. Access will be restored in:
                                    </p>
                                    {countdown && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 bg-red-100 rounded-lg px-2.5 py-1">
                                            <i className="fa-solid fa-clock text-red-400 text-[10px]"></i>
                                            <span className="text-[13px] font-black text-red-600 tabular-nums">{countdown}</span>
                                        </div>
                                    )}
                                    <p className="text-[10px] font-bold text-red-400 mt-2">
                                        Need immediate access? Contact your administrator to reset your account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* General error (non-lockout) */}
                    {error && !locked && (
                        <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[11px] font-bold text-red-600">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="mt-8 space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                            <div className="relative">
                                <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]"></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={locked}
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-[13px] font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="you@alphafunding.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Password</label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={locked}
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-[13px] font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    disabled={locked}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-[11px]`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || locked}
                            className="w-full bg-slate-900 text-white rounded-xl py-3 text-[12px] font-black uppercase tracking-widest mt-2 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i>
                                    Authenticating...
                                </>
                            ) : locked ? (
                                <>
                                    <i className="fa-solid fa-lock text-[10px]"></i>
                                    Account Locked
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-right-to-bracket text-[10px]"></i>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

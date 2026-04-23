'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password === 'Pass@123') {
            setLoading(true);
            setTimeout(() => {
                if (email === 'admin@taskflow.com') {
                    router.push('/dashboard/super_admin');
                } else if (email === 'manager@taskflow.com') {
                    router.push('/dashboard/accounts_manager');
                } else if (email === 'lead@taskflow.com') {
                    router.push('/dashboard/team_lead');
                } else if (email === 'agent@taskflow.com') {
                    router.push('/dashboard/tele_agent');
                } else {
                    setError('Unknown role. Please use demo emails.');
                    setLoading(false);
                }
            }, 700);
        } else {
            setError('Invalid password. Use demo credentials.');
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
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
                        The all-in-one platform for managing leads, loans, teams and documents — built for modern mortgage brokers.
                    </p>
                    <ul className="mt-8 space-y-3">
                        {[
                            { label: 'Real-time Pipeline Intelligence', color: 'indigo' },
                            { label: 'Role-Based Access Control', color: 'emerald' },
                            { label: 'Automated Document Vault', color: 'amber' },
                            { label: 'Live Team Activity Monitor', color: 'rose' },
                        ].map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-[12px] font-bold text-slate-400">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${f.color}-500 shrink-0`}></div>
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

                    {error && (
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
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-[13px] font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                    placeholder="you@taskflow.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Password</label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]"></i>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-[13px] font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 mt-1.5 flex flex-wrap gap-x-2 gap-y-1">
                                <span>Demo password: <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">Pass@123</span></span>
                                <span className="opacity-50">|</span>
                                <span>Admin: <span className="text-slate-600">admin@taskflow.com</span></span>
                                <span>Manager: <span className="text-slate-600">manager@taskflow.com</span></span>
                                <span>Team Lead: <span className="text-slate-600">lead@taskflow.com</span></span>
                                <span>Agent: <span className="text-slate-600">agent@taskflow.com</span></span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-slate-900 text-white rounded-xl py-3 text-[12px] font-black uppercase tracking-widest mt-2 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 pointer-events-none' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i>
                                    Authenticating...
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

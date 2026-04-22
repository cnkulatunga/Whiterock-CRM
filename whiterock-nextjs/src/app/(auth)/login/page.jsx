'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/auth';

const ROLE_CONFIGS = {
  super_admin:      { label: 'Super Admin',      color: '#6366f1', email: 'admin@alphafunding.com',    badge: 'bg-indigo-100 text-indigo-700',  redirect: '/super-admin' },
  tele_agent:       { label: 'Tele Agent',       color: '#2447d7', email: 'agent@alphafunding.com',    badge: 'bg-blue-100 text-blue-700',     redirect: '/tele-agent' },
  accounts_manager: { label: 'Accounts Manager', color: '#10b981', email: 'accounts@alphafunding.com', badge: 'bg-green-100 text-green-700',   redirect: '/accounts-manager' },
  team_lead:        { label: 'Team Lead',        color: '#f59e0b', email: 'lead@alphafunding.com',     badge: 'bg-yellow-100 text-yellow-700', redirect: '/team-lead' },
};

const ROLE_REDIRECT = {
  super_admin: '/super-admin',
  tele_agent: '/tele-agent',
  accounts_manager: '/accounts-manager',
  team_lead: '/team-lead',
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please enter your credentials.'); return; }

    setLoading(true);
    try {
      const data = await authApi.login(form.email, form.password);
      setUser(data.user, data.access, data.refresh);
      router.push(ROLE_REDIRECT[data.user.role] || '/super-admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    const cfg = ROLE_CONFIGS[role];
    setForm({ email: cfg.email, password: 'password123' });
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">

      {/* ── LEFT: BRAND PANEL ── */}
      <div
        className="w-[420px] flex-shrink-0 flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: '#0f172a' }}
      >
        {/* Glowing orbs */}
        <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)', top: '-80px', left: '-80px' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(16,185,129,.12) 0%,transparent 70%)', bottom: '-60px', right: '-60px' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'rgba(255,255,255,.1)' }}>
            <img src="/images/alpha.png" alt="Alpha Funding" className="w-8 h-8 object-contain"
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
            <i className="fas fa-layer-group text-white text-sm hidden" />
          </div>
          <div>
            <div className="text-[15px] font-black text-white tracking-tight">Alpha Funding CRM</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>Enterprise Edition</div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative flex-1 flex flex-col justify-center py-8">
          <h1 className="text-[32px] font-black text-white leading-tight tracking-tighter mb-3">
            Precision Lending,<br />Simplified.
          </h1>
          <p className="text-[13px] leading-relaxed font-medium" style={{ color: '#64748b' }}>
            The all-in-one platform for managing leads, loans, teams and documents — built for modern mortgage brokers.
          </p>
          <ul className="mt-9 flex flex-col gap-3">
            {[
              { dot: '#6366f1', text: 'Real-time Pipeline Intelligence' },
              { dot: '#10b981', text: 'Role-Based Access Control' },
              { dot: '#f59e0b', text: 'Automated Document Vault' },
              { dot: '#ec4899', text: 'Live Team Activity Monitor' },
            ].map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-[12px] font-semibold" style={{ color: '#94a3b8' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.dot }} />
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[10px] font-semibold" style={{ color: '#334155' }}>
          © 2025 Alpha Funding Group · Confidential
        </p>
      </div>

      {/* ── RIGHT: FORM PANEL ── */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#f8fafc' }}>
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="w-full max-w-[400px]">

            <h2 className="text-[26px] font-black text-navy tracking-tighter mb-1">Welcome back</h2>
            <p className="text-[12px] text-muted font-medium mb-7">Sign in to your command center</p>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 mb-4">
                <i className="fas fa-circle-exclamation text-red-600 text-[11px]" />
                <p className="text-[11px] font-bold text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-black text-subtle uppercase tracking-widest mb-1.5">Email address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[11px] pointer-events-none">
                    <i className="fas fa-envelope" />
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@alphafunding.com"
                    className="form-input-premium pl-8"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-black text-subtle uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[11px] pointer-events-none">
                    <i className="fas fa-lock" />
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="form-input-premium pl-8 pr-8"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-subtle text-[11px]"
                  >
                    <i className={`fas fa-${showPw ? 'eye-slash' : 'eye'}`} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-[10px] bg-navy text-white text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-navy-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign In <i className="fas fa-arrow-right text-[10px]" /></>
                )}
              </button>
            </form>

            {/* Quick login divider */}
            <div className="flex items-center gap-2.5 my-6">
              <div className="flex-1 h-px bg-surface-border" />
              <span className="text-[9px] font-black text-muted uppercase tracking-[.1em] whitespace-nowrap">Quick Login</span>
              <div className="flex-1 h-px bg-surface-border" />
            </div>

            <p className="text-[9px] font-black text-muted uppercase tracking-[.09em] mb-2.5">Select a demo role</p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(ROLE_CONFIGS).map(([role, cfg]) => (
                <button
                  key={role}
                  onClick={() => quickLogin(role)}
                  className="flex items-center gap-2.5 p-2.5 bg-surface border border-surface-border rounded-[10px] hover:bg-surface-border hover:border-surface-border transition-all text-left group"
                >
                  <div
                    className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ background: cfg.color }}
                  >
                    {cfg.label.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-navy">{cfg.label}</div>
                    <div className="text-[9px] font-semibold text-muted truncate">{cfg.email}</div>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${cfg.badge} whitespace-nowrap`}>
                    {cfg.label.split(' ')[0]}
                  </span>
                  <i className="fas fa-chevron-right text-[9px] text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
            <p className="text-[9px] font-semibold text-muted mt-3">
              Default password: <code className="font-mono bg-surface px-1.5 py-0.5 rounded text-subtle">password123</code>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

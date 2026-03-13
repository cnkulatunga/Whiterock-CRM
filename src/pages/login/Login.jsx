import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/theme/ThemeToggle';

/* ─── ICONS ──────────────────────────────────────────────────────── */
const IconUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconArrow  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconBack   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IconCheck  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><polyline points="20 6 9 17 4 12"/></svg>;
const IconCheckSm= () => <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11"><polyline points="2 6 5 9 10 3"/></svg>;

/* ─── W LOGO ICON ────────────────────────────────────────────────── */
const LogoIcon = ({ size = 40 }) => (
    <div
        style={{
            width: size, height: size,
            background: 'linear-gradient(135deg, #2855e8, #1a38b8)',
            borderRadius: size * 0.28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(40,85,232,0.4)',
            flexShrink: 0,
        }}
    >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            width={size * 0.5} height={size * 0.5}>
            <path d="M4 6l3 11 5-7 5 7 3-11" />
        </svg>
    </div>
);

/* ─── PW REQUIREMENT ROW ─────────────────────────────────────────── */
const PwReq = ({ met, label, isDark }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: '0.84rem', color: met ? (isDark ? '#a8f0c8' : '#16a34a') : (isDark ? '#7c97c6' : '#64748b') }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: met ? (isDark ? '#16a34a' : '#22c55e') : (isDark ? '#2c3568' : '#e2e8f0'), transition: 'all 0.2s' }}>
            {met && <IconCheckSm />}
        </div>
        {label}
    </div>
);

/* ─── STEP INDICATOR ─────────────────────────────────────────────── */
const StepIndicator = ({ current, isDark }) => {
    const steps = ['Email', 'Verify Code', 'New Password'];
    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            {steps.map((label, i) => {
                const num = i + 1;
                const isDone = num < current;
                const isActive = num === current;
                return (
                    <React.Fragment key={num}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%', border: '2px solid',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.3s',
                                borderColor: isActive ? '#2855e8' : isDone ? '#22c55e' : (isDark ? '#2c3568' : '#e2e8f0'),
                                background: isActive ? '#2855e8' : isDone ? '#22c55e' : (isDark ? '#1e2245' : '#ffffff'),
                                color: (isActive || isDone) ? '#fff' : (isDark ? '#546298' : '#94a3b8'),
                            }}>
                                {isDone ? <IconCheckSm /> : num}
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap', color: isActive ? '#2855e8' : isDone ? '#22c55e' : (isDark ? '#546298' : '#94a3b8') }}>{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{ flex: 1, height: 2, margin: '0 8px 22px', background: isDone ? '#22c55e' : (isDark ? '#2c3568' : '#e2e8f0'), transition: 'background 0.3s' }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN LOGIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
const Login = ({ onLogin, defaultRole }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
    const [isTablet, setIsTablet] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
    React.useEffect(() => {
        const handler = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    const [view, setView] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPw, setShowLoginPw] = useState(false);
    const [keepLogged, setKeepLogged] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [fpEmail, setFpEmail] = useState('');
    const [fpEmailError, setFpEmailError] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const otpRefs = useRef([]);
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [newPwError, setNewPwError] = useState('');

    const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const pwReqs = { length: newPw.length >= 8, upper: /[A-Z]/.test(newPw), symbol: /[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?`~]/.test(newPw) };

    const openForgotFlow = () => { setFpEmail(''); setFpEmailError(''); setOtp(['','','','','','']); setOtpError(''); setNewPw(''); setConfirmPw(''); setNewPwError(''); setView('fp-email'); };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');
        if (!loginEmail) { setLoginError('Please enter your email address.'); return; }
        if (!loginPassword) { setLoginError('Please enter your password.'); return; }
        let role = defaultRole || 'client';
        if (!defaultRole) {
            if (loginEmail.startsWith('tele')) role = 'tele_agent';
            else if (loginEmail.startsWith('admin')) role = 'super_admin';
            else if (loginEmail.startsWith('manager')) role = 'accounts_manager';
            else if (loginEmail.startsWith('leader')) role = 'team_leader';
        }
        const NAMES = { tele_agent:['Tele','User'], super_admin:['Admin','User'], accounts_manager:['Alex','Thompson'], team_leader:['Sarah','Johnson'], client:['Client','User'] };
        localStorage.setItem('user', JSON.stringify({ id:'123', email:loginEmail, first_name:NAMES[role][0], last_name:NAMES[role][1], role, is_staff: role==='super_admin' }));
        if (onLogin) onLogin();
    };

    const handleSendCode = (e) => { e.preventDefault(); setFpEmailError(''); if (!fpEmail) { setFpEmailError('Please enter your email address.'); return; } if (!isValidEmail(fpEmail)) { setFpEmailError('Please enter a valid email address.'); return; } setView('fp-otp'); setTimeout(() => otpRefs.current[0]?.focus(), 300); };
    const handleOtpChange = (val, idx) => { const digit = val.replace(/\D/g, '').slice(0,1); const next = [...otp]; next[idx] = digit; setOtp(next); if (digit && idx < 5) otpRefs.current[idx+1]?.focus(); };
    const handleOtpKey = (e, idx) => { if (e.key==='Backspace' && !otp[idx] && idx>0) otpRefs.current[idx-1]?.focus(); };
    const handleOtpPaste = (e) => { e.preventDefault(); const digits = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6).split(''); const next = ['','','','','','']; digits.forEach((d,i) => { next[i]=d; }); setOtp(next); otpRefs.current[Math.min(digits.length,5)]?.focus(); };
    const handleVerifyOtp = (e) => { e.preventDefault(); setOtpError(''); if (otp.join('').length<6) { setOtpError('Please enter the full 6-digit code.'); return; } setView('fp-newpw'); };
    const handleSetPassword = (e) => { e.preventDefault(); setNewPwError(''); if (!newPw||!confirmPw) { setNewPwError('Please fill in both fields.'); return; } if (newPw!==confirmPw) { setNewPwError('Passwords do not match.'); return; } if (!Object.values(pwReqs).every(Boolean)) { setNewPwError('Password does not meet all requirements.'); return; } setView('fp-success'); };

    /* ── Shared styles ── */
    const pageBg  = isDark ? '#181c2e' : '#edf0fb';
    const cardBg  = isDark ? '#1f2347' : '#ffffff';
    const cardBorder = isDark ? '#36407a' : '#dde5f5';
    const inputBg = isDark ? '#242b50' : '#f5f7fe';
    const inputBorder = isDark ? '#36407a' : '#dbe1f5';
    const inputFocusBorder = '#2855e8';
    const textPrimary = isDark ? '#e4ecff' : '#090e28';
    const textSecondary = isDark ? '#94abda' : '#3a4b7c';
    const textMuted = isDark ? '#546298' : '#7d8eb6';
    const accent = '#2855e8';

    const inputStyle = {
        display: 'flex', alignItems: 'center',
        border: `1.5px solid ${inputBorder}`,
        borderRadius: 12, background: inputBg,
        overflow: 'hidden', position: 'relative',
        transition: 'border-color 0.18s, box-shadow 0.18s',
    };
    const inputFieldStyle = {
        flex: 1, minWidth: 0, padding: '13px 12px 13px 0',
        border: 'none', background: 'transparent',
        fontFamily: 'inherit', fontSize: '0.9rem',
        color: textPrimary, outline: 'none',
    };
    const iconBoxStyle = {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 44, flexShrink: 0, color: textMuted,
    };
    const labelStyle = { display: 'block', fontSize: '0.84rem', fontWeight: 600, color: textPrimary, marginBottom: 8 };
    const btnPrimary = {
        width: '100%', padding: '14px', background: `linear-gradient(135deg, ${accent}, #1a38b8)`,
        color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none',
        borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8, fontFamily: 'inherit',
        boxShadow: '0 4px 18px rgba(40,85,232,0.35)',
        transition: 'all 0.18s ease',
    };
    const fpStep = view==='fp-email' ? 1 : view==='fp-otp' ? 2 : 3;

    return (
        <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: pageBg, display: 'flex', flexDirection: 'column' }}>

            {/* ── TOP NAV ─────────────────────────────────────────────── */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: isMobile ? '0 16px' : '0 32px', height: isMobile ? 54 : 60, flexShrink: 0,
                background: isDark ? 'rgba(22,26,48,0.97)' : 'rgba(255,255,255,0.97)',
                borderBottom: `1px solid ${isDark ? '#2c3568' : '#dde5f5'}`,
                backdropFilter: 'blur(10px)',
                boxShadow: isDark ? '0 1px 12px rgba(0,0,0,0.25)' : '0 1px 8px rgba(36,71,215,0.06)',
                zIndex: 100, position: 'sticky', top: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LogoIcon size={isMobile ? 30 : 36} />
                    {!isMobile && (
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.3px' }}>
                            Alpha <span style={{ color: accent }}>Funding</span>
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
                    <ThemeToggle compact={isMobile} />
                    <a href="#" style={{
                        fontSize: '0.82rem', fontWeight: 600, color: '#fff', textDecoration: 'none',
                        padding: isMobile ? '7px 12px' : '8px 20px', borderRadius: 10,
                        background: `linear-gradient(135deg, ${accent}, #1a38b8)`,
                        boxShadow: '0 3px 10px rgba(40,85,232,0.3)',
                    }}>{isMobile ? 'Help' : 'Support'}</a>
                </div>
            </nav>

            {/* ── MAIN CONTENT ────────────────────────────────────────── */}
            <main style={{ flex: 1, display: 'flex', alignItems: isTablet ? 'flex-start' : 'stretch', overflow: 'auto' }}>

                {/* ── LEFT BRAND PANEL ──────────────────────────────── */}
                {!isTablet && <div style={{
                    width: '50%', minWidth: 420, display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', padding: '40px 48px',
                    background: isDark
                        ? 'linear-gradient(160deg, #1a1f3c 0%, #131726 60%, #0e1220 100%)'
                        : 'linear-gradient(160deg, #1e3a8a 0%, #2855e8 50%, #3b6ef8 100%)',
                    position: 'relative', overflow: 'hidden',
                }}
                >
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: isDark ? 'rgba(96,128,248,0.06)' : 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: isDark ? 'rgba(96,128,248,0.04)' : 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

                    <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.8px', marginBottom: 16 }}>
                        Manage your<br />loans smarter
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 40, maxWidth: 440 }}>
                        The all-in-one platform for loan management, lead tracking, and team collaboration.
                    </p>

                    {[
                        { icon: '◈', text: 'Full loan pipeline visibility' },
                        { icon: '◉', text: 'Smart lead & document tracking' },
                        { icon: '◆', text: 'Multi-role team management' },
                    ].map((f) => (
                        <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff', flexShrink: 0 }}>{f.icon}</div>
                            <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{f.text}</span>
                        </div>
                    ))}

                    <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        {['AT','SJ','JD','MC'].map((ini, i) => (
                            <div key={ini} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', background: ['#6080f8','#22c55e','#f97316','#a855f7'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginLeft: i > 0 ? -12 : 0 }}>{ini}</div>
                        ))}
                        <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>2,400+ users trust Alpha Funding</span>
                    </div>
                </div>}

                {/* ── RIGHT FORM PANEL ──────────────────────────────── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 16px' : '24px', minHeight: isTablet ? 'calc(100vh - 54px)' : 'auto' }}>

                    {/* ══ LOGIN VIEW ══ */}
                    {view === 'login' && (
                        <div style={{ width: '100%', maxWidth: 440 }}>
                            <div style={{ textAlign: 'center', marginBottom: isMobile ? 16 : 20 }}>
                                <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.85rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Welcome back</h2>
                                <p style={{ fontSize: '0.88rem', color: textSecondary, margin: 0 }}>Sign in to your enterprise account</p>
                            </div>

                            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: isMobile ? '20px 18px 18px' : '28px 32px 22px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 4px 24px rgba(36,71,215,0.08)' }}>
                                <form onSubmit={handleLogin} noValidate>
                                    <div style={{ marginBottom: 14 }}>
                                        <label style={labelStyle}>Email address</label>
                                        <div style={inputStyle}>
                                            <span style={iconBoxStyle}><IconUser /></span>
                                            <input style={inputFieldStyle} type="email" placeholder="alex@whiterock.com" autoComplete="off" name="no-autofill" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onFocus={e => e.target.parentNode.style.borderColor = inputFocusBorder} onBlur={e => e.target.parentNode.style.borderColor = inputBorder} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                                            <button type="button" style={{ fontSize: '0.82rem', fontWeight: 600, color: accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={openForgotFlow}>Forgot password?</button>
                                        </div>
                                        <div style={inputStyle}>
                                            <span style={iconBoxStyle}><IconLock /></span>
                                            <input style={{ ...inputFieldStyle, paddingRight: 44 }} type={showLoginPw ? 'text' : 'password'} placeholder="••••••••" autoComplete="off" name="no-autofill-pw" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onFocus={e => e.target.parentNode.style.borderColor = inputFocusBorder} onBlur={e => e.target.parentNode.style.borderColor = inputBorder} />
                                            <button type="button" style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', padding: 4 }} onClick={() => setShowLoginPw(!showLoginPw)}>{showLoginPw ? <IconEyeOff /> : <IconEye />}</button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                        <input type="checkbox" id="keep-logged" style={{ width: 17, height: 17, cursor: 'pointer', accentColor: accent }} checked={keepLogged} onChange={e => setKeepLogged(e.target.checked)} />
                                        <label htmlFor="keep-logged" style={{ fontSize: '0.875rem', color: textSecondary, cursor: 'pointer' }}>Keep me signed in</label>
                                    </div>

                                    {loginError && <div style={{ background: isDark ? 'rgba(220,38,38,0.12)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(220,38,38,0.3)' : '#fecaca'}`, color: isDark ? '#f87171' : '#dc2626', fontSize: '0.82rem', fontWeight: 500, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>{loginError}</div>}

                                    <button type="submit" style={btnPrimary} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(40,85,232,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(40,85,232,0.35)'; }}>
                                        Sign In <IconArrow />
                                    </button>
                                </form>

                                <div style={{ height: 1, background: isDark ? '#2c3568' : '#e8edf8', margin: '24px 0 20px' }} />
                                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: textMuted, margin: 0 }}>
                                    Don't have an account?{' '}
                                    <a href="#" style={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>Contact your administrator</a>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ══ FORGOT PASSWORD VIEWS ══ */}
                    {['fp-email','fp-otp','fp-newpw'].includes(view) && (
                        <div style={{ width: '100%', maxWidth: 440 }}>
                            <StepIndicator current={fpStep} isDark={isDark} />
                            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: isMobile ? '24px 18px 20px' : '36px 36px 28px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 4px 24px rgba(36,71,215,0.08)' }}>

                                {view === 'fp-email' && (
                                    <>
                                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.4px', marginBottom: 8 }}>Reset Password</h2>
                                        <p style={{ fontSize: '0.88rem', color: textSecondary, marginBottom: 28 }}>Enter your email to receive a verification code.</p>
                                        <form onSubmit={handleSendCode} noValidate>
                                            <div style={{ marginBottom: 20 }}>
                                                <label style={labelStyle}>Email Address</label>
                                                <div style={inputStyle}>
                                                    <span style={iconBoxStyle}><IconMail /></span>
                                                    <input style={inputFieldStyle} type="email" placeholder="alex@whiterock.com" value={fpEmail} onChange={e => setFpEmail(e.target.value)} onFocus={e => e.target.parentNode.style.borderColor = inputFocusBorder} onBlur={e => e.target.parentNode.style.borderColor = inputBorder} />
                                                </div>
                                            </div>
                                            {fpEmailError && <div style={{ background: isDark ? 'rgba(220,38,38,0.12)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(220,38,38,0.3)' : '#fecaca'}`, color: isDark ? '#f87171' : '#dc2626', fontSize: '0.82rem', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>{fpEmailError}</div>}
                                            <button type="submit" style={btnPrimary}>Send Reset Code <IconArrow /></button>
                                        </form>
                                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: accent, fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', width: '100%', marginTop: 16, padding: 4 }} onClick={() => setView('login')}><IconBack /> Back to Login</button>
                                    </>
                                )}

                                {view === 'fp-otp' && (
                                    <>
                                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.4px', marginBottom: 8 }}>Check your email</h2>
                                        <p style={{ fontSize: '0.88rem', color: textSecondary, marginBottom: 28 }}>We sent a 6-digit code to <strong style={{ color: textPrimary }}>{fpEmail}</strong></p>
                                        <form onSubmit={handleVerifyOtp} noValidate>
                                            <label style={{ ...labelStyle, textAlign: 'center' }}>Verification Code</label>
                                            <div style={{ display: 'flex', gap: isMobile ? 6 : 10, justifyContent: 'center', marginBottom: 20 }}>
                                                {otp.map((digit, i) => (
                                                    <input key={i} ref={el => (otpRefs.current[i] = el)}
                                                        style={{ width: isMobile ? 42 : 52, height: isMobile ? 50 : 58, padding: 0, textAlign: 'center', fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 700, borderRadius: 12, border: `1.5px solid ${digit ? accent : inputBorder}`, color: textPrimary, background: inputBg, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s', flexShrink: 0 }}
                                                        type="text" inputMode="numeric" maxLength={1} value={digit}
                                                        onChange={e => handleOtpChange(e.target.value, i)}
                                                        onKeyDown={e => handleOtpKey(e, i)}
                                                        onPaste={i === 0 ? handleOtpPaste : undefined}
                                                    />
                                                ))}
                                            </div>
                                            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: textMuted, marginBottom: 20 }}>
                                                Didn't receive a code?{' '}
                                                <button type="button" style={{ color: accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }} onClick={() => alert('Code resent! (demo)')}>Resend</button>
                                            </p>
                                            {otpError && <div style={{ background: isDark ? 'rgba(220,38,38,0.12)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(220,38,38,0.3)' : '#fecaca'}`, color: isDark ? '#f87171' : '#dc2626', fontSize: '0.82rem', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>{otpError}</div>}
                                            <button type="submit" style={btnPrimary}>Verify Code <IconArrow /></button>
                                        </form>
                                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: accent, fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', width: '100%', marginTop: 16, padding: 4 }} onClick={() => setView('fp-email')}><IconBack /> Back</button>
                                    </>
                                )}

                                {view === 'fp-newpw' && (
                                    <>
                                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.4px', marginBottom: 8 }}>Set New Password</h2>
                                        <p style={{ fontSize: '0.88rem', color: textSecondary, marginBottom: 28 }}>Choose a secure password for your account.</p>
                                        <form onSubmit={handleSetPassword} noValidate>
                                            <div style={{ marginBottom: 18 }}>
                                                <label style={labelStyle}>New Password</label>
                                                <div style={inputStyle}>
                                                    <input style={{ ...inputFieldStyle, paddingLeft: 14, paddingRight: 44 }} type={showNewPw ? 'text' : 'password'} placeholder="••••••••" value={newPw} onChange={e => setNewPw(e.target.value)} onFocus={e => e.target.parentNode.style.borderColor = inputFocusBorder} onBlur={e => e.target.parentNode.style.borderColor = inputBorder} />
                                                    <button type="button" style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', padding: 4 }} onClick={() => setShowNewPw(!showNewPw)}>{showNewPw ? <IconEyeOff /> : <IconEye />}</button>
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: 18 }}>
                                                <label style={labelStyle}>Confirm Password</label>
                                                <div style={inputStyle}>
                                                    <input style={{ ...inputFieldStyle, paddingLeft: 14, paddingRight: 44 }} type={showConfirmPw ? 'text' : 'password'} placeholder="••••••••" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} onFocus={e => e.target.parentNode.style.borderColor = inputFocusBorder} onBlur={e => e.target.parentNode.style.borderColor = inputBorder} />
                                                    <button type="button" style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', padding: 4 }} onClick={() => setShowConfirmPw(!showConfirmPw)}>{showConfirmPw ? <IconEyeOff /> : <IconEye />}</button>
                                                </div>
                                            </div>
                                            <div style={{ background: isDark ? '#1e2245' : '#f5f7ff', border: `1px solid ${isDark ? '#2c3568' : '#dce4f7'}`, borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: textMuted, marginBottom: 10 }}>Password Requirements</div>
                                                <PwReq met={pwReqs.length} label="At least 8 characters" isDark={isDark} />
                                                <PwReq met={pwReqs.upper} label="At least one uppercase letter" isDark={isDark} />
                                                <PwReq met={pwReqs.symbol} label="At least one special character" isDark={isDark} />
                                            </div>
                                            {newPwError && <div style={{ background: isDark ? 'rgba(220,38,38,0.12)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(220,38,38,0.3)' : '#fecaca'}`, color: isDark ? '#f87171' : '#dc2626', fontSize: '0.82rem', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>{newPwError}</div>}
                                            <button type="submit" style={btnPrimary}>Update Password <IconArrow /></button>
                                        </form>
                                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: accent, fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', width: '100%', marginTop: 16, padding: 4 }} onClick={() => setView('fp-otp')}><IconBack /> Back</button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══ SUCCESS VIEW ══ */}
                    {view === 'fp-success' && (
                        <div style={{ width: '100%', maxWidth: 440 }}>
                            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: isMobile ? '36px 20px 28px' : '52px 36px 44px', textAlign: 'center', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 4px 24px rgba(36,71,215,0.08)' }}>
                                <div style={{ width: 72, height: 72, borderRadius: '50%', background: isDark ? 'rgba(34,197,94,0.15)' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#16a34a' }}>
                                    <IconCheck />
                                </div>
                                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.4px', marginBottom: 12 }}>Password Updated!</h2>
                                <p style={{ fontSize: '0.88rem', color: textSecondary, lineHeight: 1.65, marginBottom: 32 }}>Your password has been updated. You can now sign in with your new credentials.</p>
                                <button style={btnPrimary} onClick={() => { setView('login'); setLoginEmail(''); setLoginPassword(''); }}>Back to Login <IconArrow /></button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Login;

import React, { useState, useRef, useEffect } from 'react';

/* ─────────────────────────────────────────────
   SVG ICON HELPERS
───────────────────────────────────────────── */
const IconLayers = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

const IconHelp = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconLock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const IconEye = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEyeOff = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const IconArrowRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconArrowLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconCheckSm = () => (
    <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
        <polyline points="2 6 5 9 10 3" />
    </svg>
);

/* ─────────────────────────────────────────────
   SHARED NAVBAR
───────────────────────────────────────────── */
const Navbar = ({ showPrivacy = false }) => (
    <nav className="flex justify-between items-center px-10 h-[62px] bg-white border-b border-[#e2e8f0] sticky top-0 z-[100] w-full md:px-6 sm:px-4 sm:h-[58px]">
        <a href="#" className="flex items-center gap-2.5 no-underline text-[#1a1f36]">
            <div className="w-9 h-9 bg-[#2447D7] rounded-[10px] flex items-center justify-center shrink-0 sm:w-8 sm:h-8"><IconLayers /></div>
            <span className="text-[1.1rem] font-bold tracking-[-0.3px] sm:hidden">
                Whiterock <span className="text-[#2447D7]">CRM</span>
            </span>
        </a>
        <div className="flex items-center gap-3 sm:gap-2 xs:gap-2">
            <a href="#" className="flex items-center gap-1.5 text-[#4a5568] text-[0.875rem] font-medium no-underline p-[7px_14px] rounded-lg transition-all duration-150 hover:bg-[#EEF2FF] hover:text-[#2447D7] sm:p-[6px_10px] sm:text-[0.8rem]">
                <span className="sm:hidden"><IconHelp /></span> Help Center
            </a>
            {showPrivacy
                ? <a href="#" className="flex items-center gap-1.5 text-[#4a5568] text-[0.875rem] font-medium no-underline p-[7px_14px] rounded-lg transition-all duration-150 hover:bg-[#EEF2FF] hover:text-[#2447D7] sm:p-[6px_10px] sm:text-[0.8rem]">Privacy Policy</a>
                : <a href="#" className="bg-[#2447D7] text-white text-[0.875rem] font-semibold p-[8px_20px] rounded-lg no-underline transition-all duration-150 hover:bg-[#1a38b8] hover:-translate-y-[1px] sm:p-[6px_14px] sm:text-[0.8rem]">Support</a>
            }
        </div>
    </nav>
);

/* ─────────────────────────────────────────────
   SHARED FOOTER
───────────────────────────────────────────── */
const Footer = () => (
    <footer className="p-[20px_40px] border-t border-[#e2e8f0] bg-white flex justify-center items-center gap-4 text-[0.8rem] text-[#94a3b8] font-['Sora',sans-serif] flex-wrap w-full box-border sm:p-[16px_20px] sm:gap-2 sm:text-[0.75rem]">
        <span>© 2026 Whiterock CRM. All systems operational.</span>
        <span className="w-[3px] h-[3px] bg-[#e2e8f0] rounded-full inline-block shrink-0" />
        <a href="#" className="text-[#94a3b8] no-underline transition-colors duration-150 hover:text-[#2447D7]">Privacy Policy</a>
        <span className="w-[3px] h-[3px] bg-[#e2e8f0] rounded-full inline-block shrink-0" />
        <a href="#" className="text-[#94a3b8] no-underline transition-colors duration-150 hover:text-[#2447D7]">Terms of Service</a>
    </footer>
);

/* ─────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────── */
const StepIndicator = ({ current }) => {
    const steps = ['Email', 'Verify Code', 'New Password'];
    return (
        <div className="flex items-center gap-0 animate-slideUp sm:gap-0">
            {steps.map((label, i) => {
                const num = i + 1;
                const isDone = num < current;
                const isActive = num === current;
                return (
                    <React.Fragment key={num}>
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[0.78rem] font-bold transition-all duration-300 ${isActive ? 'border-[#2447D7] bg-[#2447D7] text-white' : isDone ? 'border-[#22c55e] bg-[#22c55e] text-white' : 'border-[#e2e8f0] bg-white text-[#94a3b8]'}`}>
                                {isDone ? <IconCheckSm /> : num}
                            </div>
                            <span className={`text-[0.72rem] font-semibold whitespace-nowrap sm:text-[0.65rem] ${isActive ? 'text-[#2447D7]' : isDone ? 'text-[#22c55e]' : 'text-[#94a3b8]'}`}>{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`w-14 h-[2px] mx-1.5 mb-[22px] transition-colors duration-300 shrink-0 sm:w-6 sm:mx-1 sm:mb-5 ${isDone ? 'bg-[#22c55e]' : 'bg-[#e2e8f0]'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

/* ─────────────────────────────────────────────
   PASSWORD REQUIREMENT ROW
───────────────────────────────────────────── */
const PwReq = ({ met, label }) => (
    <div className={`flex items-center gap-[10px] mb-2 text-[0.85rem] transition-colors duration-200 ${met ? 'text-[#1a1f36]' : 'text-[#4a5568]'}`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-250 ${met ? 'bg-[#22c55e]' : 'bg-[#dde3ef]'}`}>{met && <IconCheckSm />}</div>
        {label}
    </div>
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const Login = ({ onLogin, defaultRole }) => {

    // ── VIEW STATES ──
    // 'login' | 'fp-email' | 'fp-otp' | 'fp-newpw' | 'fp-success'
    const [view, setView] = useState('login');

    // ── LOGIN STATE ──
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPw, setShowLoginPw] = useState(false);
    const [keepLogged, setKeepLogged] = useState(false);
    const [loginError, setLoginError] = useState('');

    // ── FORGOT PASSWORD STATE ──
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

    const pwReqs = {
        length: newPw.length >= 8,
        upper: /[A-Z]/.test(newPw),
        symbol: /[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?`~]/.test(newPw),
    };

    // Reset forgot-pw state when entering the flow
    const openForgotFlow = () => {
        setFpEmail(''); setFpEmailError('');
        setOtp(['', '', '', '', '', '']); setOtpError('');
        setNewPw(''); setConfirmPw(''); setNewPwError('');
        setView('fp-email');
    };

    /* ── LOGIN SUBMIT ── */
    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');
        if (!loginEmail) { setLoginError('Please enter your email address.'); return; }
        if (!loginPassword) { setLoginError('Please enter your password.'); return; }

        // For now, let's bypass real backend check as requested
        let role = defaultRole || 'client';
        if (!defaultRole) {
            if (loginEmail.startsWith('tele')) role = 'tele_agent';
            else if (loginEmail.startsWith('admin')) role = 'super_admin';
            else if (loginEmail.startsWith('manager')) role = 'accounts_manager';
            else if (loginEmail.startsWith('leader')) role = 'team_leader';
        }

        const NAMES = {
            tele_agent: ['Tele', 'User'],
            super_admin: ['Admin', 'User'],
            accounts_manager: ['Alex', 'Thompson'],
            team_leader: ['Sarah', 'Johnson'],
            client: ['Client', 'User'],
        };

        const mockUser = {
            id: '123',
            email: loginEmail,
            first_name: NAMES[role][0],
            last_name: NAMES[role][1],
            role: role,
            is_staff: role === 'super_admin'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        if (onLogin) onLogin();
    };

    /* ── FP STEP 1: SEND CODE ── */
    const handleSendCode = (e) => {
        e.preventDefault();
        setFpEmailError('');
        if (!fpEmail) { setFpEmailError('Please enter your email address.'); return; }
        if (!isValidEmail(fpEmail)) { setFpEmailError('Please enter a valid email address.'); return; }
        // TODO: POST /api/auth/forgot-password
        setView('fp-otp');
        setTimeout(() => otpRefs.current[0]?.focus(), 300);
    };

    /* ── OTP INPUT HANDLING ── */
    const handleOtpChange = (val, idx) => {
        const digit = val.replace(/\D/g, '').slice(0, 1);
        const next = [...otp];
        next[idx] = digit;
        setOtp(next);
        if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
    };

    const handleOtpKey = (e, idx) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            otpRefs.current[idx - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
        const next = ['', '', '', '', '', ''];
        digits.forEach((d, i) => { next[i] = d; });
        setOtp(next);
        otpRefs.current[Math.min(digits.length, 5)]?.focus();
    };

    /* ── FP STEP 2: VERIFY OTP ── */
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setOtpError('');
        if (otp.join('').length < 6) { setOtpError('Please enter the full 6-digit code.'); return; }
        // TODO: POST /api/auth/verify-otp
        setView('fp-newpw');
    };

    /* ── FP STEP 3: SET NEW PASSWORD ── */
    const handleSetPassword = (e) => {
        e.preventDefault();
        setNewPwError('');
        if (!newPw || !confirmPw) { setNewPwError('Please fill in both password fields.'); return; }
        if (newPw !== confirmPw) { setNewPwError('Passwords do not match.'); return; }
        if (!Object.values(pwReqs).every(Boolean)) { setNewPwError('Password does not meet all requirements.'); return; }
        // TODO: POST /api/auth/reset-password
        setView('fp-success');
    };

    /* ── SHARED FP CARD WRAPPER ── */
    const fpStep = view === 'fp-email' ? 1 : view === 'fp-otp' ? 2 : 3;

    /* ─────────────────────────────────────────
       RENDER
    ───────────────────────────────────────── */
    return (
        <div className="font-['Sora',sans-serif] bg-[#f0f2f7] min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_10%_20%,rgba(36,71,215,0.07)_0%,transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(36,71,215,0.05)_0%,transparent_55%)]">

            <Navbar showPrivacy={view !== 'login'} />

            <main className="flex-1 flex flex-col items-center justify-center p-[40px_16px] gap-6 sm:p-[30px_16px]">

                {/* ══════════════════════════════
                    VIEW: LOGIN
                ══════════════════════════════ */}
                {view === 'login' && (
                    <>
                        <div className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_2px_24px_rgba(36,71,215,0.07),0_1px_4px_rgba(0,0,0,0.04)] w-full max-w-[460px] p-[44px_44px_36px] animate-slideUp box-border sm:p-[28px_20px_24px] sm:rounded-xl sm:w-[calc(100%-32px)] sm:mx-4">
                            <div className="text-center mb-8">
                                <h2 className="text-[1.75rem] font-bold text-[#1a1f36] tracking-[-0.5px] mb-2 sm:text-2xl">Welcome Back</h2>
                                <p className="text-[0.9rem] text-[#4a5568] leading-[1.6] sm:text-[0.85rem]">Enter your enterprise credentials to continue</p>
                            </div>

                            <form onSubmit={handleLogin} noValidate>

                                {/* Email */}
                                <div className="mb-5">
                                    <label htmlFor="login-email" className="block text-[0.85rem] font-semibold text-[#1a1f36] mb-2">Email</label>
                                    <div className="flex items-center border-[1.5px] border-[#e2e8f0] rounded-[10px] bg-white transition-all duration-180 overflow-hidden relative focus-within:border-[#2447D7] focus-within:shadow-[0_0_0_3px_rgba(36,71,215,0.1)]">
                                        <span className="flex items-center justify-center shrink-0 w-[44px] text-[#94a3b8] transition-colors duration-200 group-focus-within:text-[#2447D7]"><IconUser /></span>
                                        <input
                                            id="login-email"
                                            className="flex-1 min-w-0 p-[14px_12px_14px_0] border-none bg-transparent font-inherit text-[0.9rem] text-[#1a1f36] outline-none placeholder:text-[#94a3b8] placeholder:font-normal"
                                            type="email"
                                            placeholder="e.g. alex@whiterock.com"
                                            autoComplete="email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="login-password" className="text-[0.85rem] font-semibold text-[#1a1f36]">Password</label>
                                        <button type="button" className="text-[0.82rem] font-semibold text-[#2447D7] bg-none border-none cursor-pointer p-0 transition-opacity duration-150 hover:opacity-75"
                                            onClick={openForgotFlow}>
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="flex items-center border-[1.5px] border-[#e2e8f0] rounded-[10px] bg-white transition-all duration-180 overflow-hidden relative focus-within:border-[#2447D7] focus-within:shadow-[0_0_0_3px_rgba(36,71,215,0.1)]">
                                        <span className="flex items-center justify-center shrink-0 w-[44px] text-[#94a3b8] transition-colors duration-200"><IconLock /></span>
                                        <input
                                            id="login-password"
                                            className="flex-1 min-w-0 p-[14px_44px_14px_0] border-none bg-transparent font-inherit text-[0.9rem] text-[#1a1f36] outline-none placeholder:text-[#94a3b8] placeholder:font-normal"
                                            type={showLoginPw ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                        />
                                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#94a3b8] flex items-center p-1 transition-colors duration-150 hover:text-[#2447D7]"
                                            onClick={() => setShowLoginPw(!showLoginPw)}>
                                            {showLoginPw ? <IconEyeOff /> : <IconEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Keep logged in */}
                                <div className="flex items-center gap-2.5 mb-6">
                                    <input type="checkbox" id="keep-logged"
                                        className="w-[17px] h-[17px] rounded-md cursor-pointer accent-[#2447D7] shrink-0"
                                        checked={keepLogged}
                                        onChange={(e) => setKeepLogged(e.target.checked)} />
                                    <label htmlFor="keep-logged" className="text-[0.875rem] font-normal text-[#4a5568] cursor-pointer">Keep me logged in</label>
                                </div>

                                {loginError && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[0.82rem] font-medium rounded-lg p-[10px_14px] mb-4" role="alert">{loginError}</div>}

                                <button type="submit" className="w-full p-[13px] bg-[#2447D7] text-white font-semibold text-[0.95rem] border-none rounded-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_4px_14px_rgba(36,71,215,0.3)] hover:bg-[#1a38b8] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(36,71,215,0.35)] active:translate-y-0 group">
                                    Sign In <IconArrowRight className="transition-transform duration-200 group-hover:translate-x-[3px]" />
                                </button>
                            </form>

                            <div className="h-[1px] bg-[#e2e8f0] m-[28px_0_24px]" />
                        </div>

                        <p className="text-[0.875rem] text-[#4a5568] text-center">
                            Don't have an account?{' '}
                            <a href="#" className="text-[#2447D7] font-semibold no-underline transition-opacity duration-150 hover:opacity-75">Contact your administrator</a>
                        </p>
                    </>
                )}

                {/* ══════════════════════════════
                    FORGOT PASSWORD VIEWS (1–3)
                ══════════════════════════════ */}
                {['fp-email', 'fp-otp', 'fp-newpw'].includes(view) && (
                    <>
                        <StepIndicator current={fpStep} />

                        <div className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_2px_24px_rgba(36,71,215,0.07),0_1px_4px_rgba(0,0,0,0.04)] w-full max-w-[460px] p-[44px_44px_36px] animate-slideUp box-border sm:p-[28px_20px_24px] sm:rounded-xl sm:w-[calc(100%-32px)] sm:mx-4">

                            {/* ── STEP 1: Enter Email ── */}
                            {view === 'fp-email' && (
                                <>
                                    <div className="text-left mb-8">
                                        <h2 className="text-[1.75rem] font-bold text-[#1a1f36] tracking-[-0.5px] mb-2 sm:text-2xl">Reset Password</h2>
                                        <p className="text-[0.9rem] text-[#4a5568] leading-[1.6] sm:text-[0.85rem]">Enter your email to receive a 6-digit verification code.</p>
                                    </div>
                                    <form onSubmit={handleSendCode} noValidate>
                                        <div className="mb-5">
                                            <label htmlFor="fp-email" className="block text-[0.85rem] font-semibold text-[#1a1f36] mb-2">Email Address</label>
                                            <div className="flex items-center border-[1.5px] border-[#e2e8f0] rounded-[10px] bg-white transition-all duration-180 overflow-hidden relative focus-within:border-[#2447D7] focus-within:shadow-[0_0_0_3px_rgba(36,71,215,0.1)]">
                                                <span className="flex items-center justify-center shrink-0 w-[44px] text-[#94a3b8] transition-colors duration-200"><IconMail /></span>
                                                <input
                                                    id="fp-email"
                                                    className="flex-1 min-w-0 p-[14px_12px_14px_0] border-none bg-transparent font-inherit text-[0.9rem] text-[#1a1f36] outline-none placeholder:text-[#94a3b8] placeholder:font-normal"
                                                    type="email"
                                                    placeholder="e.g. alex@whiterock.com"
                                                    autoComplete="email"
                                                    value={fpEmail}
                                                    onChange={(e) => setFpEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {fpEmailError && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[0.82rem] font-medium rounded-lg p-[10px_14px] mb-4" role="alert">{fpEmailError}</div>}
                                        <button type="submit" className="w-full p-[13px] bg-[#2447D7] text-white font-semibold text-[0.95rem] border-none rounded-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_4px_14px_rgba(36,71,215,0.3)] hover:bg-[#1a38b8] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(36,71,215,0.35)] active:translate-y-0 group">
                                            Send Reset Code <IconArrowRight className="transition-transform duration-200 group-hover:translate-x-[3px]" />
                                        </button>
                                    </form>
                                    <button className="flex items-center justify-center gap-1.5 text-[#2447D7] text-[0.875rem] font-semibold bg-none border-none cursor-pointer w-full mt-4 p-1 transition-opacity duration-150 hover:opacity-75" onClick={() => setView('login')}>
                                        <IconArrowLeft /> Back to Login
                                    </button>
                                    <div className="border-t border-[#e2e8f0] mt-5 pt-4 text-center text-[0.8rem] text-[#94a3b8] leading-[1.6]">
                                        Lost access to your email? <a href="#" className="text-[#2447D7] font-semibold no-underline hover:underline">Contact Support</a>
                                    </div>
                                </>
                            )}

                            {/* ── STEP 2: OTP Verification ── */}
                            {view === 'fp-otp' && (
                                <>
                                    <div className="text-left mb-8">
                                        <h2 className="text-[1.75rem] font-bold text-[#1a1f36] tracking-[-0.5px] mb-2 sm:text-2xl">Enter Verification Code</h2>
                                        <p className="text-[0.9rem] text-[#4a5568] leading-[1.6] sm:text-[0.85rem]">We sent a 6-digit code to <strong>{fpEmail}</strong>. Enter it below.</p>
                                    </div>
                                    <form onSubmit={handleVerifyOtp} noValidate>
                                        <label className="block text-[0.85rem] font-semibold text-[#1a1f36] mb-3 text-center">Verification Code</label>
                                        <div className="flex gap-2.5 justify-center mb-4 sm:gap-1.5">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={(el) => (otpRefs.current[i] = el)}
                                                    className="w-[52px] h-[56px] p-0 text-center text-[1.4rem] font-bold rounded-[10px] border-[1.5px] border-[#e2e8f0] text-[#1a1f36] bg-white outline-none transition-all duration-180 focus:border-[#2447D7] focus:shadow-[0_0_0_3px_rgba(36,71,215,0.1)] sm:w-[42px] sm:h-[48px] sm:text-[1.15rem]"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(e.target.value, i)}
                                                    onKeyDown={(e) => handleOtpKey(e, i)}
                                                    onPaste={i === 0 ? handleOtpPaste : undefined}
                                                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-center text-[0.82rem] text-[#94a3b8] mb-5">
                                            Didn't receive a code?{' '}
                                            <button type="button" className="bg-none border-none text-[#2447D7] font-semibold text-[0.82rem] cursor-pointer p-0 transition-opacity duration-150 hover:opacity-75"
                                                onClick={() => alert('Code resent! (demo)')}>
                                                Resend code
                                            </button>
                                        </p>
                                        {otpError && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[0.82rem] font-medium rounded-lg p-[10px_14px] mb-4" role="alert">{otpError}</div>}
                                        <button type="submit" className="w-full p-[13px] bg-[#2447D7] text-white font-semibold text-[0.95rem] border-none rounded-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_4px_14px_rgba(36,71,215,0.3)] hover:bg-[#1a38b8] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(36,71,215,0.35)] active:translate-y-0 group">
                                            Verify Code <IconArrowRight className="transition-transform duration-200 group-hover:translate-x-[3px]" />
                                        </button>
                                    </form>
                                    <button className="flex items-center justify-center gap-1.5 text-[#2447D7] text-[0.875rem] font-semibold bg-none border-none cursor-pointer w-full mt-4 p-1 transition-opacity duration-150 hover:opacity-75" onClick={() => setView('fp-email')}>
                                        <IconArrowLeft /> Back
                                    </button>
                                </>
                            )}

                            {/* ── STEP 3: Set New Password ── */}
                            {view === 'fp-newpw' && (
                                <>
                                    <div className="text-left mb-8">
                                        <h2 className="text-[1.75rem] font-bold text-[#1a1f36] tracking-[-0.5px] mb-2 sm:text-2xl">Set New Password</h2>
                                        <p className="text-[0.9rem] text-[#4a5568] leading-[1.6] sm:text-[0.85rem]">Almost there! Choose a secure password for your account.</p>
                                    </div>
                                    <form onSubmit={handleSetPassword} noValidate>

                                        {/* New Password */}
                                        <div className="mb-5">
                                            <label htmlFor="new-password" className="block text-[0.85rem] font-semibold text-[#1a1f36] mb-2">New Password</label>
                                            <div className="flex items-center border-[1.5px] border-[#e2e8f0] rounded-[10px] bg-white transition-all duration-180 overflow-hidden relative focus-within:border-[#2447D7] focus-within:shadow-[0_0_0_3px_rgba(36,71,215,0.1)]">
                                                <input
                                                    id="new-password"
                                                    className="flex-1 min-w-0 p-[14px_44px_14px_14px] border-none bg-transparent font-inherit text-[0.9rem] text-[#1a1f36] outline-none placeholder:text-[#94a3b8] placeholder:font-normal"
                                                    type={showNewPw ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={newPw}
                                                    onChange={(e) => setNewPw(e.target.value)}
                                                />
                                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#94a3b8] flex items-center p-1 transition-colors duration-150 hover:text-[#2447D7]"
                                                    onClick={() => setShowNewPw(!showNewPw)}>
                                                    {showNewPw ? <IconEyeOff /> : <IconEye />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="mb-5">
                                            <label htmlFor="confirm-password" className="block text-[0.85rem] font-semibold text-[#1a1f36] mb-2">Confirm Password</label>
                                            <div className="flex items-center border-[1.5px] border-[#e2e8f0] rounded-[10px] bg-white transition-all duration-180 overflow-hidden relative focus-within:border-[#2447D7] focus-within:shadow-[0_0_0_3px_rgba(36,71,215,0.1)]">
                                                <input
                                                    id="confirm-password"
                                                    className="flex-1 min-w-0 p-[14px_44px_14px_14px] border-none bg-transparent font-inherit text-[0.9rem] text-[#1a1f36] outline-none placeholder:text-[#94a3b8] placeholder:font-normal"
                                                    type={showConfirmPw ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={confirmPw}
                                                    onChange={(e) => setConfirmPw(e.target.value)}
                                                />
                                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#94a3b8] flex items-center p-1 transition-colors duration-150 hover:text-[#2447D7]"
                                                    onClick={() => setShowConfirmPw(!showConfirmPw)}>
                                                    {showConfirmPw ? <IconEyeOff /> : <IconEye />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Requirements */}
                                        <div className="bg-[#f7f9ff] border border-[#dce4f7] rounded-[10px] p-4 m-[4px_0_20px]">
                                            <div className="text-[0.72rem] font-bold tracking-widest uppercase text-[#4a5568] mb-3">Password Requirements</div>
                                            <PwReq met={pwReqs.length} label="At least 8 characters long" />
                                            <PwReq met={pwReqs.upper} label="At least one uppercase letter (A–Z)" />
                                            <PwReq met={pwReqs.symbol} label="At least one symbol or special character (!@#)" />
                                        </div>

                                        {newPwError && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[0.82rem] font-medium rounded-lg p-[10px_14px] mb-4" role="alert">{newPwError}</div>}

                                        <button type="submit" className="w-full p-[13px] bg-[#2447D7] text-white font-semibold text-[0.95rem] border-none rounded-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_4px_14px_rgba(36,71,215,0.3)] hover:bg-[#1a38b8] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(36,71,215,0.35)] active:translate-y-0 group">
                                            Update Password <IconArrowRight className="transition-transform duration-200 group-hover:translate-x-[3px]" />
                                        </button>
                                    </form>
                                    <button className="flex items-center justify-center gap-1.5 text-[#2447D7] text-[0.875rem] font-semibold bg-none border-none cursor-pointer w-full mt-4 p-1 transition-opacity duration-150 hover:opacity-75" onClick={() => setView('fp-otp')}>
                                        <IconArrowLeft /> Back
                                    </button>

                                    {/* Security strip */}
                                    <div className="flex justify-center gap-6 mt-6 pt-5 border-t border-[#e2e8f0]">
                                        <div className="flex items-center gap-1.5 text-[0.72rem] font-semibold tracking-widest uppercase text-[#94a3b8]">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                                                strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                            Secure Encryption
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[0.72rem] font-semibold tracking-widest uppercase text-[#94a3b8]">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                                                strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            </svg>
                                            GDPR Compliant
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* ══════════════════════════════
                    VIEW: SUCCESS
                ══════════════════════════════ */}
                {view === 'fp-success' && (
                    <div className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_2px_24px_rgba(36,71,215,0.07),0_1px_4px_rgba(0,0,0,0.04)] w-full max-w-[460px] p-[52px_44px_44px] text-center animate-slideUp sm:p-[28px_20px_24px] sm:rounded-xl sm:w-[calc(100%-32px)] sm:mx-4">
                        <div className="w-[68px] h-[68px] rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-5">
                            <IconCheck className="stroke-[#16a34a]" />
                        </div>
                        <h2 className="text-[1.6rem] font-bold text-[#1a1f36] tracking-[-0.4px] mb-[10px] sm:text-[1.5rem]">Password Updated!</h2>
                        <p className="text-[0.88rem] text-[#4a5568] leading-[1.6] mb-7">Your password has been successfully updated. You can now sign in with your new credentials.</p>
                        <button className="w-full p-[13px] bg-[#2447D7] text-white font-semibold text-[0.95rem] border-none rounded-[10px] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_4px_14px_rgba(36,71,215,0.3)] hover:bg-[#1a38b8] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(36,71,215,0.35)] active:translate-y-0 group" onClick={() => {
                            setView('login');
                            setLoginEmail(''); setLoginPassword('');
                        }}>
                            Back to Login <IconArrowRight className="transition-transform duration-200 group-hover:translate-x-[3px]" />
                        </button>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
};

export default Login;

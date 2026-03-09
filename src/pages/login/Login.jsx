import React, { useState, useRef, useEffect } from 'react';
import './Login.css';

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
    <nav className="navbar">
        <a href="#" className="nav-brand">
            <div className="brand-icon"><IconLayers /></div>
            <span className="brand-name">
                Whiterock <span className="brand-highlight">CRM</span>
            </span>
        </a>
        <div className="nav-actions">
            <a href="#" className="btn-help"><IconHelp /> Help Center</a>
            {showPrivacy
                ? <a href="#" className="btn-help">Privacy Policy</a>
                : <a href="#" className="btn-support">Support</a>
            }
        </div>
    </nav>
);

/* ─────────────────────────────────────────────
   SHARED FOOTER
───────────────────────────────────────────── */
const Footer = () => (
    <footer className="site-footer">
        <span>© 2026 Whiterock CRM. All systems operational.</span>
        <span className="footer-dot" />
        <a href="#">Privacy Policy</a>
        <span className="footer-dot" />
        <a href="#">Terms of Service</a>
    </footer>
);

/* ─────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────── */
const StepIndicator = ({ current }) => {
    const steps = ['Email', 'Verify Code', 'New Password'];
    return (
        <div className="step-indicator">
            {steps.map((label, i) => {
                const num = i + 1;
                const isDone = num < current;
                const isActive = num === current;
                return (
                    <React.Fragment key={num}>
                        <div className={`step ${isActive ? 'step--active' : ''} ${isDone ? 'step--done' : ''}`}>
                            <div className="step-circle">
                                {isDone ? <IconCheckSm /> : num}
                            </div>
                            <span className="step-label">{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`step-line ${isDone ? 'step-line--done' : ''}`} />
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
    <div className={`pw-req-item ${met ? 'pw-req-item--met' : ''}`}>
        <div className="req-dot">{met && <IconCheckSm />}</div>
        {label}
    </div>
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const Login = ({ onLogin }) => {

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
        let role = 'client';
        if (loginEmail.startsWith('tele')) role = 'tele_agent';
        else if (loginEmail.startsWith('admin')) role = 'super_admin';
        else if (loginEmail.startsWith('team')) role = 'team_leader';

        const mockUser = {
            id: '123',
            email: loginEmail,
            first_name: role === 'tele_agent' ? 'Tele' : (role === 'super_admin' ? 'Admin' : 'Client'),
            last_name: 'User',
            role: role
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
        <div className="page-wrapper">

            <Navbar showPrivacy={view !== 'login'} />

            <main className="main-content">

                {/* ══════════════════════════════
                    VIEW: LOGIN
                ══════════════════════════════ */}
                {view === 'login' && (
                    <>
                        <div className="login-card">
                            <div className="card-header">
                                <h2>Welcome Back</h2>
                                <p>Enter your enterprise credentials to continue</p>
                            </div>

                            <form onSubmit={handleLogin} noValidate>

                                {/* Email */}
                                <div className="form-group">
                                    <label htmlFor="login-email">Email</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon"><IconUser /></span>
                                        <input
                                            id="login-email"
                                            type="email"
                                            placeholder="e.g. alex@whiterock.com"
                                            autoComplete="email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="form-group">
                                    <div className="form-label-row">
                                        <label htmlFor="login-password">Password</label>
                                        <button type="button" className="forgot-link"
                                            onClick={openForgotFlow}>
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="input-wrapper">
                                        <span className="input-icon"><IconLock /></span>
                                        <input
                                            id="login-password"
                                            type={showLoginPw ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                        />
                                        <button type="button" className="toggle-password"
                                            onClick={() => setShowLoginPw(!showLoginPw)}>
                                            {showLoginPw ? <IconEyeOff /> : <IconEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Keep logged in */}
                                <div className="keep-logged-in">
                                    <input type="checkbox" id="keep-logged"
                                        checked={keepLogged}
                                        onChange={(e) => setKeepLogged(e.target.checked)} />
                                    <label htmlFor="keep-logged">Keep me logged in</label>
                                </div>

                                {loginError && <div className="form-error" role="alert">{loginError}</div>}

                                <button type="submit" className="btn-primary">
                                    Sign In <IconArrowRight />
                                </button>
                            </form>

                            <div className="divider" />
                        </div>

                        <p className="contact-admin">
                            Don't have an account?{' '}
                            <a href="#">Contact your administrator</a>
                        </p>
                    </>
                )}

                {/* ══════════════════════════════
                    FORGOT PASSWORD VIEWS (1–3)
                ══════════════════════════════ */}
                {['fp-email', 'fp-otp', 'fp-newpw'].includes(view) && (
                    <>
                        <StepIndicator current={fpStep} />

                        <div className="login-card">

                            {/* ── STEP 1: Enter Email ── */}
                            {view === 'fp-email' && (
                                <>
                                    <div className="card-header card-header--left">
                                        <h2>Reset Password</h2>
                                        <p>Enter your email to receive a 6-digit verification code.</p>
                                    </div>
                                    <form onSubmit={handleSendCode} noValidate>
                                        <div className="form-group">
                                            <label htmlFor="fp-email">Email Address</label>
                                            <div className="input-wrapper">
                                                <span className="input-icon"><IconMail /></span>
                                                <input
                                                    id="fp-email"
                                                    type="email"
                                                    placeholder="e.g. alex@whiterock.com"
                                                    autoComplete="email"
                                                    value={fpEmail}
                                                    onChange={(e) => setFpEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {fpEmailError && <div className="form-error" role="alert">{fpEmailError}</div>}
                                        <button type="submit" className="btn-primary">
                                            Send Reset Code <IconArrowRight />
                                        </button>
                                    </form>
                                    <button className="btn-back" onClick={() => setView('login')}>
                                        <IconArrowLeft /> Back to Login
                                    </button>
                                    <div className="card-note">
                                        Lost access to your email? <a href="#">Contact Support</a>
                                    </div>
                                </>
                            )}

                            {/* ── STEP 2: OTP Verification ── */}
                            {view === 'fp-otp' && (
                                <>
                                    <div className="card-header card-header--left">
                                        <h2>Enter Verification Code</h2>
                                        <p>We sent a 6-digit code to <strong>{fpEmail}</strong>. Enter it below.</p>
                                    </div>
                                    <form onSubmit={handleVerifyOtp} noValidate>
                                        <label className="otp-label">Verification Code</label>
                                        <div className="otp-row">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={(el) => (otpRefs.current[i] = el)}
                                                    className="otp-input"
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
                                        <p className="otp-hint">
                                            Didn't receive a code?{' '}
                                            <button type="button" className="resend-btn"
                                                onClick={() => alert('Code resent! (demo)')}>
                                                Resend code
                                            </button>
                                        </p>
                                        {otpError && <div className="form-error" role="alert">{otpError}</div>}
                                        <button type="submit" className="btn-primary">
                                            Verify Code <IconArrowRight />
                                        </button>
                                    </form>
                                    <button className="btn-back" onClick={() => setView('fp-email')}>
                                        <IconArrowLeft /> Back
                                    </button>
                                </>
                            )}

                            {/* ── STEP 3: Set New Password ── */}
                            {view === 'fp-newpw' && (
                                <>
                                    <div className="card-header card-header--left">
                                        <h2>Set New Password</h2>
                                        <p>Almost there! Choose a secure password for your account.</p>
                                    </div>
                                    <form onSubmit={handleSetPassword} noValidate>

                                        {/* New Password */}
                                        <div className="form-group">
                                            <label htmlFor="new-password">New Password</label>
                                            <div className="input-wrapper">
                                                <input
                                                    id="new-password"
                                                    className="input-no-icon"
                                                    type={showNewPw ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={newPw}
                                                    onChange={(e) => setNewPw(e.target.value)}
                                                />
                                                <button type="button" className="toggle-password"
                                                    onClick={() => setShowNewPw(!showNewPw)}>
                                                    {showNewPw ? <IconEyeOff /> : <IconEye />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="form-group">
                                            <label htmlFor="confirm-password">Confirm Password</label>
                                            <div className="input-wrapper">
                                                <input
                                                    id="confirm-password"
                                                    className="input-no-icon"
                                                    type={showConfirmPw ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={confirmPw}
                                                    onChange={(e) => setConfirmPw(e.target.value)}
                                                />
                                                <button type="button" className="toggle-password"
                                                    onClick={() => setShowConfirmPw(!showConfirmPw)}>
                                                    {showConfirmPw ? <IconEyeOff /> : <IconEye />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Requirements */}
                                        <div className="pw-requirements">
                                            <div className="pw-req-title">Password Requirements</div>
                                            <PwReq met={pwReqs.length} label="At least 8 characters long" />
                                            <PwReq met={pwReqs.upper} label="At least one uppercase letter (A–Z)" />
                                            <PwReq met={pwReqs.symbol} label="At least one symbol or special character (!@#)" />
                                        </div>

                                        {newPwError && <div className="form-error" role="alert">{newPwError}</div>}

                                        <button type="submit" className="btn-primary">
                                            Update Password <IconArrowRight />
                                        </button>
                                    </form>
                                    <button className="btn-back" onClick={() => setView('fp-otp')}>
                                        <IconArrowLeft /> Back
                                    </button>

                                    {/* Security strip */}
                                    <div className="security-strip">
                                        <div className="sec-badge">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                                                strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                            Secure Encryption
                                        </div>
                                        <div className="sec-badge">
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
                    <div className="success-card">
                        <div className="success-icon"><IconCheck /></div>
                        <h2>Password Updated!</h2>
                        <p>Your password has been successfully updated. You can now sign in with your new credentials.</p>
                        <button className="btn-primary" onClick={() => {
                            setView('login');
                            setLoginEmail(''); setLoginPassword('');
                        }}>
                            Back to Login <IconArrowRight />
                        </button>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
};

export default Login;

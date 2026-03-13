import React from 'react';
import whatsappQr from '../../../assets/images/whatsapp_qr.png';
import { useTheme } from '../../../context/ThemeContext';

const Support = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const cardStyle = {
        background: isDark ? '#1e2340' : '#ffffff',
        border: `1px solid ${isDark ? '#2d3561' : '#edf2f7'}`,
        boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.02)',
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="mb-10">
                <h1
                    className="text-[1.75rem] font-bold mb-2 sm:text-2xl tracking-tight"
                    style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}
                >
                    Help &amp; Support
                </h1>
                <p className="text-[0.95rem] leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#718096' }}>
                    Have questions or need assistance? Our team is here to help you 24/7.
                </p>
            </header>

            <div className="grid grid-cols-[1fr_400px] gap-8 lg:grid-cols-1">
                {/* Contact Methods */}
                <div className="flex flex-col gap-6">
                    {/* Email */}
                    <div
                        className="rounded-2xl p-6 flex items-center gap-6 hover:shadow-lg transition-all duration-300 group"
                        style={cardStyle}
                    >
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-[#2563eb] group-hover:text-white"
                            style={{ background: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff', color: '#2563eb' }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-lg font-bold" style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}>Email Us</h3>
                            <p className="font-medium" style={{ color: isDark ? '#94a3b8' : '#4a5568' }}>support@whiterockcrm.com</p>
                            <span className="text-[12px] font-semibold" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Typical response time: 2 hours</span>
                        </div>
                    </div>

                    {/* Call */}
                    <div
                        className="rounded-2xl p-6 flex items-center gap-6 hover:shadow-lg transition-all duration-300 group"
                        style={cardStyle}
                    >
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-[#db2777] group-hover:text-white"
                            style={{ background: isDark ? 'rgba(219,39,119,0.15)' : '#fdf2f8', color: '#db2777' }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-lg font-bold" style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}>Call Us</h3>
                            <p className="font-medium" style={{ color: isDark ? '#94a3b8' : '#4a5568' }}>+1 (800) 123-4567</p>
                            <span className="text-[12px] font-semibold" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Available Mon-Fri, 9am - 6pm</span>
                        </div>
                    </div>

                    {/* Visit */}
                    <div
                        className="rounded-2xl p-6 flex items-center gap-6 hover:shadow-lg transition-all duration-300 group"
                        style={cardStyle}
                    >
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-[#16a34a] group-hover:text-white"
                            style={{ background: isDark ? 'rgba(22,163,74,0.15)' : '#f0fdf4', color: '#16a34a' }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-lg font-bold" style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}>Visit Office</h3>
                            <p className="font-medium leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#4a5568' }}>123 Financial Plaza, New York, NY 10001</p>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Section */}
                <div
                    className="rounded-3xl p-8 flex flex-col gap-8 relative overflow-hidden group"
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, #0d5c2a, #128c3e)'
                            : 'linear-gradient(135deg, #25D366, #1db954)',
                        boxShadow: isDark
                            ? '0 20px 40px -10px rgba(18,140,62,0.4)'
                            : '0 20px 40px -10px rgba(37,211,102,0.3)',
                    }}
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                            <svg viewBox="0 0 24 24" fill="#25D366" width="32" height="32">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.115-.708-.941-.708-1.797 0-.855.448-1.274.607-1.44.159-.166.346-.208.462-.208s.231.005.332.012c.108.008.253-.041.395.3s.484 1.181.527 1.265c.043.085.072.184.014.3-.058.115-.087.187-.174.29-.087.103-.182.23-.261.309-.094.094-.193.197-.083.385.11.188.487.804 1.047 1.303.721.643 1.327.842 1.515.936.188.094.299.079.408-.047.108-.126.473-.551.599-.739.126-.188.252-.158.423-.095.171.063 1.085.512 1.272.606.187.094.312.141.357.219.045.078.045.452-.099.857zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.435 5.176L2 22l4.957-1.3c1.517.845 3.257 1.3 5.043 1.3 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-lg font-bold text-white">Chat with us</h3>
                            <p className="text-white/80 text-[13px] font-medium leading-tight">Fast and secure communication for your loan queries.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 relative z-10">
                        <div className="bg-white p-4 rounded-3xl shadow-xl hover:rotate-2 transition-transform duration-300">
                            <img src={whatsappQr} alt="WhatsApp QR Code" className="w-48 h-48 object-contain" />
                            <p className="text-center text-[11px] font-bold text-[#25D366] uppercase mt-3 tracking-widest">Scan to start chat</p>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <a
                                href="https://wa.me/1234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-3.5 px-6 rounded-xl text-sm font-extrabold flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all no-underline"
                                style={{
                                    background: isDark ? 'rgba(255,255,255,0.15)' : '#ffffff',
                                    color: isDark ? '#ffffff' : '#25D366',
                                    border: isDark ? '1px solid rgba(255,255,255,0.25)' : 'none',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.25)' : '#f0fff4';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : '#ffffff';
                                }}
                            >
                                Open WhatsApp Web
                            </a>
                            <p className="text-center text-[12px] font-bold text-white/90">Or message us at +1 234 567 890</p>
                        </div>
                    </div>
                </div>
            </div>

            <section
                className="mt-12 rounded-3xl p-8 sm:p-6"
                style={{
                    background: isDark ? '#1e2340' : '#ffffff',
                    border: `1px solid ${isDark ? '#2d3561' : '#edf2f7'}`,
                    boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.02)',
                }}
            >
                <h3
                    className="text-xl font-bold mb-8 tracking-tight"
                    style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}
                >
                    Common Questions
                </h3>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
                    <div
                        className="flex flex-col gap-3 p-6 rounded-2xl transition-all duration-300"
                        style={{
                            background: isDark ? '#252c50' : '#f8fafc',
                            border: `1px solid ${isDark ? '#2d3561' : '#f1f5f9'}`,
                        }}
                    >
                        <h4 className="text-[15px] font-bold" style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>
                            How long does the verification take?
                        </h4>
                        <p className="text-[14px] font-medium leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#718096' }}>
                            Typically 24-48 business hours once all documents are uploaded.
                        </p>
                    </div>
                    <div
                        className="flex flex-col gap-3 p-6 rounded-2xl transition-all duration-300"
                        style={{
                            background: isDark ? '#252c50' : '#f8fafc',
                            border: `1px solid ${isDark ? '#2d3561' : '#f1f5f9'}`,
                        }}
                    >
                        <h4 className="text-[15px] font-bold" style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>
                            Can I change my requested amount?
                        </h4>
                        <p className="text-[14px] font-medium leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#718096' }}>
                            Yes, as long as your application is in the &apos;Lender Selection&apos; stage.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Support;

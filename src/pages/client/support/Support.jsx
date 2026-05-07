import React from 'react';
import './Support.css';
import whatsappQr from '../../../assets/images/whatsapp_qr.png';

const Support = () => {
    return (
        <div className="support-container">
            <header className="support-header">
                <h1>Help & Support</h1>
                <p>Have questions or need assistance? Our team is here to help you 24/7.</p>
            </header>

            <div className="support-grid">
                {/* Contact Methods */}
                <div className="contact-methods">
                    <div className="contact-card">
                        <div className="contact-icon email">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <div className="contact-info">
                            <h3>Email Us</h3>
                            <p>support@whiterockcrm.com</p>
                            <span className="response-time">Typical response time: 2 hours</span>
                        </div>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon phone">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <div className="contact-info">
                            <h3>Call Us</h3>
                            <p>+1 (800) 123-4567</p>
                            <span className="response-time">Available Mon-Fri, 9am - 6pm</span>
                        </div>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon address">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <div className="contact-info">
                            <h3>Visit Office</h3>
                            <p>123 Financial Plaza, New York, NY 10001</p>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Section */}
                <div className="whatsapp-section-card">
                    <div className="whatsapp-header">
                        <div className="whatsapp-logo">
                            <svg viewBox="0 0 24 24" fill="#25D366" width="32" height="32">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.115-.708-.941-.708-1.797 0-.855.448-1.274.607-1.44.159-.166.346-.208.462-.208s.231.005.332.012c.108.008.253-.041.395.3s.484 1.181.527 1.265c.043.085.072.184.014.3-.058.115-.087.187-.174.29-.087.103-.182.23-.261.309-.094.094-.193.197-.083.385.11.188.487.804 1.047 1.303.721.643 1.327.842 1.515.936.188.094.299.079.408-.047.108-.126.473-.551.599-.739.126-.188.252-.158.423-.095.171.063 1.085.512 1.272.606.187.094.312.141.357.219.045.078.045.452-.099.857zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.435 5.176L2 22l4.957-1.3c1.517.845 3.257 1.3 5.043 1.3 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                            </svg>
                        </div>
                        <div className="whatsapp-title">
                            <h3>Chat with us on WhatsApp</h3>
                            <p>Fast and secure communication for your loan queries.</p>
                        </div>
                    </div>

                    <div className="whatsapp-content">
                        <div className="qr-container">
                            <img src={whatsappQr} alt="WhatsApp QR Code" className="whatsapp-qr" />
                            <p>Scan to start chat</p>
                        </div>
                        <div className="whatsapp-actions">
                            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                                Open WhatsApp Web
                            </a>
                            <p className="whatsapp-hint">Or message us at +1 234 567 890</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="faq-teaser">
                <h3>Common Questions</h3>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h4>How long does the verification take?</h4>
                        <p>Typically 24-48 business hours once all documents are uploaded.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Can I change my requested amount?</h4>
                        <p>Yes, as long as your application is in the 'Lender Selection' stage.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Support;

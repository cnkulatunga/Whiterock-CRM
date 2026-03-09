import React, { useRef } from 'react';
import './Documents.css';

const Documents = () => {
    const fileInputRef = useRef(null);

    const handleBrowse = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            console.log("Selected file:", files[0].name);
            // In a real app, you would handle the upload here
            alert(`Ready to upload: ${files[0].name}`);
        }
    };

    return (
        <div className="document-center">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png"
            />

            <header className="doc-header">
                <h1>Document Center</h1>
                <p>Complete your profile by uploading the required verification files.</p>
            </header>

            <section className="required-docs">
                <div className="section-header">
                    <h2>Required Documents</h2>
                    <span className="action-badge">1 ACTION REQUIRED</span>
                </div>

                <div className="doc-item-card">
                    <div className="doc-icon-wrapper income-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <rect x="3" y="10" width="18" height="12" rx="2" />
                            <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                        </svg>
                    </div>
                    <div className="doc-details">
                        <h3>Bank Statement</h3>
                        <p>Most recent 3 months of banking history</p>
                    </div>
                    <button className="btn-upload-solid" onClick={handleBrowse}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ marginRight: '8px' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Browse & Upload
                    </button>
                </div>
            </section>

            <section className="upload-history">
                <h2>Upload History</h2>
                <div className="history-grid">
                    <div className="history-card approved">
                        <div className="card-top">
                            <div className="history-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>
                        <div className="card-bottom">
                            <div className="file-info-header">
                                <span className="file-name">Bank_Statement_Jan.pdf</span>
                                <span className="status-label approved">APPROVED</span>
                            </div>
                            <span className="upload-date">Uploaded on Jan 15, 2024</span>
                        </div>
                    </div>

                    <div className="history-card approved">
                        <div className="card-top">
                            <div className="history-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>
                        <div className="card-bottom">
                            <div className="file-info-header">
                                <span className="file-name">Bank_Statement_Dec.pdf</span>
                                <span className="status-label approved">APPROVED</span>
                            </div>
                            <span className="upload-date">Uploaded on Dec 12, 2023</span>
                        </div>
                    </div>

                    <div className="history-card pending">
                        <div className="card-top">
                            <div className="history-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                        </div>
                        <div className="card-bottom">
                            <div className="file-info-header">
                                <span className="file-name">Bank_Statement_Feb.pdf</span>
                                <span className="status-label pending">PENDING</span>
                            </div>
                            <span className="upload-date">Uploaded on Feb 24, 2024</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="dropzone-section">
                <div className="dropzone">
                    <div className="upload-cloud-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <h3>Drag and drop files here</h3>
                    <p>Support for PDF, JPG, PNG up to 10MB</p>
                    <button className="btn-browse" onClick={handleBrowse}>Browse Files</button>
                </div>
            </section>
        </div>
    );
};

export default Documents;

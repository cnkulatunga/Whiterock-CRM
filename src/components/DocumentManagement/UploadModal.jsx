import React, { useState, useRef } from 'react';
import { IconUpload, IconCheck, IconAlert, IconFile, IconClose, IconTrash, IconEye } from './Icons';

const UploadModal = ({ client, onClose, onUpload, onDelete, onApprove, onReject, uploadingDocs, isDark, isTeamLeader, isAccountsManager }) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const safeRole = (currentUser.role || '').toLowerCase();
    
    const isTL = isTeamLeader || safeRole.includes('leader');
    const isAM = isAccountsManager || safeRole.includes('manager') || safeRole.includes('admin');
    
    const canUpload = true; 
    const canApproveReject = isTL || isAM;
    const canDelete = isAM;

    const [customName, setCustomName] = useState('');
    const [previewDoc, setPreviewDoc] = useState(null);
    const [rejectionDocId, setRejectionDocId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const fileInputRef = useRef(null);
    const [pendingUpload, setPendingUpload] = useState(null);

    if (!client) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && pendingUpload) {
            onUpload(pendingUpload.clientId, pendingUpload.docId, pendingUpload.docName, file);
            setCustomName('');
        }
        setPendingUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Approved': return { bg: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5', color: isDark ? '#34d399' : '#059669', border: isDark ? 'rgba(16,185,129,0.3)' : '#bbf7d0', icon: <IconCheck size={12} /> };
            case 'Rejected': return { bg: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2', color: isDark ? '#f87171' : '#dc2626', border: isDark ? 'rgba(239,68,68,0.3)' : '#fecaca', icon: <IconAlert size={12} /> };
            case 'Pending':  return { bg: isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb', color: isDark ? '#fbbf24' : '#d97706', border: isDark ? 'rgba(245,158,11,0.3)' : '#fef3c7', icon: <div className="w-1.5 h-1.5 rounded-full bg-current" /> };
            default:         return { bg: isDark ? '#2a3258' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b', border: isDark ? '#36407a' : '#e2e8f0', icon: null };
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            <div 
                className="w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn"
                style={{ 
                    background: isDark ? '#1f2347' : '#ffffff',
                    border: `1px solid ${isDark ? '#36407a' : '#ffffff'}`,
                    boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(36,71,215,0.2)'
                }}
            >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b flex items-center justify-between" style={{ borderColor: isDark ? '#36407a' : '#f1f5f9' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center text-[#2447d7]">
                            <IconFile size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold tracking-tight" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>
                                Manage Documents
                            </h3>
                            <p className="text-[13px] font-medium" style={{ color: isDark ? '#94abda' : '#64748b' }}>
                                {client.name} · {client.id}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5 transition-colors" style={{ color: isDark ? '#94abda' : '#a0aec0' }}><IconClose /></button>
                </div>

                {/* Modal Body */}
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* New Custom Upload Section */}
                    {canUpload && (
                        <div className="mb-8 p-6 rounded-3xl border-2 border-dashed flex flex-col gap-4" style={{ borderColor: isDark ? '#36407a' : '#eef2ff', background: isDark ? 'rgba(36,71,215,0.05)' : '#fcfdff' }}>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-[13px] font-black uppercase tracking-widest text-[#2447d7]">Add New Document</h4>
                                <p className="text-[11px] font-medium text-[#94a3b8]">Upload a custom document like NIC, Passport, or Contract</p>
                            </div>
                            <div className="flex gap-3">
                                <input 
                                    type="text"
                                    placeholder="Enter document name (e.g. NIC Image)"
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all"
                                    style={{ background: isDark ? '#242b50' : '#ffffff', borderColor: isDark ? '#36407a' : '#e2e8f0', color: isDark ? '#e4ecff' : '#1a202c' }}
                                    value={customName}
                                    onChange={e => setCustomName(e.target.value)}
                                />
                                <button 
                                    onClick={() => { 
                                        const finalName = customName.trim() || `Document ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                                        setPendingUpload({ clientId: client.id, docId: null, docName: finalName });
                                        fileInputRef.current?.click();
                                    }}
                                    className="px-6 rounded-xl bg-[#2447d7] text-white text-[13px] font-bold shadow-lg shadow-[#2447d7]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <IconUpload size={14} /> Upload
                                </button>
                            </div>
                        </div>
                    )}

                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-[#94a3b8]">Document Checklist</h4>
                    <div className="flex flex-col gap-4">
                        {(client.documents || []).map(doc => {
                            const styles = getStatusStyles(doc.status);
                            const uploading = uploadingDocs[doc.id];
                            return (
                                <div 
                                    key={doc.id}
                                    className="p-5 rounded-2xl border transition-all duration-300"
                                    style={{ 
                                        background: isDark ? '#242b50' : '#ffffff',
                                        borderColor: isDark ? '#36407a' : '#f1f5f9',
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isDark ? '#2c3568' : '#f8faff', color: isDark ? '#6080f8' : '#2447d7' }}>
                                                <IconFile size={20} />
                                            </div>
                                            <div>
                                                <span className="block text-[14px] font-bold" style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}>{doc.type}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span 
                                                        className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1.5"
                                                        style={{ background: styles.bg, color: styles.color, border: `1px solid ${styles.border}` }}
                                                    >
                                                        {styles.icon}
                                                        {doc.status}
                                                    </span>
                                                    {doc.date && !uploading && <span className="text-[10px] font-medium" style={{ color: isDark ? '#546298' : '#a0aec0' }}>Updated {doc.date}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {!uploading && (
                                            <div className="flex items-center gap-2">
                                                {!(doc.status === 'Approved' && !canApproveReject) && (
                                                    <button 
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className="p-2.5 rounded-xl border border-[#2447d7]/20 text-[#2447d7] hover:bg-[#2447d7]/10 active:scale-95 transition-all"
                                                        title="View Document"
                                                    >
                                                        <IconEye size={16} />
                                                    </button>
                                                )}
                                                
                                                {canUpload && (
                                                    <button 
                                                        onClick={() => {
                                                            setPendingUpload({ clientId: client.id, docId: doc.id, docName: doc.type });
                                                            fileInputRef.current?.click();
                                                        }}
                                                        disabled={doc.status === 'Approved' && !isAM}
                                                        className={`p-2.5 rounded-xl transition-all ${doc.status === 'Approved' && !isAM ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' : 'bg-[#2447d7] text-white shadow-lg shadow-[#2447d7]/20 hover:bg-[#1732a3] hover:scale-105 active:scale-95'}`}
                                                        title={doc.status === 'Approved' && !isAM ? "Cannot re-upload approved document" : "Re-upload Document (Admin Override)"}
                                                    >
                                                        <IconUpload size={16} />
                                                    </button>
                                                )}
                                                
                                                {canDelete && (
                                                    <button 
                                                        onClick={() => onDelete?.(client.id, doc.id)}
                                                        className="p-2.5 rounded-xl bg-white border border-[#fee2e2] text-[#ef4444] hover:bg-[#ef4444] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                                                        title="Delete Document"
                                                    >
                                                        <IconTrash size={16} />
                                                    </button>
                                                )}
                                                
                                                {canApproveReject && (
                                                    <div className="flex items-center gap-2">
                                                        {doc.status !== 'Approved' && (
                                                            <button 
                                                                onClick={() => onApprove?.(client.id, doc.id)}
                                                                className="p-2.5 rounded-xl bg-[#10b981] text-white shadow-lg shadow-[#10b981]/10 hover:bg-[#059669] hover:scale-105 active:scale-95 transition-all"
                                                                title="Approve"
                                                            >
                                                                <IconCheck size={16} strokeWidth={3} />
                                                            </button>
                                                        )}
                                                        {doc.status !== 'Rejected' && (
                                                            <button 
                                                                onClick={() => {
                                                                    setRejectionDocId(doc.id);
                                                                    setRejectionReason('');
                                                                }}
                                                                className="p-2.5 rounded-xl bg-[#ef4444] text-white shadow-lg shadow-[#ef4444]/10 hover:bg-[#dc2626] hover:scale-105 active:scale-95 transition-all"
                                                                title="Reject"
                                                            >
                                                                <IconAlert size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {uploading && (
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[10px] font-black text-[#2447d7] animate-pulse">Uploading Document...</span>
                                                <span className="text-[10px] font-black text-[#2447d7]">{uploading.progress}%</span>
                                            </div>
                                            <div className="h-1.5 rounded-full overflow-hidden bg-gray-100" style={{ background: isDark ? '#1c2040' : '#f1f5f9' }}>
                                                <div 
                                                    className="h-full bg-[#2447d7] transition-all duration-300 ease-out"
                                                    style={{ width: `${uploading.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {doc.status === 'Rejected' && doc.note && !uploading && rejectionDocId !== doc.id && (
                                        <div className="mt-4 p-3 rounded-xl flex gap-3 text-[12px] font-medium" style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fff5f5', color: isDark ? '#f87171' : '#dc2626' }}>
                                            <IconAlert size={14} className="shrink-0 mt-0.5" />
                                            <p className="leading-relaxed"><span className="font-black uppercase tracking-widest text-[10px] block mb-0.5">TL Rejection Note:</span>{doc.note}</p>
                                        </div>
                                    )}

                                    {/* Inline Rejection Reason Input */}
                                    {canApproveReject && rejectionDocId === doc.id && (
                                        <div className="mt-4 p-4 rounded-2xl border animate-fadeIn" style={{ background: isDark ? 'rgba(239,68,68,0.05)' : '#fffafa', borderColor: isDark ? 'rgba(239,68,68,0.2)' : '#ffeaea' }}>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#ef4444]">Reason for rejection</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text"
                                                        placeholder="e.g. Image blurry or document expired..."
                                                        className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium outline-none border transition-all"
                                                        style={{ background: isDark ? '#242b50' : '#ffffff', borderColor: isDark ? 'rgba(239,68,68,0.2)' : '#fecaca', color: isDark ? '#e4ecff' : '#1a202c' }}
                                                        value={rejectionReason}
                                                        onChange={e => setRejectionReason(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            onReject?.(client.id, doc.id, rejectionReason);
                                                            setRejectionDocId(null);
                                                            setRejectionReason('');
                                                        }}
                                                        disabled={!rejectionReason.trim()}
                                                        className="px-5 rounded-xl bg-[#ef4444] text-white text-[12px] font-bold shadow-lg shadow-[#ef4444]/20 hover:bg-[#dc2626] disabled:opacity-50 transition-all"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button 
                                                        onClick={() => setRejectionDocId(null)}
                                                        className="px-4 rounded-xl border text-[12px] font-bold transition-all"
                                                        style={{ borderColor: isDark ? '#36407a' : '#e2e8f0', color: isDark ? '#94a3b8' : '#64748b' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-8 border-t flex justify-end" style={{ borderColor: isDark ? '#36407a' : '#f1f5f9', background: isDark ? '#1c2040' : '#fcfdff' }}>
                    <button onClick={onClose} className="px-8 py-3 rounded-xl text-sm font-bold transition-all border" style={{ background: isDark ? '#242b50' : '#ffffff', color: isDark ? '#94abda' : '#64748b', borderColor: isDark ? '#36407a' : '#e2e8f0' }}>Close Portal</button>
                </div>
            </div>

            {/* Document Preview Overlay */}
            {previewDoc && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#ebf0ff] flex items-center justify-center text-[#2447d7]">
                                    <IconFile size={16} />
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{previewDoc.type}</span>
                            </div>
                            <button onClick={() => setPreviewDoc(null)} className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500"><IconClose size={18} /></button>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-[400px] p-8 relative overflow-hidden">
                            {(previewDoc.url || uploadingDocs[previewDoc.id]?.previewUrl) ? (
                                (previewDoc.fileType?.includes('pdf') || previewDoc.url?.endsWith('.pdf') || uploadingDocs[previewDoc.id]?.file?.type === 'application/pdf') ? (
                                    <iframe 
                                        src={previewDoc.url || uploadingDocs[previewDoc.id]?.previewUrl} 
                                        title="Document Preview"
                                        className="w-full h-full min-h-[500px] rounded-xl shadow-2xl animate-scaleIn border bg-white"
                                    />
                                ) : (
                                    <img 
                                        src={previewDoc.url || uploadingDocs[previewDoc.id]?.previewUrl} 
                                        alt="Preview" 
                                        className="max-w-full max-h-full object-contain shadow-2xl animate-scaleIn"
                                    />
                                )
                            ) : (
                                /* Mock Document Preview Content for Non-images (Fallback) */
                                <div className="bg-white w-full h-full max-w-md shadow-lg p-8 flex flex-col gap-5 animate-slideUp border border-gray-100">
                                    <div className="h-6 w-1/2 bg-gray-100 rounded-lg flex items-center px-3 text-[10px] font-bold text-gray-400">FILE METADATA</div>
                                    <div className="flex flex-col gap-4 mt-4">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">Filename</span>
                                            <span className="text-xs font-bold text-gray-700">{previewDoc.fileName || uploadingDocs[previewDoc.id]?.file?.name || 'document.pdf'}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">File Type</span>
                                            <span className="text-xs font-bold text-gray-700">{uploadingDocs[previewDoc.id]?.file?.type || previewDoc.fileType || 'application/pdf'}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-gray-400">Size</span>
                                            <span className="text-xs font-bold text-gray-700">{uploadingDocs[previewDoc.id]?.file ? `${(uploadingDocs[previewDoc.id].file.size / 1024).toFixed(1)} KB` : '1.2 MB'}</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                        <IconFile size={200} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50/50 flex justify-center">
                            <button 
                                onClick={() => setPreviewDoc(null)}
                                className="px-10 py-2.5 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-900 transition-all shadow-lg active:scale-95"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadModal;

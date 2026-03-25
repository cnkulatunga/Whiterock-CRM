import React, { useState } from 'react';
import { usePromotions } from '../../../context/PromotionsContext';
import { useTheme } from '../../../context/ThemeContext';

/* ─── ICONS ────────────────────────────────────── */
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);
const IconFile = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
    </svg>
);
const IconUpload = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

/* ─── MODAL ─────────────────────────────────────── */
const PromotionModal = ({ title, children, onClose, onSubmit, submitLabel, submitClass, isDark }) => (
    <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fadeIn p-6" onClick={onClose}>
        <div className={`rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden animate-slideUp ${isDark ? 'bg-[#1e2347] border border-[#2c3568]' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'border-[#2c3568]' : 'border-[#f1f5f9]'}`}>
                <h3 className={`text-[15px] font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>{title}</h3>
                <button className={`transition-colors p-1.5 rounded-lg ${isDark ? 'text-[#8ea0d4] hover:text-[#e4ecff] hover:bg-[#2c3568]' : 'text-[#a0aec0] hover:text-[#1a202c] hover:bg-[#f8fafc]'}`} onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <form onSubmit={onSubmit} noValidate className="p-6">
                <div className="flex flex-col gap-4">{children}</div>
                <div className="mt-6 flex gap-3">
                    <button type="button" className={`flex-1 py-2.5 border rounded-xl text-[13px] font-medium transition-all ${isDark ? 'bg-[#1e2347] border-[#2c3568] text-[#8ea0d4] hover:bg-[#2c3568]' : 'bg-white border-[#edf2f7] text-[#718096] hover:bg-[#f8fafc]'}`} onClick={onClose}>Cancel</button>
                    <button type="submit" className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all ${submitClass}`}>{submitLabel}</button>
                </div>
            </form>
        </div>
    </div>
);

const PromotionFormFields = ({ form, setForm, error, isDark }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setForm({ ...form, fileName: file.name, fileData: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const inputClasses = `w-full border py-2.5 px-3 rounded-xl text-[13px] font-medium outline-none focus:border-[#2447d7]/50 transition-all ${isDark ? 'bg-[#141829] border-[#2c3568] text-[#e4ecff]' : 'bg-[#f8fafc] border-[#edf2f7] text-[#1a202c]'}`;
    const labelClasses = `text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-[#8ea0d4]' : 'text-[#a0aec0]'}`;

    return (
        <>
            <div className="flex flex-col gap-1.5">
                <label className={labelClasses}>Lender Name</label>
                <input type="text" className={inputClasses} placeholder="e.g. Alpha Funding" value={form.lenderName} onChange={(e) => setForm({ ...form, lenderName: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className={labelClasses}>Promotion Description</label>
                <textarea rows="3" className={`${inputClasses} resize-none`} placeholder="Describe the promotion..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className={labelClasses}>Promotion Document</label>
                <div className="relative">
                    <input type="file" id="promo-doc" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="promo-doc" className={`flex items-center gap-2 cursor-pointer p-3 border-2 border-dashed rounded-xl transition-all ${isDark ? 'border-[#2c3568] hover:border-[#2447d7]/50 bg-[#141829] text-[#8ea0d4]' : 'border-[#edf2f7] hover:border-[#2447d7]/50 bg-[#f8fafc] text-[#718096]'}`}>
                        <IconUpload />
                        <span className="text-[12px] font-medium truncate">{form.fileName || 'Click to upload promotion document'}</span>
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className={labelClasses}>Start Date</label>
                    <input type="date" className={inputClasses} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={labelClasses}>End Date</label>
                    <input type="date" className={inputClasses} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
            </div>
            {error && <div className="p-3 bg-[#fef2f2] border border-[#fee2e2] text-[#dc2626] text-[12px] font-medium text-center rounded-xl animate-shake">{error}</div>}
        </>
    );
};

const LenderPromotions = () => {
    const { promotions, addPromotion, updatePromotion, deletePromotion } = usePromotions();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ lenderName: '', description: '', fileName: '', fileData: '', startDate: '', endDate: '' });

    const validate = () => {
        if (!form.lenderName.trim()) return 'Lender Name is required';
        if (!form.description.trim()) return 'Description is required';
        if (!form.startDate) return 'Start Date is required';
        if (!form.endDate) return 'End Date is required';
        if (new Date(form.startDate) > new Date(form.endDate)) return 'Start Date cannot be after End Date';
        return null;
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        addPromotion(form);
        setShowAddModal(false);
        setForm({ lenderName: '', description: '', fileName: '', fileData: '', startDate: '', endDate: '' });
        setError('');
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        updatePromotion(editingPromotion.id, form);
        setEditingPromotion(null);
        setForm({ lenderName: '', description: '', fileName: '', fileData: '', startDate: '', endDate: '' });
        setError('');
    };

    const startEdit = (promo) => {
        setEditingPromotion(promo);
        setForm({ lenderName: promo.lenderName, description: promo.description, fileName: promo.fileName, fileData: promo.fileData, startDate: promo.startDate, endDate: promo.endDate });
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className={`text-[1.6rem] font-bold mb-1 ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>Lender Promotions</h1>
                    <p className={`text-sm ${isDark ? 'text-[#8ea0d4]' : 'text-[#718096]'}`}>Manage special offers and promotions from various lenders.</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-[#2447d7] text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-[#1732a3] transition-all shadow-[0_4px_12px_rgba(36,71,215,0.3)]"
                    onClick={() => { setShowAddModal(true); setForm({ lenderName: '', description: '', fileName: '', fileData: '', startDate: '', endDate: '' }); setError(''); }}
                >
                    <IconPlus /> Add Promotion
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
                {promotions.length === 0 ? (
                    <div className={`col-span-full py-20 text-center rounded-2xl border-2 border-dashed ${isDark ? 'bg-[#1e2347] border-[#2c3568] text-[#8ea0d4]' : 'bg-white border-[#edf2f7] text-[#a0aec0]'}`}>
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-[#141829]' : 'bg-[#f8fafc]'}`}>
                            <IconFile />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">No Promotions Found</h3>
                        <p className="text-sm">Start by adding a new lender promotion.</p>
                    </div>
                ) : (
                    promotions.map((promo) => (
                        <div key={promo.id} className={`p-6 rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 ${isDark ? 'bg-[#1e2347] border-[#2c3568] hover:border-[#2447d7]/30' : 'bg-white border-[#edf2f7] hover:border-[#2447d7]/20 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-[#2447d7]/20 text-[#7a96fa]' : 'bg-[#e0e7ff] text-[#2447d7]'}`}>
                                    {promo.lenderName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => startEdit(promo)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-[#8ea0d4] hover:bg-[#2c3568] hover:text-[#e4ecff]' : 'text-[#718096] hover:bg-[#f8fafc] hover:text-[#2447d7]'}`}>
                                        <IconEdit />
                                    </button>
                                    <button onClick={() => deletePromotion(promo.id)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-[#8ea0d4] hover:bg-red-500/10 hover:text-red-500' : 'text-[#718096] hover:bg-red-50 hover:text-red-600'}`}>
                                        <IconTrash />
                                    </button>
                                </div>
                            </div>
                            <h3 className={`font-bold text-[15px] mb-2 line-clamp-2 ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>{promo.description}</h3>
                            
                            {promo.fileName && (
                                <div className={`flex items-center justify-between gap-2 p-2.5 rounded-xl text-[11px] font-medium mb-4 transition-all ${isDark ? 'bg-[#141829] text-[#8ea0d4]' : 'bg-[#f8fafc] text-[#718096]'}`}>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <IconFile />
                                        <span className="truncate">{promo.fileName}</span>
                                    </div>
                                    {promo.fileData && (
                                        <a
                                            href={promo.fileData}
                                            download={promo.fileName}
                                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2c3568] text-[#7a96fa]' : 'hover:bg-white text-[#2447d7]'}`}
                                            title="Download Document"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                        </a>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-[#2c3568]">
                                <div>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>Start Date</p>
                                    <p className={`text-xs font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#4a5568]'}`}>{promo.startDate}</p>
                                </div>
                                <div>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>End Date</p>
                                    <p className={`text-xs font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#4a5568]'}`}>{promo.endDate}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAddModal && (
                <PromotionModal title="Add New Lender Promotion" onClose={() => setShowAddModal(false)} onSubmit={handleAdd} submitLabel="Create Promotion" submitClass="bg-[#2447d7] hover:bg-[#1732a3]" isDark={isDark}>
                    <PromotionFormFields form={form} setForm={setForm} error={error} isDark={isDark} />
                </PromotionModal>
            )}

            {editingPromotion && (
                <PromotionModal title="Edit Lender Promotion" onClose={() => setEditingPromotion(null)} onSubmit={handleUpdate} submitLabel="Update Promotion" submitClass="bg-[#2447d7] hover:bg-[#1732a3]" isDark={isDark}>
                    <PromotionFormFields form={form} setForm={setForm} error={error} isDark={isDark} />
                </PromotionModal>
            )}
        </div>
    );
};

export default LenderPromotions;

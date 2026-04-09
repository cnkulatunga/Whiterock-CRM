import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const IconDoc = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconPlus = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

const AddResourcePopup = ({ onClose, onAdd, initialData = null }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [form, setForm] = useState(initialData || { name: '', category: 'Guides', type: 'PDF', content: '', productCategory: 'Unsecured' });
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert("File is too large! Maximum file size is 10MB to maintain performance.");
                e.target.value = '';
                return;
            }
            setFile(selectedFile);
            set('type', selectedFile.type === 'application/pdf' ? 'PDF' : selectedFile.type.startsWith('image/') ? 'IMG' : 'DOC');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        
        setIsUploading(true);
        let fileData = null;
        let fileType = null;
        let size = '—';

        if (file) {
            fileType = file.type;
            size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
            fileData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        }

        onAdd({ 
            ...form, 
            id: initialData ? initialData.id : Date.now(), 
            tag: { Guides: 'blue', FAQs: 'violet', Products: 'orange' }[form.category] || 'blue', 
            size: file ? size : (initialData?.size || '—'),
            fileData: fileData || (initialData?.fileData || null),
            fileType: fileType || (initialData?.fileType || null),
            content: form.content || (file ? `Attached file: ${file.name}` : '')
        });
        setIsUploading(false);
        onClose();
    };

    const inputCls = `text-[11px] px-3 py-2 rounded-xl border focus:outline-none transition-colors ${isDark ? 'bg-[#151932] border-white/10 text-[#e4ecff] placeholder-white/20 focus:border-teal-500' : 'bg-slate-50 border-slate-200 focus:border-teal-400 placeholder-slate-300'}`;
    const labelCls = `text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-[#546298]' : 'text-slate-500'}`;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn overflow-hidden ${isDark ? 'bg-[#1e2347]' : 'bg-white'}`}>
                <div className={`flex items-center justify-between px-5 py-3.5 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/60'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                            {initialData ? (
                                <IconDoc width="13" height="13" className="text-teal-600" />
                            ) : (
                                <IconPlus width="13" height="13" className="text-teal-600" />
                            )}
                        </div>
                        <p className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>
                            {initialData ? 'Edit Resource' : 'Add Resource'}
                        </p>
                    </div>
                    <button onClick={onClose} className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
                        <IconX width="13" height="13" className={isDark ? 'text-[#94abda]' : 'text-slate-500'} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Resource Name</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. New Call Script Q2 2026" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Category</label>
                        <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                            {['Guides', 'FAQs', 'Products'].map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    {form.category === 'Products' && (
                        <div className="flex flex-col gap-1">
                            <label className={labelCls}>Product Category (Asset Class)</label>
                            <input 
                                value={form.productCategory || ''} 
                                onChange={e => set('productCategory', e.target.value)} 
                                placeholder="e.g. Equipment Finance, SMSF Loan..." 
                                className={inputCls} 
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Upload Document (Optional)</label>
                        <div className={`relative border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${isDark ? 'bg-[#151932] border-white/10 hover:border-teal-500/50' : 'bg-slate-50 border-slate-200 hover:border-teal-400'}`}>
                            <input type="file" onChange={handleFileChange} accept="application/pdf,image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                <IconDoc width="16" height="16" />
                            </div>
                            <p className={`text-[10px] font-bold ${isDark ? 'text-[#e4ecff]' : 'text-slate-700'}`}>{file ? file.name : (initialData?.fileData ? 'Replace existing file...' : 'Drop file or click to browse')}</p>
                            <p className={`text-[8px] uppercase tracking-widest ${isDark ? 'text-[#546298]' : 'text-slate-400'}`}>{file ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'PDF, JPG, PNG (Max 10MB)'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className={labelCls}>Content / Notes</label>
                        <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={3}
                            placeholder="Paste the resource content or notes here..."
                            className={`${inputCls} resize-none leading-relaxed`} />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose} className={`text-[10px] font-bold px-4 py-2 rounded-xl transition-colors ${isDark ? 'text-[#94abda] bg-white/5 hover:bg-white/10' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
                        <button type="submit" disabled={isUploading} className={`text-[10px] font-bold text-white bg-teal-600 px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isUploading ? 'Processing...' : (initialData ? 'Save Changes' : 'Add Resource')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResourcePopup;

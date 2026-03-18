import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const KnowledgeBase = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const requiredDetails = [
        'Turnover',
        'Amount',
        'Purpose',
        'Homeowner',
        'Bank',
        'Overdraft',
        'Existing Loan',
        'Term',
        'Contact',
        'Email',
        'How soon do you need this funding?'
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">
            <header className="flex justify-between items-start gap-4 flex-wrap animate-headerDrop">
                <div>
                    <h1 className="text-[1.6rem] font-bold mb-1" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>Knowledge Based</h1>
                    <p className="text-sm font-medium" style={{ color: isDark ? '#94abda' : '#718096' }}>Information required to pre-qualify leads.</p>
                </div>
            </header>

            <div className="grid grid-cols-[1fr] gap-6">
                <div className="flex flex-col gap-6 w-full">
                    <section 
                        className="rounded-2xl border shadow-sm overflow-hidden"
                        style={{ background: isDark ? '#1e2347' : '#ffffff', borderColor: isDark ? '#2c3568' : '#edf2f7' }}
                    >
                        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: isDark ? '#2c3568' : '#f7fafc' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg outline-none text-white flex items-center justify-center shadow-md bg-gradient-to-br from-[#2855e8] to-[#1a38b8]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <span className="text-[14px] font-bold" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>Required Call Details</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-[13px] leading-relaxed mb-6" style={{ color: isDark ? '#94abda' : '#4a5568' }}>
                                Ensure you collect the following information during your discovery call with the prospect:
                            </p>
                            
                            <div className="grid grid-cols-3 gap-y-4 gap-x-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
                                {requiredDetails.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-md cursor-default" style={{ 
                                        background: isDark ? 'rgba(36, 71, 215, 0.15)' : 'rgba(36, 71, 215, 0.05)',
                                        border: `1px solid ${isDark ? 'rgba(96, 128, 248, 0.3)' : 'rgba(36, 71, 215, 0.15)'}`,
                                        boxShadow: isDark ? 'inset 0 1px 1px rgba(255,255,255,0.05)' : 'inset 0 1px 1px rgba(255,255,255,0.5)'
                                    }}>
                                        <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]" style={{ background: isDark ? '#7a96fa' : '#2447d7', color: isDark ? '#7a96fa' : '#2447d7' }}></div>
                                        <span className="text-[13.5px] font-bold" style={{ color: isDark ? '#e4ecff' : '#1a202c' }}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;

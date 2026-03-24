import React from 'react';
import { usePromotions } from '../../../context/PromotionsContext';
import { useTheme } from '../../../context/ThemeContext';

/* ─── ICONS ────────────────────────────────────── */
const IconFile = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
    </svg>
);

const LenderPromotionsView = () => {
    const { promotions } = usePromotions();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const activePromotions = promotions.filter(promo => {
        const today = new Date().toISOString().split('T')[0];
        return today >= promo.startDate && today <= promo.endDate;
    });

    return (
        <div className="flex flex-col gap-6 animate-fadeIn font-['Sora',sans-serif]">
            <header className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                    <h1 className={`text-[1.6rem] font-bold mb-1 ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>Active Lender Promotions</h1>
                    <p className={`text-sm ${isDark ? 'text-[#8ea0d4]' : 'text-[#718096]'}`}>View ongoing special offers and lender programs.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePromotions.length === 0 ? (
                    <div className={`col-span-full py-20 text-center rounded-2xl border-2 border-dashed ${isDark ? 'bg-[#1e2347] border-[#2c3568] text-[#8ea0d4]' : 'bg-white border-[#edf2f7] text-[#a0aec0]'}`}>
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-[#141829]' : 'bg-[#f8fafc]'}`}>
                            <IconFile />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">No Active Promotions</h3>
                        <p className="text-sm">There are no active promotions at this time.</p>
                    </div>
                ) : (
                    activePromotions.map((promo) => (
                        <div key={promo.id} className={`p-6 rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 ${isDark ? 'bg-[#1e2347] border-[#2c3568] hover:border-[#2447d7]/30' : 'bg-white border-[#edf2f7] hover:border-[#2447d7]/20 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-[#2447d7]/20 text-[#7a96fa]' : 'bg-[#e0e7ff] text-[#2447d7]'}`}>
                                    {promo.lenderName}
                                </div>
                            </div>
                            <h3 className={`font-bold text-[15px] mb-2 line-clamp-2 ${isDark ? 'text-[#e4ecff]' : 'text-[#1a202c]'}`}>{promo.description}</h3>
                            
                            {promo.fileName && (
                                <div className={`group flex items-center justify-between gap-2 p-3 rounded-xl text-[12px] font-bold mb-4 transition-all ${isDark ? 'bg-[#141829] text-[#7a96fa] hover:bg-[#2447d7]/10' : 'bg-[#f0f4ff] text-[#2447d7] hover:bg-[#e0e7ff]'}`}>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <IconFile />
                                        <span className="truncate">{promo.fileName}</span>
                                    </div>
                                    <button className="shrink-0 p-1.5 rounded-lg hover:bg-white/20 transition-all font-black text-[10px] uppercase tracking-wider">
                                        View Doc
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-[#2c3568]">
                                <div>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>Active Until</p>
                                    <p className={`text-xs font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#4a5568]'}`}>{promo.endDate}</p>
                                </div>
                                <div className="flex justify-end items-end">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-[#10b981] uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                                        Active Now
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LenderPromotionsView;

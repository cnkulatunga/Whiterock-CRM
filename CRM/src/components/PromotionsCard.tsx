'use client';

import { promotions } from '@/data/dummy';

interface PromotionsCardProps {
    onSelect?: (entity: any, type: 'promotion') => void;
}

export default function PromotionsCard({ onSelect }: PromotionsCardProps) {
    return (
        <div className="glass-card flex flex-col h-[280px] overflow-hidden">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <i className="fa-solid fa-tags text-xs"></i>
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Lender Promotions</h3>
                </div>
                <span className="text-[8px] font-black text-indigo-600 uppercase cursor-pointer hover:underline">
                    Manage All
                </span>
            </div>

            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar space-y-1.5">
                {promotions.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => onSelect?.(p, 'promotion')}
                        className={`p-2 border rounded-xl hover:border-indigo-200 transition-all group flex flex-col gap-1 cursor-pointer ${p.type === 'Exclusive' ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <span
                                className={`bg-${p.typeColor}-600 text-white text-[5px] font-black px-1.5 py-0.5 rounded uppercase leading-none`}
                            >
                                {p.type}
                            </span>
                            <span className="text-[6px] font-bold text-slate-400 uppercase leading-none">
                                Exp: {p.expiry}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-[8px] font-black text-slate-900 leading-none">
                                {p.lender}: {p.title}
                            </h4>
                            <p className="text-[7px] text-slate-500 leading-none mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                {p.desc}
                            </p>
                        </div>
                        <div className="pt-1 border-t border-indigo-100/50 flex justify-end">
                            <button className="text-[6px] font-black text-indigo-600 uppercase hover:text-indigo-900 flex items-center gap-1 transition-colors leading-none">
                                <i className="fa-solid fa-file-contract"></i> View Doc
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

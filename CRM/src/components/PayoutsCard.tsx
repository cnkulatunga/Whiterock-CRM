'use client';

import { useRouter } from 'next/navigation';
import { payouts } from '@/data/dummy';

export default function PayoutsCard() {
    const router = useRouter();
    return (
        <div className="glass-card flex flex-col h-[280px] overflow-hidden">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                        <i className="fa-solid fa-hand-holding-dollar text-xs"></i>
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Pending Payouts</h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Total:</span>
                    <span className="text-[10px] font-black text-emerald-600">£124,500</span>
                </div>
            </div>

            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar space-y-1.5">
                {payouts.map((p: any) => (
                    <div
                        key={p.id}
                        onClick={() => p.leadId && router.push(`/pipeline/${p.leadId}`)}
                        className="p-2 bg-white border border-slate-100 rounded-xl flex flex-col gap-1 hover:border-emerald-200 transition-all group cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[8px] font-black text-indigo-600 leading-none">{p.id}</span>
                                    <span className="text-[9px] font-black text-slate-900 leading-none">{p.client}</span>
                                </div>
                                <p className="text-[6px] font-bold text-slate-400 uppercase mt-1 leading-none">
                                    Lender: {p.lender}
                                </p>
                            </div>
                            <div className="text-right flex flex-col justify-between">
                                <div className="text-[9px] font-black text-slate-900 leading-none">{p.amount}</div>
                                <span className="text-[5px] font-black text-emerald-500 uppercase tracking-widest block mt-1 leading-none">
                                    Est. Payout
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 mt-0.5 border-t border-slate-50">
                            <span
                                className={`bg-${p.statusColor}-50 text-${p.statusColor}-600 text-[5px] font-black px-1.5 py-0.5 rounded uppercase leading-none`}
                            >
                                {p.status}
                            </span>
                            <span className="text-[6px] font-bold text-slate-400 uppercase leading-none">
                                Sent: {p.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Promotion {
    lender_id: string;
    lender: string;
    title: string;
    description: string;
    rate: number;
    valid_until: string | null;
    created_at: string | null;
}

interface PromotionsCardProps {
    onSelect?: (entity: any, type: 'promotion') => void;
}

function formatExpiry(iso: string | null): string {
    if (!iso) return 'No Expiry';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PromotionsCard({ onSelect }: PromotionsCardProps) {
    const router = useRouter();
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/lenders/promotions')
            .then(r => r.json())
            .then(data => {
                const items = Array.isArray(data) ? data : (data?.results ?? []);
                setPromotions(items);
            })
            .catch(() => setPromotions([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="glass-card card-h-std flex flex-col overflow-hidden">
            <div className="flex items-center gap-2.5 shrink-0" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 16px', minHeight: 48 }}>
                <i className="fa-solid fa-tags" style={{ color: '#818cf8', fontSize: 13, flexShrink: 0 }}></i>
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', lineHeight: 1, margin: 0 }}>Lender Promotions</p>
                    <p style={{ color: '#475569', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', margin: 0 }}>Active Deals</p>
                </div>
                <span
                    onClick={() => router.push('/lenders')}
                    style={{ fontSize: 10, fontWeight: 900, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer' }}
                >
                    Manage All
                </span>
            </div>

            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar space-y-1.5">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <span style={{ color: '#475569', fontSize: 10 }}>Loading...</span>
                    </div>
                ) : promotions.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <span style={{ color: '#475569', fontSize: 10 }}>No active promotions</span>
                    </div>
                ) : (
                    promotions.map((p, idx) => (
                        <div
                            key={`${p.lender_id}-${idx}`}
                            onClick={() => onSelect?.(p, 'promotion')}
                            className="p-2 border rounded-xl hover:border-indigo-200 transition-all group flex flex-col gap-1 cursor-pointer bg-indigo-50/30 border-indigo-100"
                        >
                            <div className="flex justify-between items-center">
                                <span className="bg-indigo-600 text-white text-[5px] font-black px-1.5 py-0.5 rounded uppercase leading-none">
                                    {p.rate > 0 ? `${p.rate}%` : 'Promo'}
                                </span>
                                <span className="text-[6px] font-bold text-slate-400 uppercase leading-none">
                                    Exp: {formatExpiry(p.valid_until)}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-900 leading-none">
                                    {p.lender}: {p.title}
                                </h4>
                                <p className="text-[10px] text-slate-500 leading-none mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {p.description}
                                </p>
                            </div>
                            <div className="pt-1 border-t border-indigo-100/50 flex justify-end">
                                <button className="text-[6px] font-black text-indigo-600 uppercase hover:text-indigo-900 flex items-center gap-1 transition-colors leading-none">
                                    <i className="fa-solid fa-file-contract"></i> View Doc
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

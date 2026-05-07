'use client';

import { useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toasts: ToastItem[];
    remove: (id: number) => void;
}

const ICONS: Record<ToastType, string> = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info',
};

const COLORS: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-indigo-500',
};

export function ToastContainer({ toasts, remove }: ToastProps) {
    return (
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-[#0f172a] text-white rounded-xl shadow-2xl border border-white/10 min-w-[260px] max-w-[380px] animate-in slide-in-from-right-4 fade-in duration-200"
                >
                    <span className={`w-6 h-6 rounded-lg ${COLORS[t.type]} flex items-center justify-center shrink-0`}>
                        <i className={`fa-solid ${ICONS[t.type]} text-[11px]`}></i>
                    </span>
                    <p className="text-[11px] font-semibold flex-1 leading-snug">{t.message}</p>
                    <button
                        onClick={() => remove(t.id)}
                        className="text-white/40 hover:text-white/80 transition-colors shrink-0"
                    >
                        <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                </div>
            ))}
        </div>
    );
}

let _counter = 0;

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const remove = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const show = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
        const id = ++_counter;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const toast = {
        success: (msg: string) => show(msg, 'success'),
        error: (msg: string) => show(msg, 'error'),
        warning: (msg: string) => show(msg, 'warning'),
        info: (msg: string) => show(msg, 'info'),
    };

    return { toasts, remove, toast };
}

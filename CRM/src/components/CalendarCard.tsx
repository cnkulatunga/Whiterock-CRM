'use client';

import { useState } from 'react';

export default function CalendarCard() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const changeMonth = (offset: number) => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + offset);
        setCurrentDate(d);
    };

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);

    const prevMonthDays = daysInMonth(month - 1, year);
    const calendarDays = [];

    // Prev month days
    for (let i = firstDay - 1; i >= 0; i--) {
        calendarDays.push({ day: prevMonthDays - i, current: false, today: false });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= days; i++) {
        calendarDays.push({
            day: i,
            current: true,
            today: today.getDate() === i && today.getMonth() === month && today.getFullYear() === year
        });
    }

    // Next month days
    const remaining = 42 - calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
        calendarDays.push({ day: i, current: false, today: false });
    }

    return (
        <div className="glass-card flex flex-col h-[280px]">
            <div className="px-5 py-2.5 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <i className="fa-solid fa-calendar-days text-xs"></i>
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Operational Calendar</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                        <i className="fa-solid fa-chevron-left text-[8px]"></i>
                    </button>
                    <span className="text-[9px] font-black text-slate-900 uppercase">{monthNames[month]} {year}</span>
                    <button onClick={() => changeMonth(1)} className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                        <i className="fa-solid fa-chevron-right text-[8px]"></i>
                    </button>
                </div>
            </div>
            <div className="flex-1 px-3 pt-2 pb-1">
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-center text-[7px] font-black text-slate-400 uppercase">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((d, i) => (
                        <div
                            key={i}
                            className={`h-[26px] flex items-center justify-center text-[9px] font-bold rounded-lg cursor-pointer transition-all relative
                                ${d.current ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-300'}
                                ${d.today ? 'bg-slate-900 text-white font-black' : ''}
                            `}
                        >
                            {d.day}
                            {d.current && (i % 7 === 2 || i % 7 === 4) && !d.today && (
                                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${i % 7 === 2 ? 'bg-indigo-500' : 'bg-amber-500'}`}></span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

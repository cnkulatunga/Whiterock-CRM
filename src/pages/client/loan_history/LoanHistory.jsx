import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const LoanHistory = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const historyData = [
        { leadNumber: 'LD-7612', type: 'Business Expansion', date: 'Sep 05, 2023', amount: '$120,000.00', outcome: 'Approved' },
        { leadNumber: 'LD-7401', type: 'Equipment Lease',    date: 'Aug 22, 2023', amount: '$35,500.00',  outcome: 'Closed'   },
        { leadNumber: 'LD-6992', type: 'Real Estate Loan',   date: 'Jul 10, 2023', amount: '$450,000.00', outcome: 'Withdrawn' },
        { leadNumber: 'LD-6551', type: 'Working Capital',    date: 'May 14, 2023', amount: '$25,000.00',  outcome: 'Approved'  },
    ];

    const outcomeStyle = (outcome) => {
        if (outcome === 'Approved') return {
            background: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
            color: isDark ? '#34d399' : '#059669',
            border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#d1fae5'}`,
        };
        if (outcome === 'Closed') return {
            background: isDark ? 'rgba(14,165,233,0.15)' : '#f0f9ff',
            color: isDark ? '#38bdf8' : '#0284c7',
            border: `1px solid ${isDark ? 'rgba(14,165,233,0.3)' : '#e0f2fe'}`,
        };
        return {
            background: isDark ? 'rgba(220,38,38,0.15)' : '#fdf2f2',
            color: isDark ? '#fc8181' : '#dc2626',
            border: `1px solid ${isDark ? 'rgba(220,38,38,0.3)' : '#fde2e2'}`,
        };
    };

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="mb-10">
                <h1
                    className="text-[1.75rem] font-bold mb-2 sm:text-2xl tracking-tight"
                    style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}
                >
                    My History
                </h1>
                <p className="text-[0.95rem]" style={{ color: isDark ? '#94a3b8' : '#718096' }}>
                    Track and manage your commercial loan applications.
                </p>
            </header>

            <section className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: isDark ? 'rgba(36,71,215,0.2)' : '#ebf0ff', color: '#2447d7' }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <polyline points="12 8 12 12 16 14" />
                            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                        </svg>
                    </div>
                    <h2
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ color: isDark ? '#64748b' : '#a0aec0' }}
                    >
                        Application History
                    </h2>
                </div>

                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: isDark ? '#1e2340' : '#ffffff',
                        border: `1px solid ${isDark ? '#2d3561' : '#edf2f7'}`,
                        boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.02)',
                    }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${isDark ? '#2d3561' : '#f7fafc'}` }}>
                                    {['LEAD NUMBER', 'TYPE', 'COMPLETED DATE', 'AMOUNT', 'OUTCOME'].map(col => (
                                        <th
                                            key={col}
                                            className="p-5 px-6 text-left text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap"
                                            style={{ color: isDark ? '#64748b' : '#a0aec0' }}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="transition-colors group"
                                        style={{ borderBottom: `1px solid ${isDark ? '#252c50' : '#f7fafc'}` }}
                                        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(36,71,215,0.06)' : 'rgba(248,250,252,0.5)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td className="p-5 px-6">
                                            <span
                                                className="text-[13px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200"
                                                style={{
                                                    color: '#2447d7',
                                                    background: isDark ? 'rgba(36,71,215,0.2)' : '#ebf0ff',
                                                }}
                                            >
                                                {item.leadNumber}
                                            </span>
                                        </td>
                                        <td className="p-5 px-6">
                                            {/* TYPE column - visible in both modes */}
                                            <span
                                                className="text-[14px] font-bold tracking-tight"
                                                style={{ color: isDark ? '#cbd5e1' : '#2d3748' }}
                                            >
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="p-5 px-6">
                                            <span
                                                className="text-[13px] font-semibold"
                                                style={{ color: isDark ? '#94a3b8' : '#718096' }}
                                            >
                                                {item.date}
                                            </span>
                                        </td>
                                        <td
                                            className="p-5 px-6 text-[15px] font-extrabold tracking-tight"
                                            style={{ color: isDark ? '#e2e8f0' : '#1a202c' }}
                                        >
                                            {item.amount}
                                        </td>
                                        <td className="p-5 px-6">
                                            <span
                                                className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider transition-all duration-300"
                                                style={outcomeStyle(item.outcome)}
                                            >
                                                {item.outcome}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="p-6 px-8 flex items-center justify-between md:flex-col md:gap-5"
                        style={{ borderTop: `1px solid ${isDark ? '#2d3561' : '#f7fafc'}` }}
                    >
                        <span className="text-[13px] font-semibold" style={{ color: isDark ? '#64748b' : '#a0aec0' }}>
                            Showing <span style={{ color: isDark ? '#94a3b8' : '#4a5568' }}>4</span> of <span style={{ color: isDark ? '#94a3b8' : '#4a5568' }}>12</span> historical applications
                        </span>
                        <div className="flex gap-2">
                            <button
                                className="border p-[8px_20px] rounded-xl text-sm font-bold cursor-not-allowed transition-all"
                                style={{
                                    background: isDark ? '#252c50' : '#ffffff',
                                    borderColor: isDark ? '#2d3561' : '#e2e8f0',
                                    color: isDark ? '#3d4a7a' : '#cbd5e0',
                                }}
                                disabled
                            >
                                Previous
                            </button>
                            <button
                                className="border p-[8px_20px] rounded-xl text-sm font-bold shadow-sm transition-all duration-200"
                                style={{
                                    background: isDark ? '#252c50' : '#ffffff',
                                    borderColor: isDark ? '#2d3561' : '#e2e8f0',
                                    color: isDark ? '#94a3b8' : '#4a5568',
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoanHistory;

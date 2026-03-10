import React from 'react';

const LoanHistory = () => {
    const historyData = [
        {
            leadNumber: 'LD-7612',
            type: 'Business Expansion',
            date: 'Sep 05, 2023',
            amount: '$120,000.00',
            outcome: 'Approved'
        },
        {
            leadNumber: 'LD-7401',
            type: 'Equipment Lease',
            date: 'Aug 22, 2023',
            amount: '$35,500.00',
            outcome: 'Closed'
        },
        {
            leadNumber: 'LD-6992',
            type: 'Real Estate Loan',
            date: 'Jul 10, 2023',
            amount: '$450,000.00',
            outcome: 'Withdrawn'
        },
        {
            leadNumber: 'LD-6551',
            type: 'Working Capital',
            date: 'May 14, 2023',
            amount: '$25,000.00',
            outcome: 'Approved'
        }
    ];

    return (
        <div className="flex flex-col animate-fadeIn font-['Sora',sans-serif]">
            <header className="mb-10">
                <h1 className="text-[1.75rem] font-bold text-[#1a202c] mb-2 sm:text-2xl tracking-tight">My History</h1>
                <p className="text-[0.95rem] text-[#718096]">Track and manage your commercial loan applications.</p>
            </header>

            <section className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ebf0ff] text-[#2447d7] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <polyline points="12 8 12 12 16 14" />
                            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                        </svg>
                    </div>
                    <h2 className="text-sm font-bold text-[#a0aec0] uppercase tracking-wider">Application History</h2>
                </div>

                <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-[#f7fafc]">
                                    <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">LEAD NUMBER</th>
                                    <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">TYPE</th>
                                    <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">COMPLETED DATE</th>
                                    <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">AMOUNT</th>
                                    <th className="p-5 px-6 text-left text-[11px] font-extrabold text-[#a0aec0] uppercase tracking-wider whitespace-nowrap">OUTCOME</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f7fafc]">
                                {historyData.map((item, index) => (
                                    <tr key={index} className="hover:bg-[#f8fafc]/50 transition-colors group">
                                        <td className="p-5 px-6">
                                            <span className="text-[13px] font-bold text-[#2447d7] bg-[#ebf0ff] px-2.5 py-1 rounded-lg group-hover:bg-[#2447d7] group-hover:text-white transition-all duration-200">
                                                {item.leadNumber}
                                            </span>
                                        </td>
                                        <td className="p-5 px-6">
                                            <span className="text-[14px] font-bold text-[#2d3748] tracking-tight">{item.type}</span>
                                        </td>
                                        <td className="p-5 px-6">
                                            <span className="text-[13px] font-semibold text-[#718096]">{item.date}</span>
                                        </td>
                                        <td className="p-5 px-6 text-[15px] font-extrabold text-[#1a202c] tracking-tight">
                                            {item.amount}
                                        </td>
                                        <td className="p-5 px-6">
                                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border transition-all duration-300 ${
                                                item.outcome === 'Approved' ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5] shadow-[0_2px_4px_rgba(16,185,129,0.1)]' :
                                                item.outcome === 'Closed' ? 'bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe] shadow-[0_2px_4px_rgba(14,165,233,0.1)]' :
                                                'bg-[#fdf2f2] text-[#dc2626] border-[#fde2e2] shadow-[0_2px_4px_rgba(239,68,68,0.1)]'
                                            }`}>
                                                {item.outcome}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 px-8 border-t border-[#f7fafc] flex items-center justify-between md:flex-col md:gap-5">
                        <span className="text-[13px] font-semibold text-[#a0aec0]">Showing <span className="text-[#4a5568]">4</span> of <span className="text-[#4a5568]">12</span> historical applications</span>
                        <div className="flex gap-2">
                            <button className="bg-white border border-[#e2e8f0] text-[#cbd5e0] p-[8px_20px] rounded-xl text-sm font-bold cursor-not-allowed transition-all" disabled>Previous</button>
                            <button className="bg-white border border-[#e2e8f0] text-[#4a5568] p-[8px_20px] rounded-xl text-sm font-bold hover:bg-[#f8fafc] hover:border-[#cbd5e0] hover:text-[#2d3748] shadow-sm transition-all duration-200">Next</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoanHistory;

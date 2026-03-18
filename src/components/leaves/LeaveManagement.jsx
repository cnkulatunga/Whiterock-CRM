import React, { useState } from 'react';
import { useLeaves } from '../../context/LeavesContext';
import { useTheme } from '../../context/ThemeContext';

const LeaveManagement = () => {
    const { leaves, getAgentBalance, addLeaveRequest } = useLeaves();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const myLeaves = leaves.filter(l => l.agentId?.toString() === user.id?.toString());
    const myBalance = getAgentBalance(user.id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        type: 'Annual',
        reason: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addLeaveRequest({
            ...formData,
            agentId: user.id,
            agentName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || 'Tele Agent',
            status: 'Pending'
        });
        setIsModalOpen(false);
        setFormData({ startDate: '', endDate: '', type: 'Annual', reason: '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
            default: return isDark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="w-full flex justify-center text-[#1a202c]">
            <div className="w-full max-w-[1200px] flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-[#0d1236]'}`}>Leave Management</h1>
                        <p className={`text-sm ${isDark ? 'text-[#94abda]' : 'text-[#4b5681]'}`}>Manage your leave balances and requests.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="py-2.5 px-5 rounded-xl font-semibold text-white shadow-md transition-all hover:-translate-y-0.5"
                        style={{ background: isDark ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2447d7, #1a38b8)' }}
                    >
                        + Request Leave
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                    {[
                        { label: 'Annual Leave (Avail)', value: `${myBalance.Annual?.available || 0}`, unit: 'Days', sub: `Earned: ${myBalance.Annual?.total || 0}`, color: isDark ? '#3b82f6' : '#2447d7', bg: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(36, 71, 215, 0.05)' },
                        { label: 'Casual Leave (Avail)', value: `${myBalance.Casual?.available || 0}`, unit: 'Days', sub: `Limit: ${myBalance.Casual?.total || 0} / yr`, color: '#38a169', bg: 'rgba(56, 161, 105, 0.05)' },
                        { label: 'Sick Leave (Avail)', value: `${myBalance.Sick?.available || 0}`, unit: 'Days', sub: `Limit: ${myBalance.Sick?.total || 0} / yr`, color: '#e53e3e', bg: 'rgba(229, 62, 62, 0.05)' },
                        { label: 'Pending Leaves', value: `${(myBalance.Annual?.pending || 0) + (myBalance.Casual?.pending || 0) + (myBalance.Sick?.pending || 0)}`, unit: 'Days', sub: 'Awaiting review', color: '#d69e2e', bg: 'rgba(214, 158, 46, 0.05)' }
                    ].map((stat, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-[#1c2040] border-[#2c3568]' : 'bg-white border-[#edf2f7]'} relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1`}>
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: stat.bg }}></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-[#94abda]' : 'text-[#4b5681]'}`}>
                                    {stat.label}
                                </div>
                                <div className="mt-1 flex items-baseline gap-1.5" style={{ color: stat.color }}>
                                    <span className="text-4xl font-extrabold tracking-tight">{stat.value}</span>
                                    <span className="text-sm font-bold opacity-80">{stat.unit}</span>
                                </div>
                                <div className={`text-[11px] font-semibold mt-auto pt-4 ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>
                                    {stat.sub}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Requests Table */}
                <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-[#1c2040] border-[#2c3568]' : 'bg-white border-[#edf2f7]'}`}>
                    <div className={`px-5 py-4 border-b font-bold ${isDark ? 'border-[#2c3568] text-white' : 'border-[#edf2f7] text-[#0d1236]'}`}>
                        My Leave Requests
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-[0.8rem] uppercase tracking-wider ${isDark ? 'bg-[#141829] text-[#546298]' : 'bg-[#f8fafc] text-[#718096]'}`}>
                                    <th className="p-4 font-semibold">Leave ID</th>
                                    <th className="p-4 font-semibold">Type</th>
                                    <th className="p-4 font-semibold">Dates</th>
                                    <th className="p-4 font-semibold">Reason</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Approver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myLeaves.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className={`p-6 text-center text-sm italic ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>No leave requests found.</td>
                                    </tr>
                                ) : myLeaves.map((request) => (
                                    <tr key={request.id} className={`border-b last:border-0 transition-colors ${isDark ? 'border-[#2c3568] hover:bg-[#242b58]' : 'border-[#edf2f7] hover:bg-[#f7fafc]'}`}>
                                        <td className={`p-4 text-sm font-medium ${isDark ? 'text-white' : 'text-[#2d3748]'}`}>{request.id}</td>
                                        <td className={`p-4 text-sm ${isDark ? 'text-[#94abda]' : 'text-[#4b5681]'}`}>{request.type}</td>
                                        <td className={`p-4 text-sm ${isDark ? 'text-[#94abda]' : 'text-[#4b5681]'}`}>
                                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                        </td>
                                        <td className={`p-4 text-sm ${isDark ? 'text-[#94abda]' : 'text-[#4b5681]'}`}>{request.reason}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className={`p-4 text-sm ${isDark ? 'text-[#94abda]' : 'text-[#4b5681]'}`}>{request.approverName || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] animate-fadeIn p-4">
                    <div className={`w-full max-w-[500px] rounded-2xl p-6 shadow-2xl animate-slideUp ${isDark ? 'bg-[#1c2040] border border-[#2c3568]' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0d1236]'}`}>Request Leave</h3>
                            <button onClick={() => setIsModalOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-[#2a3055] text-[#94abda] hover:bg-[#36407a] hover:text-white' : 'bg-[#f0f4f8] text-[#718096] hover:bg-[#e2e8f0]'}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className={`text-sm font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>Leave Type</label>
                                <select 
                                    className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? 'bg-[#141829] border-[#2c3568] text-white focus:ring-blue-500/50 focus:border-blue-500' : 'bg-white border-[#e2e8f0] text-[#4a5568] focus:ring-[#2855e8]/20 focus:border-[#2855e8]'}`}
                                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required
                                >
                                    <option value="Annual">Annual Leave</option>
                                    <option value="Casual">Casual Leave</option>
                                    <option value="Sick">Sick Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-sm font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>Start Date</label>
                                    <input 
                                        type="date" required min={new Date().toISOString().split('T')[0]}
                                        className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? 'bg-[#141829] border-[#2c3568] text-white focus:ring-blue-500/50 focus:border-blue-500' : 'bg-white border-[#e2e8f0] text-[#4a5568] focus:ring-[#2855e8]/20 focus:border-[#2855e8]'}`}
                                        value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-sm font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>End Date</label>
                                    <input 
                                        type="date" required min={formData.startDate || new Date().toISOString().split('T')[0]}
                                        className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${isDark ? 'bg-[#141829] border-[#2c3568] text-white focus:ring-blue-500/50 focus:border-blue-500' : 'bg-white border-[#e2e8f0] text-[#4a5568] focus:ring-[#2855e8]/20 focus:border-[#2855e8]'}`}
                                        value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={`text-sm font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>Reason</label>
                                <textarea 
                                    className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all min-h-[100px] resize-none ${isDark ? 'bg-[#141829] border-[#2c3568] text-white focus:ring-blue-500/50 focus:border-blue-500' : 'bg-white border-[#e2e8f0] text-[#4a5568] focus:ring-[#2855e8]/20 focus:border-[#2855e8]'}`}
                                    placeholder="Brief reason for the leave..." required
                                    value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                />
                            </div>
                            
                            <div className="flexjustify-end flex gap-3 mt-4 pt-4 border-t" style={{ borderColor: isDark ? '#2c3568' : '#edf2f7' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDark ? 'bg-[#2a3055] text-white hover:bg-[#36407a]' : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'}`}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm shadow-md transition-all hover:-translate-y-0.5" style={{ background: isDark ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #2447d7, #1a38b8)' }}>
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;

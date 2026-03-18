import React, { useState } from 'react';
import { useLeaves } from '../../context/LeavesContext';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_MEMBERSHIPS, SHARED_INITIAL_USERS } from '../../data/dummyData';

const LeaveApprovals = () => {
    const { leaves, getAgentBalance, updateLeaveStatus } = useLeaves();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const myName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || 'Manager';

    const [editingAgent, setEditingAgent] = useState(null);
    const [limitsForm, setLimitsForm] = useState({ casualTotal: 7, sickTotal: 7 });

    const teamMembers = INITIAL_MEMBERSHIPS[user.id]; // Only applies if team leader
    
    // Get agents under this manager
    const allAgents = SHARED_INITIAL_USERS.filter(u => u.role === 'Tele Agent');
    const myAgents = (user.role === 'Super Admin' || user.role === 'Accounts Manager') 
        ? allAgents 
        : allAgents.filter(a => teamMembers?.some(m => m.id === a.id));

    const handleEditLimits = (agentId) => {
        const bal = getAgentBalance(agentId);
        setEditingAgent(agentId);
        setLimitsForm({ casualTotal: bal.Casual.total, sickTotal: bal.Sick.total });
    };

    const handleSaveLimits = (agentId) => {
        updateLeaveLimits(agentId, Number(limitsForm.casualTotal), Number(limitsForm.sickTotal));
        setEditingAgent(null);
    };
    
    const requestsToShow = leaves.filter(l => {
        if (user.role === 'Super Admin' || user.role === 'Accounts Manager') return true; // See all!
        if (user.role === 'Team Leader' && teamMembers) {
            return teamMembers.some(member => member.id === l.agentId);
        }
        return false;
    });

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
                <div>
                    <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-[#0d1236]'}`}>Leave Approvals</h1>
                    <p className={`text-sm ${isDark ? 'text-[#94abda]' : 'text-[#4b5681]'}`}>Review and manage leave requests from the team.</p>
                </div>

                <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-[#1c2040] border-[#2c3568]' : 'bg-white border-[#edf2f7]'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className={`text-[0.8rem] uppercase tracking-wider ${isDark ? 'bg-[#141829] text-[#546298]' : 'bg-[#f8fafc] text-[#718096]'}`}>
                                    <th className="p-4 font-semibold">Leave ID</th>
                                    <th className="p-4 font-semibold">Agent</th>
                                    <th className="p-4 font-semibold">Dates</th>
                                    <th className="p-4 font-semibold">Type/Reason</th>
                                    <th className="p-4 font-semibold">Available Balance</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requestsToShow.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className={`p-6 text-center text-sm italic ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>No leave requests found for your team.</td>
                                    </tr>
                                ) : requestsToShow.map((request) => {
                                    const agentBalance = getAgentBalance(request.agentId);
                                    const isPending = request.status === 'Pending';
                                    return (
                                    <tr key={request.id} className={`border-b last:border-0 transition-colors ${isDark ? 'border-[#2c3568] hover:bg-[#242b58]' : 'border-[#edf2f7] hover:bg-[#f7fafc]'}`}>
                                        <td className={`p-4 text-sm font-medium ${isDark ? 'text-white' : 'text-[#2d3748]'}`}>{request.id}</td>
                                        <td className={`p-4 text-sm font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#2447d7]'}`}>{request.agentName}</td>
                                        <td className={`p-4 text-sm whitespace-nowrap ${isDark ? 'text-[#94abda]' : 'text-[#4b5681]'}`}>
                                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className={`font-semibold ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>{request.type}</div>
                                            <div className={`text-xs ${isDark ? 'text-[#94abda]' : 'text-[#718096]'}`}>{request.reason}</div>
                                        </td>
                                        <td className={`p-4 text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                            {agentBalance ? `${agentBalance[request.type]?.available || 0} Days` : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                            {request.approverName && (
                                                <div className={`text-[10px] mt-1 ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>by {request.approverName}</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {isPending ? (
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={() => updateLeaveStatus(request.id, 'Approved', myName)} className="w-[32px] h-[32px] rounded-lg flex items-center justify-center bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-500/20" title="Approve">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12" /></svg>
                                                    </button>
                                                    <button onClick={() => updateLeaveStatus(request.id, 'Rejected', myName)} className="w-[32px] h-[32px] rounded-lg flex items-center justify-center bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-500/20" title="Reject">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`text-xs italic ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>Action taken</span>
                                            )}
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Agent Limits Table */}
                <div className="mt-6">
                    <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#0d1236]'}`}>Team Leave Limits</h2>
                    <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-[#1c2040] border-[#2c3568]' : 'bg-white border-[#edf2f7]'}`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className={`text-[0.8rem] uppercase tracking-wider ${isDark ? 'bg-[#141829] text-[#546298]' : 'bg-[#f8fafc] text-[#718096]'}`}>
                                        <th className="p-4 font-semibold">Agent</th>
                                        <th className="p-4 font-semibold">Annual Balance</th>
                                        <th className="p-4 font-semibold">Casual Balance (Yearly)</th>
                                        <th className="p-4 font-semibold">Sick Balance (Yearly)</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myAgents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className={`p-6 text-center text-sm italic ${isDark ? 'text-[#546298]' : 'text-[#a0aec0]'}`}>No agents found.</td>
                                        </tr>
                                    ) : myAgents.map((agent) => {
                                        const bal = getAgentBalance(agent.id);
                                        const isEditing = editingAgent === agent.id;
                                        return (
                                        <tr key={agent.id} className={`border-b last:border-0 transition-colors ${isDark ? 'border-[#2c3568] hover:bg-[#242b58]' : 'border-[#edf2f7] hover:bg-[#f7fafc]'}`}>
                                            <td className={`p-4 text-sm font-bold ${isDark ? 'text-white' : 'text-[#2447d7]'}`}>{agent.name}</td>
                                            
                                            <td className={`p-4 text-sm ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>
                                                <div className="flex gap-2 text-xs">
                                                    <span title="Available" className="text-green-500 font-bold">{bal.Annual.available} Avail</span>
                                                    <span title="Total Earned" className="opacity-60">/ {bal.Annual.total} Tot</span>
                                                </div>
                                            </td>

                                            <td className={`p-4 text-sm ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>
                                                {isEditing ? (
                                                    <input type="number" min="0" value={limitsForm.casualTotal} onChange={e => setLimitsForm({...limitsForm, casualTotal: e.target.value})} className={`w-16 px-2 py-1 text-sm border rounded ${isDark ? 'bg-[#141829] border-[#546298] text-white' : 'bg-white border-gray-300'}`} />
                                                ) : (
                                                    <div className="flex gap-2 text-xs">
                                                        <span title="Available" className="text-green-500 font-bold">{bal.Casual.available} Avail</span>
                                                        <span title="Total Fixed" className="opacity-60">/ {bal.Casual.total} Tot</span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className={`p-4 text-sm ${isDark ? 'text-[#e4ecff]' : 'text-[#2d3748]'}`}>
                                                {isEditing ? (
                                                    <input type="number" min="0" value={limitsForm.sickTotal} onChange={e => setLimitsForm({...limitsForm, sickTotal: e.target.value})} className={`w-16 px-2 py-1 text-sm border rounded ${isDark ? 'bg-[#141829] border-[#546298] text-white' : 'bg-white border-gray-300'}`} />
                                                ) : (
                                                    <div className="flex gap-2 text-xs">
                                                        <span title="Available" className="text-green-500 font-bold">{bal.Sick.available} Avail</span>
                                                        <span title="Total Fixed" className="opacity-60">/ {bal.Sick.total} Tot</span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-4 text-right">
                                                {isEditing ? (
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={() => setEditingAgent(null)} className="text-xs px-3 py-1.5 rounded bg-gray-500/10 text-gray-500 hover:bg-gray-500 hover:text-white transition-all">Cancel</button>
                                                        <button onClick={() => handleSaveLimits(agent.id)} className="text-xs px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md font-bold">Save</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleEditLimits(agent.id)} className="text-xs font-bold text-blue-500 hover:text-blue-600 underline">Edit Limits</button>
                                                )}
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaveApprovals;

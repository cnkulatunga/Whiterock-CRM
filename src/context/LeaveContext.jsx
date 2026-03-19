import React, { createContext, useContext, useState, useEffect } from 'react';
import { SHARED_INITIAL_USERS, INITIAL_MEMBERSHIPS, AM_MEMBERSHIPS } from '../data/dummyData';

const LeaveContext = createContext();

/* ─── Build agent → TL → AM mapping from existing membership data ─── */
const buildAgentMapping = () => {
    const mapping = {};
    Object.entries(INITIAL_MEMBERSHIPS).forEach(([tlId, agents]) => {
        const tlIdNum = parseInt(tlId);
        const tl = SHARED_INITIAL_USERS.find(u => u.id === tlIdNum);
        let amId = null;
        Object.entries(AM_MEMBERSHIPS).forEach(([amIdStr, tlIds]) => {
            if (tlIds.includes(tlIdNum)) amId = parseInt(amIdStr);
        });
        const am = amId ? SHARED_INITIAL_USERS.find(u => u.id === amId) : null;
        agents.forEach(agent => {
            mapping[agent.id] = {
                teamLeaderId: tlIdNum,
                teamLeaderName: tl ? tl.name : 'Unassigned',
                accountManagerId: amId,
                accountManagerName: am ? am.name : 'Unassigned',
            };
        });
    });
    return mapping;
};

export const AGENT_MAPPING = buildAgentMapping();

const TELE_AGENT_IDS = SHARED_INITIAL_USERS.filter(u => u.role === 'Tele Agent').map(u => u.id);

const BASE_BALANCES = TELE_AGENT_IDS.map(id => ({
    userId: id,
    annualTotal: 7,
    annualUsed: 0,
    sickTotal: 7,
    sickUsed: 0,
}));

const SAMPLE_REQUESTS = [
    {
        id: 'LR-001',
        agentId: 3,
        agentName: 'Cody Lane',
        type: 'Annual',
        duration: 'Full Day',
        halfDayPeriod: null,
        startDate: '2026-02-10',
        endDate: '2026-02-10',
        days: 1,
        reason: 'Family vacation',
        status: 'Approved',
        teamLeaderId: 2,
        teamLeaderName: 'Marcus Smith',
        accountManagerId: 4,
        accountManagerName: 'Sarah White',
        reviewedBy: 'Marcus Smith',
        reviewedAt: '2026-02-08',
        reviewNote: 'Approved. Enjoy your time off!',
        createdAt: '2026-02-05',
    },
    {
        id: 'LR-002',
        agentId: 11,
        agentName: 'Priya Sharma',
        type: 'Sick',
        duration: 'Half Day',
        halfDayPeriod: 'Morning',
        startDate: '2026-03-10',
        endDate: '2026-03-10',
        days: 0.5,
        reason: 'Medical appointment',
        status: 'Rejected',
        teamLeaderId: 2,
        teamLeaderName: 'Marcus Smith',
        accountManagerId: 4,
        accountManagerName: 'Sarah White',
        reviewedBy: 'Marcus Smith',
        reviewedAt: '2026-03-09',
        reviewNote: 'Please reschedule to outside working hours.',
        createdAt: '2026-03-08',
    },
    {
        id: 'LR-003',
        agentId: 6,
        agentName: 'Leo Kumar',
        type: 'Annual',
        duration: 'Full Day',
        halfDayPeriod: null,
        startDate: '2026-03-20',
        endDate: '2026-03-21',
        days: 2,
        reason: 'Personal matters',
        status: 'Pending',
        teamLeaderId: 5,
        teamLeaderName: 'Diana Fernandez',
        accountManagerId: 4,
        accountManagerName: 'Sarah White',
        reviewedBy: null,
        reviewedAt: null,
        reviewNote: '',
        createdAt: '2026-03-15',
    },
    {
        id: 'LR-004',
        agentId: 3,
        agentName: 'Cody Lane',
        type: 'Sick',
        duration: 'Full Day',
        halfDayPeriod: null,
        startDate: '2026-03-18',
        endDate: '2026-03-18',
        days: 1,
        reason: 'Not feeling well',
        status: 'Pending',
        teamLeaderId: 2,
        teamLeaderName: 'Marcus Smith',
        accountManagerId: 4,
        accountManagerName: 'Sarah White',
        reviewedBy: null,
        reviewedAt: null,
        reviewNote: '',
        createdAt: '2026-03-18',
    },
    {
        id: 'LR-005',
        agentId: 12,
        agentName: 'Jake Morrison',
        type: 'Annual',
        duration: 'Half Day',
        halfDayPeriod: 'Afternoon',
        startDate: '2026-03-22',
        endDate: '2026-03-22',
        days: 0.5,
        reason: 'Personal errand',
        status: 'Pending',
        teamLeaderId: 8,
        teamLeaderName: 'Ryan Patel',
        accountManagerId: 4,
        accountManagerName: 'Sarah White',
        reviewedBy: null,
        reviewedAt: null,
        reviewNote: '',
        createdAt: '2026-03-17',
    },
];

/* Compute initial balances based on approved sample requests */
const COMPUTED_INITIAL_BALANCES = BASE_BALANCES.map(b => {
    const approved = SAMPLE_REQUESTS.filter(r => r.agentId === b.userId && r.status === 'Approved');
    const annualUsed = approved.filter(r => r.type === 'Annual').reduce((s, r) => s + r.days, 0);
    const sickUsed = approved.filter(r => r.type === 'Sick').reduce((s, r) => s + r.days, 0);
    return { ...b, annualUsed, sickUsed };
});

export const LeaveProvider = ({ children }) => {
    const [leaveRequests, setLeaveRequests] = useState(() => {
        try {
            const saved = localStorage.getItem('leave_requests');
            return saved ? JSON.parse(saved) : SAMPLE_REQUESTS;
        } catch { return SAMPLE_REQUESTS; }
    });

    const [leaveBalances, setLeaveBalances] = useState(() => {
        try {
            const saved = localStorage.getItem('leave_balances');
            return saved ? JSON.parse(saved) : COMPUTED_INITIAL_BALANCES;
        } catch { return COMPUTED_INITIAL_BALANCES; }
    });

    useEffect(() => {
        localStorage.setItem('leave_requests', JSON.stringify(leaveRequests));
    }, [leaveRequests]);

    useEffect(() => {
        localStorage.setItem('leave_balances', JSON.stringify(leaveBalances));
    }, [leaveBalances]);

    const getAgentInfo = (agentId) => AGENT_MAPPING[agentId] || {
        teamLeaderId: null,
        teamLeaderName: 'Unassigned',
        accountManagerId: null,
        accountManagerName: 'Unassigned',
    };

    const createLeaveRequest = (requestData) => {
        const agentInfo = getAgentInfo(requestData.agentId);
        const newReq = {
            ...requestData,
            id: `LR-${String(leaveRequests.length + 1).padStart(3, '0')}`,
            status: 'Pending',
            teamLeaderId: agentInfo.teamLeaderId,
            teamLeaderName: agentInfo.teamLeaderName,
            accountManagerId: agentInfo.accountManagerId,
            accountManagerName: agentInfo.accountManagerName,
            reviewedBy: null,
            reviewedAt: null,
            reviewNote: '',
            createdAt: new Date().toISOString().split('T')[0],
        };
        setLeaveRequests(prev => [...prev, newReq]);
        return newReq;
    };

    const reviewLeaveRequest = (id, status, note, reviewerName) => {
        setLeaveRequests(prev => prev.map(r => {
            if (r.id !== id) return r;
            if (status === 'Approved') {
                setLeaveBalances(bPrev => bPrev.map(b => {
                    if (b.userId !== r.agentId) return b;
                    if (r.type === 'Annual') return { ...b, annualUsed: Math.min(b.annualTotal, b.annualUsed + r.days) };
                    if (r.type === 'Sick') return { ...b, sickUsed: Math.min(b.sickTotal, b.sickUsed + r.days) };
                    return b;
                }));
            }
            return { ...r, status, reviewedBy: reviewerName, reviewedAt: new Date().toISOString().split('T')[0], reviewNote: note || '' };
        }));
    };

    const getBalanceForAgent = (agentId) =>
        leaveBalances.find(b => b.userId === agentId) || {
            userId: agentId, annualTotal: 7, annualUsed: 0, sickTotal: 7, sickUsed: 0,
        };

    return (
        <LeaveContext.Provider value={{
            leaveRequests,
            leaveBalances,
            createLeaveRequest,
            reviewLeaveRequest,
            getBalanceForAgent,
            getAgentInfo,
            AGENT_MAPPING,
        }}>
            {children}
        </LeaveContext.Provider>
    );
};

export const useLeave = () => useContext(LeaveContext);

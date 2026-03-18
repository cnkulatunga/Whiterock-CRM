import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LEAVES, INITIAL_LEAVE_BALANCES } from '../data/dummyData';

const LeavesContext = createContext(null);

export const LeavesProvider = ({ children }) => {
    const [leaves, setLeaves] = useState(() => {
        const saved = localStorage.getItem('crm_leaves');
        return saved ? JSON.parse(saved) : INITIAL_LEAVES;
    });

    const [balances, setBalances] = useState(() => {
        const saved = localStorage.getItem('crm_leave_balances');
        return saved ? JSON.parse(saved) : INITIAL_LEAVE_BALANCES;
    });

    useEffect(() => {
        localStorage.setItem('crm_leaves', JSON.stringify(leaves));
    }, [leaves]);

    useEffect(() => {
        localStorage.setItem('crm_leave_balances', JSON.stringify(balances));
    }, [balances]);

    // Check cross-tab sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'crm_leaves' && e.newValue) {
                setLeaves(JSON.parse(e.newValue));
            }
            if (e.key === 'crm_leave_balances' && e.newValue) {
                setBalances(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // UK Time Zone monthly accrual rule: updates on the 1st of the month
    const getUKDate = () => {
        return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/London" }));
    };
    
    const currentMonth = getUKDate().getMonth() + 1;
    const totalAnnualEarned = currentMonth * 1.5;

    const getAgentBalance = (agentId) => {
        const base = balances[agentId] || {};
        
        const annualUsed = base.annualUsed || 0;
        const annualPending = base.annualPending || 0;
        
        const casualTotal = base.casualTotal !== undefined ? base.casualTotal : 7;
        const casualUsed = base.casualUsed || 0;
        const casualPending = base.casualPending || 0;
        
        const sickTotal = base.sickTotal !== undefined ? base.sickTotal : 7;
        const sickUsed = base.sickUsed || 0;
        const sickPending = base.sickPending || 0;

        return {
            Annual: {
                total: totalAnnualEarned,
                used: annualUsed,
                pending: annualPending,
                available: totalAnnualEarned - annualUsed - annualPending
            },
            Casual: {
                total: casualTotal,
                used: casualUsed,
                pending: casualPending,
                available: casualTotal - casualUsed - casualPending
            },
            Sick: {
                total: sickTotal,
                used: sickUsed,
                pending: sickPending,
                available: sickTotal - sickUsed - sickPending
            }
        };
    };

    const addLeaveRequest = (request) => {
        setLeaves(prev => [{...request, id: 'LR-' + Date.now()}, ...prev]);
        setBalances(prev => {
            const current = prev[request.agentId] || {};
            const days = getBusinessDays(request.startDate, request.endDate);
            const typeKey = request.type === 'Casual' ? 'casualPending' : (request.type === 'Sick' ? 'sickPending' : 'annualPending');
            
            return {
                ...prev,
                [request.agentId]: {
                    ...current,
                    [typeKey]: (current[typeKey] || 0) + days,
                }
            };
        });
    };

    const updateLeaveStatus = (leaveId, status, approverName) => {
        setLeaves(prev => prev.map(l => {
            if (l.id === leaveId) {
                return { ...l, status, approverName, approvedAt: new Date().toISOString() };
            }
            return l;
        }));

        const leave = leaves.find(l => l.id === leaveId);
        if (leave && leave.status === 'Pending') {
            const days = getBusinessDays(leave.startDate, leave.endDate);
            const pendingKey = leave.type === 'Casual' ? 'casualPending' : (leave.type === 'Sick' ? 'sickPending' : 'annualPending');
            const usedKey = leave.type === 'Casual' ? 'casualUsed' : (leave.type === 'Sick' ? 'sickUsed' : 'annualUsed');

            setBalances(prev => {
                const current = prev[leave.agentId];
                if (!current) return prev;
                if (status === 'Approved') {
                    return {
                        ...prev,
                        [leave.agentId]: {
                            ...current,
                            [pendingKey]: Math.max(0, (current[pendingKey] || 0) - days),
                            [usedKey]: (current[usedKey] || 0) + days
                        }
                    };
                } else if (status === 'Rejected') {
                    return {
                        ...prev,
                        [leave.agentId]: {
                            ...current,
                            [pendingKey]: Math.max(0, (current[pendingKey] || 0) - days),
                        }
                    };
                }
                return prev;
            });
        }
    };
    
    const updateLeaveLimits = (agentId, casualTotal, sickTotal) => {
        setBalances(prev => {
            const current = prev[agentId] || {};
            return {
                ...prev,
                [agentId]: {
                    ...current,
                    casualTotal,
                    sickTotal
                }
            };
        });
    };

    const getBusinessDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        let count = 0;
        let curDate = new Date(startDate.getTime());
        while (curDate <= endDate) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        return count === 0 ? 1 : count;
    };

    return (
        <LeavesContext.Provider value={{ leaves, balances, getAgentBalance, addLeaveRequest, updateLeaveStatus, updateLeaveLimits }}>
            {children}
        </LeavesContext.Provider>
    );
};

export const useLeaves = () => {
    const context = useContext(LeavesContext);
    if (!context) {
        throw new Error('useLeaves must be used within a LeavesProvider');
    }
    return context;
};

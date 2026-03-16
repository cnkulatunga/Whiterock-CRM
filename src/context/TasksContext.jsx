import React, { createContext, useContext, useState, useEffect } from 'react';

const TasksContext = createContext(null);

export const INITIAL_TASKS = [
    // Super Admin Tasks
    { id: 301, title: 'Compliance Audit', lead: 'Whiterock', status: 'Pending', date: '2026-03-12', time: '10:00', type: 'Review', reminder: '1h', assignedTo: 'Self' },
    { id: 302, title: 'System Maintenance', lead: 'Infrastructure', status: 'In Progress', date: '2026-03-12', time: '15:00', type: 'Administrative', reminder: 'none', assignedTo: 'Self' },
    
    // Team Leader Tasks
    { id: 101, title: 'Follow up with New Leads', lead: 'Team Alpha', status: 'Pending', date: '2026-03-16', time: '10:00', type: 'Call', reminder: '15m', assignedTo: 'Self' },
    { id: 102, title: 'Quarterly Review Prep', lead: 'Internal', status: 'In Progress', date: '2026-03-17', time: '14:30', type: 'Meeting', reminder: '1h', assignedTo: 'Self' },
    
    // Account Manager Tasks
    { id: 201, title: 'Portfolio Strategy Review', lead: 'Key Accounts', status: 'Pending', date: '2026-03-16', time: '11:00', type: 'Meeting', reminder: '1h', assignedTo: 'Self' },
    { id: 202, title: 'Quarterly Performance Report', lead: 'Enterprise', status: 'In Progress', date: '2026-03-18', time: '09:00', type: 'Review', reminder: 'none', assignedTo: 'Self' },

    // Tele Agent Tasks
    { id: 1, title: 'Follow up with Robert Miller', lead: 'Robert Miller', status: 'Pending', date: '2026-03-09', time: '14:00', type: 'Call', reminder: '15m', assignedTo: '3' }, // Assigned to Cody Lane (id 3)
    { id: 2, title: "Verify Alice Huang's documents", lead: 'Alice Huang', status: 'In Progress', date: '2026-03-09', time: '16:30', type: 'Document', reminder: '1h', assignedTo: '3' },
    { id: 3, title: 'Check loan eligibility for David Rivera', lead: 'David Rivera', status: 'Completed', date: '2026-03-08', time: '10:00', type: 'Review', reminder: 'none', assignedTo: '3' },
    { id: 4, title: 'Send welcome email to Michael Chen', lead: 'Michael Chen', status: 'Pending', date: '2026-03-10', time: '10:00', type: 'Email', reminder: '1d', assignedTo: '3' },
];

export const TasksProvider = ({ children }) => {
    // Load tasks from localStorage if available, otherwise use INITIAL_TASKS
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('global_tasks');
        return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
    });

    // Persist tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('global_tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Handle cross-tab sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'global_tasks' && e.newValue) {
                setTasks(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addTask = (task) => {
        setTasks(prev => [task, ...prev]);
    };

    const updateTask = (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    return (
        <TasksContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};

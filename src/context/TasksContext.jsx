import React, { createContext, useContext, useState, useEffect } from 'react';

const TasksContext = createContext(null);

import { INITIAL_TASKS } from '../data/dummyData';

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

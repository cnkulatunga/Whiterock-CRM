import React, { createContext, useContext, useState, useEffect } from 'react';

import { SHARED_INITIAL_USERS } from '../data/dummyData';

const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
    // Load users from localStorage if available, otherwise use SHARED_INITIAL_USERS
    const [users, setUsers] = useState(() => {
        try {
            const saved = localStorage.getItem('crm_users');
            return saved ? JSON.parse(saved) : SHARED_INITIAL_USERS;
        } catch {
            return SHARED_INITIAL_USERS;
        }
    });

    // Persist to localStorage whenever they change
    React.useEffect(() => {
        localStorage.setItem('crm_users', JSON.stringify(users));
    }, [users]);

    return (
        <UsersContext.Provider value={{ users, setUsers }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) {
        // Fallback for components used outside the provider (like in isolated tests or misconfigured routes)
        return { users: SHARED_INITIAL_USERS, setUsers: () => {} };
    }
    return context;
};

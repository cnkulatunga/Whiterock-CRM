import React, { createContext, useContext, useState } from 'react';

import { SHARED_INITIAL_USERS } from '../data/dummyData';

const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState(SHARED_INITIAL_USERS);
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

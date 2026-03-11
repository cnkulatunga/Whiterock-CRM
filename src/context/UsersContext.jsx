import React, { createContext, useContext, useState } from 'react';

/* ─── SHARED INITIAL USERS ────────────────────── */
export const SHARED_INITIAL_USERS = [
    { id: 1,  name: 'Jane Doe',        email: 'jane.doe@whiterock.crm',      initials: 'JD', color: '#dbeafe', textColor: '#1d4ed8', role: 'Super Admin',      roleColor: 'role--super',    status: 'Active' },
    { id: 2,  name: 'Marcus Smith',    email: 'm.smith@whiterock.crm',       initials: 'MS', color: '#f3e8ff', textColor: '#7c3aed', role: 'Team Leader',      roleColor: 'role--leader',   status: 'Active' },
    { id: 3,  name: 'Cody Lane',       email: 'cody.l@whiterock.crm',        initials: 'CL', color: '#f1f5f9', textColor: '#64748b', role: 'Tele Agent',       roleColor: 'role--agent',    status: 'Active' },
    { id: 4,  name: 'Sarah White',     email: 'sarah.w@whiterock.crm',       initials: 'SW', color: '#fef9c3', textColor: '#a16207', role: 'Accounts Manager', roleColor: 'role--accounts', status: 'Active' },
    { id: 5,  name: 'Diana Fernandez', email: 'd.fernandez@whiterock.crm',   initials: 'DF', color: '#dcfce7', textColor: '#15803d', role: 'Team Leader',      roleColor: 'role--leader',   status: 'Active' },
    { id: 6,  name: 'Leo Kumar',       email: 'leo.k@whiterock.crm',         initials: 'LK', color: '#e0f2fe', textColor: '#0369a1', role: 'Tele Agent',       roleColor: 'role--agent',    status: 'Active' },
    { id: 7,  name: 'Nina Hassan',     email: 'nina.h@whiterock.crm',        initials: 'NH', color: '#fce7f3', textColor: '#be185d', role: 'Tele Agent',       roleColor: 'role--agent',    status: 'Inactive' },
    { id: 8,  name: 'Ryan Patel',      email: 'r.patel@whiterock.crm',       initials: 'RP', color: '#fef3c7', textColor: '#b45309', role: 'Team Leader',      roleColor: 'role--leader',   status: 'Active' },
    { id: 9,  name: 'Aisha Nkosi',     email: 'a.nkosi@whiterock.crm',       initials: 'AN', color: '#ede9fe', textColor: '#6d28d9', role: 'Team Leader',      roleColor: 'role--leader',   status: 'Active' },
    { id: 10, name: 'Tom Brennan',     email: 't.brennan@whiterock.crm',     initials: 'TB', color: '#fee2e2', textColor: '#b91c1c', role: 'Team Leader',      roleColor: 'role--leader',   status: 'Inactive' },
    { id: 11, name: 'Priya Sharma',    email: 'p.sharma@whiterock.crm',      initials: 'PS', color: '#f0fdf4', textColor: '#166534', role: 'Tele Agent',       roleColor: 'role--agent',    status: 'Active' },
    { id: 12, name: 'Jake Morrison',   email: 'j.morrison@whiterock.crm',    initials: 'JM', color: '#f0f9ff', textColor: '#0c4a6e', role: 'Tele Agent',       roleColor: 'role--agent',    status: 'Active' },
    { id: 13, name: 'Elena Vasquez',   email: 'e.vasquez@whiterock.crm',     initials: 'EV', color: '#fff1f2', textColor: '#9f1239', role: 'Tele Agent',       roleColor: 'role--agent',    status: 'Active' },
    { id: 14, name: 'Omar Khalil',     email: 'o.khalil@whiterock.crm',      initials: 'OK', color: '#ecfdf5', textColor: '#065f46', role: 'Tele Agent',       roleColor: 'role--agent',    status: 'Inactive' },
    { id: 15, name: 'Sophie Tan',      email: 's.tan@whiterock.crm',         initials: 'ST', color: '#f5f3ff', textColor: '#4c1d95', role: 'Tele Agent',       roleColor: 'role--agent',    status: 'Active' },
];

const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState(SHARED_INITIAL_USERS);
    return (
        <UsersContext.Provider value={{ users, setUsers }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => useContext(UsersContext);

// This is a mock database layer for the CRM.
// In a production app, you would use Prisma, Mongoose, or Knex to talk to a real DB.

import { INITIAL_USERS } from '@/data/users';
import { DEFAULT_ROLE_PERMISSIONS } from '@/data/permissions';

// Using global to persist across hot-reloads in development
let globalDb: any = (global as any).crm_db;

if (!globalDb) {
    globalDb = {
        users: (INITIAL_USERS as any[]).map(user => ({
            ...user,
            permissions: user.permissions || DEFAULT_ROLE_PERMISSIONS[user.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || DEFAULT_ROLE_PERMISSIONS['Tele Agent']
        })),
        permissionsMatrix: { ...DEFAULT_ROLE_PERMISSIONS },
        leads: [],
        tasks: [
            { id: 1, title: 'Follow up with James Wilson', status: 'Pending', priority: 'High', date: '2026-04-25' },
            { id: 2, title: 'Check valuation report for LD-102', status: 'In Progress', priority: 'Medium', date: '2026-04-24' }
        ],
        notifications: [
            { id: 1, text: 'New lead assigned to you', time: '5m ago', read: false },
            { id: 2, text: 'Case AF-772 approved', time: '1h ago', read: true }
        ],
        audits: [
            { id: 1, user: 'Sarah White', action: 'Modified Permission Matrix', time: '2026-04-23 10:15' }
        ]
    };
    (global as any).crm_db = globalDb;
}

export const db = {
    users: {
        getAll: () => globalDb.users,
        getById: (id: string) => globalDb.users.find((u: any) => u.id === id),
        getByEmail: (email: string) => globalDb.users.find((u: any) => u.email === email),
        create: (user: any) => {
            const newUser = { ...user, id: `EMP-${Math.floor(Math.random() * 9000) + 1000}` };
            globalDb.users.push(newUser);
            return newUser;
        },
        update: (id: string, data: any) => {
            const idx = globalDb.users.findIndex((u: any) => u.id === id);
            if (idx !== -1) globalDb.users[idx] = { ...globalDb.users[idx], ...data };
            return globalDb.users[idx];
        }
    },
    permissions: {
        getMatrix: () => globalDb.permissionsMatrix,
        updateRole: (role: string, perms: any) => {
            globalDb.permissionsMatrix[role] = perms;
            // Record audit
            globalDb.audits.unshift({ id: Date.now(), user: 'System', action: `Updated role: ${role}`, time: new Date().toISOString() });
            return globalDb.permissionsMatrix[role];
        }
    },
    leads: {
        getAll: () => globalDb.leads,
        create: (lead: any) => { globalDb.leads.unshift(lead); return lead; },
        update: (id: string, updates: any) => {
            const idx = globalDb.leads.findIndex((l: any) => l.id === id);
            if (idx !== -1) globalDb.leads[idx] = { ...globalDb.leads[idx], ...updates };
            return globalDb.leads[idx];
        },
        delete: (id: string) => { globalDb.leads = globalDb.leads.filter((l: any) => l.id !== id); }
    },
    tasks: {
        getAll: () => globalDb.tasks,
        create: (task: any) => { globalDb.tasks.push({ ...task, id: Date.now() }); },
        update: (id: number, status: string) => {
            const t = globalDb.tasks.find((task: any) => task.id === id);
            if (t) t.status = status;
        }
    },
    audits: {
        getAll: () => globalDb.audits,
        log: (user: string, action: string) => {
            globalDb.audits.unshift({ id: Date.now(), user, action, time: new Date().toISOString() });
        }
    }
};

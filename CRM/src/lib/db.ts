// This is a mock database layer for the CRM.
// In a production app, you would use Prisma, Mongoose, or Knex to talk to a real DB.

import { INITIAL_USERS } from '@/data/users';
import { DEFAULT_ROLE_PERMISSIONS } from '@/data/permissions';
import { INITIAL_LEADS, INITIAL_LENDERS, INITIAL_TASKS, INITIAL_NOTIFICATIONS, INITIAL_LICENSES, INITIAL_NOTES, INITIAL_PAYOUTS } from '@/data/dummy';

// Using global to persist across hot-reloads in development
let globalDb: any = (global as any).crm_db;

if (!globalDb || !globalDb.leads) {
    console.log('--- INITIALIZING CRM DATABASE ---');
    console.log('INITIAL_LEADS count:', INITIAL_LEADS?.length);
    globalDb = {
        users: (INITIAL_USERS as any[]).map(user => ({
            ...user,
            permissions: user.permissions || DEFAULT_ROLE_PERMISSIONS[user.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || DEFAULT_ROLE_PERMISSIONS['Tele Agent']
        })),
        permissionsMatrix: { ...DEFAULT_ROLE_PERMISSIONS },
        leads: [...(INITIAL_LEADS || [])],
        lenders: [...(INITIAL_LENDERS || [])],
        tasks: [...(INITIAL_TASKS || [])],
        notifications: [...(INITIAL_NOTIFICATIONS || [])],
        licenses: [...(INITIAL_LICENSES || [])],
        notes: [...(INITIAL_NOTES || [])],
        payouts: [...(INITIAL_PAYOUTS || [])],
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
            const rolePerks = globalDb.permissionsMatrix[user.role] || globalDb.permissionsMatrix['Tele Agent'];
            const newUser = {
                ...user,
                id: `EMP-${Math.floor(Math.random() * 9000) + 1000}`,
                permissions: user.permissions || rolePerks
            };
            globalDb.users.push(newUser);
            return newUser;
        },
        update: (id: string, data: any) => {
            const idx = globalDb.users.findIndex((u: any) => u.id === id);
            if (idx !== -1) globalDb.users[idx] = { ...globalDb.users[idx], ...data };
            return globalDb.users[idx];
        }
    },
    lenders: {
        getAll: () => globalDb.lenders,
        create: (lender: any) => { globalDb.lenders.push(lender); return lender; },
        update: (id: number, data: any) => {
            const idx = globalDb.lenders.findIndex((l: any) => l.id === id);
            if (idx !== -1) globalDb.lenders[idx] = { ...globalDb.lenders[idx], ...data };
            return globalDb.lenders[idx];
        },
        delete: (id: number) => { globalDb.lenders = globalDb.lenders.filter((l: any) => l.id !== id); }
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
        create: (task: any) => { 
            const newTask = { ...task, id: Date.now() };
            globalDb.tasks.push(newTask); 
            return newTask;
        },
        update: (id: number, data: any) => {
            const idx = globalDb.tasks.findIndex((t: any) => t.id === id);
            if (idx !== -1) globalDb.tasks[idx] = { ...globalDb.tasks[idx], ...data };
            return globalDb.tasks[idx];
        },
        delete: (id: number) => { globalDb.tasks = globalDb.tasks.filter((t: any) => t.id !== id); }
    },
    audits: {
        getAll: () => globalDb.audits,
        log: (user: string, action: string) => {
            globalDb.audits.unshift({ id: Date.now(), user, action, time: new Date().toISOString() });
        }
    },
    notifications: {
        getAll: () => globalDb.notifications,
        getById: (id: number) => globalDb.notifications.find((n: any) => n.id === id),
    },
    licenses: {
        getAll: () => globalDb.licenses,
        create: (license: any) => { globalDb.licenses.push(license); return license; },
        update: (id: number, data: any) => {
            const idx = globalDb.licenses.findIndex((l: any) => l.id === id);
            if (idx !== -1) globalDb.licenses[idx] = { ...globalDb.licenses[idx], ...data };
            return globalDb.licenses[idx];
        },
        delete: (id: number) => { globalDb.licenses = globalDb.licenses.filter((l: any) => l.id !== id); }
    },
    notes: {
        getAll: () => globalDb.notes,
        create: (note: any) => { globalDb.notes.unshift(note); return note; },
        update: (id: number, data: any) => {
            const idx = globalDb.notes.findIndex((n: any) => n.id === id);
            if (idx !== -1) globalDb.notes[idx] = { ...globalDb.notes[idx], ...data };
            return globalDb.notes[idx];
        },
        delete: (id: number) => { globalDb.notes = globalDb.notes.filter((n: any) => n.id !== id); }
    },
    payouts: {
        getAll: () => globalDb.payouts,
        update: (id: string, data: any) => {
            const idx = globalDb.payouts.findIndex((p: any) => p.id === id);
            if (idx !== -1) globalDb.payouts[idx] = { ...globalDb.payouts[idx], ...data };
            return globalDb.payouts[idx];
        }
    }
};

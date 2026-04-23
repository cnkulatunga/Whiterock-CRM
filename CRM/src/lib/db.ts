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
        tasks: []
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
            return globalDb.permissionsMatrix[role];
        }
    }
};

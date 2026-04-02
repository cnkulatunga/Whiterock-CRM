/**
 * Checks if a user has permission to edit or delete a task.
 * Rules:
 * - Any role can manage tasks they personally created (matched by creatorId).
 * - Super Admin can manage all tasks.
 * - Fallback for legacy tasks without creatorId: match by createdBy role + assignedTo.
 */
export const canManageTask = (task, currentUser) => {
    if (!task || !currentUser) return false;

    const role = (currentUser.role || '').toLowerCase();
    const isSuperAdmin = role.includes('super_admin') || role.includes('super admin');

    // Super admin can manage everything
    if (isSuperAdmin) return true;

    // Primary check: creatorId must match current user
    if (task.creatorId) {
        return task.creatorId.toString() === currentUser.id?.toString();
    }

    // Fallback for legacy tasks without creatorId
    if (task.assignedTo === 'Self') {
        // Only allow if createdBy role matches current user's role
        if (task.createdBy) {
            const taskRole = task.createdBy.toLowerCase().replace(/_/g, ' ');
            const userRole = role.replace(/_/g, ' ');
            return taskRole === userRole;
        }
        return true; // no createdBy info, allow
    }

    if (task.createdBy) {
        const taskRole = task.createdBy.toLowerCase().replace(/_/g, ' ');
        const userRole = role.replace(/_/g, ' ');
        if (taskRole === userRole && task.assignedTo?.toString() === currentUser.id?.toString()) {
            return true;
        }
    }

    return false;
};

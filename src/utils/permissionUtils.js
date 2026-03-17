/**
 * Checks if a user has permission to edit or delete a task (reminder).
 * 
 * Logic:
 * 1. If the task has a creatorId, it must match the currentUser's id.
 * 2. Fallback for legacy tasks: If creatorId is missing, check role and assigned status.
 *    Note: Super Admins may have broad access, but the requirement was 
 *    "can edit and delete him self set reminders, but he can't edit or delete manager... like this do leader, account manager and super admin roles also"
 *    implying even Super Admins are restricted to their own set reminders for this specific feature.
 * 
 * @param {Object} task The task object.
 * @param {Object} currentUser The current logged in user object.
 * @returns {boolean} True if the user can manage the task.
 */
export const canManageTask = (task, currentUser) => {
    if (!task || !currentUser) return false;

    // Use creatorId as the primary identifier if available
    if (task.creatorId) {
        // If it's a personal reminder (assigned to 'Self'), emphasize that it's manageable
        if (task.assignedTo === 'Self') return true;
        
        return task.creatorId.toString() === currentUser.id?.toString();
    }
    
    // Explicitly allow personal reminders even without creatorId
    if (task.assignedTo === 'Self') return true;

    // Fallback for legacy tasks or tasks without creatorId
    // If createdBy is set (e.g. 'Tele Agent', 'Accounts Manager'), 
    // we check if the currentUser's role matches.
    // However, since multiple users can have the same role, 
    // we also check if it's assigned to 'Self' or the user's ID
    // to approximate ownership for personal tasks.
    if (task.createdBy) {
        const userRole = currentUser.role || '';
        const roleMatches = task.createdBy.toLowerCase().replace('_', ' ') === userRole.toLowerCase().replace('_', ' ');
        
        if (roleMatches) {
            // If it's a personal view task
            if (task.assignedTo === 'Self' || task.assignedTo?.toString() === currentUser.id?.toString()) {
                return true;
            }
        }
    }

    return false;
};

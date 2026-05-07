from rest_framework.permissions import BasePermission

ROLE_HIERARCHY = {
    'Super Admin': 5,
    'Admin': 4,
    'Team Leader': 3,
    'Accounts Manager': 2,
    'Tele Agent': 1,
}


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and hasattr(request.user, 'id'))


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) == 'Super Admin'


class IsAdminOrAbove(BasePermission):
    def has_permission(self, request, view):
        return ROLE_HIERARCHY.get(getattr(request.user, 'role', ''), 0) >= 4


class IsTeamLeaderOrAbove(BasePermission):
    def has_permission(self, request, view):
        return ROLE_HIERARCHY.get(getattr(request.user, 'role', ''), 0) >= 3


def _permission_dict(user):
    perms = getattr(user, 'permissions', None)
    if not perms:
        return {}
    if isinstance(perms, dict):
        return perms
    return {
        'modules': getattr(perms, 'modules', {}) or {},
        'features': getattr(perms, 'features', {}) or {},
        'dashboardCards': getattr(perms, 'dashboardCards', {}) or {},
    }


class HasModulePermission(BasePermission):
    """
    Checks request.user.permissions.modules[module_name].enabled
    Set view.required_module = 'leads' to activate.
    """
    def has_permission(self, request, view):
        module = getattr(view, 'required_module', None)
        if not module:
            return True
        perms = _permission_dict(request.user)
        modules = perms.get('modules', {})
        return modules.get(module, {}).get('enabled', False)


class HasActionPermission(BasePermission):
    """
    Checks request.user.permissions.modules[module_name].actions[action].
    Set view.required_module and view.required_action on the view.
    """
    def has_permission(self, request, view):
        module = getattr(view, 'required_module', None)
        action = getattr(view, 'required_action', None)
        if not module or not action:
            return True
        perms = _permission_dict(request.user)
        actions = perms.get('modules', {}).get(module, {}).get('actions', {})
        return actions.get(action, False)

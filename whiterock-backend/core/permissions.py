"""
Shared permission mixins to keep view code clean.
Import role-specific permissions from apps.users.permissions.
"""
from rest_framework.permissions import BasePermission

ROLE_HIERARCHY = {
    'super_admin':      5,
    'team_lead':        4,
    'accounts_manager': 3,
    'tele_agent':       2,
    'client':           1,
}


def user_has_min_role(user_payload, min_role):
    role = user_payload.get('role', 'client')
    return ROLE_HIERARCHY.get(role, 0) >= ROLE_HIERARCHY.get(min_role, 99)


class MinRolePermission(BasePermission):
    """
    Usage:
        class MyView(APIView):
            permission_classes = [IsAuthenticated, MinRolePermission]
            min_role = 'team_lead'
    """
    min_role = 'tele_agent'

    def has_permission(self, request, view):
        if not request.auth:
            return False
        return user_has_min_role(request.auth.payload, getattr(view, 'min_role', self.min_role))

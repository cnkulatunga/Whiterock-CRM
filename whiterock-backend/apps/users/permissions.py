from rest_framework.permissions import BasePermission


def _role(request):
    """Extract role string from JWT payload, or empty string if unauthenticated."""
    if not request.auth:
        return ''
    return getattr(request.auth, 'payload', {}).get('role', '')


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return _role(request) == 'super_admin'


class IsTeamLead(BasePermission):
    def has_permission(self, request, view):
        return _role(request) in ('super_admin', 'team_lead')


class IsAccountsManager(BasePermission):
    def has_permission(self, request, view):
        return _role(request) in ('super_admin', 'accounts_manager')


class IsTeleAgent(BasePermission):
    def has_permission(self, request, view):
        return _role(request) in ('super_admin', 'team_lead', 'tele_agent')


class IsStaff(BasePermission):
    """Any internal staff member (not client)."""
    def has_permission(self, request, view):
        return _role(request) in ('super_admin', 'team_lead', 'accounts_manager', 'tele_agent')

from django.urls import path, include
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.core.permissions import IsAuthenticated, IsAdminOrAbove


class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.leads.models import Lead
        from apps.audit.models import AuditLog
        from apps.users.models import User
        from apps.core.permissions import ROLE_HIERARCHY

        user = request.user
        role = getattr(user, 'role', '')
        role_level = ROLE_HIERARCHY.get(role, 0)

        # Scope totalLeads by role
        if role_level >= 4:
            # Super Admin / Admin — all leads
            total = Lead.objects.count()
        elif role == 'Accounts Manager':
            # All leads across all teams (entire portfolio under management)
            total = Lead.objects.count()
        elif role == 'Team Leader':
            # Leads owned by all members of the same team (including team leader)
            if user.team:
                team_id = user.team.pk if hasattr(user.team, 'pk') else user.team
                team_members = list(User.objects.filter(team=team_id))
                total = Lead.objects.filter(agent__in=team_members).count()
            else:
                total = Lead.objects.filter(agent=user).count()
        else:
            # Tele Agent — own leads only
            total = Lead.objects.filter(agent=user).count()

        all_total = Lead.objects.count()
        approved = Lead.objects.filter(status='approved').count()
        active = Lead.objects.filter(status__in=['collecting', 'verified', 'lender']).count()

        conversion = round((approved / all_total * 100), 1) if all_total else 0

        leads_by_quality = {
            'hot': Lead.objects.filter(quality='hot').count(),
            'warm': Lead.objects.filter(quality='warm').count(),
            'cool': Lead.objects.filter(quality='cool').count(),
        }

        recent_activity = AuditLog.objects.order_by('-timestamp')[:10]
        from apps.audit.serializers import AuditLogSerializer

        return Response({
            'totalLeads': total,
            'conversionRate': conversion,
            'activeCases': active,
            'leadsByQuality': leads_by_quality,
            'recentActivity': AuditLogSerializer(recent_activity, many=True).data,
        })


class AnalyticsView(APIView):
    """Per-agent/role performance analytics used by the reports page."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.leads.models import Lead
        from apps.users.models import User  # noqa: PLC0415
        from apps.core.permissions import ROLE_HIERARCHY

        requester = request.user
        requester_role = getattr(requester, 'role', '')

        if ROLE_HIERARCHY.get(requester_role, 0) < 2:
            return Response({'error': 'Forbidden'}, status=403)

        role_filter = request.query_params.get('role')

        qs = User.objects.filter(status='Active')

        if requester_role == 'Team Leader':
            if requester.team:
                qs = qs.filter(team=requester.team, role='Tele Agent')
            else:
                qs = User.objects.none()
        elif requester_role == 'Accounts Manager':
            # Accounts Manager sees only Tele Agents regardless of role param
            qs = qs.filter(role='Tele Agent')
        elif role_filter:
            qs = qs.filter(role=role_filter)

        converted_statuses = ['approved', 'completed']

        rows = []
        for user in qs:
            total = Lead.objects.filter(agent=user).count()
            converted = Lead.objects.filter(agent=user, status__in=converted_statuses).count()
            conv_rate = round((converted / total * 100), 1) if total else 0

            # Sum numeric amounts — skip non-numeric values
            amount_total = 0
            for lead in Lead.objects.filter(agent=user, status__in=converted_statuses).only('amount'):
                try:
                    raw = (lead.amount or '0').replace('£', '').replace(',', '').replace(' ', '').strip()
                    amount_total += float(raw) if raw else 0
                except (ValueError, TypeError):
                    pass

            rows.append({
                'id': str(user.id),
                'name': user.name,
                'role': user.role,
                'designation': user.designation or '',
                'total_leads': total,
                'converted': converted,
                'conversion_rate': conv_rate,
                'total_value': amount_total,
            })

        # Sort descending by total leads
        rows.sort(key=lambda r: r['total_leads'], reverse=True)
        for i, row in enumerate(rows):
            row['rank'] = i + 1

        return Response(rows)


class ApiRootView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            'name': 'Whiterock CRM API',
            'version': 'v1',
            'endpoints': {
                'auth': '/api/v1/auth/',
                'users': '/api/v1/users/',
                'leads': '/api/v1/leads/',
                'tasks': '/api/v1/tasks/',
                'notes': '/api/v1/notes/',
                'lenders': '/api/v1/lenders/',
                'licenses': '/api/v1/licenses/',
                'notifications': '/api/v1/notifications/',
                'audit': '/api/v1/audit/',
                'stats': '/api/v1/stats/',
            },
        })


urlpatterns = [
    path('', ApiRootView.as_view(), name='api-root'),
    path('auth/', include('apps.authentication.urls')),
    path('users/', include('apps.users.urls')),
    path('teams/', include('apps.teams.urls')),
    path('leads/', include('apps.leads.urls')),
    path('tasks/', include('apps.tasks.urls')),
    path('notes/', include('apps.notes.urls')),
    path('lenders/', include('apps.lenders.urls')),
    path('licenses/', include('apps.licenses.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('audit/', include('apps.audit.urls')),
    path('emails/', include('apps.emails.urls')),
    path('stats/', StatsView.as_view(), name='stats'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('docs/', include('apps.docs.urls')),
]

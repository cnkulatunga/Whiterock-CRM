from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from .models import Lead
from .serializers import LeadSerializer
from apps.users.models import User
from apps.tasks.models import Task


class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = 'dashboard:stats'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        data = {
            'total_leads':      Lead.objects.count(),
            'active_pipelines': Lead.objects(stage__in=['qualified','in_progress','submitted']).count(),
            'settled_month':    Lead.objects(stage='settled').count(),
            'team_members':     User.objects(is_active=True, role__ne='client').count(),
        }
        cache.set(cache_key, data, timeout=120)
        return Response(data)


class TeleStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id  = request.auth.payload.get('user_id', '')
        cache_key = f'tele:stats:{user_id}'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        data = {
            'my_leads':     Lead.objects(assigned_to_id=user_id).count(),
            'called_today': Lead.objects(assigned_to_id=user_id, stage='contacted').count(),
            'pending_tasks': Task.objects(assigned_to_id=user_id, completed=False).count(),
            'settled_month': Lead.objects(assigned_to_id=user_id, stage='settled').count(),
        }
        cache.set(cache_key, data, timeout=60)
        return Response(data)


class ActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = 'dashboard:activity'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        # Aggregate recent activities from leads
        recent_leads = Lead.objects().order_by('-updated_at').limit(20)
        activity = []
        for lead in recent_leads:
            for event in reversed(lead.activity[-3:]):
                from datetime import datetime, timezone
                delta = datetime.utcnow() - event.time.replace(tzinfo=None)
                hours = int(delta.total_seconds() // 3600)
                time_ago = f'{hours}h ago' if hours > 0 else 'Just now'
                activity.append({
                    'type':        event.type,
                    'description': event.description,
                    'actor':       event.actor_name,
                    'time_ago':    time_ago,
                })
                if len(activity) >= 15:
                    break
            if len(activity) >= 15:
                break

        cache.set(cache_key, activity, timeout=60)
        return Response(activity)


class RecentLeadsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = 'dashboard:recent-leads'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        leads = Lead.objects().order_by('-created_at').limit(10)
        data  = LeadSerializer(leads, many=True).data
        cache.set(cache_key, data, timeout=60)
        return Response(data)

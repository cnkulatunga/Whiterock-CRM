from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.core.cache import cache
from apps.leads.models import Lead
from apps.tasks.models import Task
from apps.lenders.models import Lender
from datetime import date


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            cache_key = f"dashboard_stats_{request.user.id}"
            cached = cache.get(cache_key)
            if cached:
                return Response(cached)
        except Exception:
            cached = None

        user = request.user
        lead_qs = Lead.objects.all()
        task_qs = Task.objects.all()

        if user.role == "Tele Agent":
            lead_qs = lead_qs.filter(agent=user.name)
            task_qs = task_qs.filter(assignee=user.name)

        total_leads = lead_qs.count()
        hot_leads = lead_qs.filter(status="Hot").count()
        warm_leads = lead_qs.filter(status="Warm").count()
        cool_leads = lead_qs.filter(status="Cool").count()
        approved = lead_qs.filter(stage="Approved").count()
        conversion_rate = round((approved / total_leads * 100) if total_leads else 0, 1)

        total_tasks = task_qs.count()
        overdue_tasks = task_qs.filter(task_status="Overdue").count()

        active_lenders = Lender.objects.filter(status="Active").count()
        pending_payouts = lead_qs.filter(payout_status=False, stage="Approved").count()

        data = {
            "totalLeads": total_leads,
            "hotLeads": hot_leads,
            "warmLeads": warm_leads,
            "coolLeads": cool_leads,
            "totalTasks": total_tasks,
            "overdueTasks": overdue_tasks,
            "activeLenders": active_lenders,
            "pendingPayouts": pending_payouts,
            "conversionRate": conversion_rate,
        }
        try:
            cache.set(cache_key, data, 120)
        except Exception:
            pass
        return Response(data)

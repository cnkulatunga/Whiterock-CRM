from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from .models import Lead
from apps.users.permissions import IsTeamLead


class ReportSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsTeamLead]

    def get(self, request):
        cache_key = 'reports:summary'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        total  = Lead.objects.count()
        settled = Lead.objects(stage='settled').count()
        approved = Lead.objects(stage__in=['approved','settled']).count()

        settled_leads = Lead.objects(stage='settled', loan_amount__ne=None)
        total_settled = sum(float(l.loan_amount or 0) for l in settled_leads)

        all_leads = Lead.objects(loan_amount__ne=None)
        avg_loan  = (sum(float(l.loan_amount or 0) for l in all_leads) / max(all_leads.count(), 1))

        data = {
            'total_applications': total,
            'approval_rate':      f'{round(approved / max(total, 1) * 100, 1)}%',
            'avg_loan_size':      f'${avg_loan:,.0f}',
            'total_settled':      f'${total_settled:,.0f}',
        }
        cache.set(cache_key, data, timeout=300)
        return Response(data)


class ReportLogsView(APIView):
    permission_classes = [IsAuthenticated, IsTeamLead]

    def get(self, request):
        leads = Lead.objects().order_by('-updated_at').limit(50)
        logs  = []
        for lead in leads:
            for event in lead.activity:
                logs.append({
                    'lead_name': lead.full_name,
                    'type':      event.type,
                    'detail':    event.description,
                    'actor':     event.actor_name,
                    'time':      event.time.isoformat() if event.time else None,
                })
        return Response(logs)

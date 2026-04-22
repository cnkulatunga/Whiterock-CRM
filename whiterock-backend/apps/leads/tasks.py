from celery import shared_task
from django.core.cache import cache


@shared_task
def send_daily_summary():
    """Async: email pipeline summary to admins. Extend with Django email."""
    from .models import Lead
    stats = {
        'total': Lead.objects.count(),
        'new':   Lead.objects(stage='new').count(),
        'settled_today': Lead.objects(stage='settled').count(),
    }
    cache.set('daily:summary', stats, timeout=86400)
    return f'Daily summary: {stats}'


@shared_task
def notify_lead_assigned(lead_id, assigned_user_email):
    """Send email notification when lead is assigned."""
    # TODO: integrate with Django email backend
    return f'Notified {assigned_user_email} about lead {lead_id}'

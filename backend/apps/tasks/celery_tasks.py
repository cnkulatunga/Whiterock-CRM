"""
Celery background tasks for the CRM.
Run worker: celery -A config worker --loglevel=info
"""
from config.celery import app
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


@app.task(bind=True, max_retries=3)
def send_followup_reminder(self, task_id: str, user_email: str):
    """Send email reminder for an upcoming follow-up task."""
    try:
        from apps.tasks.models import Task
        task = Task.objects.get(id=task_id)
        # In production: integrate with SendGrid / SES
        logger.info(f"Reminder sent for task '{task.title}' to {user_email}")
        return {"status": "sent", "task_id": task_id}
    except Exception as exc:
        logger.error(f"Failed to send reminder: {exc}")
        raise self.retry(exc=exc, countdown=60)


@app.task
def update_overdue_tasks():
    """
    Periodic task: mark tasks as Overdue if date has passed.
    Schedule: every hour via Celery Beat.
    """
    from apps.tasks.models import Task
    from datetime import date

    today = date.today()
    updated = 0
    for task in Task.objects.filter(task_status__in=["To Do", "In Progress"]):
        if task.date and task.date < today:
            task.task_status = "Overdue"
            task.save()
            updated += 1

    # Invalidate dashboard cache
    cache.delete_pattern("dashboard_stats_*")
    logger.info(f"Marked {updated} tasks as overdue")
    return {"updated": updated}


@app.task
def generate_ai_lead_summary(lead_id: str) -> str:
    """
    Generate an AI summary for a lead.
    In production: call OpenAI / Bedrock API.
    """
    from apps.leads.models import Lead

    try:
        lead = Lead.objects.get(id=lead_id)
        status_map = {
            "Hot": "High-priority lead requiring immediate attention.",
            "Warm": "Engaged lead showing strong interest.",
            "Cool": "Early-stage lead, nurturing recommended.",
        }
        summary = (
            f"{status_map.get(lead.status, 'Active lead.')} "
            f"{lead.company_name or lead.full_name} seeking {lead.loan_amount or 'funding'} "
            f"for {lead.loan_purpose or 'business needs'}. "
            f"Currently at {lead.stage} stage."
        )
        # Cache the summary
        cache.set(f"ai_summary_{lead_id}", summary, 3600)
        return summary
    except Exception as exc:
        logger.error(f"AI summary failed for lead {lead_id}: {exc}")
        return ""


@app.task
def export_leads_csv(user_id: int, filters: dict) -> str:
    """Generate a CSV export of leads and store it temporarily."""
    import csv
    import io
    from apps.leads.models import Lead

    qs = Lead.objects.all()
    if filters.get("status"):
        qs = qs.filter(status=filters["status"])

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Case ID", "Full Name", "Company", "Amount", "Stage", "Status", "Agent", "Created"])
    for lead in qs:
        writer.writerow([
            lead.case_id, lead.full_name, lead.company_name,
            lead.loan_amount, lead.stage, lead.status,
            lead.agent, lead.created_at.strftime("%Y-%m-%d"),
        ])

    csv_data = output.getvalue()
    cache_key = f"csv_export_{user_id}"
    cache.set(cache_key, csv_data, 300)  # 5 min
    return cache_key

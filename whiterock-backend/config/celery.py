import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

app = Celery('whiterock')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# ── Periodic tasks ──
from celery.schedules import crontab

app.conf.beat_schedule = {
    # Send daily summary emails at 8 AM Sydney time
    'daily-pipeline-summary': {
        'task': 'apps.leads.tasks.send_daily_summary',
        'schedule': crontab(hour=8, minute=0),
    },
    # Purge expired sessions every hour
    'clear-expired-sessions': {
        'task': 'apps.users.tasks.clear_expired_sessions',
        'schedule': crontab(minute=0),
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

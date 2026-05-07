from config.celery import app


@app.task(bind=True, max_retries=3, queue='emails')
def send_email_task(self, to_email, subject, body_html, sender_name='Whiterock CRM'):
    """Send a single email via Gmail API. Retries up to 3 times on failure."""
    try:
        from apps.emails.gmail import send_via_gmail
        send_via_gmail(to_email=to_email, subject=subject, body_html=body_html, sender_name=sender_name)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@app.task(queue='emails')
def send_license_expiry_reminder(license_id):
    """Triggered by Celery Beat when a license is expiring soon."""
    from apps.licenses.models import License
    try:
        lic = License.objects.get(id=license_id)
    except License.DoesNotExist:
        return
    send_email_task.delay(
        to_email='admin@whiterock.com',
        subject=f'Reminder: {lic.name} expires soon',
        body_html=f'<p>Your {lic.type} <strong>{lic.name}</strong> is expiring on {lic.date}.</p>',
    )


@app.task(queue='emails')
def send_task_reminder(task_id):
    """Triggered when a task is due."""
    from apps.tasks.models import Task
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return
    if task.assignee:
        send_email_task.delay(
            to_email=task.assignee.email,
            subject=f'Task due: {task.title}',
            body_html=f'<p>Your task <strong>{task.title}</strong> is due.</p>',
        )

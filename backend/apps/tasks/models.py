import mongoengine as me
from datetime import datetime


class Task(me.Document):
    TYPE_CHOICES = ("Call", "Meeting", "Follow-up", "Email", "Document", "Research", "Outbound")
    STATUS_CHOICES = ("To Do", "In Progress", "Complete", "Overdue")
    LEAD_STATUS_CHOICES = ("Hot", "Warm", "Cool")

    title = me.StringField(required=True, max_length=300)
    type = me.StringField(choices=TYPE_CHOICES, default="Call")
    task_status = me.StringField(choices=STATUS_CHOICES, default="To Do")
    lead_status = me.StringField(choices=LEAD_STATUS_CHOICES, default="Warm")
    assignee = me.StringField(max_length=150)
    client = me.StringField(max_length=150)
    phone = me.StringField(max_length=30)
    email = me.EmailField()
    date = me.DateField(required=True)
    time = me.StringField(max_length=10)
    notes = me.StringField()
    lead_id = me.StringField(max_length=50)
    created_by = me.StringField(max_length=150)
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "tasks",
        "indexes": ["assignee", "task_status", "date", "lead_id"],
        "ordering": ["date", "time"],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        super().save(*args, **kwargs)

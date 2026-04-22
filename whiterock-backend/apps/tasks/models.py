import mongoengine as me
from datetime import datetime

PRIORITIES = ('low', 'medium', 'high', 'urgent')


class Task(me.Document):
    title       = me.StringField(required=True, max_length=200)
    description = me.StringField(default='')
    priority    = me.StringField(choices=PRIORITIES, default='medium')
    due_date    = me.DateTimeField()
    completed   = me.BooleanField(default=False)
    completed_at = me.DateTimeField()

    # Association
    lead_id    = me.StringField()
    lead_name  = me.StringField()

    # Ownership
    assigned_to_id   = me.StringField()
    assigned_to_name = me.StringField()
    created_by_id    = me.StringField()

    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'tasks',
        'indexes': ['assigned_to_id', 'completed', 'due_date', 'priority'],
        'ordering': ['completed', '-priority', 'due_date'],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

from datetime import datetime
from mongoengine import (
    Document,
    StringField, DateTimeField,
    ReferenceField, NULLIFY,
)


class Task(Document):
    title = StringField(required=True, max_length=300)
    type = StringField(default='')
    status = StringField(
        choices=['To Do', 'Pending', 'In Progress', 'Done', 'Complete', 'Overdue'],
        default='To Do',
    )
    priority = StringField(choices=['Hot', 'Warm', 'Cool'], default='Warm')
    date = StringField(default='')   # stored as YYYY-MM-DD string for simple date comparison
    time = StringField(default='')
    client = StringField(default='')
    phone = StringField(default='')
    email = StringField(default='')
    description = StringField(default='')
    assignee = ReferenceField('apps.users.models.User', reverse_delete_rule=NULLIFY)
    lead = ReferenceField('apps.leads.models.Lead', reverse_delete_rule=NULLIFY)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'tasks',
        'indexes': ['status', 'priority', 'assignee', 'date'],
        'ordering': ['-created_at'],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.title} [{self.status}]'

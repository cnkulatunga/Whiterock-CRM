from datetime import datetime
from mongoengine import (
    Document,
    StringField, BooleanField, DateTimeField,
    ReferenceField, NULLIFY,
)


class Notification(Document):
    title = StringField(required=True)
    desc = StringField(default='')
    time = StringField(default='')
    unread = BooleanField(default=True)
    user = ReferenceField('apps.users.models.User', required=True, reverse_delete_rule=NULLIFY)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'notifications',
        'indexes': ['user', 'unread', '-created_at'],
        'ordering': ['-created_at'],
    }

    def __str__(self):
        return self.title

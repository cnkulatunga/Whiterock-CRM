from datetime import datetime
from mongoengine import (
    Document,
    StringField, BooleanField, DateTimeField,
    ReferenceField, NULLIFY,
)


class Note(Document):
    text = StringField(required=True)
    date = StringField(default='')
    pinned = BooleanField(default=False)
    highlighted = BooleanField(default=False)
    created_by = ReferenceField('apps.users.models.User', reverse_delete_rule=NULLIFY)
    lead = ReferenceField('apps.leads.models.Lead', reverse_delete_rule=NULLIFY, default=None)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'notes',
        'indexes': ['pinned', 'highlighted', 'created_by', 'lead'],
        'ordering': ['-pinned', '-created_at'],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.text[:60]

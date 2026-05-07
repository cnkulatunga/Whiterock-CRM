from datetime import datetime
from mongoengine import (
    Document,
    StringField, IntField, DateTimeField,
)


class License(Document):
    type = StringField(
        required=True,
        choices=['License', 'Insurance'],
    )
    name = StringField(required=True, max_length=200)
    desc = StringField(default='')
    date = DateTimeField()           # expiry date
    remind_days = IntField(default=30)
    status = StringField(choices=['ACTIVE', 'EXPIRED', 'EXPIRING_SOON'], default='ACTIVE')
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'licenses',
        'indexes': ['type', 'status', 'date'],
        'ordering': ['date'],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} ({self.type})'

from datetime import datetime
from mongoengine import Document, StringField, DateTimeField


class Team(Document):
    name = StringField(required=True, max_length=150, unique=True)
    description = StringField(default='')
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'teams',
        'indexes': ['name'],
        'ordering': ['name'],
    }

    def __str__(self):
        return self.name

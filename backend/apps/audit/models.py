from datetime import datetime
from mongoengine import (
    Document,
    StringField, DictField, DateTimeField,
    ReferenceField, NULLIFY,
)


class AuditLog(Document):
    user = ReferenceField('apps.users.models.User', reverse_delete_rule=NULLIFY)
    user_name = StringField(default='')    # denormalised for fast display
    user_email = StringField(default='')
    action = StringField(required=True)    # e.g. 'Lead moved to approved'
    entity_type = StringField(default='')  # 'Lead', 'User', 'Lender', etc.
    entity_id = StringField(default='')
    metadata = DictField(default=dict)     # any extra context
    timestamp = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'audit_logs',
        'indexes': ['user', 'entity_type', '-timestamp'],
        'ordering': ['-timestamp'],
    }

    @classmethod
    def log(cls, user, action, entity_type='', entity_id='', metadata=None):
        return cls(
            user=user,
            user_name=getattr(user, 'name', ''),
            user_email=getattr(user, 'email', ''),
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id),
            metadata=metadata or {},
        ).save()

    def __str__(self):
        return f'{self.user_name}: {self.action}'

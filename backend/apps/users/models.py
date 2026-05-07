from datetime import datetime
from mongoengine import (
    Document, EmbeddedDocument,
    StringField, EmailField, DateTimeField, DictField, IntField, BooleanField,
    EmbeddedDocumentField, ReferenceField, NULLIFY,
)
from django.contrib.auth.hashers import make_password, check_password
from apps.teams.models import Team


class Permissions(EmbeddedDocument):
    modules = DictField(default=dict)
    features = DictField(default=dict)
    dashboardCards = DictField(default=dict)


class User(Document):
    name = StringField(required=True, max_length=150)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    legacy_password = StringField(db_field='password')
    role = StringField(
        required=True,
        choices=['Super Admin', 'Admin', 'Team Leader', 'Accounts Manager', 'Tele Agent'],
    )
    avatar = StringField(default='')
    status = StringField(choices=['Active', 'Inactive'], default='Active')
    phone = StringField(default='')
    designation = StringField(default='')
    permissions = EmbeddedDocumentField(Permissions, default=Permissions)
    team = ReferenceField(Team, reverse_delete_rule=NULLIFY, default=None)
    joined = DateTimeField(default=datetime.utcnow)
    last_seen = DateTimeField(default=None)
    failed_login_attempts = IntField(default=0)
    locked_until = DateTimeField(default=None)
    must_set_password = BooleanField(default=True)

    meta = {
        'collection': 'users',
        'indexes': ['email', 'role', 'status'],
        'ordering': ['name'],
    }

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash or self.legacy_password)

    def clean(self):
        if not self.password_hash and self.legacy_password:
            self.password_hash = self.legacy_password

    def __str__(self):
        return f'{self.name} ({self.email})'

    # Minimal interface expected by DRF request.user
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

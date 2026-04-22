import mongoengine as me
from datetime import datetime

ROLES = ('super_admin', 'tele_agent', 'accounts_manager', 'team_lead', 'client')


class User(me.Document):
    """Primary user document — stored in MongoDB."""
    email      = me.EmailField(required=True, unique=True)
    password   = me.StringField(required=True)        # bcrypt hash
    first_name = me.StringField(max_length=100, default='')
    last_name  = me.StringField(max_length=100, default='')
    phone      = me.StringField(max_length=20, default='')
    role       = me.StringField(choices=ROLES, default='tele_agent')
    is_active  = me.BooleanField(default=True)
    date_joined = me.DateTimeField(default=datetime.utcnow)
    last_login  = me.DateTimeField()

    # Granular permissions (override role defaults)
    permissions = me.DictField(default=dict)

    meta = {
        'collection': 'users',
        'indexes': ['email', 'role', 'is_active'],
        'ordering': ['-date_joined'],
    }

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    def __str__(self):
        return self.email


class Session(me.Document):
    """Redis-backed sessions, stored for audit. Actual session in Redis."""
    user_id    = me.StringField(required=True)
    token      = me.StringField(required=True)
    ip_address = me.StringField()
    user_agent = me.StringField()
    created_at = me.DateTimeField(default=datetime.utcnow)
    expires_at = me.DateTimeField()

    meta = {
        'collection': 'sessions',
        'indexes': [
            'user_id',
            {'fields': ['expires_at'], 'expireAfterSeconds': 0},
        ],
    }

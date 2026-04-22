import mongoengine as me
from datetime import datetime

STAGES = (
    'new', 'contacted', 'qualified', 'in_progress',
    'submitted', 'approved', 'settled', 'declined', 'withdrawn'
)
PRODUCT_TYPES = (
    'home_loan', 'investment', 'refinance', 'construction',
    'smsf', 'commercial', 'personal', 'other'
)


class LeadNote(me.EmbeddedDocument):
    content    = me.StringField(required=True)
    author_id  = me.StringField()
    author_name = me.StringField()
    created_at = me.DateTimeField(default=datetime.utcnow)


class LeadActivity(me.EmbeddedDocument):
    type        = me.StringField()   # lead_created, status_change, doc_uploaded, …
    description = me.StringField()
    actor_id    = me.StringField()
    actor_name  = me.StringField()
    time        = me.DateTimeField(default=datetime.utcnow)


class Lead(me.Document):
    # Identity
    first_name = me.StringField(required=True, max_length=100)
    last_name  = me.StringField(required=True, max_length=100)
    email      = me.EmailField()
    phone      = me.StringField(max_length=30)
    dob        = me.DateField()

    # Financial
    product_type = me.StringField(choices=PRODUCT_TYPES, default='home_loan')
    loan_amount  = me.DecimalField(precision=2)
    income       = me.DecimalField(precision=2)
    employment_type = me.StringField()
    credit_score = me.IntField()

    # Pipeline
    stage       = me.StringField(choices=STAGES, default='new')
    status      = me.StringField(default='active')  # active / archived

    # Ownership
    assigned_to_id   = me.StringField()    # User pk
    assigned_to_name = me.StringField()
    created_by_id    = me.StringField()
    created_by_name  = me.StringField()

    # Embedded
    notes      = me.EmbeddedDocumentListField(LeadNote, default=[])
    activity   = me.EmbeddedDocumentListField(LeadActivity, default=[])

    notes_text = me.StringField(default='')    # Free-form initial notes
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'leads',
        'indexes': [
            'stage', 'assigned_to_id', 'status',
            ('first_name', 'last_name'),
            {'fields': ['$first_name', '$last_name', '$email', '$phone'],
             'default_language': 'english', 'weights': {'first_name':10,'last_name':10,'email':5,'phone':3}},
        ],
        'ordering': ['-created_at'],
    }

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

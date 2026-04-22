import mongoengine as me
from datetime import datetime

LOAN_STAGES = ('new','qualified','submitted','approved','settled','declined','withdrawn')


class LoanDocument(me.EmbeddedDocument):
    name       = me.StringField()
    file_id    = me.StringField()  # ref to Document collection
    uploaded_at = me.DateTimeField(default=datetime.utcnow)


class Loan(me.Document):
    lead_id        = me.StringField(required=True)  # ref to Lead
    applicant_name = me.StringField(required=True)

    # Product
    product_type = me.StringField(default='home_loan')
    loan_amount  = me.DecimalField(precision=2)
    lvr          = me.FloatField()   # Loan-to-Value Ratio
    term_years   = me.IntField()
    interest_rate = me.FloatField()
    repayment_type = me.StringField(choices=('principal_interest','interest_only'), default='principal_interest')

    # Lender
    lender_id   = me.StringField()
    lender_name = me.StringField()

    # Pipeline
    stage       = me.StringField(choices=LOAN_STAGES, default='new')
    submitted_at = me.DateTimeField()
    approved_at  = me.DateTimeField()
    settled_at   = me.DateTimeField()

    # Ownership
    assigned_to_id   = me.StringField()
    assigned_to_name = me.StringField()
    created_by_id    = me.StringField()

    documents  = me.EmbeddedDocumentListField(LoanDocument, default=[])
    notes      = me.StringField(default='')
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'loans',
        'indexes': ['lead_id', 'stage', 'assigned_to_id', 'lender_id'],
        'ordering': ['-created_at'],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

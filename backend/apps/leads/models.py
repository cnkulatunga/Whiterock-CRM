from datetime import datetime
from mongoengine import (
    Document, EmbeddedDocument,
    StringField, IntField, DateTimeField,
    ReferenceField, EmbeddedDocumentListField, NULLIFY,
)

# Direct imports so mongoengine registry has these classes before Lead is defined
from apps.users.models import User
from apps.lenders.models import Lender


class LeadDocument(EmbeddedDocument):
    doc_id = StringField(required=True)
    name = StringField(required=True)
    file_path = StringField(required=True)
    doc_type = StringField(default='')
    status = StringField(choices=['Pending', 'Verified', 'Missing', 'Failed'], default='Pending')
    uploaded_by = StringField(default='')
    uploaded_at = DateTimeField(default=datetime.utcnow)


class Lead(Document):
    name = StringField(required=True, max_length=200)
    title = StringField(default='')
    company = StringField(default='')
    email = StringField(default='')
    phone = StringField(default='')
    amount = StringField(default='0')
    status = StringField(
        choices=['new', 'collecting', 'verified', 'lender', 'approved', 'rejected', 'completed'],
        default='new',
    )
    priority = StringField(choices=['hot', 'warm', 'cool'], default='warm')
    quality = StringField(choices=['hot', 'warm', 'cool'], default='warm')
    # agent = the user who created / owns this lead
    agent = ReferenceField(User, reverse_delete_rule=NULLIFY)
    # assigned_to = a higher-role user who pushed this lead down to the agent
    assigned_to = ReferenceField(User, reverse_delete_rule=NULLIFY, default=None)
    lender = ReferenceField(Lender, reverse_delete_rule=NULLIFY)
    type = StringField(default='')
    level = StringField(default='Level 1')
    notes = StringField(default='')
    documents = EmbeddedDocumentListField(LeadDocument, default=list)
    days = IntField(default=0)
    dob = StringField(default='')
    company_house_number = StringField(db_field='companyHouseNumber', default='')
    business_annual_turnover = StringField(db_field='businessAnnualTurnover', default='')
    job_title = StringField(db_field='jobTitle', default='')
    industry = StringField(default='')
    preferred_method = StringField(db_field='preferredMethod', default='')
    home_owner = StringField(db_field='homeOwner', default='')
    residential_address = StringField(db_field='residentialAddress', default='')
    loan_purpose = StringField(db_field='loanPurpose', default='')
    existing_loan = StringField(db_field='existingLoan', default='')
    company_bank = StringField(db_field='companyBank', default='')
    lead_source = StringField(db_field='leadSource', default='')
    credit_consent = StringField(db_field='creditConsent', default='')
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'leads',
        'indexes': ['status', 'priority', 'quality', 'agent', 'assigned_to', 'lender', 'created_at'],
        'ordering': ['-created_at'],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} — {self.status}'

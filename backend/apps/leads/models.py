import mongoengine as me
from datetime import datetime


class Lead(me.Document):
    """Primary lead document stored in MongoDB."""

    STAGE_CHOICES = (
        "Create Lead",
        "Pending Documents",
        "Document Verification",
        "Lender Selection",
        "Approved",
        "Reject",
    )
    STATUS_CHOICES = ("Hot", "Warm", "Cool")

    case_id = me.StringField(unique=True)
    full_name = me.StringField(required=True, max_length=150)
    title = me.StringField(max_length=20)
    dob = me.DateField()
    company_name = me.StringField(max_length=200)
    company_house_number = me.StringField(max_length=50)
    business_annual_turnover = me.StringField(max_length=50)
    job_title = me.StringField(max_length=100)
    industry = me.StringField(max_length=100)
    email_address = me.EmailField()
    phone_number = me.StringField(max_length=30)
    preferred_contact = me.StringField(max_length=20, default="Email")
    home_owner = me.StringField(max_length=5, default="No")
    time_at_current_address = me.StringField(max_length=50)
    residential_address = me.StringField(max_length=300)
    previous_address = me.StringField(max_length=300)

    # Loan details
    loan_amount = me.StringField(max_length=50)
    loan_purpose = me.StringField(max_length=200)
    existing_loan = me.StringField(max_length=5, default="No")
    existing_lender = me.StringField(max_length=100)
    existing_amount = me.StringField(max_length=50)
    existing_rate = me.StringField(max_length=20)
    existing_repayment = me.StringField(max_length=50)
    existing_term = me.StringField(max_length=50)
    overdraft_facility = me.StringField(max_length=5, default="No")
    company_bank = me.StringField(max_length=100)
    lead_source = me.StringField(max_length=100)
    funding_timeline = me.StringField(max_length=100)
    credit_consent = me.StringField(max_length=5, default="Yes")
    previous_alpha_funding_loan = me.StringField(max_length=5, default="No")

    # Status
    stage = me.StringField(choices=STAGE_CHOICES, default="Create Lead")
    status = me.StringField(choices=STATUS_CHOICES, default="Warm")
    agent = me.StringField(max_length=150)
    lender = me.StringField(max_length=150)
    payout_status = me.BooleanField(default=False)
    additional_comments = me.StringField()

    # Metadata
    created_by = me.StringField(max_length=150)
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "leads",
        "indexes": [
            "case_id",
            "status",
            "stage",
            "agent",
            "created_at",
            {"fields": ["$full_name", "$company_name"], "default_language": "english"},
        ],
        "ordering": ["-created_at"],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        if not self.case_id:
            import random
            self.case_id = f"AF-CASE-{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.case_id})"

import mongoengine as me
from datetime import datetime


class Promotion(me.EmbeddedDocument):
    name = me.StringField(required=True, max_length=200)
    offer = me.StringField(required=True)
    expiry_date = me.DateField()
    document = me.StringField(max_length=300)
    created_at = me.DateTimeField(default=datetime.utcnow)


class Lender(me.Document):
    TYPE_CHOICES = ("Bank", "Non-Bank", "Credit Union")
    STATUS_CHOICES = ("Active", "Inactive")

    name = me.StringField(required=True, max_length=200)
    trading_name = me.StringField(max_length=200)
    type = me.StringField(choices=TYPE_CHOICES, default="Bank")
    status = me.StringField(choices=STATUS_CHOICES, default="Active")
    trading_years = me.IntField()
    email = me.EmailField()
    account_manager = me.StringField(max_length=150)
    manager_email = me.EmailField()
    trading_address = me.StringField(max_length=300)
    registered_address = me.StringField(max_length=300)
    categories = me.ListField(me.StringField(max_length=50))
    notes = me.StringField()
    promotions = me.EmbeddedDocumentListField(Promotion)
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "lenders",
        "indexes": ["name", "status", "type"],
        "ordering": ["name"],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        super().save(*args, **kwargs)

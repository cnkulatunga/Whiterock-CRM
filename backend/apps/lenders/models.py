from datetime import datetime
from mongoengine import (
    Document, EmbeddedDocument,
    StringField, FloatField, IntField,
    DateTimeField, ListField, EmbeddedDocumentField,
)


class Promotion(EmbeddedDocument):
    title = StringField(required=True)
    description = StringField(default='')
    rate = FloatField(default=0.0)
    valid_until = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)


class RateRange(EmbeddedDocument):
    min = FloatField(default=0.0)
    max = FloatField(default=0.0)


class LoanRange(EmbeddedDocument):
    min = FloatField(default=0.0)
    max = FloatField(default=0.0)


class Lender(Document):
    name = StringField(required=True, max_length=200)
    trading = StringField(default='')
    type = StringField(default='Bank')
    status = StringField(choices=['Active', 'Inactive'], default='Active')
    email = StringField(default='')
    manager = StringField(default='')
    manager_email = StringField(default='')
    address = StringField(default='')
    reg_address = StringField(default='')
    trading_years = IntField(default=0)
    rates = EmbeddedDocumentField(RateRange, default=RateRange)
    loan_ranges = EmbeddedDocumentField(LoanRange, default=LoanRange)
    categories = ListField(StringField())
    notes = StringField(default='')
    promotions = ListField(EmbeddedDocumentField(Promotion))
    added = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'lenders',
        'indexes': ['name', 'status', 'type'],
        'ordering': ['name'],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name

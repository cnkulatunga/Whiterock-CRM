import mongoengine as me
from datetime import datetime

LENDER_TYPES = ('bank', 'credit_union', 'non_bank', 'private', 'specialist')


class LenderProduct(me.EmbeddedDocument):
    name          = me.StringField()
    product_type  = me.StringField()
    max_lvr       = me.FloatField()
    min_rate      = me.FloatField()
    max_rate      = me.FloatField()


class Lender(me.Document):
    name         = me.StringField(required=True, max_length=200)
    type         = me.StringField(choices=LENDER_TYPES, default='bank')
    contact_name = me.StringField(default='')
    phone        = me.StringField(default='')
    email        = me.EmailField(default='')
    website      = me.StringField(default='')
    notes        = me.StringField(default='')
    is_active    = me.BooleanField(default=True)
    products     = me.EmbeddedDocumentListField(LenderProduct, default=[])
    created_at   = me.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'lenders',
        'indexes': ['type', 'is_active'],
        'ordering': ['name'],
    }

import mongoengine as me
from datetime import datetime

DOC_TYPES = ('id', 'payslip', 'bank_statement', 'tax_return', 'contract', 'valuation', 'other')


class Document(me.Document):
    name      = me.StringField(required=True)
    doc_type  = me.StringField(choices=DOC_TYPES, default='other')

    # Association
    lead_id   = me.StringField()
    lead_name = me.StringField()
    loan_id   = me.StringField()

    # File storage
    file_url  = me.StringField()
    file_size = me.IntField()    # bytes
    mime_type = me.StringField()

    uploaded_by_id   = me.StringField()
    uploaded_by_name = me.StringField()
    created_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'documents',
        'indexes': ['lead_id', 'loan_id', 'doc_type'],
        'ordering': ['-created_at'],
    }

    @property
    def file_size_display(self):
        if not self.file_size:
            return '—'
        if self.file_size < 1024:
            return f'{self.file_size} B'
        if self.file_size < 1048576:
            return f'{self.file_size/1024:.1f} KB'
        return f'{self.file_size/1048576:.1f} MB'

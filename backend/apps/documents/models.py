import mongoengine as me
from datetime import datetime


class Document(me.Document):
    CATEGORY_CHOICES = (
        "Knowledge Base", "Guides", "FAQs", "Products", "Policies", "Scripts",
    )
    STATUS_CHOICES = ("New", "Updated", "Archived")

    title = me.StringField(required=True, max_length=300)
    category = me.StringField(max_length=100, default="Knowledge Base")
    status = me.StringField(choices=STATUS_CHOICES, default="New")
    version = me.StringField(max_length=20, default="v1.0")
    filename = me.StringField(max_length=300)
    file_type = me.StringField(max_length=10)
    file_size = me.StringField(max_length=20)
    file_path = me.StringField(max_length=500)  # S3 / local path
    description = me.StringField()
    uploaded_by = me.StringField(max_length=150)
    uploaded_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "documents",
        "indexes": ["category", "status", "uploaded_at"],
        "ordering": ["-uploaded_at"],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        super().save(*args, **kwargs)

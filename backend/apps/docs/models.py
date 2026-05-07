from datetime import datetime
from mongoengine import (
    Document, StringField, DateTimeField, ReferenceField, NULLIFY,
)


class DocCategory(Document):
    """Custom categories created by Super Admin in addition to the presets."""
    name = StringField(required=True, unique=True)
    created_by = ReferenceField('apps.users.models.User', reverse_delete_rule=NULLIFY)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'doc_categories',
        'indexes': ['name'],
        'ordering': ['name'],
    }

    def __str__(self):
        return self.name


class Doc(Document):
    title = StringField(required=True)
    description = StringField(default='')
    category = StringField(required=True)
    filename = StringField(required=True)
    file_type = StringField(required=True)
    file_size = StringField(default='')
    file_path = StringField(required=True)  # relative path under MEDIA_ROOT
    version = StringField(default='v1.0')
    status = StringField(default='New')      # New | Updated | Archived
    uploaded_by = ReferenceField('apps.users.models.User', reverse_delete_rule=NULLIFY)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'docs',
        'indexes': ['category', 'uploaded_by'],
        'ordering': ['-created_at'],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title

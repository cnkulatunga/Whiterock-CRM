from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    title = serializers.CharField()
    category = serializers.CharField()
    status = serializers.CharField()
    version = serializers.CharField()
    filename = serializers.CharField(read_only=True)
    fileType = serializers.CharField(source="file_type", read_only=True)
    fileSize = serializers.CharField(source="file_size", read_only=True)
    description = serializers.CharField(allow_blank=True, required=False)
    uploadedBy = serializers.CharField(source="uploaded_by", read_only=True)
    uploadedAt = serializers.DateTimeField(source="uploaded_at", read_only=True)

    def get_id(self, obj):
        return str(obj.id)

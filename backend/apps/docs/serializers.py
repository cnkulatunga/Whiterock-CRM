from rest_framework import serializers


class DocSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    title = serializers.CharField()
    description = serializers.CharField(default='', allow_blank=True)
    category = serializers.CharField()
    filename = serializers.CharField()
    file_type = serializers.CharField()
    file_size = serializers.CharField(default='')
    file_url = serializers.SerializerMethodField()
    version = serializers.CharField(default='v1.0')
    status = serializers.CharField(default='New')
    uploaded_by = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)

    def get_file_url(self, obj):
        return f'/media/{obj.file_path}'

    def get_uploaded_by(self, obj):
        if obj.uploaded_by:
            return {'id': str(obj.uploaded_by.id), 'name': obj.uploaded_by.name}
        return None


class DocUpdateSerializer(serializers.Serializer):
    title = serializers.CharField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False)
    version = serializers.CharField(required=False)
    status = serializers.CharField(required=False)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance


class DocCategorySerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    name = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)

from rest_framework import serializers


class AuditLogSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    user_name = serializers.CharField()
    user_email = serializers.CharField()
    action = serializers.CharField()
    entity_type = serializers.CharField()
    entity_id = serializers.CharField()
    metadata = serializers.DictField()
    timestamp = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)

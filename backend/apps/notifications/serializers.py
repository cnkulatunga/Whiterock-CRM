from rest_framework import serializers


class NotificationSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    title = serializers.CharField()
    desc = serializers.CharField(default='', allow_blank=True)
    time = serializers.CharField(default='', allow_blank=True)
    unread = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)

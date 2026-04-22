from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
    id               = serializers.CharField(source='pk', read_only=True)
    title            = serializers.CharField(max_length=200)
    description      = serializers.CharField(default='', required=False)
    priority         = serializers.ChoiceField(choices=['low','medium','high','urgent'], default='medium')
    due_date         = serializers.DateTimeField(required=False, allow_null=True)
    completed        = serializers.BooleanField(default=False)
    completed_at     = serializers.DateTimeField(read_only=True, allow_null=True)
    lead_id          = serializers.CharField(required=False, allow_blank=True)
    lead_name        = serializers.CharField(read_only=True)
    assigned_to_id   = serializers.CharField(required=False, allow_blank=True)
    assigned_to_name = serializers.CharField(read_only=True)
    created_at       = serializers.DateTimeField(read_only=True)

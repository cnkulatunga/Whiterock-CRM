from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    title = serializers.CharField()
    type = serializers.CharField()
    taskStatus = serializers.CharField(source="task_status")
    leadStatus = serializers.CharField(source="lead_status")
    assignee = serializers.CharField(allow_blank=True, required=False)
    client = serializers.CharField(allow_blank=True, required=False)
    phone = serializers.CharField(allow_blank=True, required=False)
    email = serializers.EmailField(allow_blank=True, required=False)
    date = serializers.DateField()
    time = serializers.CharField(allow_blank=True, required=False)
    notes = serializers.CharField(allow_blank=True, required=False)
    leadId = serializers.CharField(source="lead_id", allow_blank=True, required=False)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    def get_id(self, obj):
        return str(obj.id)

    def create(self, validated_data):
        return Task(**validated_data).save()

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

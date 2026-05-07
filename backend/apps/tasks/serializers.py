from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    title = serializers.CharField(max_length=300)
    type = serializers.CharField(default='', allow_blank=True)
    status = serializers.CharField(default='To Do', allow_blank=True)
    priority = serializers.CharField(default='Warm', allow_blank=True)
    date = serializers.CharField(default='', allow_blank=True)
    time = serializers.CharField(default='', allow_blank=True)
    client = serializers.CharField(default='', allow_blank=True)
    phone = serializers.CharField(default='', allow_blank=True)
    email = serializers.CharField(default='', allow_blank=True)
    description = serializers.CharField(default='', allow_blank=True)
    assignee = serializers.SerializerMethodField()
    lead = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)

    def get_assignee(self, obj):
        if obj.assignee:
            return {'id': str(obj.assignee.id), 'name': obj.assignee.name}
        return None

    def get_lead(self, obj):
        if obj.lead:
            return {'id': str(obj.lead.id), 'name': obj.lead.name}
        return None


class TaskCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=300)
    type = serializers.CharField(default='', allow_blank=True)
    status = serializers.CharField(default='To Do', allow_blank=True)
    priority = serializers.CharField(default='Warm', allow_blank=True)
    date = serializers.CharField(default='', allow_blank=True)
    time = serializers.CharField(default='', allow_blank=True)
    client = serializers.CharField(default='', allow_blank=True)
    phone = serializers.CharField(default='', allow_blank=True)
    email = serializers.CharField(default='', allow_blank=True)
    description = serializers.CharField(default='', allow_blank=True)
    assignee_id = serializers.CharField(required=False, allow_blank=True)
    lead_id = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        from apps.tasks.models import Task
        from apps.users.models import User
        from apps.leads.models import Lead

        assignee_id = validated_data.pop('assignee_id', None)
        lead_id = validated_data.pop('lead_id', None)
        task = Task(**validated_data)
        if assignee_id:
            try:
                task.assignee = User.objects.get(id=assignee_id)
            except Exception:
                pass
        if lead_id:
            try:
                task.lead = Lead.objects.get(id=lead_id)
                if not task.client:
                    task.client = task.lead.name
            except Exception:
                pass
        task.save()
        return task

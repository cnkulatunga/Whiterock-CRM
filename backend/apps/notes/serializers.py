from rest_framework import serializers


class NoteSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    text = serializers.CharField()
    date = serializers.CharField(default='', allow_blank=True)
    pinned = serializers.BooleanField(default=False)
    highlighted = serializers.BooleanField(default=False)
    created_by = serializers.SerializerMethodField()
    lead_id = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)

    def get_created_by(self, obj):
        if obj.created_by:
            return {'id': str(obj.created_by.id), 'name': obj.created_by.name}
        return None

    def get_lead_id(self, obj):
        if obj.lead:
            return str(obj.lead.id)
        return None


class NoteCreateSerializer(serializers.Serializer):
    text = serializers.CharField()
    date = serializers.CharField(default='', allow_blank=True, required=False)
    pinned = serializers.BooleanField(default=False, required=False)
    highlighted = serializers.BooleanField(default=False, required=False)
    lead_id = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        from apps.notes.models import Note
        from apps.leads.models import Lead
        lead_id = validated_data.pop('lead_id', None)
        note = Note(**validated_data)
        if lead_id:
            try:
                note.lead = Lead.objects.get(id=lead_id)
            except Exception:
                pass
        note.save()
        return note


class NoteUpdateSerializer(serializers.Serializer):
    text = serializers.CharField(required=False)
    date = serializers.CharField(allow_blank=True, required=False)
    pinned = serializers.BooleanField(required=False)
    highlighted = serializers.BooleanField(required=False)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance

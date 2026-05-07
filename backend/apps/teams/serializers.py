from rest_framework import serializers


class TeamSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    name = serializers.CharField(max_length=150)
    description = serializers.CharField(default='', allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)


class TeamCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    description = serializers.CharField(default='', allow_blank=True)

    def create(self, validated_data):
        from apps.teams.models import Team
        team = Team(**validated_data)
        team.save()
        return team

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance

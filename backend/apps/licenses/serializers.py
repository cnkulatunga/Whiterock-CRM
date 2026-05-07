from rest_framework import serializers


class LicenseSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    type = serializers.ChoiceField(choices=['License', 'Insurance'])
    name = serializers.CharField(max_length=200)
    desc = serializers.CharField(default='', allow_blank=True)
    date = serializers.DateTimeField(allow_null=True, required=False)
    remind_days = serializers.IntegerField(default=30)
    status = serializers.ChoiceField(choices=['ACTIVE', 'EXPIRED', 'EXPIRING_SOON'], default='ACTIVE')
    created_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)


class LicenseCreateSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=['License', 'Insurance'])
    name = serializers.CharField(max_length=200)
    desc = serializers.CharField(default='', allow_blank=True)
    date = serializers.DateTimeField(allow_null=True, required=False)
    remind_days = serializers.IntegerField(required=False)
    remind = serializers.IntegerField(default=30, required=False, write_only=True)

    def create(self, validated_data):
        from apps.licenses.models import License
        legacy_remind = validated_data.pop('remind', None)
        if legacy_remind is not None and 'remind_days' not in validated_data:
            validated_data['remind_days'] = legacy_remind
        license = License(**validated_data)
        license.save()
        return license

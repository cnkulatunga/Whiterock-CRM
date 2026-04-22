from rest_framework import serializers


class LenderSerializer(serializers.Serializer):
    id           = serializers.CharField(source='pk', read_only=True)
    name         = serializers.CharField(max_length=200)
    type         = serializers.ChoiceField(choices=['bank','credit_union','non_bank','private','specialist'])
    contact_name = serializers.CharField(required=False, allow_blank=True)
    phone        = serializers.CharField(required=False, allow_blank=True)
    email        = serializers.EmailField(required=False, allow_blank=True)
    website      = serializers.CharField(required=False, allow_blank=True)
    notes        = serializers.CharField(required=False, allow_blank=True)
    is_active    = serializers.BooleanField(default=True)
    created_at   = serializers.DateTimeField(read_only=True)

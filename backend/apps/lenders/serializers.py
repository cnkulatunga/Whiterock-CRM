from rest_framework import serializers
from .models import Lender, Promotion


class PromotionSerializer(serializers.Serializer):
    name = serializers.CharField()
    offer = serializers.CharField()
    expiryDate = serializers.DateField(source="expiry_date", allow_null=True, required=False)
    document = serializers.CharField(allow_blank=True, required=False)


class LenderSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    name = serializers.CharField()
    tradingName = serializers.CharField(source="trading_name", allow_blank=True, required=False)
    type = serializers.CharField()
    status = serializers.CharField()
    tradingYears = serializers.IntegerField(source="trading_years", allow_null=True, required=False)
    email = serializers.EmailField(allow_blank=True, required=False)
    accountManager = serializers.CharField(source="account_manager", allow_blank=True, required=False)
    managerEmail = serializers.EmailField(source="manager_email", allow_blank=True, required=False)
    tradingAddress = serializers.CharField(source="trading_address", allow_blank=True, required=False)
    registeredAddress = serializers.CharField(source="registered_address", allow_blank=True, required=False)
    categories = serializers.ListField(child=serializers.CharField(), required=False)
    notes = serializers.CharField(allow_blank=True, required=False)
    promotions = PromotionSerializer(many=True, required=False)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    def get_id(self, obj):
        return str(obj.id)

    def create(self, validated_data):
        promotions_data = validated_data.pop("promotions", [])
        lender = Lender(**validated_data)
        for p in promotions_data:
            lender.promotions.append(Promotion(**p))
        lender.save()
        return lender

    def update(self, instance, validated_data):
        promotions_data = validated_data.pop("promotions", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if promotions_data is not None:
            instance.promotions = [Promotion(**p) for p in promotions_data]
        instance.save()
        return instance

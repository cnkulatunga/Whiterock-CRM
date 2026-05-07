from rest_framework import serializers


class PromotionSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField(default='', allow_blank=True)
    rate = serializers.FloatField(default=0.0)
    valid_until = serializers.DateTimeField(allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)


class LenderSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    name = serializers.CharField(max_length=200)
    trading = serializers.CharField(default='', allow_blank=True)
    type = serializers.CharField(default='Bank', allow_blank=True)
    status = serializers.ChoiceField(choices=['Active', 'Inactive'], default='Active')
    email = serializers.EmailField(default='', allow_blank=True)
    manager = serializers.CharField(default='', allow_blank=True)
    manager_email = serializers.EmailField(default='', allow_blank=True)
    address = serializers.CharField(default='', allow_blank=True)
    reg_address = serializers.CharField(default='', allow_blank=True)
    trading_years = serializers.IntegerField(default=0)
    rates = serializers.SerializerMethodField()
    loan_ranges = serializers.SerializerMethodField()
    categories = serializers.ListField(child=serializers.CharField(), default=list)
    notes = serializers.CharField(default='', allow_blank=True)
    promotions = PromotionSerializer(many=True, read_only=True)
    added = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)

    def get_rates(self, obj):
        return {
            'min': obj.rates.min if obj.rates else 0.0,
            'max': obj.rates.max if obj.rates else 0.0,
        }

    def get_loan_ranges(self, obj):
        return {
            'min': obj.loan_ranges.min if obj.loan_ranges else 0.0,
            'max': obj.loan_ranges.max if obj.loan_ranges else 0.0,
        }


class LenderCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    trading = serializers.CharField(default='', allow_blank=True)
    type = serializers.CharField(default='Bank', allow_blank=True)
    status = serializers.ChoiceField(choices=['Active', 'Inactive'], default='Active')
    email = serializers.EmailField(default='', allow_blank=True)
    manager = serializers.CharField(default='', allow_blank=True)
    manager_email = serializers.EmailField(default='', allow_blank=True)
    address = serializers.CharField(default='', allow_blank=True)
    reg_address = serializers.CharField(default='', allow_blank=True)
    trading_years = serializers.IntegerField(default=0)
    rates = serializers.DictField(required=False, default=dict)
    loan_ranges = serializers.DictField(required=False, default=dict)
    rate_min = serializers.FloatField(required=False, write_only=True)
    rate_max = serializers.FloatField(required=False, write_only=True)
    loan_min = serializers.FloatField(required=False, write_only=True)
    loan_max = serializers.FloatField(required=False, write_only=True)
    categories = serializers.ListField(child=serializers.CharField(), default=list)
    notes = serializers.CharField(default='', allow_blank=True)

    def create(self, validated_data):
        from apps.lenders.models import Lender, LoanRange, RateRange

        rates = validated_data.pop('rates', {}) or {}
        loan_ranges = validated_data.pop('loan_ranges', {}) or {}
        rates.setdefault('min', validated_data.pop('rate_min', 0.0))
        rates.setdefault('max', validated_data.pop('rate_max', 0.0))
        loan_ranges.setdefault('min', validated_data.pop('loan_min', 0.0))
        loan_ranges.setdefault('max', validated_data.pop('loan_max', 0.0))

        lender = Lender(**validated_data)
        lender.rates = RateRange(**rates)
        lender.loan_ranges = LoanRange(**loan_ranges)
        lender.save()
        return lender

from rest_framework import serializers


class LoanSerializer(serializers.Serializer):
    id             = serializers.CharField(source='pk', read_only=True)
    lead_id        = serializers.CharField()
    applicant_name = serializers.CharField()
    product_type   = serializers.CharField()
    loan_amount    = serializers.DecimalField(max_digits=12, decimal_places=2, allow_null=True, required=False)
    lvr            = serializers.FloatField(allow_null=True, required=False)
    term_years     = serializers.IntegerField(allow_null=True, required=False)
    interest_rate  = serializers.FloatField(allow_null=True, required=False)
    repayment_type = serializers.CharField(default='principal_interest')
    lender_id      = serializers.CharField(required=False, allow_blank=True)
    lender_name    = serializers.CharField(read_only=True)
    stage          = serializers.CharField(default='new')
    submitted_at   = serializers.DateTimeField(allow_null=True, required=False)
    approved_at    = serializers.DateTimeField(allow_null=True, required=False)
    settled_at     = serializers.DateTimeField(allow_null=True, required=False)
    assigned_to_id = serializers.CharField(required=False, allow_blank=True)
    notes          = serializers.CharField(required=False, allow_blank=True)
    created_at     = serializers.DateTimeField(read_only=True)

from rest_framework import serializers


class LeadNoteSerializer(serializers.Serializer):
    content     = serializers.CharField()
    author_name = serializers.CharField(read_only=True)
    created_at  = serializers.DateTimeField(read_only=True)


class LeadSerializer(serializers.Serializer):
    id               = serializers.CharField(source='pk', read_only=True)
    first_name       = serializers.CharField(max_length=100)
    last_name        = serializers.CharField(max_length=100)
    full_name        = serializers.CharField(read_only=True)
    email            = serializers.EmailField(required=False, allow_blank=True)
    phone            = serializers.CharField(required=False, allow_blank=True)
    product_type     = serializers.ChoiceField(choices=['home_loan','investment','refinance','construction','smsf','commercial','personal','other'])
    loan_amount      = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    income           = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    employment_type  = serializers.CharField(required=False, allow_blank=True)
    credit_score     = serializers.IntegerField(required=False, allow_null=True)
    stage            = serializers.ChoiceField(choices=['new','contacted','qualified','in_progress','submitted','approved','settled','declined','withdrawn'], default='new')
    status           = serializers.CharField(default='active')
    assigned_to_id   = serializers.CharField(required=False, allow_blank=True)
    assigned_to_name = serializers.CharField(read_only=True)
    notes_text       = serializers.CharField(required=False, allow_blank=True)
    notes            = LeadNoteSerializer(many=True, read_only=True)
    created_at       = serializers.DateTimeField(read_only=True)
    updated_at       = serializers.DateTimeField(read_only=True)


class CreateLeadSerializer(serializers.Serializer):
    first_name    = serializers.CharField(max_length=100)
    last_name     = serializers.CharField(max_length=100)
    email         = serializers.EmailField(required=False, allow_blank=True)
    phone         = serializers.CharField(required=False, allow_blank=True)
    product_type  = serializers.ChoiceField(choices=['home_loan','investment','refinance','construction','smsf','commercial','personal','other'], default='home_loan')
    loan_amount   = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    notes         = serializers.CharField(required=False, allow_blank=True, source='notes_text')

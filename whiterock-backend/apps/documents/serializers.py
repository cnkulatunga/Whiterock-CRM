from rest_framework import serializers


class DocumentSerializer(serializers.Serializer):
    id                = serializers.CharField(source='pk', read_only=True)
    name              = serializers.CharField()
    doc_type          = serializers.ChoiceField(choices=['id','payslip','bank_statement','tax_return','contract','valuation','other'])
    lead_id           = serializers.CharField(required=False, allow_blank=True)
    lead_name         = serializers.CharField(read_only=True)
    loan_id           = serializers.CharField(required=False, allow_blank=True)
    file_url          = serializers.CharField(read_only=True)
    file_size         = serializers.IntegerField(read_only=True)
    file_size_display = serializers.CharField(read_only=True)
    mime_type         = serializers.CharField(read_only=True)
    uploaded_by_name  = serializers.CharField(read_only=True)
    created_at        = serializers.DateTimeField(read_only=True)

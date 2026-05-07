from rest_framework import serializers


class LeadSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    name = serializers.CharField(max_length=200)
    title = serializers.CharField(default='', allow_blank=True)
    company = serializers.CharField(default='', allow_blank=True)
    email = serializers.CharField(default='', allow_blank=True)
    phone = serializers.CharField(default='', allow_blank=True)
    amount = serializers.CharField(default='0', allow_blank=True)
    status = serializers.ChoiceField(
        choices=['new', 'collecting', 'verified', 'lender', 'approved', 'rejected', 'completed'],
        default='new',
    )
    priority = serializers.ChoiceField(choices=['hot', 'warm', 'cool'], default='warm')
    quality = serializers.ChoiceField(choices=['hot', 'warm', 'cool'], default='warm')
    type = serializers.CharField(default='', allow_blank=True)
    level = serializers.CharField(default='Level 1', allow_blank=True)
    notes = serializers.CharField(default='', allow_blank=True)
    days = serializers.IntegerField(default=0)
    dob = serializers.CharField(default='', allow_blank=True)
    companyHouseNumber = serializers.SerializerMethodField()
    businessAnnualTurnover = serializers.SerializerMethodField()
    jobTitle = serializers.SerializerMethodField()
    industry = serializers.CharField(default='', allow_blank=True)
    preferredMethod = serializers.SerializerMethodField()
    homeOwner = serializers.SerializerMethodField()
    residentialAddress = serializers.SerializerMethodField()
    loanPurpose = serializers.SerializerMethodField()
    existingLoan = serializers.SerializerMethodField()
    companyBank = serializers.SerializerMethodField()
    leadSource = serializers.SerializerMethodField()
    creditConsent = serializers.SerializerMethodField()
    agent = serializers.SerializerMethodField()
    assigned_to = serializers.SerializerMethodField()
    lender = serializers.SerializerMethodField()
    last_note = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)

    def get_companyHouseNumber(self, obj): return obj.company_house_number or ''
    def get_businessAnnualTurnover(self, obj): return obj.business_annual_turnover or ''
    def get_jobTitle(self, obj): return obj.job_title or ''
    def get_preferredMethod(self, obj): return obj.preferred_method or ''
    def get_homeOwner(self, obj): return obj.home_owner or ''
    def get_residentialAddress(self, obj): return obj.residential_address or ''
    def get_loanPurpose(self, obj): return obj.loan_purpose or ''
    def get_existingLoan(self, obj): return obj.existing_loan or ''
    def get_companyBank(self, obj): return obj.company_bank or ''
    def get_leadSource(self, obj): return obj.lead_source or ''
    def get_creditConsent(self, obj): return obj.credit_consent or ''

    def get_agent(self, obj):
        if obj.agent:
            return {'id': str(obj.agent.id), 'name': obj.agent.name}
        return None

    def get_assigned_to(self, obj):
        if obj.assigned_to:
            return {'id': str(obj.assigned_to.id), 'name': obj.assigned_to.name}
        return None

    def get_lender(self, obj):
        if obj.lender:
            return {'id': str(obj.lender.id), 'name': obj.lender.name}
        return None

    def get_last_note(self, obj):
        from apps.notes.models import Note
        from apps.tasks.models import Task
        last_n = Note.objects.filter(lead=obj).order_by('-updated_at').first()
        last_t = Task.objects.filter(lead=obj).order_by('-updated_at').first()
        candidates = []
        if last_n:
            candidates.append((last_n.updated_at, last_n.text))
        if last_t and last_t.description:
            candidates.append((last_t.updated_at, last_t.description))
        if not candidates:
            return None
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]


_CAMEL_TO_FIELD = {
    'assigned_to_id': 'assigned_to',
    'companyHouseNumber': 'company_house_number',
    'businessAnnualTurnover': 'business_annual_turnover',
    'jobTitle': 'job_title',
    'preferredMethod': 'preferred_method',
    'homeOwner': 'home_owner',
    'residentialAddress': 'residential_address',
    'loanPurpose': 'loan_purpose',
    'existingLoan': 'existing_loan',
    'companyBank': 'company_bank',
    'leadSource': 'lead_source',
    'creditConsent': 'credit_consent',
}


class LeadCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    title = serializers.CharField(default='', allow_blank=True)
    company = serializers.CharField(default='', allow_blank=True)
    email = serializers.CharField(default='', allow_blank=True)
    phone = serializers.CharField(default='', allow_blank=True)
    amount = serializers.CharField(default='0', allow_blank=True)
    status = serializers.ChoiceField(
        choices=['new', 'collecting', 'verified', 'lender', 'approved', 'rejected', 'completed'],
        default='new',
    )
    priority = serializers.ChoiceField(choices=['hot', 'warm', 'cool'], default='warm')
    quality = serializers.ChoiceField(choices=['hot', 'warm', 'cool'], default='warm')
    type = serializers.CharField(default='', allow_blank=True)
    level = serializers.CharField(allow_blank=True, required=False)
    lead_level = serializers.CharField(default='Level 1', allow_blank=True, required=False, write_only=True)
    notes = serializers.CharField(default='', allow_blank=True)
    dob = serializers.CharField(default='', allow_blank=True)
    companyHouseNumber = serializers.CharField(default='', allow_blank=True)
    businessAnnualTurnover = serializers.CharField(default='', allow_blank=True)
    jobTitle = serializers.CharField(default='', allow_blank=True)
    industry = serializers.CharField(default='', allow_blank=True)
    preferredMethod = serializers.CharField(default='', allow_blank=True)
    homeOwner = serializers.CharField(default='', allow_blank=True)
    residentialAddress = serializers.CharField(default='', allow_blank=True)
    loanPurpose = serializers.CharField(default='', allow_blank=True)
    existingLoan = serializers.CharField(default='', allow_blank=True)
    companyBank = serializers.CharField(default='', allow_blank=True)
    leadSource = serializers.CharField(default='', allow_blank=True)
    creditConsent = serializers.CharField(default='', allow_blank=True)
    agent_id = serializers.CharField(required=False, allow_blank=True)
    assigned_to_id = serializers.CharField(required=False, allow_blank=True)
    lender_id = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        from apps.leads.models import Lead
        from apps.users.models import User
        from apps.lenders.models import Lender

        agent_id = validated_data.pop('agent_id', None)
        assigned_to_id = validated_data.pop('assigned_to_id', None)
        lender_id = validated_data.pop('lender_id', None)
        legacy_level = validated_data.pop('lead_level', None)
        if legacy_level and 'level' not in validated_data:
            validated_data['level'] = legacy_level

        # Remap camelCase keys to model field names
        for camel, field in _CAMEL_TO_FIELD.items():
            if camel in validated_data:
                validated_data[field] = validated_data.pop(camel)

        lead = Lead(**validated_data)
        if agent_id:
            lead.agent = User.objects.get(id=agent_id)
        if assigned_to_id:
            lead.assigned_to = User.objects.get(id=assigned_to_id)
        if lender_id:
            lead.lender = Lender.objects.get(id=lender_id)
        lead.save()
        return lead


class PipelineStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=['new', 'collecting', 'verified', 'lender', 'approved', 'rejected', 'completed'],
    )

from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    caseId = serializers.CharField(source="case_id", read_only=True)
    fullName = serializers.CharField(source="full_name")
    title = serializers.CharField(allow_blank=True, required=False)
    dob = serializers.DateField(allow_null=True, required=False)
    companyName = serializers.CharField(source="company_name", allow_blank=True, required=False)
    companyHouseNumber = serializers.CharField(source="company_house_number", allow_blank=True, required=False)
    businessAnnualTurnover = serializers.CharField(source="business_annual_turnover", allow_blank=True, required=False)
    jobTitle = serializers.CharField(source="job_title", allow_blank=True, required=False)
    industry = serializers.CharField(allow_blank=True, required=False)
    emailAddress = serializers.EmailField(source="email_address", allow_blank=True, required=False)
    phoneNumber = serializers.CharField(source="phone_number", allow_blank=True, required=False)
    preferredContact = serializers.CharField(source="preferred_contact", required=False)
    homeOwner = serializers.CharField(source="home_owner", required=False)
    timeAtCurrentAddress = serializers.CharField(source="time_at_current_address", allow_blank=True, required=False)
    residentialAddress = serializers.CharField(source="residential_address", allow_blank=True, required=False)
    previousAddress = serializers.CharField(source="previous_address", allow_blank=True, required=False)
    loanAmount = serializers.CharField(source="loan_amount", allow_blank=True, required=False)
    loanPurpose = serializers.CharField(source="loan_purpose", allow_blank=True, required=False)
    existingLoan = serializers.CharField(source="existing_loan", required=False)
    overdraftFacility = serializers.CharField(source="overdraft_facility", required=False)
    companyBank = serializers.CharField(source="company_bank", allow_blank=True, required=False)
    leadSource = serializers.CharField(source="lead_source", allow_blank=True, required=False)
    fundingTimeline = serializers.CharField(source="funding_timeline", allow_blank=True, required=False)
    creditConsent = serializers.CharField(source="credit_consent", required=False)
    previousAlphaFundingLoan = serializers.CharField(source="previous_alpha_funding_loan", required=False)
    stage = serializers.CharField()
    status = serializers.CharField()
    agent = serializers.CharField(allow_blank=True, required=False)
    lender = serializers.CharField(allow_blank=True, required=False)
    payoutStatus = serializers.BooleanField(source="payout_status", required=False)
    additionalComments = serializers.CharField(source="additional_comments", allow_blank=True, required=False)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    def get_id(self, obj):
        return str(obj.id)

    def create(self, validated_data):
        return Lead(**validated_data).save()

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

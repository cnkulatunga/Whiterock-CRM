import re
import uuid
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings

from apps.leads.models import Lead, LeadDocument
from apps.leads.serializers import LeadSerializer, LeadCreateSerializer, PipelineStatusSerializer
from apps.audit.models import AuditLog
from apps.core.permissions import IsAuthenticated, ROLE_HIERARCHY
from apps.core.pagination import CRMPagination

# Roles that can only see their own leads — used to auto-assign agent on create
_ROLE_LEAD_VIEW = {
    'Tele Agent': 'self',
    'Team Leader': 'team',
    'Accounts Manager': 'all',
    'Super Admin': 'all',
    'Admin': 'all',
}


def _scope_leads(qs, user):
    """
    Role-based lead visibility:

    Tele Agent    — own created leads + leads assigned to them by Team Leader/AM/Super Admin
    Team Leader   — own created leads + all leads created by agents in their team
                    + leads assigned to them by AM/Super Admin
    Accounts Mgr  — own created leads + all leads from every team
                    + leads assigned to them by Super Admin
    Super Admin   — everything
    """
    role = getattr(user, 'role', '')

    if role == 'Super Admin':
        return qs

    if role == 'Accounts Manager':
        # Own + all teams' leads + assigned to them — effectively all leads
        return qs

    if role == 'Team Leader':
        from apps.users.models import User as UserModel
        # Collect all team-member IDs
        team_member_ids = []
        if user.team:
            members = UserModel.objects(team=user.team, role='Tele Agent')
            team_member_ids = [m.id for m in members]
        return qs.filter(__raw__={
            '$or': [
                {'agent': user.id},
                {'agent': {'$in': team_member_ids}},
                {'assigned_to': user.id},
            ]
        })

    # Tele Agent (default)
    return qs.filter(__raw__={
        '$or': [
            {'agent': user.id},
            {'assigned_to': user.id},
        ]
    })


def _filter_leads(qs, params):
    if params.get('status'):
        qs = qs.filter(status=params['status'])
    if params.get('priority'):
        qs = qs.filter(priority=params['priority'])
    if params.get('quality'):
        qs = qs.filter(quality=params['quality'])
    if params.get('agent'):
        qs = qs.filter(agent=params['agent'])
    if params.get('lender'):
        qs = qs.filter(lender=params['lender'])
    if params.get('type'):
        qs = qs.filter(type=params['type'])
    if params.get('search'):
        term = re.escape(params['search'])
        qs = qs.filter(__raw__={
            '$or': [
                {'name': {'$regex': term, '$options': 'i'}},
                {'company': {'$regex': term, '$options': 'i'}},
                {'email': {'$regex': term, '$options': 'i'}},
                {'phone': {'$regex': term, '$options': 'i'}},
            ]
        })
    return qs


class LeadListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Lead.objects.all().order_by('-created_at')
        qs = _scope_leads(qs, request.user)
        qs = _filter_leads(qs, request.query_params)

        paginator = CRMPagination()
        page = paginator.paginate_queryset(list(qs), request)
        if page is not None:
            return paginator.get_paginated_response(LeadSerializer(page, many=True).data)
        return Response(LeadSerializer(qs, many=True).data)

    def post(self, request):
        data = request.data.copy()
        # Auto-assign the creating user as agent if none specified and their scope is 'self'
        if not data.get('agent_id') and _ROLE_LEAD_VIEW.get(getattr(request.user, 'role', ''), 'self') == 'self':
            data['agent_id'] = str(request.user.id)
        serializer = LeadCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.create(serializer.validated_data)
        AuditLog.log(request.user, f'Created lead: {lead.name}', 'Lead', lead.id)
        return Response(LeadSerializer(lead).data, status=status.HTTP_201_CREATED)


class LeadDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_lead(self, pk):
        try:
            return Lead.objects.get(id=pk)
        except Lead.DoesNotExist:
            return None

    def get(self, request, pk):
        lead = self._get_lead(pk)
        if not lead:
            return Response({'error': True, 'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(LeadSerializer(lead).data)

    def patch(self, request, pk):
        from apps.leads.serializers import _CAMEL_TO_FIELD
        lead = self._get_lead(pk)
        if not lead:
            return Response({'error': True, 'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)
        payload = request.data.copy()
        if 'lead_level' in payload and 'level' not in payload:
            payload['level'] = payload.pop('lead_level')
        for key, value in payload.items():
            field = _CAMEL_TO_FIELD.get(key, key)
            if hasattr(lead, field):
                setattr(lead, field, value)
        lead.save()
        AuditLog.log(request.user, f'Updated lead: {lead.name}', 'Lead', lead.id)
        return Response(LeadSerializer(lead).data)

    def delete(self, request, pk):
        lead = self._get_lead(pk)
        if not lead:
            return Response({'error': True, 'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)
        AuditLog.log(request.user, f'Deleted lead: {lead.name}', 'Lead', lead.id)
        lead.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PipelineStatusView(APIView):
    """Move a lead through pipeline stages."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            lead = Lead.objects.get(id=pk)
        except Lead.DoesNotExist:
            return Response({'error': True, 'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PipelineStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = lead.status
        lead.status = serializer.validated_data['status']
        lead.save()

        AuditLog.log(
            request.user,
            f'Pipeline: {lead.name} moved {old_status} → {lead.status}',
            'Lead', lead.id,
            {'old_status': old_status, 'new_status': lead.status},
        )
        return Response(LeadSerializer(lead).data)


def _serialize_doc(doc):
    return {
        'id': doc.doc_id,
        'name': doc.name,
        'type': doc.doc_type,
        'status': doc.status,
        'uploadedBy': doc.uploaded_by,
        'uploadedAt': doc.uploaded_at.strftime('%Y-%m-%d') if doc.uploaded_at else '',
        'url': f'{settings.MEDIA_URL}lead_docs/{doc.file_path}',
    }


class DocumentSummaryView(APIView):
    """Flat list of all documents across all leads, filtered by status."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_filter = request.query_params.get('status')
        qs = Lead.objects.all()
        qs = _scope_leads(qs, request.user)
        result = []
        for lead in qs:
            for doc in lead.documents:
                if status_filter and doc.status != status_filter:
                    continue
                result.append({
                    'doc_id': doc.doc_id,
                    'doc_name': doc.name,
                    'doc_type': doc.doc_type,
                    'doc_status': doc.status,
                    'lead_id': str(lead.id),
                    'lead_name': lead.name,
                    'company': lead.company,
                    'quality': lead.quality,
                    'lead_status': lead.status,
                    'uploaded_by': doc.uploaded_by,
                    'uploaded_at': doc.uploaded_at.isoformat() if doc.uploaded_at else None,
                })
        result.sort(key=lambda x: x['uploaded_at'] or '', reverse=True)
        return Response(result[:50])


class LeadDocumentListView(APIView):
    """List all documents or upload a new one for a lead."""
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            lead = Lead.objects.get(id=pk)
        except Lead.DoesNotExist:
            return Response({'error': True, 'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response([_serialize_doc(d) for d in lead.documents])

    def post(self, request, pk):
        try:
            lead = Lead.objects.get(id=pk)
        except Lead.DoesNotExist:
            return Response({'error': True, 'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)

        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': True, 'detail': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        doc_id = str(uuid.uuid4())
        ext = os.path.splitext(file_obj.name)[1]
        stored_name = f'{pk}_{doc_id}{ext}'
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'lead_docs')
        os.makedirs(upload_dir, exist_ok=True)
        with open(os.path.join(upload_dir, stored_name), 'wb') as f:
            for chunk in file_obj.chunks():
                f.write(chunk)

        doc = LeadDocument(
            doc_id=doc_id,
            name=file_obj.name,
            file_path=stored_name,
            doc_type=request.data.get('doc_type', ''),
            status='Pending',
            uploaded_by=request.user.name if request.user else '',
        )
        lead.documents.append(doc)
        lead.save()

        AuditLog.log(request.user, f'Uploaded document: {file_obj.name} for {lead.name}', 'Lead', lead.id)
        return Response(_serialize_doc(doc), status=status.HTTP_201_CREATED)


class LeadDocumentDetailView(APIView):
    """Update status or delete a single document."""
    permission_classes = [IsAuthenticated]

    def _get_lead_and_doc(self, pk, doc_id):
        try:
            lead = Lead.objects.get(id=pk)
        except Lead.DoesNotExist:
            return None, None
        doc = next((d for d in lead.documents if d.doc_id == doc_id), None)
        return lead, doc

    def patch(self, request, pk, doc_id):
        lead, doc = self._get_lead_and_doc(pk, doc_id)
        if not lead:
            return Response({'error': True, 'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)
        if not doc:
            return Response({'error': True, 'detail': 'Document not found.'}, status=status.HTTP_404_NOT_FOUND)
        new_status = request.data.get('status')
        if new_status:
            doc.status = new_status
        lead.save()
        return Response(_serialize_doc(doc))

    def delete(self, request, pk, doc_id):
        lead, doc = self._get_lead_and_doc(pk, doc_id)
        if not lead:
            return Response({'error': True, 'detail': 'Lead not found.'}, status=status.HTTP_404_NOT_FOUND)
        if not doc:
            return Response({'error': True, 'detail': 'Document not found.'}, status=status.HTTP_404_NOT_FOUND)
        file_path = os.path.join(settings.MEDIA_ROOT, 'lead_docs', doc.file_path)
        if os.path.exists(file_path):
            os.remove(file_path)
        lead.documents = [d for d in lead.documents if d.doc_id != doc_id]
        lead.save()
        AuditLog.log(request.user, f'Deleted document: {doc.name} from {lead.name}', 'Lead', lead.id)
        return Response(status=status.HTTP_204_NO_CONTENT)

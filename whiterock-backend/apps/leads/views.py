from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
import mongoengine as me
from .models import Lead, LeadNote, LeadActivity
from .serializers import LeadSerializer, CreateLeadSerializer, LeadNoteSerializer
from apps.users.permissions import IsStaff
from core.pagination import paginate_queryset
from datetime import datetime


def _get_requester(request):
    """Extract user_id and name from JWT payload."""
    payload  = request.auth.payload if hasattr(request, 'auth') and request.auth else {}
    user_id  = payload.get('user_id', '')
    email    = payload.get('email', '')
    return user_id, email


class LeadListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        cache_key = f'leads:{request.build_absolute_uri()}'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        qs = Lead.objects()

        # Role-based scoping
        payload = request.auth.payload if request.auth else {}
        role    = payload.get('role', '')
        user_id = payload.get('user_id', '')
        if role == 'tele_agent':
            qs = qs.filter(assigned_to_id=user_id)

        # Filters
        stage   = request.query_params.get('stage')
        product = request.query_params.get('product_type')
        search  = request.query_params.get('search')
        if stage:
            qs = qs.filter(stage=stage)
        if product:
            qs = qs.filter(product_type=product)
        if search:
            qs = qs.filter(
                me.Q(first_name__icontains=search) |
                me.Q(last_name__icontains=search)  |
                me.Q(email__icontains=search)       |
                me.Q(phone__icontains=search)
            )

        result = paginate_queryset(qs, request, LeadSerializer)
        cache.set(cache_key, result.data, timeout=60)
        return result

    def post(self, request):
        serializer = CreateLeadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user_id, email = _get_requester(request)
        data = serializer.validated_data
        lead = Lead(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            product_type=data.get('product_type', 'home_loan'),
            loan_amount=data.get('loan_amount'),
            notes_text=data.get('notes_text', ''),
            created_by_id=user_id,
            created_by_name=email,
            assigned_to_id=user_id,
            activity=[LeadActivity(type='lead_created', description='Lead created', actor_id=user_id, actor_name=email)],
        ).save()

        # Invalidate list cache
        cache.delete_pattern('*leads:*')
        return Response(LeadSerializer(lead).data, status=201)


class LeadDetailView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def _get(self, pk):
        lead = Lead.objects(pk=pk).first()
        if not lead:
            return None
        return lead

    def get(self, request, pk):
        cache_key = f'lead:{pk}'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)
        lead = self._get(pk)
        if not lead:
            return Response({'detail': 'Not found.'}, status=404)
        data = LeadSerializer(lead).data
        cache.set(cache_key, data, timeout=120)
        return Response(data)

    def patch(self, request, pk):
        lead = self._get(pk)
        if not lead:
            return Response({'detail': 'Not found.'}, status=404)

        user_id, email = _get_requester(request)
        old_stage = lead.stage

        allowed = ('first_name','last_name','email','phone','product_type','loan_amount',
                   'income','stage','status','assigned_to_id','notes_text','credit_score')
        for field in allowed:
            if field in request.data:
                setattr(lead, field, request.data[field])

        if 'stage' in request.data and request.data['stage'] != old_stage:
            lead.activity.append(LeadActivity(
                type='status_change',
                description=f'Stage changed from {old_stage} to {request.data["stage"]}',
                actor_id=user_id, actor_name=email
            ))

        lead.save()
        cache.delete(f'lead:{pk}')
        cache.delete_pattern('*leads:*')
        return Response(LeadSerializer(lead).data)

    def delete(self, request, pk):
        lead = self._get(pk)
        if not lead:
            return Response({'detail': 'Not found.'}, status=404)
        lead.delete()
        cache.delete(f'lead:{pk}')
        cache.delete_pattern('*leads:*')
        return Response(status=204)


class LeadNotesView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request, pk):
        lead = Lead.objects(pk=pk).first()
        if not lead:
            return Response({'detail': 'Not found.'}, status=404)
        return Response(LeadNoteSerializer(lead.notes, many=True).data)

    def post(self, request, pk):
        lead = Lead.objects(pk=pk).first()
        if not lead:
            return Response({'detail': 'Not found.'}, status=404)
        user_id, email = _get_requester(request)
        note = LeadNote(content=request.data.get('content', ''), author_id=user_id, author_name=email)
        lead.notes.append(note)
        lead.activity.append(LeadActivity(type='note_added', description='Note added', actor_id=user_id, actor_name=email))
        lead.save()
        cache.delete(f'lead:{pk}')
        return Response(LeadNoteSerializer(note).data, status=201)

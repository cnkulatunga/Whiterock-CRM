from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from .models import Loan
from .serializers import LoanSerializer
from apps.users.permissions import IsStaff
from core.pagination import paginate_queryset


class LoanListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        cache_key = f'loans:{request.query_params.urlencode()}'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        qs = Loan.objects()
        stage = request.query_params.get('stage')
        if stage:
            qs = qs.filter(stage=stage)

        payload = request.auth.payload if request.auth else {}
        if payload.get('role') == 'tele_agent':
            qs = qs.filter(assigned_to_id=payload.get('user_id'))

        result = paginate_queryset(qs, request, LoanSerializer)
        cache.set(cache_key, result.data, timeout=60)
        return result

    def post(self, request):
        serializer = LoanSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        data = serializer.validated_data
        loan = Loan(**{k: v for k, v in data.items() if k != 'pk'}).save()
        cache.delete_pattern('*loans:*')
        return Response(LoanSerializer(loan).data, status=201)


class LoanDetailView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request, pk):
        loan = Loan.objects(pk=pk).first()
        if not loan:
            return Response({'detail': 'Not found.'}, status=404)
        return Response(LoanSerializer(loan).data)

    def patch(self, request, pk):
        loan = Loan.objects(pk=pk).first()
        if not loan:
            return Response({'detail': 'Not found.'}, status=404)
        allowed = ('stage','lender_id','lender_name','notes','loan_amount','interest_rate','submitted_at','approved_at','settled_at')
        for field in allowed:
            if field in request.data:
                setattr(loan, field, request.data[field])
        loan.save()
        cache.delete_pattern('*loans:*')
        return Response(LoanSerializer(loan).data)

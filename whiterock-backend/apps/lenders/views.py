from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from .models import Lender
from .serializers import LenderSerializer
from apps.users.permissions import IsStaff, IsAccountsManager
from core.pagination import paginate_queryset


class LenderListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        cache_key = 'lenders:list'
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        qs = Lender.objects(is_active=True)
        result = paginate_queryset(qs, request, LenderSerializer)
        cache.set(cache_key, result.data, timeout=300)
        return result

    def post(self, request):
        serializer = LenderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data   = serializer.validated_data
        lender = Lender(**{k: v for k, v in data.items() if k != 'pk'}).save()
        cache.delete('lenders:list')
        return Response(LenderSerializer(lender).data, status=201)


class LenderDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAccountsManager]

    def get(self, request, pk):
        lender = Lender.objects(pk=pk).first()
        if not lender:
            return Response({'detail': 'Not found.'}, status=404)
        return Response(LenderSerializer(lender).data)

    def patch(self, request, pk):
        lender = Lender.objects(pk=pk).first()
        if not lender:
            return Response({'detail': 'Not found.'}, status=404)
        for field in ('name','type','contact_name','phone','email','website','notes','is_active'):
            if field in request.data:
                setattr(lender, field, request.data[field])
        lender.save()
        cache.delete('lenders:list')
        return Response(LenderSerializer(lender).data)

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.core.cache import cache
from .models import Lender
from .serializers import LenderSerializer

CACHE_KEY = "lenders_list"
CACHE_TTL = 600  # 10 minutes — lenders change infrequently


class LenderViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        try:
            cached = cache.get(CACHE_KEY)
            if cached:
                return Response(cached)
        except Exception:
            cached = None
        lenders = Lender.objects.all()
        data = LenderSerializer(lenders, many=True).data
        try:
            cache.set(CACHE_KEY, data, CACHE_TTL)
        except Exception:
            pass
        return Response(data)

    def retrieve(self, request, pk=None):
        try:
            lender = Lender.objects.get(id=pk)
        except Lender.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        return Response(LenderSerializer(lender).data)

    def create(self, request):
        serializer = LenderSerializer(data=request.data)
        if serializer.is_valid():
            lender = serializer.save()
            cache.delete(CACHE_KEY)
            return Response(LenderSerializer(lender).data, status=201)
        return Response(serializer.errors, status=400)

    def partial_update(self, request, pk=None):
        try:
            lender = Lender.objects.get(id=pk)
        except Lender.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        serializer = LenderSerializer(lender, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete(CACHE_KEY)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        try:
            lender = Lender.objects.get(id=pk)
        except Lender.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        lender.delete()
        cache.delete(CACHE_KEY)
        return Response(status=204)

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.core.cache import cache
from .models import Lead
from .serializers import LeadSerializer

CACHE_TTL = 120  # 2 minutes


class LeadViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def _cache_key(self, suffix=""):
        return f"leads_{suffix}"

    def list(self, request):
        try:
            cache_key = self._cache_key(
                f"list_{request.user.id}_{request.query_params.urlencode()}"
            )
            cached = cache.get(cache_key)
            if cached:
                return Response(cached)
        except Exception:
            cached = None

        qs = Lead.objects.all()

        if request.user.role == "Tele Agent":
            qs = qs.filter(agent=request.user.name)

        search = request.query_params.get("search")
        if search:
            qs = qs.filter(
                __raw__={
                    "$or": [
                        {"full_name": {"$regex": search, "$options": "i"}},
                        {"company_name": {"$regex": search, "$options": "i"}},
                        {"case_id": {"$regex": search, "$options": "i"}},
                    ]
                }
            )

        status_filter = request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)

        stage_filter = request.query_params.get("stage")
        if stage_filter:
            qs = qs.filter(stage=stage_filter)

        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 25))
        total = qs.count()
        leads = qs.skip((page - 1) * page_size).limit(page_size)

        serializer = LeadSerializer(leads, many=True)
        data = {
            "count": total,
            "next": None,
            "previous": None,
            "results": serializer.data,
        }
        try:
            cache.set(cache_key, data, CACHE_TTL)
        except Exception:
            pass
        return Response(data)

    def retrieve(self, request, pk=None):
        cache_key = self._cache_key(f"detail_{pk}")
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)
        try:
            lead = Lead.objects.get(id=pk)
        except Lead.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        data = LeadSerializer(lead).data
        cache.set(cache_key, data, CACHE_TTL)
        return Response(data)

    def create(self, request):
        serializer = LeadSerializer(data=request.data)
        if serializer.is_valid():
            lead = serializer.save()
            lead.created_by = request.user.name
            lead.agent = request.user.name
            lead.save()
            cache.delete_pattern("leads_list_*")
            return Response(LeadSerializer(lead).data, status=201)
        return Response(serializer.errors, status=400)

    def partial_update(self, request, pk=None):
        try:
            lead = Lead.objects.get(id=pk)
        except Lead.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        serializer = LeadSerializer(lead, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete(self._cache_key(f"detail_{pk}"))
            cache.delete_pattern("leads_list_*")
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        try:
            lead = Lead.objects.get(id=pk)
        except Lead.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        lead.delete()
        cache.delete(self._cache_key(f"detail_{pk}"))
        cache.delete_pattern("leads_list_*")
        return Response(status=204)

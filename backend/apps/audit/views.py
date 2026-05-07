from rest_framework.views import APIView
from rest_framework.response import Response

from apps.audit.models import AuditLog
from apps.audit.serializers import AuditLogSerializer
from apps.core.permissions import IsAuthenticated, IsAdminOrAbove
from apps.core.pagination import CRMPagination


class AuditLogListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entity_id = request.query_params.get('entity_id')
        entity_type = request.query_params.get('entity_type')

        # Non-admins may only query audit logs for a specific entity (e.g. lead detail timeline)
        role_level = ROLE_HIERARCHY.get(getattr(request.user, 'role', ''), 0)
        if role_level < 4 and not entity_id:
            return Response([], status=200)

        qs = AuditLog.objects.order_by('-timestamp')
        if entity_type:
            qs = qs.filter(entity_type=entity_type)
        if entity_id:
            qs = qs.filter(entity_id=entity_id)

        paginator = CRMPagination()
        page = paginator.paginate_queryset(list(qs), request)
        if page is not None:
            return paginator.get_paginated_response(AuditLogSerializer(page, many=True).data)
        return Response(AuditLogSerializer(qs[:100], many=True).data)

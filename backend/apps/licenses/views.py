from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.licenses.models import License
from apps.licenses.serializers import LicenseSerializer, LicenseCreateSerializer
from apps.core.permissions import IsAuthenticated, IsAdminOrAbove
from apps.core.pagination import CRMPagination


class LicenseListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = License.objects.all().order_by('date')

        license_type = request.query_params.get('type')
        license_status = request.query_params.get('status')
        if license_type:
            qs = qs.filter(type=license_type)
        if license_status:
            qs = qs.filter(status=license_status)

        paginator = CRMPagination()
        page = paginator.paginate_queryset(list(qs), request)
        if page is not None:
            return paginator.get_paginated_response(LicenseSerializer(page, many=True).data)
        return Response(LicenseSerializer(qs, many=True).data)

    def post(self, request):
        serializer = LicenseCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.create(serializer.validated_data)
        return Response(LicenseSerializer(obj).data, status=status.HTTP_201_CREATED)


class LicenseDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrAbove]

    def patch(self, request, pk):
        try:
            obj = License.objects.get(id=pk)
        except License.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'License not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        payload = request.data.copy()
        if 'remind' in payload and 'remind_days' not in payload:
            payload['remind_days'] = payload.pop('remind')
        for field, value in payload.items():
            if hasattr(obj, field):
                setattr(obj, field, value)
        obj.save()
        return Response(LicenseSerializer(obj).data)

    def delete(self, request, pk):
        try:
            obj = License.objects.get(id=pk)
        except License.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'License not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

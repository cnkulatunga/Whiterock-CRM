from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.lenders.models import Lender, Promotion
from apps.lenders.serializers import LenderSerializer, LenderCreateSerializer, PromotionSerializer
from apps.core.permissions import IsAuthenticated, IsAdminOrAbove
from apps.core.pagination import CRMPagination


class LenderListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Lender.objects.all().order_by('name')

        lender_status = request.query_params.get('status')
        lender_type = request.query_params.get('type')
        if lender_status:
            qs = qs.filter(status=lender_status)
        if lender_type:
            qs = qs.filter(type=lender_type)

        paginator = CRMPagination()
        page = paginator.paginate_queryset(list(qs), request)
        if page is not None:
            return paginator.get_paginated_response(LenderSerializer(page, many=True).data)
        return Response(LenderSerializer(qs, many=True).data)

    def post(self, request):
        serializer = LenderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lender = serializer.create(serializer.validated_data)
        return Response(LenderSerializer(lender).data, status=status.HTTP_201_CREATED)


class LenderDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrAbove]

    def patch(self, request, pk):
        try:
            lender = Lender.objects.get(id=pk)
        except Lender.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Lender not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        from apps.lenders.models import LoanRange, RateRange

        payload = request.data.copy()
        rates = payload.pop('rates', None)
        loan_ranges = payload.pop('loan_ranges', None)
        if rates is None and ('rate_min' in payload or 'rate_max' in payload):
            rates = {
                'min': payload.pop('rate_min', lender.rates.min if lender.rates else 0.0),
                'max': payload.pop('rate_max', lender.rates.max if lender.rates else 0.0),
            }
        if loan_ranges is None and ('loan_min' in payload or 'loan_max' in payload):
            loan_ranges = {
                'min': payload.pop('loan_min', lender.loan_ranges.min if lender.loan_ranges else 0.0),
                'max': payload.pop('loan_max', lender.loan_ranges.max if lender.loan_ranges else 0.0),
            }
        if rates is not None:
            lender.rates = RateRange(**rates)
        if loan_ranges is not None:
            lender.loan_ranges = LoanRange(**loan_ranges)
        promotions_data = payload.pop('promotions', None)
        if promotions_data is not None:
            from dateutil.parser import parse as parse_dt
            promo_objs = []
            for p in promotions_data:
                valid_until = p.get('valid_until') or None
                if valid_until:
                    try:
                        valid_until = parse_dt(valid_until)
                    except Exception:
                        valid_until = None
                promo_objs.append(Promotion(
                    title=p.get('title', ''),
                    description=p.get('description', ''),
                    rate=float(p.get('rate', 0) or 0),
                    valid_until=valid_until,
                ))
            lender.promotions = promo_objs

        for field, value in payload.items():
            if hasattr(lender, field):
                setattr(lender, field, value)
        lender.save()
        return Response(LenderSerializer(lender).data)

    def delete(self, request, pk):
        try:
            lender = Lender.objects.get(id=pk)
        except Lender.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Lender not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        lender.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LenderPromotionView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrAbove]

    def post(self, request, pk):
        try:
            lender = Lender.objects.get(id=pk)
        except Lender.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Lender not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PromotionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lender.promotions.append(Promotion(**serializer.validated_data))
        lender.save()
        return Response(LenderSerializer(lender).data, status=status.HTTP_201_CREATED)


class ActivePromotionsView(APIView):
    """Return all active (non-expired) promotions across all active lenders."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from datetime import datetime
        now = datetime.utcnow()
        result = []
        for lender in Lender.objects.filter(status='Active').order_by('name'):
            for promo in lender.promotions:
                if promo.valid_until and promo.valid_until < now:
                    continue
                result.append({
                    'lender_id': str(lender.id),
                    'lender': lender.name,
                    'title': promo.title,
                    'description': promo.description,
                    'rate': promo.rate,
                    'valid_until': promo.valid_until.isoformat() if promo.valid_until else None,
                    'created_at': promo.created_at.isoformat() if promo.created_at else None,
                })
        return Response(result)

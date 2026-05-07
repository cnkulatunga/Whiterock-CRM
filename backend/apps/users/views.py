from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.users.models import User
from apps.users.serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer
from apps.core.permissions import IsAuthenticated, IsAdminOrAbove
from apps.core.pagination import CRMPagination


class ResetLockView(APIView):
    """Admin resets a locked account so the user can log in again."""
    permission_classes = [IsAuthenticated, IsAdminOrAbove]

    def post(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'error': True, 'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        user.failed_login_attempts = 0
        user.locked_until = None
        user.save()
        return Response({'detail': f'Lock cleared for {user.name}.'})


class UserListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrAbove]

    def get(self, request):
        qs = User.objects.all().order_by('name')

        role = request.query_params.get('role')
        user_status = request.query_params.get('status')
        if role:
            qs = qs.filter(role=role)
        if user_status:
            qs = qs.filter(status=user_status)
        else:
            qs = qs.filter(status='Active')

        paginator = CRMPagination()
        page = paginator.paginate_queryset(list(qs), request)
        if page is not None:
            return paginator.get_paginated_response(UserSerializer(page, many=True).data)
        return Response(UserSerializer(qs, many=True).data)

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.create(serializer.validated_data)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(UserSerializer(user).data)

    def put(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = UserUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.update(user, serializer.validated_data)
        return Response(UserSerializer(user).data)

    def delete(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        user.status = 'Inactive'
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class DirectoryView(APIView):
    """Returns all users visible to the requester, enriched with their lead count."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.leads.models import Lead
        from apps.core.permissions import ROLE_HIERARCHY

        requester = request.user
        role = getattr(requester, 'role', '')
        role_level = ROLE_HIERARCHY.get(role, 0)

        # Determine which users this role can see
        if role_level >= 4 or role == 'Accounts Manager':
            # Super Admin / Admin / AM — all users
            qs = User.objects.all().order_by('name')
        elif role == 'Team Leader':
            if requester.team:
                team_id = requester.team.pk if hasattr(requester.team, 'pk') else requester.team
                qs = User.objects.filter(team=team_id).order_by('name')
            else:
                qs = User.objects.filter(id=requester.id)
        else:
            # Tele Agent — only themselves
            qs = User.objects.filter(id=requester.id)

        from datetime import datetime, timezone, timedelta
        now = datetime.now(timezone.utc)
        online_threshold = timedelta(minutes=15)

        rows = []
        for user in qs:
            lead_count = Lead.objects.filter(agent=user).count()
            last_seen = user.last_seen
            if last_seen is not None and last_seen.tzinfo is None:
                last_seen = last_seen.replace(tzinfo=timezone.utc)
            is_online = last_seen is not None and (now - last_seen) <= online_threshold
            rows.append({
                'id': str(user.id),
                'name': user.name,
                'email': user.email,
                'phone': user.phone or '',
                'role': user.role,
                'designation': user.designation or '',
                'status': user.status,
                'is_online': is_online,
                'last_seen': last_seen.isoformat() if last_seen else None,
                'lead_count': lead_count,
            })

        # Online users first, then alphabetical
        rows.sort(key=lambda r: (0 if r['is_online'] else 1, r['name']))
        return Response(rows)

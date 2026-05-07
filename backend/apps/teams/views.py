from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.teams.models import Team
from apps.teams.serializers import TeamSerializer, TeamCreateSerializer
from apps.core.permissions import IsAuthenticated, IsAdminOrAbove


class TeamListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrAbove]

    def get(self, request):
        teams = Team.objects.all().order_by('name')
        return Response(TeamSerializer(teams, many=True).data)

    def post(self, request):
        serializer = TeamCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        team = serializer.create(serializer.validated_data)
        return Response(TeamSerializer(team).data, status=status.HTTP_201_CREATED)


class TeamDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrAbove]

    def put(self, request, pk):
        try:
            team = Team.objects.get(id=pk)
        except Team.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Team not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = TeamCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        team = serializer.update(team, serializer.validated_data)
        return Response(TeamSerializer(team).data)

    def delete(self, request, pk):
        try:
            team = Team.objects.get(id=pk)
        except Team.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Team not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        from apps.users.models import User
        User.objects(team=team).update(set__team=None)
        team.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

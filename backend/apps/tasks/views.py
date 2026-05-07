from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.tasks.models import Task
from apps.tasks.serializers import TaskSerializer, TaskCreateSerializer
from apps.core.permissions import IsAuthenticated
from apps.core.pagination import CRMPagination


_ROLE_TASK_VIEW = {
    'Super Admin': 'all',
    'Admin': 'all',
    'Accounts Manager': 'all',
    'Team Leader': 'team',
    'Tele Agent': 'self',
}


def _scope_tasks(qs, user):
    view_scope = _ROLE_TASK_VIEW.get(getattr(user, 'role', ''), 'self')
    if view_scope == 'self':
        return qs.filter(assignee=user)
    if view_scope == 'team':
        from apps.users.models import User as UserModel
        if getattr(user, 'team', None):
            team_id = user.team.pk if hasattr(user.team, 'pk') else user.team
            team_members = UserModel.objects.filter(team=team_id)
            return qs.filter(assignee__in=list(team_members))
        return qs.filter(assignee=user)
    return qs


def _filter_tasks(qs, params):
    if params.get('status'):
        qs = qs.filter(status=params['status'])
    if params.get('priority'):
        qs = qs.filter(priority=params['priority'])
    if params.get('assignee'):
        qs = qs.filter(assignee=params['assignee'])
    if params.get('type'):
        qs = qs.filter(type=params['type'])
    if params.get('lead_id'):
        from apps.leads.models import Lead
        try:
            lead = Lead.objects.get(id=params['lead_id'])
            qs = qs.filter(lead=lead)
        except Lead.DoesNotExist:
            qs = qs.none()
    if params.get('upcoming') == 'true':
        from datetime import date
        today = date.today().isoformat()
        qs = qs.filter(status__nin=['Complete', 'Done'], date__gte=today)
    return qs


class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Task.objects.all().order_by('-created_at')
        # When filtering by a specific lead, skip role scoping so all
        # team members can see that lead's tasks in the detail view.
        if not request.query_params.get('lead_id'):
            qs = _scope_tasks(qs, request.user)
        qs = _filter_tasks(qs, request.query_params)

        paginator = CRMPagination()
        page = paginator.paginate_queryset(list(qs), request)
        if page is not None:
            return paginator.get_paginated_response(TaskSerializer(page, many=True).data)
        return Response(TaskSerializer(qs, many=True).data)

    def post(self, request):
        data = request.data.copy()
        if not data.get('assignee_id') and _ROLE_TASK_VIEW.get(getattr(request.user, 'role', ''), 'self') == 'self':
            data['assignee_id'] = str(request.user.id)
        serializer = TaskCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        task = serializer.create(serializer.validated_data)
        return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)


class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Task not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        for field, value in request.data.items():
            if hasattr(task, field):
                setattr(task, field, value)
        task.save()
        return Response(TaskSerializer(task).data)

    def delete(self, request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Task not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

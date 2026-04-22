from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from .models import Task
from .serializers import TaskSerializer
from apps.users.permissions import IsStaff


class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        payload = request.auth.payload if request.auth else {}
        user_id = payload.get('user_id', '')
        role    = payload.get('role', '')

        qs = Task.objects()
        # Scope tele agents to their own tasks
        if role == 'tele_agent':
            qs = qs.filter(assigned_to_id=user_id)

        completed = request.query_params.get('completed')
        if completed is not None:
            qs = qs.filter(completed=(completed.lower() == 'true'))

        data = TaskSerializer(qs, many=True).data
        return Response(data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        payload = request.auth.payload if request.auth else {}
        data    = serializer.validated_data
        task    = Task(
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', 'medium'),
            due_date=data.get('due_date'),
            lead_id=data.get('lead_id', ''),
            assigned_to_id=payload.get('user_id', ''),
            created_by_id=payload.get('user_id', ''),
        ).save()
        return Response(TaskSerializer(task).data, status=201)


class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def patch(self, request, pk):
        task = Task.objects(pk=pk).first()
        if not task:
            return Response({'detail': 'Not found.'}, status=404)

        if 'completed' in request.data and request.data['completed'] and not task.completed:
            task.completed_at = datetime.utcnow()

        for field in ('title', 'description', 'priority', 'due_date', 'completed'):
            if field in request.data:
                setattr(task, field, request.data[field])
        task.save()
        return Response(TaskSerializer(task).data)

    def delete(self, request, pk):
        task = Task.objects(pk=pk).first()
        if not task:
            return Response({'detail': 'Not found.'}, status=404)
        task.delete()
        return Response(status=204)

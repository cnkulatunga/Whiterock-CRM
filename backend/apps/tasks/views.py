from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.core.cache import cache
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        qs = Task.objects.all()
        if request.user.role == "Tele Agent":
            qs = qs.filter(assignee=request.user.name)

        status_filter = request.query_params.get("status")
        if status_filter:
            qs = qs.filter(task_status=status_filter)

        date_filter = request.query_params.get("date")
        if date_filter:
            qs = qs.filter(date=date_filter)

        lead_id = request.query_params.get("lead_id")
        if lead_id:
            qs = qs.filter(lead_id=lead_id)

        serializer = TaskSerializer(qs, many=True)
        return Response({"count": qs.count(), "results": serializer.data})

    def create(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save()
            task.created_by = request.user.name
            task.save()
            return Response(TaskSerializer(task).data, status=201)
        return Response(serializer.errors, status=400)

    def partial_update(self, request, pk=None):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        task.delete()
        return Response(status=204)

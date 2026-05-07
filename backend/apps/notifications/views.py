from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer
from apps.core.permissions import IsAuthenticated


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:50]
        return Response(NotificationSerializer(notifications, many=True).data)

    def post(self, request):
        from apps.users.models import User
        title = request.data.get('title', '')
        desc = request.data.get('desc', '')
        user_id = request.data.get('user_id')
        if not title:
            return Response({'error': 'title required'}, status=status.HTTP_400_BAD_REQUEST)
        if user_id:
            try:
                target_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            target_user = request.user
        notif = Notification(title=title, desc=desc, user=target_user)
        notif.save()
        return Response(NotificationSerializer(notif).data, status=status.HTTP_201_CREATED)


class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            notif = Notification.objects.get(id=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response({'error': True, 'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        notif.unread = False
        notif.save()
        return Response({'success': True})


class NotificationReadAllView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, unread=True).update(unread=False)
        return Response({'success': True})

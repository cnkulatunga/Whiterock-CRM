from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.cache import cache
from .models import User
from .serializers import UserSerializer, UserCreateSerializer, CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True).order_by("-created_at")
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        # Only admins can manage users
        if self.action in ["create", "destroy", "update", "partial_update"]:
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return super().get_permissions()

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        try:
            cache_key = f"user_me_{request.user.id}"
            cached = cache.get(cache_key)
            if cached:
                return Response(cached)
            data = UserSerializer(request.user).data
            cache.set(cache_key, data, timeout=300)
        except Exception:
            data = UserSerializer(request.user).data
        return Response(data)

    def perform_update(self, serializer):
        instance = serializer.save()
        # Invalidate cache on update
        cache.delete(f"user_me_{instance.id}")


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "Admin"

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
import bcrypt
import mongoengine as me

from .models import User
from .serializers import LoginSerializer, UserSerializer, CreateUserSerializer
from .permissions import IsSuperAdmin
from core.pagination import paginate_queryset


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            # Return the first validation error message clearly
            errors = serializer.errors
            if isinstance(errors, dict):
                msgs = []
                for v in errors.values():
                    if isinstance(v, list):
                        msgs.extend(v)
                    else:
                        msgs.append(str(v))
                detail = msgs[0] if msgs else 'Invalid credentials.'
            else:
                detail = str(errors)
            return Response({'detail': detail}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()
        except Exception:
            pass
        return Response({'detail': 'Logged out.'})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payload   = request.auth.payload
        user_id   = payload.get('user_id')
        cache_key = f'user:{user_id}'

        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        try:
            user = User.objects(pk=user_id, is_active=True).first()
        except Exception:
            # MongoDB down — reconstruct minimal profile from JWT claims
            user_data = {
                'id':         user_id,
                'email':      payload.get('email', ''),
                'first_name': payload.get('first_name', ''),
                'last_name':  payload.get('last_name', ''),
                'role':       payload.get('role', ''),
                'full_name':  f"{payload.get('first_name','')} {payload.get('last_name','')}".strip(),
                'is_active':  True,
            }
            return Response(user_data)

        if not user:
            return Response({'detail': 'User not found.'}, status=404)

        data = UserSerializer(user).data
        cache.set(cache_key, data, timeout=300)
        return Response(data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.auth.payload.get('user_id')
        try:
            user = User.objects(pk=user_id).first()
        except Exception:
            return Response({'detail': 'Database unavailable.'}, status=503)

        old_pw = request.data.get('old_password', '')
        new_pw = request.data.get('new_password', '')

        if not bcrypt.checkpw(old_pw.encode(), user.password.encode()):
            return Response({'detail': 'Current password is incorrect.'}, status=400)
        if len(new_pw) < 8:
            return Response({'detail': 'Password must be at least 8 characters.'}, status=400)

        user.password = bcrypt.hashpw(new_pw.encode(), bcrypt.gensalt()).decode()
        user.save()
        cache.delete(f'user:{user_id}')
        return Response({'detail': 'Password updated successfully.'})


class UserListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        search = request.query_params.get('search', '')
        try:
            qs = User.objects()
            if search:
                qs = qs.filter(
                    me.Q(email__icontains=search) |
                    me.Q(first_name__icontains=search) |
                    me.Q(last_name__icontains=search)
                )
        except Exception:
            return Response({'detail': 'Database unavailable.'}, status=503)

        return paginate_queryset(qs, request, UserSerializer)

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        try:
            user = serializer.create(serializer.validated_data)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)
        return Response(UserSerializer(user).data, status=201)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def _get_user(self, pk):
        try:
            return User.objects(pk=pk).first()
        except Exception:
            return None

    def get(self, request, pk):
        user = self._get_user(pk)
        if not user:
            return Response({'detail': 'Not found.'}, status=404)
        return Response(UserSerializer(user).data)

    def patch(self, request, pk):
        user = self._get_user(pk)
        if not user:
            return Response({'detail': 'Not found.'}, status=404)
        for field in ('first_name', 'last_name', 'phone', 'role', 'is_active'):
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        cache.delete(f'user:{pk}')
        return Response(UserSerializer(user).data)

from datetime import datetime, timezone, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from apps.users.models import User
from apps.users.serializers import UserSerializer
from apps.authentication.utils import generate_tokens, decode_token

MAX_ATTEMPTS = 3
LOCKOUT_HOURS = 2


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'error': True, 'detail': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Check lockout
        now = datetime.now(timezone.utc)
        if user.locked_until:
            locked_until = user.locked_until
            if locked_until.tzinfo is None:
                locked_until = locked_until.replace(tzinfo=timezone.utc)
            if now < locked_until:
                remaining_secs = int((locked_until - now).total_seconds())
                remaining_hrs = remaining_secs // 3600
                remaining_mins = (remaining_secs % 3600) // 60
                if remaining_hrs > 0:
                    time_str = f'{remaining_hrs}h {remaining_mins}m'
                else:
                    time_str = f'{remaining_mins}m'
                return Response(
                    {
                        'error': True,
                        'locked': True,
                        'detail': f'Account locked. Try again in {time_str} or contact your admin to reset.',
                        'locked_until': locked_until.isoformat(),
                        'remaining_seconds': remaining_secs,
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            else:
                # Lockout expired — reset
                user.locked_until = None
                user.failed_login_attempts = 0
                user.save()

        if not user.check_password(password):
            user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
            if user.failed_login_attempts >= MAX_ATTEMPTS:
                user.locked_until = now + timedelta(hours=LOCKOUT_HOURS)
                user.save()
                return Response(
                    {
                        'error': True,
                        'locked': True,
                        'detail': f'Too many failed attempts. Account locked for {LOCKOUT_HOURS} hours. Contact your admin to reset.',
                        'locked_until': user.locked_until.isoformat(),
                        'remaining_seconds': LOCKOUT_HOURS * 3600,
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            attempts_left = MAX_ATTEMPTS - user.failed_login_attempts
            user.save()
            return Response(
                {
                    'error': True,
                    'detail': f'Invalid credentials. {attempts_left} attempt{"s" if attempts_left != 1 else ""} remaining before lockout.',
                    'attempts_left': attempts_left,
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if user.status != 'Active':
            return Response(
                {'error': True, 'detail': 'Account is inactive. Contact your administrator.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Successful login — reset attempt counter
        user.failed_login_attempts = 0
        user.locked_until = None
        user.save()

        tokens = generate_tokens(user)
        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': UserSerializer(user).data,
            'must_set_password': bool(user.must_set_password),
        })


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh', '')
        if not refresh_token:
            return Response(
                {'error': True, 'detail': 'Refresh token required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            payload = decode_token(refresh_token)
        except Exception:
            return Response(
                {'error': True, 'detail': 'Invalid or expired refresh token.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if payload.get('type') != 'refresh':
            return Response(
                {'error': True, 'detail': 'Invalid token type.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=payload['user_id'])
        except User.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        tokens = generate_tokens(user)
        return Response({'access': tokens['access'], 'refresh': tokens['refresh']})


class LogoutView(APIView):
    def post(self, request):
        return Response({'detail': 'Logged out.'})


class SetPasswordView(APIView):
    """Allows an authenticated user to set a new strong password."""

    def post(self, request):
        new_password = request.data.get('new_password', '')
        if not new_password:
            return Response(
                {'error': True, 'detail': 'new_password is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Strength requirements: min 8 chars, uppercase, lowercase, digit, special char
        import re
        errors = []
        if len(new_password) < 8:
            errors.append('at least 8 characters')
        if not re.search(r'[A-Z]', new_password):
            errors.append('an uppercase letter')
        if not re.search(r'[a-z]', new_password):
            errors.append('a lowercase letter')
        if not re.search(r'\d', new_password):
            errors.append('a number')
        if not re.search(r'[^A-Za-z0-9]', new_password):
            errors.append('a special character')
        if errors:
            return Response(
                {'error': True, 'detail': f'Password must contain {", ".join(errors)}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        user.set_password(new_password)
        user.must_set_password = False
        user.save()
        return Response({'detail': 'Password updated successfully.'})

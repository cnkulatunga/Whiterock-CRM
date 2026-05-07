from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings


class MongoJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ', 1)[1]
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token.')

        if payload.get('type') != 'access':
            raise AuthenticationFailed('Invalid token type.')

        from apps.users.models import User
        try:
            user = User.objects.get(id=payload['user_id'])
        except (User.DoesNotExist, Exception):
            raise AuthenticationFailed('User not found.')

        if user.status != 'Active':
            raise AuthenticationFailed('User account is inactive.')

        # Stamp last_seen — only write if >60s stale to avoid a DB write on every request
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        last = user.last_seen
        if last is None or (now - last.replace(tzinfo=timezone.utc)).total_seconds() > 60:
            user.last_seen = now
            user.save()

        return (user, token)

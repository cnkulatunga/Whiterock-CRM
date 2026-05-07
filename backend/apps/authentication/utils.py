from datetime import datetime, timezone
import jwt
from django.conf import settings


def generate_tokens(user):
    now = datetime.now(tz=timezone.utc)
    access_payload = {
        'user_id': str(user.id),
        'email': user.email,
        'role': user.role,
        'type': 'access',
        'iat': now,
        'exp': now + settings.JWT_ACCESS_TOKEN_LIFETIME,
    }
    refresh_payload = {
        'user_id': str(user.id),
        'type': 'refresh',
        'iat': now,
        'exp': now + settings.JWT_REFRESH_TOKEN_LIFETIME,
    }
    access = jwt.encode(access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    refresh = jwt.encode(refresh_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return {'access': access, 'refresh': refresh}


def decode_token(token):
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

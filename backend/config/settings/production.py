import mongoengine
from decouple import config
from .base import *  # noqa: F401, F403

DEBUG = False

# Connect to MongoDB
mongoengine.connect(host=MONGODB_URI, db=MONGODB_NAME, alias='default')  # noqa: F405

# ── Security ──────────────────────────────────────────────────────────────────
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
# Traefik terminates TLS — trust its forwarded proto header
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

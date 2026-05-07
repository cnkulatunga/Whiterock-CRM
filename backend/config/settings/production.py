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
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

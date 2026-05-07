import mongoengine
from .base import *  # noqa: F401, F403

DEBUG = True

ALLOWED_HOSTS = ['*']

# Enable Django debug toolbar or browsable API in dev
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [  # noqa: F405
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
]

# Connect to MongoDB
mongoengine.connect(host=MONGODB_URI, db=MONGODB_NAME, alias='default')  # noqa: F405

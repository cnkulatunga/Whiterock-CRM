from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf.urls.static import static
import mongoengine
import redis as redis_client
from django.conf import settings


def health_check(request):
    status = {'status': 'ok', 'services': {}}

    # MongoDB check
    try:
        mongoengine.connection.get_db()
        status['services']['mongodb'] = 'ok'
    except Exception as e:
        status['services']['mongodb'] = f'error: {e}'
        status['status'] = 'degraded'

    # Redis check
    try:
        r = redis_client.from_url(settings.CELERY_BROKER_URL)
        r.ping()
        status['services']['redis'] = 'ok'
    except Exception as e:
        status['services']['redis'] = f'error: {e}'
        status['status'] = 'degraded'

    http_status = 200 if status['status'] == 'ok' else 503
    return JsonResponse(status, status=http_status)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/v1/', include('apps.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

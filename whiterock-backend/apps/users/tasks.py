from celery import shared_task
from django.core.cache import cache


@shared_task
def clear_expired_sessions():
    """Periodic cleanup of expired session cache keys."""
    # MongoDB TTL index handles doc expiry; this clears any orphan Redis keys
    pattern = 'whiterock:session:*'
    cache.delete_pattern(pattern)
    return 'Sessions cleaned'

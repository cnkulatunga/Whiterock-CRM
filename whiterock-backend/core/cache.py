"""
Cache helpers for Redis-backed caching layer.

Usage:
    from core.cache import cached_view, invalidate

    @cached_view('leads:{user_id}', timeout=120)
    def expensive_query(user_id):
        ...
"""
import functools
import hashlib
import json
from django.core.cache import cache


def make_cache_key(*parts):
    """Build a stable cache key from arbitrary parts."""
    raw = ':'.join(str(p) for p in parts)
    return hashlib.md5(raw.encode()).hexdigest()[:12] + ':' + raw[:64]


def cached_view(key_template, timeout=300):
    """Decorator: caches the return value of a function in Redis."""
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            key = key_template.format(**kwargs) if kwargs else key_template
            hit = cache.get(key)
            if hit is not None:
                return hit
            result = fn(*args, **kwargs)
            cache.set(key, result, timeout=timeout)
            return result
        return wrapper
    return decorator


def invalidate(*keys):
    """Delete one or more cache keys."""
    for key in keys:
        cache.delete(key)


def invalidate_pattern(pattern):
    """Delete all cache keys matching a pattern (requires django-redis)."""
    try:
        cache.delete_pattern(f'*{pattern}*')
    except AttributeError:
        pass


def rate_limit(key, limit, window):
    """
    Increment a counter in Redis. Returns True if over limit.
    Used for API rate-limiting beyond DRF throttling.
    """
    count = cache.get(key, 0)
    if count >= limit:
        return True
    cache.set(key, count + 1, timeout=window)
    return False

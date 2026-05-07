#!/bin/sh
set -e

mkdir -p /app/data

echo "Running Django system checks..."
python manage.py check --deploy 2>/dev/null || python manage.py check

echo "Applying Django migrations..."
python manage.py migrate --noinput

if [ "$#" -gt 0 ]; then
  echo "Starting command: $*"
  exec "$@"
fi

if [ "$DJANGO_ENV" = "production" ]; then
  echo "Collecting static files..."
  python manage.py collectstatic --noinput

  echo "Starting Gunicorn..."
  exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --threads 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
else
  echo "Starting Django development server..."
  exec python manage.py runserver 0.0.0.0:8000
fi

#!/bin/sh

mkdir -p /app/data

echo "Running Django system checks..."
python manage.py check 2>&1
echo "Django check exit code: $?"

echo "Applying Django migrations..."
python manage.py migrate --noinput 2>&1
MIGRATE_EXIT=$?
echo "Migrate exit code: $MIGRATE_EXIT"

if [ "$#" -gt 0 ]; then
  echo "Starting command: $*"
  exec "$@"
fi

if [ "$DJANGO_ENV" = "production" ]; then
  echo "Collecting static files..."
  python manage.py collectstatic --noinput 2>&1 || echo "WARNING: collectstatic failed, continuing..."

  echo "Starting Gunicorn..."
  exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --threads 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
else
  echo "Starting Django development server..."
  exec python manage.py runserver 0.0.0.0:8000
fi

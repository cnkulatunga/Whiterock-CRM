from django.urls import path, include
from django.conf import settings

urlpatterns = [
    path('api/auth/',      include('apps.users.urls')),
    path('api/users/',     include('apps.users.user_urls')),
    path('api/leads/',     include('apps.leads.urls')),
    path('api/loans/',     include('apps.loans.urls')),
    path('api/documents/', include('apps.documents.urls')),
    path('api/tasks/',     include('apps.tasks.urls')),
    path('api/lenders/',   include('apps.lenders.urls')),
    path('api/dashboard/', include('apps.leads.dashboard_urls')),
    path('api/reports/',   include('apps.leads.report_urls')),
]

# Only mount Django admin in dev
if settings.DEBUG:
    try:
        from django.contrib import admin
        urlpatterns += [path('admin/', admin.site.urls)]
    except Exception:
        pass

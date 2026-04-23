from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    # API v1
    path("api/auth/", include("apps.users.urls")),
    path("api/leads/", include("apps.leads.urls")),
    path("api/tasks/", include("apps.tasks.urls")),
    path("api/lenders/", include("apps.lenders.urls")),
    path("api/documents/", include("apps.documents.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
    # JWT refresh
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # API Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

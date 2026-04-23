from django.urls import path
from .views import LeadViewSet

lead_list = LeadViewSet.as_view({"get": "list", "post": "create"})
lead_detail = LeadViewSet.as_view(
    {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}
)

urlpatterns = [
    path("", lead_list, name="lead-list"),
    path("<str:pk>/", lead_detail, name="lead-detail"),
]

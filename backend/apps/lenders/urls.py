from django.urls import path
from .views import LenderViewSet

lender_list = LenderViewSet.as_view({"get": "list", "post": "create"})
lender_detail = LenderViewSet.as_view(
    {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}
)

urlpatterns = [
    path("", lender_list, name="lender-list"),
    path("<str:pk>/", lender_detail, name="lender-detail"),
]

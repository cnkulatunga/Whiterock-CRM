from django.urls import path
from .views import DocumentViewSet

doc_list = DocumentViewSet.as_view({"get": "list", "post": "create"})
doc_detail = DocumentViewSet.as_view({"patch": "partial_update", "delete": "destroy"})

urlpatterns = [
    path("", doc_list, name="document-list"),
    path("<str:pk>/", doc_detail, name="document-detail"),
]

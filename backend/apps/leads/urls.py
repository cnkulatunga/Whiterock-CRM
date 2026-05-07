from django.urls import path
from .views import LeadListCreateView, LeadDetailView, PipelineStatusView, LeadDocumentListView, LeadDocumentDetailView, DocumentSummaryView

urlpatterns = [
    path('', LeadListCreateView.as_view(), name='lead-list'),
    path('documents/', DocumentSummaryView.as_view(), name='lead-documents-summary'),
    path('<str:pk>/', LeadDetailView.as_view(), name='lead-detail'),
    path('<str:pk>/pipeline/', PipelineStatusView.as_view(), name='lead-pipeline'),
    path('<str:pk>/documents/', LeadDocumentListView.as_view(), name='lead-document-list'),
    path('<str:pk>/documents/<str:doc_id>/', LeadDocumentDetailView.as_view(), name='lead-document-detail'),
]

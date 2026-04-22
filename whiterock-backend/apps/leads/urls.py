from django.urls import path
from .views import LeadListCreateView, LeadDetailView, LeadNotesView

urlpatterns = [
    path('',              LeadListCreateView.as_view(), name='lead-list'),
    path('<str:pk>/',     LeadDetailView.as_view(),     name='lead-detail'),
    path('<str:pk>/notes/', LeadNotesView.as_view(),    name='lead-notes'),
]

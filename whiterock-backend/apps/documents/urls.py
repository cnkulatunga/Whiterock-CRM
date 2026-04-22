from django.urls import path
from .views import DocumentListCreateView, DocumentDetailView

urlpatterns = [
    path('',          DocumentListCreateView.as_view(), name='doc-list'),
    path('<str:pk>/', DocumentDetailView.as_view(),     name='doc-detail'),
]

from django.urls import path
from .views import LicenseListCreateView, LicenseDetailView

urlpatterns = [
    path('', LicenseListCreateView.as_view(), name='license-list'),
    path('<str:pk>/', LicenseDetailView.as_view(), name='license-detail'),
]

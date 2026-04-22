from django.urls import path
from .views import LoanListCreateView, LoanDetailView

urlpatterns = [
    path('',          LoanListCreateView.as_view(), name='loan-list'),
    path('<str:pk>/', LoanDetailView.as_view(),     name='loan-detail'),
]

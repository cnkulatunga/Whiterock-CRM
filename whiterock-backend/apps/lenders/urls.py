from django.urls import path
from .views import LenderListCreateView, LenderDetailView

urlpatterns = [
    path('',          LenderListCreateView.as_view(), name='lender-list'),
    path('<str:pk>/', LenderDetailView.as_view(),     name='lender-detail'),
]

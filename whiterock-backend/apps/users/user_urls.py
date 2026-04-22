from django.urls import path
from .views import UserListCreateView, UserDetailView

# Mounted at /api/users/
urlpatterns = [
    path('',       UserListCreateView.as_view(), name='user-list'),
    path('<str:pk>/', UserDetailView.as_view(),  name='user-detail'),
]

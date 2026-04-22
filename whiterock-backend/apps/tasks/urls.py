from django.urls import path
from .views import TaskListCreateView, TaskDetailView

urlpatterns = [
    path('',          TaskListCreateView.as_view(), name='task-list'),
    path('<str:pk>/', TaskDetailView.as_view(),     name='task-detail'),
]

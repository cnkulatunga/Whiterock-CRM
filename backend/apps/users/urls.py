from django.urls import path
from .views import UserListCreateView, UserDetailView, MeView, DirectoryView, ResetLockView

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list'),
    path('me/', MeView.as_view(), name='user-me'),
    path('directory/', DirectoryView.as_view(), name='user-directory'),
    path('<str:pk>/reset-lock/', ResetLockView.as_view(), name='user-reset-lock'),
    path('<str:pk>/', UserDetailView.as_view(), name='user-detail'),
]

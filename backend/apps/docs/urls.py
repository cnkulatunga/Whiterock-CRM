from django.urls import path
from .views import DocListCreateView, DocDetailView, DocCategoryListCreateView, DocCategoryDetailView

urlpatterns = [
    path('', DocListCreateView.as_view(), name='doc-list'),
    # categories/ must come before <str:pk>/ so it isn't captured as a pk
    path('categories/', DocCategoryListCreateView.as_view(), name='doc-category-list'),
    path('categories/<str:pk>/', DocCategoryDetailView.as_view(), name='doc-category-detail'),
    path('<str:pk>/', DocDetailView.as_view(), name='doc-detail'),
]

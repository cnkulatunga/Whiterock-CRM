from django.urls import path
from .views import LenderListCreateView, LenderDetailView, LenderPromotionView, ActivePromotionsView

urlpatterns = [
    path('', LenderListCreateView.as_view(), name='lender-list'),
    path('promotions/', ActivePromotionsView.as_view(), name='active-promotions'),
    path('<str:pk>/', LenderDetailView.as_view(), name='lender-detail'),
    path('<str:pk>/promotions/', LenderPromotionView.as_view(), name='lender-promotions'),
]

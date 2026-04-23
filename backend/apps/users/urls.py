from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomTokenObtainPairView, UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("me/", UserViewSet.as_view({"get": "me"}), name="user_me"),
    path("", include(router.urls)),
]

from rest_framework.routers import DefaultRouter
from django.urls import path

from . import views

router = DefaultRouter()
router.register(r'files', views.FileViewSet, basename="files")
router.register(r'routes', views.RouteViewSet, basename="routes")

urlpatterns = [
    path('users', views.Users.as_view()),
    path('register', views.Users.as_view()),
    path('user', views.user_current),
    path('login', views.user_login),
    path('logout', views.user_logout),
]

urlpatterns += router.urls

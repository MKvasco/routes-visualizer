from rest_framework.routers import DefaultRouter
from django.urls import path

from . import views

router = DefaultRouter()
router.register(r'files', views.FileViewSet, basename="files")
router.register(r'routes', views.RouteViewSet, basename="routes")

urlpatterns = [
    path('users', views.Users.as_view()),
    path('register', views.Users.as_view()),
    path('login', views.user_login),
    path('logout', views.user_logout),
    path('user', views.user_current),
    path('user/files', views.user_current_files),
    path('user/routes', views.user_current_routes),
]

urlpatterns += router.urls

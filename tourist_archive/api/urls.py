from django.urls import path

from .views import FileDetailView
from .views import FileListView
from .views import RouteBaseListView
from .views import RegisterView
from .views import LoginView
from .views import UserView
from .views import LogoutView

urlpatterns = [
    path('files', FileListView.as_view()),
    path('files/<int:pk>', FileDetailView.as_view()),
    path('base-routes', RouteBaseListView.as_view()),
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('user', UserView.as_view())
]

from django.urls import path

from .views import FileDetailView, FileListView, RegisterView, LoginView, UserView, LogoutView

urlpatterns = [
    path('files', FileListView.as_view()),
    path('files/<int:pk>', FileDetailView.as_view()),
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('user', UserView.as_view())
]

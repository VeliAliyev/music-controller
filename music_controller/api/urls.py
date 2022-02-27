from .views import RoomView, CreateRoomView
from django.urls import path

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create', CreateRoomView.as_view()),
]
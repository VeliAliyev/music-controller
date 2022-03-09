from .views import RoomView, CreateRoomView, GetRoomView
from django.urls import path

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create', CreateRoomView.as_view()),
    path('get-room', GetRoomView.as_view()),
    path('join', GetRoomView.as_view()),
]
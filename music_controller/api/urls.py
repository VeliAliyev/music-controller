from .views import JoinRoom, RoomView, CreateRoomView, GetRoomView, UserInRoom
from django.urls import path

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create', CreateRoomView.as_view()),
    path('get-room', GetRoomView.as_view()),
    path('join', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
]
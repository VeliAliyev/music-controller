from django.shortcuts import render
from rest_framework import generics
# Create your views here.
from .models import Room
from .serializers import RoomSerializer


class RoomView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


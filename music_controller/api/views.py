from cgitb import lookup
from os import stat
from urllib import request
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class GetRoomView(APIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    def get(self, request):

        code = request.GET.get('code')
        if code:
            room = self.queryset.filter(code=code)
            
            if room:
                data = self.serializer_class(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Room Not Found: Invalid room code"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request: Code Parameter Not Found In Request"}, status=status.HTTP_400_BAD_REQUEST)

    


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data = request.data)

        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

class JoinRoom(APIView):
    lookup = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        code = request.data.get(self.lookup)
        print(code)
        if code != None:
            room_result = Room.objects.filter(code=code)

            if len(room_result) > 0:
                #room = room_result[0]
                self.request.session['room-code'] = code
                return Response({'message' : 'Room Found!'}, status=status.HTTP_200_OK)
            return Response({'message' : 'Room Not Found!'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request' : 'Code key not provided'}, status=status.HTTP_400_BAD_REQUEST)
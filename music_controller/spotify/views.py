from django.shortcuts import render, redirect
from music_controller.settings import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room

class AuthURL(APIView):
    def get(self, request):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url':url}, status=status.HTTP_200_OK)

def spotify_callback(request):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()
    
    update_or_create_user_tokens(request.session.session_key, access_token, refresh_token, token_type, expires_in)

    return redirect('frontend:')

class IsAuthenticated(APIView):

    def get(self, request):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
    
    def get(self, request):
        
        
        room_code = self.request.session.get('room_code')
        queryset = Room.objects.filter(code=room_code)
        
        if queryset.exists():
            room = queryset.first()
        else:
           
            print(room_code)
            return Response({"ROOM NOT FOUND": room_code}, status=status.HTTP_404_NOT_FOUND)
        
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)
        
        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        title = item.get('name')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')
        artist_string = ""

        for i,artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            
            name = artist.get('name')
            artist_string += name

        song = {

            'title' : title,
            'artist' : artist_string,
            'duration' : duration,
            'time' : progress,
            'image_url' : album_cover,
            'is_playing' : is_playing,
            'votes' : 0,
            'id' : song_id
        }

        return Response(song, status=status.HTTP_200_OK)

class PlayPause(APIView):
    def put(self, request):
        is_playing = request.data.get('is_playing')
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if(room.host == self.request.session.session_key or room.guest_can_pause):
            if(is_playing):
                endpoint = "player/pause"
            else: endpoint = "player/play"

            execute_spotify_api_request(room.host, endpoint, put_=True)
            return Response({}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class SkipNext(APIView):
    def put(self, request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if(room.host == self.request.session.session_key or room.guest_can_pause):
            execute_spotify_api_request(room.host, "player/next", post_=True)
            return Response({}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_403_FORBIDDEN)



class SkipPrev(APIView):
    def put(self, request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if(room.host == self.request.session.session_key or room.guest_can_pause):
            execute_spotify_api_request(room.host, "player/previous", post_=True)
            return Response({}, status=status.HTTP_200_OK)
        return Response({}, status=status.HTTP_403_FORBIDDEN)
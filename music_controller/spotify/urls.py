from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('play-pause', PlayPause.as_view()),
    path('skip-next', SkipNext.as_view()),
    path('skip-prev', SkipPrev.as_view()),
]

from django.urls import path
from recommender.views import career_views as views

urlpatterns = [
    path('', views.getCareers, name='get-careers'),
    path('points/', views.getCareersWithPoints, name='get-careers-with-points'),
    path('component/<str:letterCode>', views.getCareersByPersonalityComponent, name='get-career-by-component')
]
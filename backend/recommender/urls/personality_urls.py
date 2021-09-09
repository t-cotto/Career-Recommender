from django.urls import path
from recommender.views import personality_views as views

urlpatterns = [
    path('<str:personalityCode>', views.getPersonalityType, name='personality-type'),
    path('user/', views.getPersonalityTypeByUserId, name='personality-type-user-id')
]
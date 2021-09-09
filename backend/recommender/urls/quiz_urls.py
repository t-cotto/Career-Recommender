from django.urls import path
from recommender.views import quiz_views as views

urlpatterns = [
    path('questions/<int:setNo>/', views.getQuestionSet, name='question-set'),
    path('responses/', views.registerUserResponse, name='register-response' ),
    path('responses/user', views.registerLoggedUserResponse, name='register-logged-user-response')
]
from rest_framework.decorators import api_view
from rest_framework.response import Response
from recommender.serializers import UserSerializerWithToken
from ..models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status 
from datetime import datetime
from django.db import IntegrityError

#Function to post the creation of a new user account to the database
@api_view(['Post'])
def registerUser(request) :
    data = request.data
    user = None 

    try :
        user = CustomUser.objects.create_user(
            email = data['email'],
            password=data['password'],
            firstName = data['firstName'],
            lastName = data['lastName'],
            dob = datetime.strptime(data['dob'], '%Y-%m-%d')
        )
        
        #If the user posts their response including previously taken quiz then post these quiz results to the database.
        if data.keys() >= {'userAnswers', 'personalityCode', 'quizDate'} :
            user.updateUserQuizScores(data['personalityCode'], data['userAnswers'], quizDate=datetime.strptime(data['quizDate'], '%Y-%m-%dT%H:%M:%S.%fZ'))

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except IntegrityError :
        message = {'detail' : 'User with that email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        message = {'detail' : str(e)}

         #Delete the created user if the registration with quiz data failed
        if isinstance(user, CustomUser) :
            user.delete()
        
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

#Class to return the users token with unencrypted userinfo, Implemented as a class based view as opposed to functional view to follow SimpleJWT document guidelines.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for key,value in serializer.items():
            data[key] = value

        return data

#Class view for returning user info alongside authentication token credentials.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
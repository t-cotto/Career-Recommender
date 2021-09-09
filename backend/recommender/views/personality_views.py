from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from recommender.models import PersonalityType
from rest_framework import status
from recommender.serializers import PersonalityTypeSerializer

#Utility function to call database for personality type with specified code and return the response.
def fetchAndReturnPersonalityType(personalityCode) :
    personalityType = PersonalityType.objects.get(typeCode=personalityCode)
    serializer = PersonalityTypeSerializer(personalityType)

    return Response(serializer.data)

#Function to get the personality type full description using the given code
@api_view(['Get'])
def getPersonalityType(request,personalityCode) :
    try :
        return fetchAndReturnPersonalityType(personalityCode)
    except Exception as e:
        message = {'detail' : str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

#Function to get the personality type of the passed in user.  
@api_view(['Get'])
@permission_classes([IsAuthenticated])
def getPersonalityTypeByUserId(request) :
    try : 
        #Get the user from the access token passed, prevent users gaining access to another user through their own authentication token.
        user = request.user
        return fetchAndReturnPersonalityType(str(user.personalityType))

    except Exception as e :
        message = {'detail': str(e)}
        return Response(message, status= status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from recommender.models import Career, PersonalityType, PersonalityComponent
from recommender.serializers import CareerModelSerializer
from rest_framework import status
from ..recommender_system import calculateMatchScore
from rest_framework.permissions import IsAuthenticated

# Function to search the database for the careers that match the personality code
def findCareersByTypecode(typecode) : 
    personalityType = PersonalityType.objects.get(typeCode=typecode)
    careers = Career.objects.filter(associatedPersonalityType=personalityType)

    if not careers.exists() :
        raise Exception('No careers with that personality type have been found in the database')
    else :
        return careers

#Function to search the database for all the careers that have a matching personality type to the passed in code.
@api_view(['Get'])
def getCareers(request) :
    try :
        typeCode = request.GET.get('typeCode', '')
        
        if typeCode == '' :
            careers = Career.objects.all()
        else :
            careers = findCareersByTypecode(typeCode)

        serializer = CareerModelSerializer(careers, many=True)
    
        return Response(serializer.data)

    except Exception as e:
        message = {'detail' : str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

# Function for finding career matches for the passed in user and calculating the match score. 
@api_view(['Get'])
@permission_classes([IsAuthenticated])
def getCareersWithPoints(request) :
    try :
        user = request.user

        if user.personalityType == None :
            raise Exception('This user has no personality results for recommendation, please take the test')
        
        userAnswerData = {
            'extraversion' : user.extraversionScore,
            'sensing' : user.sensingScore,
            'thinking' : user.thinkingScore,
            'perceiving' : user.perceivingScore
        }
        
        careers = findCareersByTypecode(str(user.personalityType))
        serializer = CareerModelSerializer(careers, many=True)

        #Calculate the match strength between user and career match using recommender algorithm function
        for match in serializer.data :
            match['matchScore'] = calculateMatchScore(match, userAnswerData)

        return Response(serializer.data)

    except Exception as e:
        message = {'detail' : str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

#Function to return careers with personality type containing the passed in singular component. 
@api_view(['Get'])
def getCareersByPersonalityComponent(request, letterCode) :
    try :
        component = PersonalityComponent.objects.get(letterCode = letterCode)
        personalityTypes = PersonalityType.objects.filter(associatedComponents=component._id)
        foundCareers = []

        for personalityType in personalityTypes:
            foundCareers += findCareersByTypecode(personalityType.typeCode)

        if len(foundCareers) == 0:
            raise Exception('No careers found matching this component')

        serializer = CareerModelSerializer(foundCareers, many=True)
        return Response(serializer.data)

    except Exception as e:
        message = {'detail' : str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
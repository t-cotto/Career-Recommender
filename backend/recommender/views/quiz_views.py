from datetime import datetime
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from recommender.models import Question
from recommender.serializers import QuestionSerializer
from rest_framework import status
from recommender.util import quiz_views_utils as util

#Function to search the database for the passed in set number. Returns the list of questions for that question set.   
@api_view(['Get'])
def getQuestionSet(request,setNo):
    try :
        questionSet = Question.objects.filter(questionSetNumber=setNo)

        if questionSet.exists() == 0:
            raise Exception('There is no questions associated with that set number')
        
        serializer = QuestionSerializer(questionSet, many=True)

        return Response(serializer.data)

    except Exception as e:
        message = {'detail' : str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

#Function to return the users calculated personality type. 
@api_view(['Post'])
def registerUserResponse(request) :
    data = request.data
    try :
        quizScore = util.unpackQuizDetails(data)
        personalityCode = util.calculatePersonalityCode(quizScore)

        return Response({'personalityCode': personalityCode, 'quizDate' : datetime.now(tz=timezone.utc)})

    except KeyError as ke :
        message = {'message': 'No key found for ' + str(ke)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST) 
    except ValueError as ve :
        message = {'message': 'Incorrect value passed to factor data, error= ' + str(ve)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)    
    except Exception as e:
        message = {'detail' : str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

#Function to calculate a logged in user results and store them in the database
@api_view(['Post'])
@permission_classes([IsAuthenticated])
def registerLoggedUserResponse(request) :
    data = request.data
    user=request.user

    try :
        quizScore = util.unpackQuizDetails(data)

        personalityCode = util.calculatePersonalityCode(quizScore)
        user.updateUserQuizScores(personalityCode, quizScore, quizDate=datetime.now())

        return Response({'personalityCode': str(user.personalityType), 'quizDate' : user.quizDate})

    except KeyError as ke :
        message = {'message': 'No key found for ' + str(ke)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST) 
    except ValueError as ve :
        message = {'message': 'Incorrect value passed to factor data, error= ' + str(ve)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)    
    except Exception as e:
        message = {'detail' : str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
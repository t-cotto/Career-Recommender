from django.test import TestCase, Client, tag
from django.urls import reverse
from ..models import Question, QuestionSet
from ..serializers import *
from datetime import datetime, time, tzinfo
from django.utils import timezone


client = Client()

#Test class to Test the get_question_set view
@tag('id:1')
@tag('TestQuestionGetView')
class QuestionGetTestCase(TestCase):
    questionSet = None
    
    def setUp(self):
        self.questionSet = QuestionSet.objects.create()

        Question.objects.create(
            personalityFactor = 'extraversion',
            multiplier=1,
            questionContent = "test quiz views question 1",
            questionSetNumber = self.questionSet
        )

        Question.objects.create(
            personalityFactor = 'sensing',
            multiplier=1,
            questionContent = "test quiz views question 2",
            questionSetNumber = self.questionSet
        )
       
# Test to handle a successfull get question using a valid setNumber and no questions
    def testGetQuestionSetSuccessEmpty(self):
        QuestionSet.objects.create()

        response = client.get(reverse('question-set', kwargs={'setNo': 2}))
        self.assertEqual({'detail' : 'There is no questions associated with that set number'}, response.data)

#Test to handle a successful get question using a valid questionSetNumber and some questions
    def testGetQuestionSuccessFull(self):
        
        response = client.get(reverse('question-set', kwargs={'setNo': 1}))
        questions = Question.objects.filter(questionSetNumber=1)
        serializer = QuestionSerializer(questions, many=True)
        self.assertEqual(response.data, serializer.data)

#Test to handle the passing of an Invalid set number to the view 
    def testGetQuestionSetInvlaidSetNumber(self):
        response = client.get(reverse('question-set', kwargs={'setNo': 99}))
        self.assertEqual(response.data, {'detail' : 'There is no questions associated with that set number'})


@tag('id:1')
@tag('id:19')
@tag('TestUserQuizResponseView')
class TestUserQuizResponse(TestCase) :
    extrovertComponent = None
    sensingComponent = None
    thinkingComponent = None
    perceivingComponent = None
    introvertComponent = None

    def setUp(self) :
        self.extrovertComponent = PersonalityComponent.objects.create(
            letterCode = 'E',
            description = 'example description',
            title = 'Extrovert'
        )

        self.sensingComponent = PersonalityComponent.objects.create(
            letterCode = 'S',
            description = 'example description',
            title = 'Sensing'
        )

        self.thinkingComponent = PersonalityComponent.objects.create(
            letterCode = 'T',
            description = 'example description',
            title = 'Thinking'
        )

        self.perceivingComponent = PersonalityComponent.objects.create(
            letterCode = 'P',
            description = 'example description',
            title = 'Perceptive'
        )

        self.introvertComponent = PersonalityComponent.objects.create(
            letterCode = 'I', 
            description = 'example description',
            title = 'Introvert'
        )

        PersonalityType.objects.create(
            typeCode = 'ESTP',
            personalityDescription = 'this is an example description',
            personalityTitle = 'this is an example title'
        )

        PersonalityType.objects.create(
            typeCode='ISTP',
            personalityDescription = 'example description',
            personalityTitle = 'example personality title'
        )

        PersonalityType.objects.get(typeCode='ISTP').associatedComponents.add(self.introvertComponent, self.sensingComponent, self.thinkingComponent, self.perceivingComponent)
        PersonalityType.objects.get(typeCode='ESTP').associatedComponents.add(self.extrovertComponent, self.sensingComponent, self.thinkingComponent, self.perceivingComponent)

    #Test to handle a successful posting of the data and producing the correct personality type and response
    def testSuccessfulResponse(self) :
        currentDateTime = datetime.now(tz=timezone.utc)
        postData = {
            'extraversion': 1,
            'sensing' : 1,
            'thinking' : 1,
            'perceiving' : 1,
            
        }
        response = client.post(reverse('register-response'), postData, content_type='application/json')
        responseDateTime = response.data['quizDate']
        response.data['quizDate'] = responseDateTime.date()
        expectedResult = {
            "personalityCode": "ESTP",
            'quizDate' : currentDateTime.date()
        }
        self.assertEqual(response.data, expectedResult)
        self.assertEqual(responseDateTime.hour, currentDateTime.hour)
        self.assertEqual(responseDateTime.minute, currentDateTime.minute)
    #Test to handle successful API response using negative factor
    def testSuccessfulResponseWithNegativeFactor(self) :
        currentDateTime = datetime.now(tz=timezone.utc)
        postData = {
            'extraversion' : -1,
            'sensing' : 1,
            'thinking' : 1,
            'perceiving' : 1
        }

        response = client.post(reverse('register-response'), postData, content_type='application/json')
        responseDateTime = response.data['quizDate']
        response.data['quizDate'] = responseDateTime.date()

        expectedResult = {
            "personalityCode": "ISTP",
            'quizDate' : currentDateTime.date()
        }
     
        self.assertEqual(response.data, expectedResult)
        self.assertEqual(responseDateTime.hour, currentDateTime.hour)
        self.assertEqual(responseDateTime.minute, currentDateTime.minute)
    #Test to ensure exception is thrown when one of the factors is missing 
    def testIncorrectFactorThrowsError(self) :
        postData = {
            'wrong': 1,
            'sensing' : 1,
            'thinking' : 1,
            'perceiving' : 1
        }

        response = client.post(reverse('register-response'), postData, content_type='application/json')
        expectedResponse = {'message': "No key found for 'extraversion'"}
        self.assertEqual(response.data, expectedResponse)

    #Testing that a value error is thrown and caught when incorrect value
    def testIncorrectDataThrowsError(self) :
        postData = {
            'extraversion': 1,
            'sensing' : 1,
            'thinking' : 'wrong',
            'perceiving' : 1
        }

        response = client.post(reverse('register-response'), postData, content_type='application/json')
        expectedResponse = {'message': "Incorrect value passed to factor data, error= invalid literal for int() with base 10: 'wrong'"}
        self.assertEqual(response.data, expectedResponse)


@tag('id:1')
@tag('id:13')
@tag('TestLoggedUserQuizResponseView')
class TestLoggedUserQuizResponse(TestCase) :

    extrovertComponent = None
    sensingComponent = None
    thinkingComponent = None
    perceivingComponent = None
    introvertComponent = None
    user = None
    auth_headers = None

    def setUp(self) :
        self.extrovertComponent = PersonalityComponent.objects.create(
            letterCode = 'E',
            description = 'example description',
            title = 'Extrovert'
        )

        self.sensingComponent = PersonalityComponent.objects.create(
            letterCode = 'S',
            description = 'example description',
            title = 'Sensing'
        )

        self.thinkingComponent = PersonalityComponent.objects.create(
            letterCode = 'T',
            description = 'example description',
            title = 'Thinking'
        )

        self.perceivingComponent = PersonalityComponent.objects.create(
            letterCode = 'P',
            description = 'example description',
            title = 'Perceptive'
        )

        self.introvertComponent = PersonalityComponent.objects.create(
            letterCode = 'I', 
            description = 'example description',
            title = 'Introvert'
        )

        PersonalityType.objects.create(
            typeCode = 'ESTP',
            personalityDescription = 'this is an example description',
            personalityTitle = 'this is an example title'
        )

        PersonalityType.objects.create(
            typeCode='ISTP',
            personalityDescription = 'example description',
            personalityTitle = 'example personality title'
        )

        PersonalityType.objects.get(typeCode='ISTP').associatedComponents.add(self.introvertComponent, self.sensingComponent, self.thinkingComponent, self.perceivingComponent)
        PersonalityType.objects.get(typeCode='ESTP').associatedComponents.add(self.extrovertComponent, self.sensingComponent, self.thinkingComponent, self.perceivingComponent)

        self.user = CustomUser.objects.create_user(
            email = 'example@email.com',
            password = 'examplepass',
            firstName = 'example',
            lastName = 'example',
            dob = datetime(2021,7,13),
            personalityType = None,
            extraversionScore = 0,
            sensingScore = 0,
            thinkingScore = 0, 
            perceivingScore = 0,
        )
        token = RefreshToken.for_user(self.user)
        self.auth_headers = {
            'HTTP_AUTHORIZATION' : 'Bearer ' + str(token.access_token)
        }

    #Test that user info successfully updated by view
    def testUserUpdateIfUserSignedIn(self) :

        postData = {
            'extraversion': 5,
            'sensing' : 5,
            'thinking' : 5,
            'perceiving' : 5,
            'userId' : self.user._id,
        }

        client.post('/api/quiz/responses/user', postData, **self.auth_headers, content_type='application/json')
        user = CustomUser.objects.get(email='example@email.com')

        self.assertEqual(user.personalityType.__str__(), 'ESTP')
        self.assertEqual(user.extraversionScore, 5)
        self.assertEqual(user.sensingScore, 5)
        self.assertEqual(user.thinkingScore, 5)
        self.assertEqual(user.perceivingScore, 5)
        self.assertEqual(user.quizDate.date(), datetime.today().date())
        self.assertEqual(user.quizDate.hour, datetime.now(tz=timezone.utc).hour)
        self.assertEqual(user.quizDate.minute, datetime.now(tz=timezone.utc).minute)

    #Test to handle a successful posting of the data and producing the correct personality type and response
    def testSuccessfulResponse(self) :
        currentDateTime = datetime.now(tz=timezone.utc)
        postData = {
            'extraversion': 1,
            'sensing' : 1,
            'thinking' : 1,
            'perceiving' : 1,
            'userId' : self.user._id
            
        }
        response = client.post('/api/quiz/responses/user', postData, **self.auth_headers, content_type='application/json')
        responseDateTime = response.data['quizDate']
        response.data['quizDate'] = responseDateTime.date()
        expectedResult = {
            "personalityCode": "ESTP",
            'quizDate' : currentDateTime.date()
        }
        self.assertEqual(response.data, expectedResult)
        self.assertEqual(responseDateTime.hour, currentDateTime.hour)
        self.assertEqual(responseDateTime.minute, currentDateTime.minute)


    #Test to handle successful API response using negative factor
    def testSuccessfulResponseWithNegativeFactor(self) :
        currentDateTime = datetime.now(tz=timezone.utc)
        postData = {
            'extraversion' : -1,
            'sensing' : 1,
            'thinking' : 1,
            'perceiving' : 1,
            'userId' : self.user._id
        }

        response = client.post('/api/quiz/responses/user', postData, **self.auth_headers, content_type='application/json')
        responseDateTime = response.data['quizDate']
        response.data['quizDate'] = responseDateTime.date()

        expectedResult = {
            "personalityCode": "ISTP",
            'quizDate' : currentDateTime.date()
        }
     
        self.assertEqual(response.data, expectedResult)
        self.assertEqual(responseDateTime.hour, currentDateTime.hour)
        self.assertEqual(responseDateTime.minute, currentDateTime.minute)

    #Test to ensure exception is thrown when one of the factors is missing 
    def testIncorrectFactorThrowsError(self) :
        postData = {
            'wrong': 1,
            'sensing' : 1,
            'thinking' : 1,
            'perceiving' : 1,
            'userId' : self.user._id
        }

        response = client.post('/api/quiz/responses/user', postData, **self.auth_headers, content_type='application/json')
        expectedResponse = {'message': "No key found for 'extraversion'"}
        self.assertEqual(response.data, expectedResponse)

    #Testing that a value error is thrown and when incorrect value
    def testIncorrectDataThrowsError(self) :
        postData = {
            'extraversion': 1,
            'sensing' : 1,
            'thinking' : 'wrong',
            'perceiving' : 1,
            'userId' : self.user._id
        }

        response = client.post('/api/quiz/responses/user', postData, **self.auth_headers, content_type='application/json')
        expectedResponse = {'message': "Incorrect value passed to factor data, error= invalid literal for int() with base 10: 'wrong'"}
        self.assertEqual(response.data, expectedResponse)
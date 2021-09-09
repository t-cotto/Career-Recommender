from django.test import TestCase, Client, tag
from django.urls import reverse
from ..models import CustomUser, PersonalityType
from ..serializers import *
import datetime
import json
client = Client()

@tag('id:33')
@tag('RegisterUserView')
#Test class for the register user view. 
class RegisterUserTestCase(TestCase) :

    #Test a successful registration of the user with correct fields
    def testSuccessfulRegistration(self) :
        postData = {
            'email' : 'example@email.com',
            'password' : 'examplepass',
            'firstName': 'example',
            'lastName' : 'user',
            'dob' : '1997-08-01'
        }

        response = client.post(reverse('register-user'), postData)
        expectedResult = {
            '_id' : 1,
            'email': 'example@email.com',
            'firstName' : 'example',
            'lastName' : 'user',
            'dob' : datetime.datetime(1997,8,1, 0, 0 )
        }

        self.assertEqual(response.data['email'], expectedResult['email'])
        self.assertEqual(response.data['firstName'], expectedResult['firstName'])
        self.assertEqual(response.data['lastName'], expectedResult['lastName'])
        self.assertEqual(response.data['dob'], expectedResult['dob'])
        self.assertIn('token', response.data,)

    #Test that error is correctly thrown and handled when data is missing
    def testErrorIsThrownAndHandledWhenDataMissing(self) :
        postData = {
            'email' : 'example@email.com',
            'password' : 'examplepass',
            'lastName' : 'user',
            'dob' : '01/08/97'
        }

        response = client.post(reverse('register-user'), postData)
        self.assertEqual(response.data, {'detail': "'firstName'"})
        
    # Test that username integrity error sends fail response with correct error message
    def testUserNameIntegrity(self) :

        CustomUser.objects.create(email='example@email.com', firstName= 'example', lastName='user', dob= datetime.datetime(1997,8,1, 0, 0 ))
        postData = {
            'email' : 'example@email.com',
            'password' : 'examplepass',
            'firstName': 'example',
            'lastName' : 'user',
            'dob' : '1997-08-01'
        }

        response = client.post(reverse('register-user'), postData)
        expectedResponse = {'detail': 'User with that email already exists'}
        self.assertEqual(response.data, expectedResponse)

    #Test that user answers are successfully posted to database on registration 
    def testSuccessfulRegisterWithQuizResults(self) :
        
        PersonalityType.objects.create(typeCode='ESTP')
        postData = {
            'email' : 'example@email.com',
            'password' : 'examplepass',
            'firstName': 'example',
            'lastName' : 'user',
            'dob' : '1997-08-01',
            'personalityCode' : 'ESTP',
            'userAnswers' : { "extraversion" : 5, "sensing" : 5, "thinking" : 5, "perceiving" : 5 },
            'quizDate' : '2021-08-10T10:30:00.000001Z' 
        }

        response = client.post('/api/user/register/', postData, content_type='application/json')
 
        self.assertEqual(response.data['personalityType'], 'ESTP')
        self.assertEqual(response.data['quizDate'], '2021-08-10T09:30:00.000001Z')

    #Test when user answers are posted with an incorrect datetime that an error occurs and that the user instance is deleted
    def testFailureWithIncorrectDateTime(self) :

        PersonalityType.objects.create(typeCode='ESTP')
        invalidDate = datetime.datetime.now() + datetime.timedelta(days=1)
        postData = {
            'email' : 'exampleFail@email.com',
            'password' : 'examplepass',
            'firstName': 'example',
            'lastName' : 'user',
            'dob' : '1997-08-01',
            'personalityCode' : 'ESTP',
            'userAnswers' : { "extraversion" : 5, "sensing" : 5, "thinking" : 5, "perceiving" : 5 },
            'quizDate' : invalidDate.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        }

        
        response = client.post(reverse('register-user'), postData, content_type='application/json')
        self.assertEqual(response.data, {'detail': 'Cannot Have quiz date greater than the current date'})

        #Assert that queting database for non existant user happens, as the stored user info minus the quiz data will be deleted if an exception occurs in quiz date
        with self.assertRaises(expected_exception=Exception) :
            CustomUser.objects.get(email='exampleFail@email.com')

    #Test that the users personality results are not stored and returned if 1 piece of the quiz data is missing. 
    def testNoQuizResultsAreAddedWhenMissingQuizData(self) :

        PersonalityType.objects.create(typeCode='ESTP')
        postData = {
            'email' : 'exampleFail@email.com',
            'password' : 'examplepass',
            'firstName': 'example',
            'lastName' : 'user',
            'dob' : '1997-08-01',
            'personalityCode' : 'ESTP',
            'userAnswers' : { "extraversion" : 5, "sensing" : 5, "thinking" : 5, "perceiving" : 5 },
        }

        response = client.post(reverse('register-user'), postData, content_type='application/json')

        self.assertEqual(response.data['personalityType'], None )
        


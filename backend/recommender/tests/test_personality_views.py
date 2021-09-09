from django import http
from django.http import response
from django.test import TestCase, Client, tag
from django.urls import reverse
from ..models import PersonalityComponent, PersonalityType
from ..serializers import *
import datetime

client = Client()

#Test class to Test the get_question_set view
@tag('id:2')
@tag('id:12')
@tag('TestPersonalityTypeGetView')
class PersonalityGetTestCase(TestCase):
    personalityType = None
    extraversion = None
    sensing = None
    thinking = None
    perceiving = None

    def setUp(self) :

        self.extraversion = PersonalityComponent.objects.create(
                letterCode = 'E',
                description = 'This is an example description for an extrovert'
       )
        self.sensing = PersonalityComponent.objects.create(
                letterCode = 'S',
                description = 'This is an example description for a sensing person'
       )
        self.thinking = PersonalityComponent.objects.create(
                letterCode = 'T',
                description = 'This is an example description for a thinking person'
       )
        self.perceiving = PersonalityComponent.objects.create(
                letterCode = 'P',
                description = 'This is an example description for a perceptive person'
       )

        self.personalityType = PersonalityType.objects.create(
            typeCode='ESTP',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )
        self.personalityType.associatedComponents.add(self.extraversion, self.sensing, self.thinking, self.perceiving)


# Test to handle getting full personality type description using correct personality code
    def testGetPersonalityTypeSuccess(self):
        response = client.get(reverse('personality-type', kwargs={'personalityCode': 'ESTP'}))
        serializer = PersonalityTypeSerializer(self.personalityType)
        self.assertEqual(serializer.data, response.data)
        

#Test to get a personality type using an incorrect code
    def testGetPersonalityTypeIncorrectCode(self):
        response = client.get(reverse('personality-type', kwargs={'personalityCode': 'ESTZ'}))
        self.assertEqual(response.data, {"detail": "PersonalityType matching query does not exist."})

#Test suite for the get personality by user id view. 
@tag('id:2')
@tag('id:12')
@tag('GetPersonalityByUserId')
class PersonalityGetByUserId(TestCase) :
    personalityType = None
    extraversion = None
    sensing = None
    thinking = None
    perceiving = None
    user = None
    auth_header = None

    def setUp(self) :

        self.extraversion = PersonalityComponent.objects.create(
                letterCode = 'E',
                description = 'This is an example description for an extrovert'
       )
        self.sensing = PersonalityComponent.objects.create(
                letterCode = 'S',
                description = 'This is an example description for a sensing person'
       )
        self.thinking = PersonalityComponent.objects.create(
                letterCode = 'T',
                description = 'This is an example description for a thinking person'
       )
        self.perceiving = PersonalityComponent.objects.create(
                letterCode = 'P',
                description = 'This is an example description for a perceptive person'
       )

        self.personalityType = PersonalityType.objects.create(
            typeCode='ESTP',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )
        self.personalityType.associatedComponents.add(self.extraversion, self.sensing, self.thinking, self.perceiving)

        self.user = CustomUser.objects.create_user(
            email = 'example@email.com',
            password = 'examplepass',
            firstName = 'example',
            lastName = 'career user',
            dob = datetime.datetime(2021,7,13),
            personalityType = self.personalityType,
            extraversionScore = 5,
            sensingScore = 5,
            thinkingScore = 5, 
            perceivingScore = 5,
        )
        token = RefreshToken.for_user(self.user)
        self.auth_headers = {
            'HTTP_AUTHORIZATION' : 'Bearer ' + str(token.access_token)
        }

# Test to handle getting full personality type description using correct user id
    def testGetPersonalityTypeSuccess(self):
        response = client.get('/api/personalities/user/', **self.auth_headers)
        serializer = PersonalityTypeSerializer(self.personalityType)
        self.assertEqual(serializer.data, response.data)
        
# Test that exception is thrown and handled when there is an authentication error
    def testGetWithoutAuthenticationHeader(self) :
        response = client.get('/api/personalities/user/')
        self.assertEqual(str(response.data['detail']), 'Authentication credentials were not provided.')
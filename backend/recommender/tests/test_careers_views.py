from django.http import response
from django.test import TestCase, Client, tag
from django.urls import reverse
from ..models import PersonalityType, Sector, Career, CustomUser, PersonalityComponent
from ..serializers import *
import datetime
from recommender.views import career_views

client = Client()

@tag('id:2')
@tag('id:5')
@tag('CareerGet')
#test case for the getCareers view
class TestCareerGet(TestCase) :

    career = None

    def setUp(self) :
        sector = Sector.objects.create(
            sectorName ='test sector',
            sectorDescription='test description',
            associatedIcon = 'icon-associated',
            associatedColour = 'test colour'
        )

        personalityType = PersonalityType.objects.create(
            typeCode='ESTP',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )
        PersonalityType.objects.create(
            typeCode='ISTP',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )

        self.career = Career.objects.create(
            careerTitle='test career',
            careerDescription= 'test description',
            associatedSector = sector,
            extraversionScore = 10,
            sensingScore = 10,
            thinkingScore = 10,
            perceivingScore = 10,
            associatedPersonalityType= personalityType,
            avgSalary = 28000,
            associatedImage = 'placeholder.png'
        )

    #Test case for get career with a correct parameter
    def testSuccessfulGetCareerWithParam(self) :
        response = client.get(reverse('get-careers'), {'typeCode' : 'ESTP'})
        careers = Career.objects.all()
        serializer = CareerModelSerializer(careers, many=True)

        self.assertEqual(response.data, serializer.data)

    #Test case for get a career when there is no query params
    def testSuccessfulGetWithoutParam(self) :
        response = client.get(reverse('get-careers'))
        careers = Career.objects.all()
        serializer = CareerModelSerializer(careers, many=True)

        self.assertEqual(response.data, serializer.data)

@tag('id:3')
@tag('id:5')
@tag('CareerGetWithPoints')
class TestCareersGetWithPoints(TestCase) :
    user = None
    personalityType = None
    sector = None
    user2 = None
    auth_headers = None
    auth_headers_user_2 = None

    def setUp(self):
        self.sector = Sector.objects.create(
            sectorName ='test sector',
            sectorDescription='test description',
            associatedIcon = 'icon-associated',
            associatedColour = 'test colour'
        )

        self.personalityType = PersonalityType.objects.create(
            typeCode='ESTP',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )

        career = Career.objects.create(
            careerTitle='test career',
            careerDescription= 'test description',
            associatedSector = self.sector,
            extraversionScore = 5,
            sensingScore = 5,
            thinkingScore = 5,
            perceivingScore = 5,
            associatedPersonalityType= self.personalityType,
            avgSalary = 28000,
            associatedImage = 'placeholder.png'
        )

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

        self.user2 = CustomUser.objects.create_user(
            email = 'example2@email.com',
            password = 'examplepass',
            dob = datetime.datetime(2021,7,13),
        )

        token = RefreshToken.for_user(self.user)
        self.auth_headers = {
            'HTTP_AUTHORIZATION' : 'Bearer ' + str(token.access_token)
        }

        token2 = RefreshToken.for_user(self.user2)
        self.auth_headers_user_2 = {
            'HTTP_AUTHORIZATION' : 'Bearer ' + str(token2.access_token)
        }

    #Test case for get career with a correct user id. 
    def testSuccessfulGetCareerWithParam(self) :
        response = client.get('/api/careers/points/', **self.auth_headers)
        careers = Career.objects.filter(associatedPersonalityType= self.personalityType)
        serializer = CareerModelSerializer(careers, many=True)
        serializer.data[0]['matchScore'] = 100

        self.assertEqual(response.data, serializer.data)


    #Test case for get recommendations when user has not completed the quiz and has no personality score. 
    def testGetCareerWhenUserHasNoQuizScore(self) :
        response = client.get('/api/careers/points/', **self.auth_headers_user_2)
        self.assertEqual(response.data, {'detail': 'This user has no personality results for recommendation, please take the test'})

    #Test case for failed authentication 
    def testFailedAuthentication(self) :
        response = client.get('/api/careers/points/')
        self.assertEqual(str(response.data['detail']), 'Authentication credentials were not provided.')

#Test suite for the get careers utility function in user views
@tag('TestFindCareersByTypecode')
class TestFindCareersByTypecode(TestCase) :
    career = None

    def setUp(self) :
        sector = Sector.objects.create(
            sectorName ='test sector',
            sectorDescription='test description',
            associatedIcon = 'icon-associated',
            associatedColour = 'test colour'
        )
        
        personalityType = PersonalityType.objects.create(
            typeCode='ESTP',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )

        self.career = Career.objects.create(
            careerTitle='test career',
            careerDescription= 'test description',
            associatedSector = sector,
            extraversionScore = 10,
            sensingScore = 10,
            thinkingScore = 10,
            perceivingScore = 10,
            associatedPersonalityType= personalityType,
            avgSalary = 28000,
            associatedImage = 'placeholder.png'
        )
    
    #Test successful get career with a valid typecode
    def testGetCareers(self) :
        careers = career_views.findCareersByTypecode('ESTP')
        self.assertEqual(careers.count(), 1)

    #Test case for get a career when there are no careers for the type code
    def testNoCareerForTypeCode(self) :
        with self.assertRaises(expected_exception=Exception) :
            career_views.findCareersByTypecode('ISTP')

# Test suite for the getCareerByComponentView
@tag('id:25')
@tag('TestGetCareerByComponent')
class TestGetCareersByComponent(TestCase) :
    personalityComponent = None
    personalityTypeA = None
    personalityTypeB = None
    careerA = None
    careerB = None

    def setUp(self) :
        self.personalityComponent = PersonalityComponent.objects.create(
           letterCode = 'E',
           description = 'This is an example description for an extrovert'
       ) 
        self.personalityTypeA = PersonalityType.objects.create(
            typeCode='ESTP',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )
        self.personalityTypeB = PersonalityType.objects.create(
            typeCode='ESTJ',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )
        self.personalityTypeA.associatedComponents.add(self.personalityComponent)
        self.personalityTypeA.save()
        self.personalityTypeB.associatedComponents.add(self.personalityComponent)
        self.personalityTypeB.save()
        sector = Sector.objects.create(
            sectorName ='test sector',
            sectorDescription='test description',
            associatedIcon = 'icon-associated',
            associatedColour = 'test colour'
        )

        self.careerA = Career.objects.create(
            careerTitle='test career a',
            careerDescription= 'test description',
            associatedSector = sector,
            extraversionScore = 10,
            sensingScore = 10,
            thinkingScore = 10,
            perceivingScore = 10,
            associatedPersonalityType= self.personalityTypeA,
            avgSalary = 28000,
            associatedImage = 'placeholder.png'
        )

        self.careerB = Career.objects.create(
            careerTitle='test career b',
            careerDescription= 'test description',
            associatedSector = sector,
            extraversionScore = 10,
            sensingScore = 10,
            thinkingScore = 10,
            perceivingScore = 10,
            associatedPersonalityType= self.personalityTypeB,
            avgSalary = 28000,
            associatedImage = 'placeholder.png'
        )

    #Test successful get careers by component
    def testGetCareersByComponentSuccessful(self) :
        response = client.get(reverse('get-career-by-component', kwargs={'letterCode' : 'E'}))
        careerList = []
        careerList.append(self.careerA)
        careerList.append(self.careerB)

        serializer = CareerModelSerializer(careerList, many=True)

        self.assertEqual(response.data, serializer.data)

    #Test exception is caught when invalid component is used
    def testGetCareerInvalidComponent(self) :
        response = client.get(reverse('get-career-by-component', kwargs={'letterCode' : 'Z'}))
        message = {'detail': 'PersonalityComponent matching query does not exist.'}
        self.assertEqual(response.data, message)

    #Test exception is thrown and caught when no careers with valid component are found
    def testGetCareerWithNoMatchingComponent(self) :
        PersonalityComponent.objects.create(
           letterCode = 'I',
           description = 'This is an example description for an introvert'
       )

        response = client.get(reverse('get-career-by-component', kwargs={'letterCode' : 'I'}))
        message = {'detail': 'No careers found matching this component'}
        self.assertEqual(response.data, message)
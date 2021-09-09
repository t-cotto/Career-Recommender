import unittest
from rest_framework import status
from django.test import TestCase, tag
from ..models import Question, QuestionSet, Sector, Career, PersonalityType, PersonalityComponent
from ..serializers import *

#Test case for the questions serializers involved in story id 1 
@tag('id:1')
@tag('QuestionSetSerializer')
@tag('QuestionSerializer')
class TestQuestionSerializer(TestCase):
    questionSet = None
    question1 = None
    question2 = None

    def setUp(self):
        self.questionSet = QuestionSet.objects.create(
        )

        self.question1 = Question.objects.create(
            personalityFactor = 'extraversion',
            multiplier=1,
            questionContent = 'test case 1',
            questionSetNumber = self.questionSet
        )

        self.question2 = Question.objects.create(
            personalityFactor = 'extraversion',
            multiplier=1,
            questionContent = 'test case 2',
            questionSetNumber = self.questionSet
        )
        
    #Test for the successful serialization of a full question object returning all fields (id=9 for the first question object)
    def testSuccessfulQuestionSerialisation(self):
        serializer = QuestionSerializer(self.question1)
        self.assertEqual(serializer.data,{'_questionId': self.question1._questionId, 'personalityFactor': self.question1.personalityFactor, 'multiplier': self.question1.multiplier, 'questionContent': self.question1.questionContent, 'questionSetNumber': self.questionSet._setId})
    

    #Test for the successful serialisation of a full question set
    def testQuestionSetSerializerSuccessFull(self):
        questions = Question.objects.filter(questionSetNumber=1)
        serializer = QuestionSerializer(questions, many=True)

        data = [{'_questionId': self.question1._questionId, 'personalityFactor': self.question1.personalityFactor, 'multiplier': self.question1.multiplier, 'questionContent': self.question1.questionContent, 'questionSetNumber':self.questionSet._setId},
        {'_questionId': self.question2._questionId, 'personalityFactor': self.question2.personalityFactor, 'multiplier': self.question2.multiplier, 'questionContent': self.question2.questionContent, 'questionSetNumber': self.questionSet._setId}
        ]

        self.assertEqual(serializer.data, data)

@tag('id:1')
@tag('PersonalityComponentSerializer')
class TestPersonalityComponentSerializer(TestCase):
    personalityComponent = None
    

    def setUp(self) :
        self.personalityComponent = PersonalityComponent.objects.create(
            letterCode = 'E',
            description = 'Example Description',
            title = 'Extrovert'
        )

    def testSuccessfulComponentSerialization(self) :
        
        data = {'letterCode' : 'E',
            'description' : 'Example Description',
            'title' : 'Extrovert'}
        serializer = PersonalityComponentSerializer(self.personalityComponent, many=False)

        self.assertEqual(serializer.data, data)

@tag('id:1')
@tag('PersonalityTypeSerializer')
class TestPersonalityTypeSerializer(TestCase):
    personalityType = None;
    extrovertComponent = None
    sensingComponent = None
    thinkingComponent = None
    perceivingComponent = None

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

        self.personalityType = PersonalityType.objects.create(
            typeCode = 'ESTP',
            personalityDescription = 'this is an example description',
            personalityTitle = 'this is an example title'
        )

        self.personalityType.associatedComponents.add(self.extrovertComponent, self.sensingComponent, self.thinkingComponent, self.perceivingComponent)

    #Test for the successful serialization of personality type
    def testSuccessfulPersonalityTypeSerialization(self) :
        serializer = PersonalityTypeSerializer(self.personalityType)
        data = {
            'typeCode' : 'ESTP',
            'personalityTitle' : 'this is an example title',
            'personalityDescription' : 'this is an example description',
            'associatedComponents' : [ {
                "letterCode": "E",
                "description": "example description",
                "title": "Extrovert"
            },
            {
                "letterCode": "S",
                "description": "example description",
                "title": "Sensing"
            },
            {
                "letterCode": "T",
                "description": "example description",
                "title": "Thinking"
            },
            {
                "letterCode": "P",
                "description": "example description",
                "title": "Perceptive"
            }]
        }

        self.assertEqual(serializer.data, data)

@tag('id:2')
@tag('CareerModelSerializer')
#Test case for the Career Default Serializer
class TestCareerSerializer(TestCase) :
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
            careerDescription='test description',
            associatedSector = sector,
            extraversionScore = 10,
            sensingScore = 10,
            thinkingScore = 10,
            perceivingScore = 10,
            associatedPersonalityType= personalityType,
            avgSalary = 28000,
            associatedImage ='placeholder.png'
        )

    #Test the successful serialization of a CareerModel
    def testSuccessfulSerialization(self) :

        serializer = CareerModelSerializer(self.career)
        data = {
            "associatedPersonalityType": "ESTP",
            "careerTitle": "test career",
            "careerDescription": "test description",
            "extraversionScore": 10,
            "sensingScore": 10,
            "thinkingScore": 10,
            "perceivingScore": 10,
            "avgSalary": 28000,
            "associatedImage": "/images/placeholder.png",
            "associatedSector": 1
        }

        self.assertEqual(data, serializer.data)





    

from django.db import IntegrityError
from django.test import TestCase, tag
from ..models import PersonalityComponent, PersonalityType
from django.db import transaction

#Class to test the personality factor model
@tag('id:1')
@tag('PersonalityFactor')
class TestPersonalityFactorModel(TestCase) :
    personalityComponent = None

    def setUp(self):
       self.personalityComponent = PersonalityComponent.objects.create(
           letterCode = 'E',
           description = 'This is an example description for an extrovert'
       ) 
    
    
    def testSuccessfulCreation(self):
        personalityComponent = PersonalityComponent.objects.get(_id= 1)
        self.assertEqual(personalityComponent.letterCode, 'E')
    
    # Title should automatically update based on the letter code passed in
    def testTitleFieldAutoFill (self) :
        self.assertEqual(self.personalityComponent.title, 'Extrovert')
    
    #An incorrect letter code should result in an exception being thrown
    def testIncorrectLetterCode (self) :
        try: 
            PersonalityComponent.objects.create(
                letterCode = 'Z',
                description= 'This test should fail'
        )
            self.fail('A duplicate was created')
        except Exception:
            pass
    
    #An exception should be thrown when attempting to create an object of a letter code that already exists
    def testDuplicateLetterCode(self) :
        with self.assertRaises(expected_exception=IntegrityError):
            with transaction.atomic():

                PersonalityComponent.objects.create(
                    letterCode = 'E',
                    description = 'This is an example description for an extrovert'
                ) 

    def tearDown(self):
        self.personalityComponent.delete()
            
    

@tag('id:1')
@tag('PersonalityType')
class TestPersonalityType(TestCase) :
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


    #Test the creation of personality type using no added factors
    def testSuccessfulCreation(self) :
        self.assertEqual(self.personalityType.personalityTitle, 'Example Title')

    #Test to ensure duplicates of the personality code cannot be added
    def testMultipleTypeCodesCreated(self):
        with self.assertRaises(expected_exception=IntegrityError):
            with transaction.atomic():
                PersonalityType.objects.create(
                typeCode='ESTP',
                personalityTitle = 'Example Title',
                personalityDescription = 'Example Description'
                )
    
    #Test the incorrect lengths of personality codes 
    def testIncorrectCodeLength(self) :
        with self.assertRaises(expected_exception=Exception) :
            PersonalityType.objects.create(
                typeCode='EST',
                personalityTitle = 'Example Title',
                personalityDescription = 'Example Description'
                )

        with self.assertRaises(expected_exception=Exception):
            PersonalityType.objects.create(
                typeCode='ESTPJ',
                personalityTitle = 'Example Title',
                personalityDescription = 'Example Description'
                )

    #Test the codes when they are not in correct order
    def testFactorInIncorrectPosition(self) :
        with self.assertRaises(expected_exception=Exception) :
            PersonalityType.objects.create(
                typeCode='STPE',
                personalityTitle = 'Example Title',
                personalityDescription = 'Example Description'
                )

        with self.assertRaises(expected_exception=Exception) :
            PersonalityType.objects.create(
                typeCode='ETSP',
                personalityTitle = 'Example Title',
                personalityDescription = 'Example Description'
                )
                
        with self.assertRaises(expected_exception=Exception) :
            PersonalityType.objects.create(
                typeCode='EITP',
                personalityTitle = 'Example Title',
                personalityDescription = 'Example Description'
                )

    #Test using an incorrect personality factor value
    def testInvalidCodeLetter(self) :
        with self.assertRaises(expected_exception=Exception) :
            PersonalityType.objects.create(
                typeCode='XSTP',
                personalityTitle = 'Example Title',
                personalityDescription = 'Example Description'
                )

    #Test the successful adding of personality components
    def testAddingComponentsToM2MRelationship(self) :
        self.personalityType.associatedComponents.add(self.extraversion, self.sensing, self.thinking, self.perceiving)
        self.assertEqual(self.personalityType.associatedComponents.count(), 4)
    
    #Test adding a duplicate personality component to a type
    def testaddingDuplicateComponent(self) :
        with self.assertRaises(expected_exception=Exception): 
            self.self.personalityType.associatedComponents.add(self.extraversion)
        


    def tearDown(self) :
        self.personalityType.delete()
        self.extraversion.delete()
        self.sensing.delete()
        self.thinking.delete()
        self.perceiving.delete()
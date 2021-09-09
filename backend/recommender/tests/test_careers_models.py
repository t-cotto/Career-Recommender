from django.test import TestCase, tag
from ..models import PersonalityType, Sector, Career


@tag('id:2')
@tag('SectorModel')
#Test for the sector creation model
class TestSectorModel(TestCase):

    sector = None
    def setUp(self):
        self.sector = Sector.objects.create(
            sectorName ='test sector',
            sectorDescription='test description',
            associatedIcon = 'icon-associated',
            associatedColour = 'test colour'
        )

    #test the suuccessful creation
    def testSuccessfulCreation(self) :
        testSector = Sector.objects.get(sectorName='test sector')
        self.assertEqual(testSector, self.sector)

    #test that a sector with a duplicate name can not be created
    def testDuplicateSectorCreated(self) :
        with self.assertRaises(expected_exception=Exception) : 
            Sector.objects.create(
                sectorName ='test sector',
                sectorDescription='test description',
                associatedIcon = 'icon-associated',
                associatedColour = 'test colour'
            )
    
    #test successful creation without image or colour
    def testNoColourOrIconSector(self) :
        try : 
            Sector.objects.create(
                    sectorName ='test sector 2',
                    sectorDescription='test description'
                )
            Sector.objects.get(sectorName='test sector 2')
        except Exception:
            self.fail()



@tag('id:2')
@tag('CareerModel')
#Test for Career Model
class TestCareerModel(TestCase) :

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

    #Test for the successful creation of the career object
    def testSuccessfulCreation(self) :
        testCareer = Career.objects.get(careerTitle = 'test career')
        self.assertEqual(self.career, testCareer)

    #Test that career can still be created with null=True fields
    def testSuccessfulCreationWithNullableFields(self) :
        try : 
            Career.objects.create(
                careerTitle='test career 2',
                careerDescription = 'test description 2',
                extraversionScore = 10,
                sensingScore = 10,
                thinkingScore = 10,
                perceivingScore = 10,

        )
        except Exception:
            self.fail()

    #test that null is set when sector and type is deleted
    def testNullSetWhenKeysDeleted(self) :
        PersonalityType.objects.get(typeCode='ESTP').delete()
        Sector.objects.get(sectorName='test sector').delete()

        self.assertEqual(Career.objects.get(careerTitle='test career').associatedSector, None)
        self.assertEqual(Career.objects.get(careerTitle='test career').associatedPersonalityType, None)

    




    




        
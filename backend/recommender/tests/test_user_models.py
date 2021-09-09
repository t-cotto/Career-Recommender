from datetime import datetime
from django.test import TestCase, tag
from ..models import CustomUser, PersonalityType
from django.utils import timezone

@tag('id:33')
@tag('id:13')
@tag('CustomUserModel')
#Test class for the custom user model
class CustomUserModelTest(TestCase) :
    PersonalityType = None
    updateTestUser = None;
    
    def setUp(self):
        self.personalityType = PersonalityType.objects.create(
            typeCode='ESTP',
            personalityTitle = 'Example Title',
            personalityDescription = 'Example Description'
        )

        self.updateTestUser = CustomUser.objects.create_user(
            email = 'updateTest@email.com',
            password = 'examplepass',
            firstName = 'example',
            lastName = 'example',
            dob = datetime(2021,7,13),
            personalityType = self.personalityType,
            extraversionScore = 1,
            sensingScore = 1,
            thinkingScore = 1, 
            perceivingScore = 1,
            quizDate = datetime.now(tz=timezone.utc)
        )

    #Test for the successful creation of a user with all fields filled
    def testSuccesfulCreationOfCustomUserAllFields(self) :
        
        user = CustomUser.objects.create_user(
            email = 'example@email.com',
            password = 'examplepass',
            firstName = 'example',
            lastName = 'example',
            dob = datetime(2021,7,13),
            personalityType = self.personalityType,
            extraversionScore = 1,
            sensingScore = 1,
            thinkingScore = 1, 
            perceivingScore = 1,
            quizDate = datetime.now(tz=timezone.utc)

        )

        self.assertEqual(user.email, 'example@email.com')
        self.assertEqual(user.firstName, 'example')
        self.assertEqual(user.lastName, 'example')
        self.assertEqual(user.dob, datetime(2021, 7, 13))
        self.assertEqual(self.personalityType, user.personalityType)
        self.assertEqual(user.extraversionScore, 1)
        self.assertEqual(user.sensingScore, 1)
        self.assertEqual(user.thinkingScore, 1)
        self.assertEqual(user.perceivingScore, 1)
        self.assertEqual(user.is_staff, False)
        self.assertEqual(user.is_superuser, False)
        self.assertEqual(user.quizDate.date(), datetime.today().date())

    
    #Test that a user can be created using only username and password and not any additional keyword arguments, also checks password has been hashed on not stored as normal string
    def testCreationOfUserNoKwargs(self) :
        user = CustomUser.objects.create_user('example@email.com', 'examplepass')
        self.assertEqual(user.email, 'example@email.com')
        self.assertNotEqual(user.password, 'examplepass')

    #Test for the successful creation of a superuser with all fields filled
    def testCreationOfSuperUserWithAllFields(self) :

        user = CustomUser.objects.create_superuser(
            email = 'example@email.com',
            password = 'examplepass',
            firstName = 'example',
            lastName = 'example',
            dob = datetime(2021,7,13),
            personalityType = self.personalityType,
            extraversionScore = 1,
            sensingScore = 1,
            thinkingScore = 1, 
            perceivingScore = 1,
            quizDate = datetime.now(tz=timezone.utc)
        )

        self.assertEqual(user.email, 'example@email.com')
        self.assertEqual(user.firstName, 'example')
        self.assertEqual(user.lastName, 'example')
        self.assertEqual(user.dob, datetime(2021, 7, 13))
        self.assertEqual(self.personalityType, user.personalityType)
        self.assertEqual(user.extraversionScore, 1)
        self.assertEqual(user.sensingScore, 1)
        self.assertEqual(user.thinkingScore, 1)
        self.assertEqual(user.perceivingScore, 1)
        self.assertEqual(user.is_staff, True)
        self.assertEqual(user.is_superuser, True)
        self.assertEqual(user.quizDate.date(), datetime.today().date())

    #Test that a user can be created using only username and password and not any additional keyword arguments, and that is staff/ superuser is set to true
    def testCreationOfSuperUserNoKwargs(self) :
        user = CustomUser.objects.create_superuser('example@email.com', 'examplepass')
        self.assertEqual(user.email, 'example@email.com')
        self.assertEqual(user.is_staff, True)
        self.assertEqual(user.is_superuser, True)
    
    #Test that a super user cannot be created with a false is_staff field
    def testFalseStaffingPermissionThrowsException(self) :
        with self.assertRaises(expected_exception=ValueError) :
            CustomUser.objects.create_superuser('example@email.com', 'examplepass', is_staff = False)

    #Test that a super user cannot be created with a false is_superuser field 
    def testFalseSuperuserPermissionThrowsException(self) :
        with self.assertRaises(expected_exception=ValueError) :
            CustomUser.objects.create_superuser('example@email.com', 'examplepass', is_superuser = False)

    #Test update quiz scores successfully no data
    def testUpdateUserQuizScores(self) :
        self.updateTestUser.updateUserQuizScores('ESTP', {'extraversion': 5, 'sensing' : 5, 'thinking' : 5, 'perceiving' : 5 })
        user = CustomUser.objects.get(email='updateTest@email.com')
        self.assertEqual(user.extraversionScore, 5)

    #Test that quiz model is updated with valid datetime object.
    def testUpdateQuizWithValidDateObject(self) : 
        self.updateTestUser.updateUserQuizScores('ESTP', {'extraversion': 3, 'sensing' : 3, 'thinking' : 3, 'perceiving' : 3 }, quizDate=datetime(2021, 8, 10, 13, 0, 0, 10))
        user = CustomUser.objects.get(email='updateTest@email.com')
        self.assertEqual(user.quizDate, datetime(2021, 8, 10, 12, 0, 0, 10, tzinfo=timezone.utc))

    #Test that exception is raised when invalid datatype is present and correct message shows 
    def testExceptionIsThrownForInvalidDateType(self) :
        with self.assertRaises(expected_exception=Exception) :
            self.updateTestUser.updateUserQuizScores('ESTP', {'extraversion': 3, 'sensing' : 3, 'thinking' : 3, 'perceiving' : 3 }, quizDate=10)

    #Test that an exception is throw if an attempt to post a future date is made
    def testThatExceptionIsThrownWhenUserUsesFutureData(self) :
        with self.assertRaises(expected_exception=Exception) :
            self.updateTestUser.updateUserQuizScores('ESTP', {'extraversion': 3, 'sensing' : 3, 'thinking' : 3, 'perceiving' : 3 }, quizDate=datetime.now() + datetime.timeDelta(hour=1))


    

        
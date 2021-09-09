from django.db import models
from .managers import CustomUserManager
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from datetime import datetime

#The Question set model for storing question set numbers in the database
class QuestionSet(models.Model) :
    _setId = models.AutoField(primary_key=True, editable=False, null=False)
    createdAt = models.DateField(auto_now_add=True)

    def __str__(self) :
        return str(self._setId)

#The question model for storing questions in the database
class Question(models.Model) :
    multiplierChoices = [(1, 'Positive Factor'), (-1,'Negative Factor')]
    personalityFactorChoice = [('extraversion', 'Extraversion Factor Question'),
     ('sensing', 'Sensing Factor Question'), 
     ('thinking', 'Thinking Factor Question'), 
     ('perceiving', 'Perceiving Factor Question')]

    _questionId = models.AutoField(primary_key=True, editable=False)
    personalityFactor = models.CharField(choices=personalityFactorChoice, max_length=12, blank=False, null=False)
    multiplier = models.IntegerField(choices=multiplierChoices, blank=False, null=False)
    questionContent = models.TextField(blank=False, null=False)
    questionSetNumber = models.ForeignKey(QuestionSet, on_delete=models.SET_NULL, null=True)

    #Override save method to ensure that only allowed factors and multipliers can be added to the model
    def save(self, *args, **kwargs) :
        correctFactor = False

        for tup in self.personalityFactorChoice:
            if tup[0] == self.personalityFactor:
                correctFactor = True
                break

        if not correctFactor:
            raise Exception('Please enter one of the allowed factors by MBTI')
        elif self.multiplier == 1 or self.multiplier == -1 :
            super(Question, self).save(*args, **kwargs)
        else :
            raise Exception('Please use a multiplier of 1 or negative 1')

        
    def __str__(self) :
        return self.questionContent

#The Personality componet model which managing information on each of the personality components of a personality type in the database
class PersonalityComponent(models.Model) :
    letterCodeChoices = [('E', 'Extrovert'), ('I', 'Introvert'), ('S', 'Sensing'), ('N', 'Intuitive'), ('T', 'Thinking'), ('F', 'Feeling'), ('P', 'Perceptive'), ('J', 'Judging')]
    
    _id = models.AutoField(primary_key=True, editable=False)
    letterCode = models.CharField(null=False, blank=False, choices=letterCodeChoices, max_length=1, unique=True)
    description = models.TextField(blank=False, null=False)
    title = models.CharField(null=False, editable=False, max_length=200)
   
    # Override the save method to auto save the title based on the passed in letter code and throw an exception if invalid code is passed
    def save(self, *args, **kwargs) :
        correctCode = False
        for tup in self.letterCodeChoices:
            if tup[0] == self.letterCode:
                self.title = tup[1]
                correctCode = True
                break

        if correctCode:
            super(PersonalityComponent, self).save(*args, **kwargs)
        else :
            raise Exception('Using Incorrect Letter Code, please enter the allowed codes by MBTI')

    def __str__(self) :
        return self.title

#The personality type model managing information on each stored personality type.
class PersonalityType(models.Model) :

    _id = models.AutoField(primary_key=True, editable=False)
    typeCode = models.CharField(null=False, blank=False, unique=True, max_length=4)
    personalityTitle = models.CharField(null=False, blank=False, max_length=200)
    personalityDescription = models.TextField(null=False, blank=False)
    associatedComponents = models.ManyToManyField(to=PersonalityComponent)

    def save(self, *args, **kwargs) :
        if len(self.typeCode) != 4 :
            raise Exception('Type code must be 4 letters')

        allowedValues = [('E', 'I'), ('S','N'), ('T', 'F',), ('P', 'J')]

        for x in range(0,3) :
            if self.typeCode[x] not in allowedValues[x]:
                raise Exception(self.typeCode[x] + ' is invalid personality factor for this component, may be in wrong position')

        super(PersonalityType, self).save(*args, **kwargs)

    def __str__(self):
        return self.typeCode

#The Sector model that manages the data assoicated with each career sector type, both associated Icon and colour can be null as these are optional UI features. 
class Sector(models.Model) :
    _sectorId = models.AutoField(primary_key=True, editable=False)
    sectorName = models.CharField(max_length=200, null=False, blank=False, unique=True)
    sectorDescription = models.TextField(null=False, blank=False)
    associatedIcon = models.CharField(max_length=100, null=True, blank=True)
    associatedColour = models.CharField(max_length=100, blank= True, null=True )

    def __str__(self) :
        return self.sectorName

#The career model for managing all the data related to a career instance of the database
class Career(models.Model) :
    _careerId = models.AutoField(primary_key=True, editable=False)
    careerTitle = models.CharField(max_length=200, null=False, blank=False, unique=True)
    careerDescription = models.TextField(null=False, blank=False)
    associatedSector = models.ForeignKey(to=Sector, on_delete=models.SET_NULL, null=True, blank=False)
    extraversionScore = models.IntegerField(null=False, blank=False)
    sensingScore = models.IntegerField(null=False, blank=False)
    thinkingScore = models.IntegerField(null=False, blank=False)
    perceivingScore = models.IntegerField(null=False, blank=False)
    associatedPersonalityType = models.ForeignKey(to=PersonalityType, on_delete=models.SET_NULL, null=True, blank=False)
    avgSalary = models.IntegerField(null=True, blank=True)
    associatedImage = models.ImageField(null=True, blank=True, default='/placeholder.png')

    def __str__(self) :
        return self.careerTitle

#Custom user model, extends abstract base user and includes personality type information and quiz results
class CustomUser(AbstractBaseUser, PermissionsMixin):
    _id = models.AutoField(primary_key=True, editable=False)
    email = models.EmailField(('email address'), unique=True, null=False, blank=False)
    firstName = models.CharField(max_length=100, null=True, blank=True)
    lastName = models.CharField(max_length=100, null=True, blank=True)
    dob = models.DateField(null=True)
    personalityType = models.ForeignKey(PersonalityType, default=None, on_delete=models.SET_NULL, null=True, blank=True)
    extraversionScore = models.IntegerField(default=0, blank=True, null=True)
    sensingScore = models.IntegerField(default=0, blank=True, null=True)
    thinkingScore = models.IntegerField(default=0, blank=True, null=True)
    perceivingScore = models.IntegerField(default=0, blank=True, null=True)
    quizDate = models.DateTimeField(null=True, blank=True, default=None)
    is_staff = models.BooleanField(default=False, blank=False, null=False)
    is_superuser = models.BooleanField(default=False, blank=False, null=False)
    date_joined = models.DateTimeField(auto_now=timezone.now)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    #Method to update the users quiz information
    def updateUserQuizScores(self, personalityCode, userAnswers, **kwargs) :
        personalityType = PersonalityType.objects.get(typeCode=personalityCode)
        self.personalityType = personalityType
        self.extraversionScore = int(userAnswers['extraversion'])
        self.sensingScore = int(userAnswers['sensing'])
        self.thinkingScore = int(userAnswers['thinking'])
        self.perceivingScore = int(userAnswers['perceiving'])
        
        
        if 'quizDate' in kwargs.keys() :
            quizDate = kwargs['quizDate']
                
            quizDate = quizDate.astimezone(timezone.utc)
            
            if quizDate > datetime.now(tz=timezone.utc) :
                raise Exception('Cannot Have quiz date greater than the current date')

            self.quizDate = quizDate

        self.save()

    def __str__(self):
        return self.email
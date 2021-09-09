from django.test import TestCase, tag
from ..models import Question, QuestionSet


#Class to test the quiz model 
@tag('id:1')
@tag('QuestionModel')
class TestQuestionModel(TestCase):
    questionSet = None;
    question = None;

    def setUp(self):
        self.questionSet = QuestionSet.objects.create()
        self.question = Question.objects.create(
            personalityFactor = 'extraversion',
            multiplier = 1,
            questionContent = 'test case 1',
            questionSetNumber = self.questionSet
        )

    #Test successful creation of question
    def testQuizModel(self):
        question = Question.objects.get(_questionId=1)
        self.assertEqual(question.personalityFactor, 'extraversion')
        self.assertEqual(question.multiplier, 1)
        self.assertEqual(question.questionContent, 'test case 1')
        self.assertEqual(question.questionSetNumber, self.questionSet)
    
    #Test exception is thrown when wrong multiplier is used
    def testMultiplierError(self) :
        with self.assertRaises(expected_exception=Exception):

            Question.objects.create(
                personalityFactor = 'extraversion',
                multiplier = 3,
                questionContent = 'test case 1',
                questionSetNumber = self.questionSet
        )

    #Test Exception is thrown when wrong factor is used
    def testFactorError(self): 
        with self.assertRaises(expected_exception=Exception):

            Question.objects.create(
                personalityFactor = 'wrong factor',
                multiplier = 1,
                questionContent = 'test case 1',
                questionSetNumber = self.questionSet
        )

    #Test exception is thrown when non existant question set is used
    def testSetError(self) :
        with self.assertRaises(expected_exception=Exception):
            Question.objects.create(
                personalityFactor = 'extraversion',
                multiplier = 1,
                questionContent = 'test case 1',
                questionSetNumber = 2
        )
    
    def tearDown(self):
        self.question.delete()
        self.questionSet.delete()


#Class to test the quiz set model 
@tag('id:1')
@tag('QuizSetModel')
class TestQuestionSetModel(TestCase):
    questionSet = None;
    question = None;

    def setUp(self):
        self.questionSet = QuestionSet.objects.create()
        self.question = Question.objects.create(
            personalityFactor = 'extraversion',
            multiplier = 1,
            questionContent = 'test case 1',
            questionSetNumber = QuestionSet.objects.get(_setId=1)
        )

    # Test successful creation of question set
    def testQuestionSetCreation(self):
        questionSet = QuestionSet.objects.get(_setId=1)
        self.assertEqual(questionSet._setId, 1)

    def tearDown(self):
        self.question.delete()
        self.questionSet.delete()

        



        




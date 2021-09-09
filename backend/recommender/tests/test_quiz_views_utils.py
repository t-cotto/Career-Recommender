from django.test import TestCase, tag, Client
from recommender.util import quiz_views_utils as util

client = Client()

@tag('TestCalculatePersonalityCode')
class TestCalculatePersonalityCode(TestCase) :
    #Test ESTP is calculated from all positive values
    def testSuccessfulCalculationPostives(self) :
        data = { 'extraversion': 5,
            'sensing' : 5,
            'thinking' : 5,
            'perceiving' : 5,
        }
        self.assertEqual(util.calculatePersonalityCode(data), 'ESTP')

    #Test INFJ is calculated from all negative values
    def testSuccessfulCalculationNegatives(self) :
        data = { 'extraversion': -5,
            'sensing' : -5,
            'thinking' : -5,
            'perceiving' : -5,
        }
        self.assertEqual(util.calculatePersonalityCode(data), 'INFJ')

    #Test ESFJ is calculated from mixture of factors
    def testSuccessfulCalculationMix(self) :
        data = { 'extraversion': 5,
            'sensing' : 5,
            'thinking' : -5,
            'perceiving' : -5,
        }
        self.assertEqual(util.calculatePersonalityCode(data), 'ESFJ')

    #test that the user of an incorrect factror throws an error
    def testIncorrectFactorThrowsError(self) :
        data = { 'wrong': 5,
            'sensing' : 5,
            'thinking' : -5,
            'perceiving' : -5,
        }

        with self.assertRaises(expected_exception=Exception) :
            util.calculatePersonalityCode(data)

        #Test that the user of an incorrect value throws and error
    def testIncorrectValueThrowsError(self) :
        data = { 'extraversion': 'fail',
            'sensing' : 5,
            'thinking' : -5,
            'perceiving' : -5,
            }

        with self.assertRaises(expected_exception=Exception) :
            util.calculatePersonalityCode(data)

#Test suite for the unpack quiz details utility function
@tag('UnpackQuizDetails')
class TestUnpackQuizDetails(TestCase) :

    #Test correct unpacking of users quiz details
    def testCorrectUnpacking(self):
        data = {'extraversion' : 1, 'sensing':1, 'thinking': 1, 'perceiving' : 1}
        expectedData  = data

        self.assertEqual(expectedData, util.unpackQuizDetails(data))

    #Test error is thrown if user misses quiz detail data
    def testExceptionThrownWhenDataMissing(self) :
        data = {'extraversion' : 1, 'sensing':1, 'thinking': 1}
        with self.assertRaises(expected_exception=KeyError) :
            util.unpackQuizDetails(data)

    #Test error is thrown if value is not a number
    def testErrorThrownWhenValueNotANumber(self) :
        data = {'extraversion' : 'fail', 'sensing':1, 'thinking': 1, 'perceiving' : 1}
        with self.assertRaises(expected_exception=ValueError) :
            util.unpackQuizDetails(data)
    
    #Test error is thrown with mistake in dictionary keys
    def testErrorThrownWithInvalidKey(self) :
        data = {'fail' : 1, 'sensing':1, 'thinking': 1, 'perceiving' : 1}
        with self.assertRaises(expected_exception=KeyError) :
            util.unpackQuizDetails(data)




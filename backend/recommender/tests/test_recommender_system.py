from django.test import TestCase, tag
from ..recommender_system import calculateMatchScore

#Test case for the calculate match score recommender function
@tag('id:3')
@tag('CalculateMatchScore')
class CalculateMatchScoreTestCase (TestCase) : 
    userScores = {
        'extraversion' : 4,
        'sensing' : 4,
        'thinking' : 4,
        'perceiving' : 4
    }

    #Test that the match score is calculated successfuly
    def testSuccessfulMatchCalculation(self) :
        careerScores = {
            'extraversionScore' : 4,
            'sensingScore' : 4,
            'thinkingScore' : 4,
            'perceivingScore' : 4
        }

        matchScore = calculateMatchScore(careerScores, self.userScores)
        self.assertEqual(matchScore, 64)

    #Test that recommender system can calculate match score when on negative side of the axes for both career and user. 
    def testCalculationUsingNegativeValues(self) :
        negativeUserScores = {
            'extraversion' : -2,
            'sensing' : -2,
            'thinking' : -2,
            'perceiving' : -2
        }

        careerScores = {
            'extraversionScore' : -2,
            'sensingScore' : -2,
            'thinkingScore' : -2,
            'perceivingScore' : -2
        }

        matchScore = calculateMatchScore(careerScores, negativeUserScores)
        self.assertEqual(matchScore,16
        )

    #Test that recommender can calculate match score when only career scores are on negative end of axes
    #Important recommender can do this as functionality will be added so that user can test the matches not related to their typecode in future.
    def testOneSetNegative(self) :
        careerScores = {
            'extraversionScore' : -2,
            'sensingScore' : -2,
            'thinkingScore' : -2,
            'perceivingScore' : -2
        }

        matchScore = calculateMatchScore(careerScores, self.userScores)
        self.assertEqual(matchScore, -32)

    #Test that correct error handling occurs when passed in objects are missing a field or value
    def testMatchCalculationWithMissingField(self) :
        careerScores = {
            'extraversionScore' : 4,
            'sensingScore' : 4,
            'thinkingScore' : 4,
        }

        matchScore = calculateMatchScore(careerScores, self.userScores)
        self.assertEqual("Failed to access 'perceivingScore'", matchScore)






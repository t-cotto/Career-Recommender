#Function that calculates the dot product of the career object and user personality object to return the match strength between user and career 
#as a singular integer
def calculateMatchScore(career, personality) :
    try :
         
        matchScore = 0

        matchScore += career['extraversionScore'] * personality['extraversion']
        matchScore += career['sensingScore'] * personality['sensing']
        matchScore += career['thinkingScore'] * personality['thinking']
        matchScore += career['perceivingScore'] * personality['perceiving']

        return matchScore

    except Exception as e:
        return 'Failed to access ' + str(e)
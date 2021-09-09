#Utility function to calculate the personality code of user based on passed in question answers
def calculatePersonalityCode(quizScore) :
    personalityCode = ''
    if  quizScore['extraversion'] >= 0:
        personalityCode += 'E'
    else :
        personalityCode += 'I'

    if quizScore['sensing'] >= 0:
        personalityCode += 'S'
    else :
        personalityCode += 'N'
        
    if quizScore['thinking']  >= 0:
        personalityCode += 'T'
    else :
        personalityCode += 'F'

    if quizScore['perceiving'] >= 0:
        personalityCode += 'P'
    else :
        personalityCode += 'J'

    return personalityCode

#Unpack the users quiz responses into a dict of integers for use in the recommender algorithm. 
def unpackQuizDetails(requestData) :
    return {
            'extraversion' : int(requestData['extraversion']),
            'sensing' : int(requestData['sensing']),
            'thinking' : int(requestData['thinking']),
            'perceiving' : int(requestData['perceiving'])
        }
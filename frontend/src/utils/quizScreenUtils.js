import { ALLOWED_USER_ANSWER_VALUES } from '../constants/quizConstants';

/* Iterate over all the questions in the question set to find those matching the passed in personality factor, then store the new questions in the passed factorQuestion array*/
export const seperateQuestionArray = (
  questionSet,
  personalityFactor,
  factorQuestions
) => {
  questionSet.forEach((question) => {
    if (question.personalityFactor === personalityFactor) {
      factorQuestions.push(question);
    }
  });
};

/* Function to check  all answers have been filled out for the page*/
export const checkAnswersValidity = (questionAnswers) => {
  let validated = true;
  questionAnswers.forEach((answer) => {
    if (!ALLOWED_USER_ANSWER_VALUES.includes(answer)) {
      validated = false;
    }
  });

  return validated;
};

/* Function to manage the local state of the user answers for the page, updates everytime a user clicks on a box with a new value*/
export const userAnswerChangeHandler = (
  question,
  questionAnswers,
  setQuestionAnswer
) => {
  questionAnswers[question.questionNumber] = question.answerValue;
  setQuestionAnswer([...questionAnswers]);
};

/*Function to handle button on click event, calculates the total user answers for the current question set on next or finish click.*/
export const totalAnswers = (questionAnswers, factorQuestions) => {
  let total = 0;
  for (let i = 0; i < questionAnswers.length; i++) {
    total += parseInt(questionAnswers[i]) * factorQuestions[i].multiplier;
  }

  return total;
};

import { USER_ANSWER_RESET } from '../constants/quizConstants';
/* Function that returns a boolean based on whether the number of days between the current datetime and passed in datetime fall within the allowed boundry, if 
the difference is grater then false is returned otherwise true*/
/* Get time automatically converts the time to UTC in order to keep inline with the universal time sent by the backend web service  for the quiz date*/
export const checkQuizTime = (quizTime, dayBoundry) => {
  const timeNow = new Date();
  const quizDate = new Date(quizTime);

  if ((timeNow.getTime() - quizDate.getTime()) / 86400000 >= dayBoundry) {
    return false;
  } else {
    return true;
  }
};

/* Quiz retake function to check if the user has taken the quiz in the last 6 months and raise an error warning if they have*/
export const checkQuizRetakeWarning = (history, quizDate, dispatch) => {
  if (checkQuizTime(quizDate, 31 * 6)) {
    const confirmation = window.confirm(
      'Are you sure you want to take the test again ? Taking the test again too soon before your personality has had a chance to evolve may have a negative impact on your results and recommendations'
    );
    if (confirmation) {
      dispatch({ type: USER_ANSWER_RESET });
      history.push('/quiz/extraversion/question');
    }
  } else {
    dispatch({ type: USER_ANSWER_RESET });
    history.push('/quiz/extraversion/question');
  }
};

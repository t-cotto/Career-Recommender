import {
  QUIZ_QUESTION_SET_REQUEST,
  QUIZ_QUESTION_SET_FAIL,
  QUIZ_QUESTION_SET_SUCCESS,
  USER_ANSWER_CHANGE,
  USER_ANSWER_RESET,
} from '../constants/quizConstants';

/* The main reducer to handle the questions coming from the back end to be loaded into the quiz for the front end.*/
export const questionSetReducer = (state = { questionSet: [] }, action) => {
  switch (action.type) {
    case QUIZ_QUESTION_SET_REQUEST:
      return { loading: true, questionSet: [] };
    case QUIZ_QUESTION_SET_SUCCESS:
      return {
        loading: false,
        questionSet: action.payload,
      };
    case QUIZ_QUESTION_SET_FAIL:
      return { loading: false, error: action.payload, questionSet: [] };

    default:
      return state;
  }
};

/* The reducer to handle the state of the users quiz answers*/
export const quizAnswerScoreReducer = (
  state = {
    extraversion: 0,
    sensing: 0,
    thinking: 0,
    perceiving: 0,
  },
  action
) => {
  switch (action.type) {
    case USER_ANSWER_CHANGE:
      state[action.payload.factor] = action.payload.value;
      localStorage.setItem('userAnswers', JSON.stringify(state));
      return { ...state };
    case USER_ANSWER_RESET:
      return {
        extraversion: 0,
        sensing: 0,
        thinking: 0,
        perceiving: 0,
      };
    default:
      return state;
  }
};

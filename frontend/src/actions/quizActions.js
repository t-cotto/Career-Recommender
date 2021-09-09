import {
  QUIZ_QUESTION_SET_REQUEST,
  QUIZ_QUESTION_SET_SUCCESS,
  QUIZ_QUESTION_SET_FAIL,
  USER_ANSWER_CHANGE,
} from '../constants/quizConstants';
import {
  USER_PERSONALITY_FAIL,
  USER_PERSONALITY_SUCCESS,
  USER_PERSONALITY_REQUEST,
  UPDATE_USER_PERSONALITY_TYPE,
} from '../constants/userConstants';
import axios from 'axios';
import { GET_PERSONALITY_INFO_RESET } from '../constants/personalityConstants';
import { GET_CAREER_RECOMMENDATIONS_RESET } from '../constants/careerConstants';

/* Action to load the question set */
export const loadQuestionSet = () => async (dispatch) => {
  try {
    dispatch({ type: QUIZ_QUESTION_SET_REQUEST });

    /* Only one question set available in the web service, as so 1 is hardcoded in, this will need to be dynamic on question set expansion*/
    const { data } = await axios.get('/api/quiz/questions/1/');

    dispatch({
      type: QUIZ_QUESTION_SET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: QUIZ_QUESTION_SET_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/*Action to update the user answer state after they have completed a section of quiz answers*/
export const updateUserAnswers = (factor, value) => (dispatch) => {
  dispatch({
    type: USER_ANSWER_CHANGE,
    payload: { factor: factor, value: value },
  });
};

/* Action to post unlogged users results to the database and have personality result returned */
export const calculatePersonalityResults = (quizScores) => async (dispatch) => {
  try {
    dispatch({ type: USER_PERSONALITY_REQUEST });
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/quiz/responses/',
      quizScores,
      config
    );

    setNewQuizState(dispatch, data);

    localStorage.setItem(
      'personalityCode',
      JSON.stringify(data.personalityCode)
    );
    localStorage.setItem('quizDate', JSON.stringify(data.quizDate));
  } catch (error) {
    dispatch({
      type: USER_PERSONALITY_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* Function return the loaded in users quiz results*/
export const calculateLoggedUserQuizResults =
  (quizScores) => async (dispatch, getState) => {
    try {
      const {
        loggedUser: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      dispatch({ type: USER_PERSONALITY_REQUEST });

      quizScores.userId = userInfo._id;

      const { data } = await axios.post(
        '/api/quiz/responses/user',
        quizScores,
        config
      );

      setNewQuizState(dispatch, data);

      dispatch({
        type: UPDATE_USER_PERSONALITY_TYPE,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_PERSONALITY_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

/* Utility Function to set the users quiz data with the returned response from the API */
const setNewQuizState = (dispatch, data) => {
  dispatch({
    type: USER_PERSONALITY_SUCCESS,
    payload: data,
  });
  dispatch({ type: GET_PERSONALITY_INFO_RESET });
  dispatch({ type: GET_CAREER_RECOMMENDATIONS_RESET });
};

import axios from 'axios';
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  UPDATE_CURRENT_USER,
  USER_REGISTER_RESET,
} from '../constants/userConstants';
import { GET_PERSONALITY_INFO_RESET } from '../constants/personalityConstants';
import { GET_CAREER_RECOMMENDATIONS_RESET } from '../constants/careerConstants';

/* Utility function to handle the user login actions for both login and register*/
const logUserin = (data, dispatch) => {
  dispatch({
    type: USER_LOGIN_SUCCESS,
    payload: data,
  });
  dispatch({ type: GET_PERSONALITY_INFO_RESET });
  dispatch({ type: GET_CAREER_RECOMMENDATIONS_RESET });
  dispatch({ type: UPDATE_CURRENT_USER, payload: data });
  localStorage.setItem('userInfo', JSON.stringify(data));
};

/* Register action for sending user registration information to the backend database*/
export const register = (registerDetails) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/user/register/',
      registerDetails,
      config
    );

    dispatch({ type: USER_REGISTER_SUCCESS, payload: true });
    logUserin(data, dispatch);
    dispatch({ type: USER_REGISTER_RESET });

    if ('userAnswers' in registerDetails) {
      localStorage.removeItem('userAnswers');
      localStorage.removeItem('quizDate');
      localStorage.removeItem('personalityCode');
    }
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* login action to load valid users credentials*/
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `/api/user/login/`,
      { email: email, password: password },
      config
    );

    logUserin(data, dispatch);
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* Logout action to remove user info from global store and local storage*/
export const logout = () => (dispatch) => {
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: GET_PERSONALITY_INFO_RESET });
  dispatch({ type: GET_CAREER_RECOMMENDATIONS_RESET });
  localStorage.removeItem('userInfo');
};

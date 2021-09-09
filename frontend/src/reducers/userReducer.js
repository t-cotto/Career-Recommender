import {
  USER_PERSONALITY_FAIL,
  USER_PERSONALITY_SUCCESS,
  USER_PERSONALITY_REQUEST,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_RESET,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  UPDATE_USER_PERSONALITY_TYPE,
  UPDATE_CURRENT_USER,
} from '../constants/userConstants';

/* Standard reducer for handling the users personality type code*/
export const userPersonalityReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PERSONALITY_REQUEST:
      return { loading: true };
    case USER_PERSONALITY_SUCCESS:
      return {
        personalityCode: action.payload.personalityCode,
        quizDate: action.payload.quizDate,
      };
    case USER_PERSONALITY_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {
        personalityCode: JSON.parse(localStorage.getItem('personalityCode')),
        quizDate: JSON.parse(localStorage.getItem('quizDate')),
      };
    case UPDATE_CURRENT_USER:
      return {
        personalityCode: action.payload.personalityType,
        quizDate: action.payload.quizDate,
      };
    default:
      return state;
  }
};

/* Reducer for the registration process*/
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, success: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case USER_REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

/* Reducer for the logged in user*/
export const loggedInUserReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_USER_PERSONALITY_TYPE:
      const updatedUserInfo = {
        userInfo: {
          ...state.userInfo,
          personalityType: action.payload.personalityCode,
          quizDate: action.payload.quizDate,
        },
      };
      localStorage.setItem(
        'userInfo',
        JSON.stringify(updatedUserInfo.userInfo)
      );
      return { userInfo: updatedUserInfo.userInfo };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

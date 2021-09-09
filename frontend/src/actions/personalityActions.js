import {
  GET_PERSONALITY_INFO_REQUEST,
  GET_PERSONALITY_INFO_SUCCESS,
  GET_PERSONALITY_INFO_FAIL,
} from '../constants/personalityConstants';
import axios from 'axios';

/* Action to load the personality type information based on the users personality code*/
export const loadPersonalityType = (typeCode) => async (dispatch) => {
  try {
    dispatch({ type: GET_PERSONALITY_INFO_REQUEST });

    const { data } = await axios.get(`/api/personalities/${typeCode}`);

    dispatch({ type: GET_PERSONALITY_INFO_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_PERSONALITY_INFO_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* Action to load the personality type based on user id*/
export const loadPersonalityTypeByUserId = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PERSONALITY_INFO_REQUEST });

    const {
      loggedUser: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/personalities/user/', config);
    dispatch({ type: GET_PERSONALITY_INFO_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_PERSONALITY_INFO_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

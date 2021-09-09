import axios from 'axios';
import {
  GET_CAREER_RECOMMENDATIONS_REQUEST,
  GET_CAREER_RECOMMENDATIONS_SUCCESS,
  GET_CAREER_RECOMMENDATIONS_FAIL,
} from '../constants/careerConstants';

/* Action to load the career recommendations from the backend database based on the typecode and user results, sorts recommendations based on user match score in descending order*/
export const loadRecommendationsWithScore =
  () => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_CAREER_RECOMMENDATIONS_REQUEST });

      const {
        loggedUser: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/careers/points/', config);

      // Function sorts the array of objects in descending match score order
      data.sort((a, b) => (a.matchScore - b.matchScore) * -1);

      const actionPayload = {
        recommendations: data,
        filter: 'typecode',
      };

      dispatch({
        type: GET_CAREER_RECOMMENDATIONS_SUCCESS,
        payload: actionPayload,
      });
    } catch (error) {
      dispatch({
        type: GET_CAREER_RECOMMENDATIONS_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

/* Load recommendations for a non signed in user with just the recommended careers */
export const loadRecommendations = (typeCode) => async (dispatch) => {
  try {
    dispatch({ type: GET_CAREER_RECOMMENDATIONS_REQUEST });

    const { data } = await axios.get('/api/careers/', {
      params: {
        typeCode: typeCode,
      },
    });

    const actionPayload = {
      recommendations: data,
      filter: 'NA',
    };

    dispatch({
      type: GET_CAREER_RECOMMENDATIONS_SUCCESS,
      payload: actionPayload,
    });
  } catch (error) {
    dispatch({
      type: GET_CAREER_RECOMMENDATIONS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* Load recommendations related to the passed in personality componenet. */
export const loadRecommendationsByComponent =
  (letterCode) => async (dispatch) => {
    try {
      dispatch({ type: GET_CAREER_RECOMMENDATIONS_REQUEST });

      const { data } = await axios.get(`/api/careers/component/${letterCode}`);
      const actionPayload = {
        recommendations: data,
        filter: letterCode,
      };
      dispatch({
        type: GET_CAREER_RECOMMENDATIONS_SUCCESS,
        payload: actionPayload,
      });
    } catch (error) {
      dispatch({
        type: GET_CAREER_RECOMMENDATIONS_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

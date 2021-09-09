import {
  GET_PERSONALITY_INFO_REQUEST,
  GET_PERSONALITY_INFO_SUCCESS,
  GET_PERSONALITY_INFO_FAIL,
  GET_PERSONALITY_INFO_RESET,
} from '../constants/personalityConstants';

/*Personality type reducer managing data on the users personality type*/
export const personalityTypeReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_PERSONALITY_INFO_REQUEST:
      return { loading: true };
    case GET_PERSONALITY_INFO_SUCCESS:
      return { loading: false, personalityType: action.payload };
    case GET_PERSONALITY_INFO_FAIL:
      return { loading: false, error: action.payload };
    case GET_PERSONALITY_INFO_RESET:
      return {};
    default:
      return state;
  }
};

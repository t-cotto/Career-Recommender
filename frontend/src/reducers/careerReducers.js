import {
  GET_CAREER_RECOMMENDATIONS_REQUEST,
  GET_CAREER_RECOMMENDATIONS_SUCCESS,
  GET_CAREER_RECOMMENDATIONS_FAIL,
  GET_CAREER_RECOMMENDATIONS_RESET,
  ORDER_CAREERS_ASCENDING,
  ORDER_CAREERS_DESCENDING,
} from '../constants/careerConstants';

/*Recommendation reducer handling the recommended career types based on personality */
export const recommendationReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CAREER_RECOMMENDATIONS_REQUEST:
      return { loading: true };
    case GET_CAREER_RECOMMENDATIONS_SUCCESS:
      return {
        recommendations: action.payload.recommendations,
        sorting: 'descending',
        filter: action.payload.filter,
      };
    case GET_CAREER_RECOMMENDATIONS_FAIL:
      return { error: action.payload };
    case GET_CAREER_RECOMMENDATIONS_RESET:
      return {};
    case ORDER_CAREERS_ASCENDING:
      return {
        recommendations: state.recommendations.sort(
          (a, b) => a.matchScore - b.matchScore
        ),
        sorting: 'ascending',
        filter: 'typecode',
      };
    case ORDER_CAREERS_DESCENDING:
      return {
        recommendations: state.recommendations.sort(
          (a, b) => (a.matchScore - b.matchScore) * -1
        ),
        sorting: 'descending',
        filter: 'typecode',
      };
    default:
      return state;
  }
};

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  questionSetReducer,
  quizAnswerScoreReducer,
} from './reducers/quizReducers';
import { personalityTypeReducer } from './reducers/personalityReducers';
import {
  userPersonalityReducer,
  userRegisterReducer,
  loggedInUserReducer,
} from './reducers/userReducer';
import { recommendationReducer } from './reducers/careerReducers';

const reducer = combineReducers({
  questionSet: questionSetReducer,
  userAnswers: quizAnswerScoreReducer,
  personalityResults: personalityTypeReducer,
  user: userPersonalityReducer,
  registration: userRegisterReducer,
  recommendedCareers: recommendationReducer,
  loggedUser: loggedInUserReducer,
});

/* Function loads in user personality from storage if the user has taken the test before otherwise it returns an empty object*/

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const userAnswersFromStorage = localStorage.getItem('userAnswers')
  ? JSON.parse(localStorage.getItem('userAnswers'))
  : {
      extraversion: 0,
      sensing: 0,
      thinking: 0,
      perceiving: 0,
    };

/* If user info is present load the personality type as the logged in user, else user is logged out and use the locally stored user*/
const personalityTypeFromStorage = userInfoFromStorage
  ? userInfoFromStorage.personalityType
  : localStorage.getItem('personalityCode')
  ? JSON.parse(localStorage.getItem('personalityCode'))
  : null;

/* If user info is present load the quiz date as the logged in user, else user is logged out and use the locally stored user*/
const quizDateFromStorage = userInfoFromStorage
  ? userInfoFromStorage.quizDate
  : localStorage.getItem('quizDate')
  ? JSON.parse(localStorage.getItem('quizDate'))
  : null;

const initialState = {
  user: {
    personalityCode: personalityTypeFromStorage,
    quizDate: quizDateFromStorage,
  },
  loggedUser: { userInfo: userInfoFromStorage },

  userAnswers: userAnswersFromStorage,
};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,

  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

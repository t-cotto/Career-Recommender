import React from 'react';
import {
  loadQuestionSet,
  updateUserAnswers,
  calculatePersonalityResults,
  calculateLoggedUserQuizResults,
} from '../../../actions/quizActions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axiosMock from 'axios';
import {
  QUIZ_QUESTION_SET_REQUEST,
  QUIZ_QUESTION_SET_SUCCESS,
  QUIZ_QUESTION_SET_FAIL,
  USER_ANSWER_CHANGE,
} from '../../../constants/quizConstants';
import {
  USER_PERSONALITY_FAIL,
  USER_PERSONALITY_REQUEST,
  USER_PERSONALITY_SUCCESS,
  UPDATE_USER_PERSONALITY_TYPE,
} from '../../../constants/userConstants';
import { cleanup } from '@testing-library/react';
import { GET_PERSONALITY_INFO_RESET } from '../../../constants/personalityConstants';
import { GET_CAREER_RECOMMENDATIONS_RESET } from '../../../constants/careerConstants';

afterEach(cleanup);

jest.mock('axios');
const mockStore = configureMockStore([thunk]);

/* Test block for the load question set action*/
describe('LoadQuestionSet Action', () => {
  let store;

  beforeEach(() => {
    store = mockStore({ questionSet: [] });
  });

  /* Test for the successful completion of the action*/
  it('question set is dispatched after succesful api connection #1', () => {
    const functionData = {
      questionSet: [
        {
          id: 7,
          personalityFactor: 'extraversion',
          multiplier: 1,
          questionContent: 'this is an example question extraversion',
          questionSetNumber: 1,
        },
      ],
    };

    const axiosMockFunc = axiosMock.get.mockResolvedValueOnce({
      data: functionData,
    });

    store.dispatch(loadQuestionSet(axiosMockFunc)).then(() =>
      expect(store.getActions()).toEqual([
        { type: QUIZ_QUESTION_SET_REQUEST },
        {
          payload: functionData,
          type: QUIZ_QUESTION_SET_SUCCESS,
        },
      ])
    );
  });

  /* Test that error is handled correctly when api response returns an error.*/
  it('Testing unsuccessful loading of question set from API #1', () => {
    axiosMock.get.mockRejectedValueOnce(new Error('this test should fail'));

    store.dispatch(loadQuestionSet()).then(() => {
      expect(store.getActions()).toEqual([
        { type: QUIZ_QUESTION_SET_REQUEST },
        {
          type: QUIZ_QUESTION_SET_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });
});

/* Test for the update user answer action*/
describe('UpdateUserAnswersTest', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      extraversion: 0,
      sensing: 0,
      thinking: 0,
      perceiving: 0,
    });
  });

  /* Test that the answer update action is fired correctly */
  it('test successful answer update #1 #6', () => {
    store.dispatch(updateUserAnswers('extraversion', 10));
    expect(store.getActions()).toEqual([
      {
        type: USER_ANSWER_CHANGE,
        payload: { factor: 'extraversion', value: 10 },
      },
    ]);
  });
});

/* Test for the calculate user personality action */
describe('CalculateUserPersonalityTest', () => {
  let store;
  let mockUserAnswerData;

  beforeEach(() => {
    store = mockStore({
      user: {
        personalityCode: {},
      },
      loggedUser: {
        userInfo: null,
      },
    });

    mockUserAnswerData = {
      extraversion: 10,
      sensing: 10,
      thinking: 10,
      perceiving: 10,
    };
  });

  /* Test the correct and successful dispatch of the action */
  it('test successful answer update and personality type received #1', () => {
    const axiosMockFunc = axiosMock.post.mockResolvedValueOnce(
      {
        data: {
          personalityCode: 'ESTP',
          quizDate: 'Test data xxxx-xx-xx',
        },
      },
      mockUserAnswerData
    );

    store.dispatch(calculatePersonalityResults(axiosMockFunc)).then(() =>
      expect(store.getActions()).toEqual([
        { type: USER_PERSONALITY_REQUEST },
        {
          type: USER_PERSONALITY_SUCCESS,
          payload: {
            personalityCode: 'ESTP',
            quizDate: 'Test data xxxx-xx-xx',
          },
        },
        { type: GET_PERSONALITY_INFO_RESET },
        { type: GET_CAREER_RECOMMENDATIONS_RESET },
      ])
    );
  });

  /* Test to ensure that set item local storage method is called when the get personality action is executed*/
  it('test that set storage is called when the user personality is received #11', () => {
    const axiosMockFunc = axiosMock.post.mockResolvedValueOnce(
      {
        data: {
          personalityCode: 'ESTP',
          quizDate: 'Test data xxxx-xx-xx',
        },
      },
      mockUserAnswerData
    );

    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(() => null),
      },
      writable: true,
    });

    store.dispatch(calculatePersonalityResults(axiosMockFunc)).then(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  /* Test for an unsuccessful api connection and error correctly handled */
  it('Testing unsuccessfull posting of question answer data #1', () => {
    const axiosMockFunc = axiosMock.post.mockRejectedValueOnce(
      new Error('this test should fail')
    );

    store.dispatch(calculatePersonalityResults(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: USER_PERSONALITY_REQUEST },
        {
          type: USER_PERSONALITY_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });
});

describe('calculateLoggedUserQuizResults', () => {
  let store;
  let mockUserAnswerData;

  beforeEach(() => {
    store = mockStore({
      user: {
        personalityCode: {},
      },
      loggedUser: {
        userInfo: { _id: 1, token: 'fake token' },
      },
    });

    mockUserAnswerData = {
      extraversion: 10,
      sensing: 10,
      thinking: 10,
      perceiving: 10,
    };
  });

  /* Test that answer actions are posted successfully and action to update user info state with new personality value is executed*/
  it('test successful answer positing when user logged in ', () => {
    const axiosMockFunc = axiosMock.post.mockResolvedValueOnce({
      data: {
        personalityCode: 'ESTP',
        quizDate: 'Test data xxxx-xx-xx',
      },
    });

    store
      .dispatch(
        calculateLoggedUserQuizResults(mockUserAnswerData, axiosMockFunc)
      )
      .then(() => {
        // Append the user id as the function shoould
        mockUserAnswerData.userId = 1;
        expect(store.getActions()).toEqual([
          { type: USER_PERSONALITY_REQUEST },
          {
            type: USER_PERSONALITY_SUCCESS,
            payload: {
              personalityCode: 'ESTP',
              quizDate: 'Test data xxxx-xx-xx',
            },
          },
          { type: GET_PERSONALITY_INFO_RESET },
          { type: GET_CAREER_RECOMMENDATIONS_RESET },
          {
            type: UPDATE_USER_PERSONALITY_TYPE,
            payload: {
              personalityCode: 'ESTP',
              quizDate: 'Test data xxxx-xx-xx',
            },
          },
        ]);
        // This test ensures that user id is appended on to logged users
        expect(axiosMockFunc).toHaveBeenCalledWith(
          '/api/quiz/responses/user',
          mockUserAnswerData,
          {
            headers: {
              Authorization: 'Bearer fake token',
              'Content-type': 'application/json',
            },
          }
        );
      });
  });

  /* Test for an unsuccessful api connection and error correctly handled */
  it('Testing unsuccessfull posting of question answer data', () => {
    const axiosMockFunc = axiosMock.post.mockRejectedValueOnce(
      new Error('this test should fail')
    );

    store.dispatch(calculateLoggedUserQuizResults(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: USER_PERSONALITY_REQUEST },
        {
          type: USER_PERSONALITY_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });
});

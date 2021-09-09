import {
  GET_PERSONALITY_INFO_REQUEST,
  GET_PERSONALITY_INFO_SUCCESS,
  GET_PERSONALITY_INFO_FAIL,
} from '../../../constants/personalityConstants';
import { loadPersonalityType } from '../../../actions/personalityActions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axiosMock from 'axios';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

jest.mock('axios');
const mockStore = configureMockStore([thunk]);

const FUNCTION_DATA = {
  personalityType: {
    typeCode: 'ESTP',
    personalityTitle: 'example title',
    personalityDescription: 'example description',
    associatedComponents: [
      {
        letterCode: 'E',
        description: 'Extraversion',
        title: 'Extrovert',
      },
      {
        letterCode: 'S',
        description: 'Sensing',
        title: 'Sensing',
      },
      {
        letterCode: 'T',
        description: 'Thinking',
        title: 'Thinking',
      },
      {
        letterCode: 'P',
        description: 'Perceiving',
        title: 'Perceptive',
      },
    ],
  },
};

/* Test suite for the load personality action */
describe('LoadPersonalityAction #1 #12', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      personalityResults: {},
    });
  });

  /* Test for a successful dispatch of the action and correct response from the server. */
  it('test successful api call to get personality type #1 #12', () => {
    const FUNCTION_DATA = {};
    const axiosMockFunc = axiosMock.get.mockResolvedValueOnce({
      data: FUNCTION_DATA,
    });

    store.dispatch(loadPersonalityType(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_PERSONALITY_INFO_REQUEST },
        {
          type: GET_PERSONALITY_INFO_SUCCESS,
          payload: FUNCTION_DATA,
        },
      ]);
    });
  });

  /* Test that error response from the server is handled correctly by the action*/
  it('test failure error handling of action', () => {
    const axiosMockFunc = axiosMock.get.mockRejectedValueOnce(
      new Error('this test should fail')
    );

    store.dispatch(loadPersonalityType(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_PERSONALITY_INFO_REQUEST },
        {
          type: GET_PERSONALITY_INFO_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });
});

/* Test for getting the user personality by utilising user Id as apposed to typeCode*/
describe('LoadPersonalityTypeByUserId', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      personalityResults: {},
      userInfo: {
        _id: 1,
      },
    });
  });

  /* Test for a successful dispatch of the action and correct response from the server. */
  it('test successful api call to get personality type by utilising the user id #1 #12', () => {
    const axiosMockFunc = axiosMock.get.mockResolvedValueOnce({
      data: FUNCTION_DATA,
    });

    store.dispatch(loadPersonalityType(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_PERSONALITY_INFO_REQUEST },
        {
          type: GET_PERSONALITY_INFO_SUCCESS,
          payload: FUNCTION_DATA,
        },
      ]);
    });
  });

  /* Test that error is correctly handled when backend returns an error */
  it('test failure error handling of action', () => {
    const axiosMockFunc = axiosMock.get.mockRejectedValueOnce(
      new Error('this test should fail')
    );

    store.dispatch(loadPersonalityType(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_PERSONALITY_INFO_REQUEST },
        {
          type: GET_PERSONALITY_INFO_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });
});

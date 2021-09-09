import {
  GET_CAREER_RECOMMENDATIONS_REQUEST,
  GET_CAREER_RECOMMENDATIONS_SUCCESS,
  GET_CAREER_RECOMMENDATIONS_FAIL,
} from '../../../constants/careerConstants';
import {
  loadRecommendationsWithScore,
  loadRecommendations,
  loadRecommendationsByComponent,
} from '../../../actions/careerActions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axiosMock from 'axios';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

jest.mock('axios');
const mockStore = configureMockStore([thunk]);

/* Test suite for the load recommendations by score action*/
describe('LoadRecommendationsWithScore test #2 #5 #3', () => {
  let store;
  let functionData;
  beforeEach(() => {
    store = mockStore({
      loggedUser: {
        userInfo: {
          _id: 1,
          token: '',
        },
      },
    });

    functionData = [
      {
        associatedPersonalityType: 'ESTP',
        careerTitle: 'Test Career',
        careerDescription: 'This is a test career description',
        extraversionScore: 10,
        sensingScore: 10,
        thinkingScore: 10,
        perceivingScore: 10,
        avgSalary: 20000,
        associatedImage: '/images/testImage.png',
        associatedSector: 1,
        matchScore: 10,
      },
      {
        associatedPersonalityType: 'ESTP',
        careerTitle: 'Test Career 2',
        careerDescription: 'This is a test career description',
        extraversionScore: 10,
        sensingScore: 10,
        thinkingScore: 10,
        perceivingScore: 10,
        avgSalary: 20000,
        associatedImage: '/images/testImage.png',
        associatedSector: 1,
        matchScore: 20,
      },
    ];
  });

  /* Test for the successful dispatch of the load career recommendation with score action*/
  it('test successful get get career recommendations with score action #2 #3', () => {
    const axiosMockFunc = axiosMock.get.mockResolvedValueOnce({
      data: functionData,
    });

    store.dispatch(loadRecommendationsWithScore(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_CAREER_RECOMMENDATIONS_REQUEST },
        {
          type: GET_CAREER_RECOMMENDATIONS_SUCCESS,
          payload: { recommendations: functionData, filter: 'typecode' },
        },
      ]);
    });
  });

  /* Test to check that the action has dispatched the correctly ordered careers based on match score, data point 2 should now be in first position*/
  it('test that action orders data correctly in descending order #3', () => {
    const axiosMockFunc = axiosMock.get.mockResolvedValueOnce({
      data: functionData,
    });

    store.dispatch(loadRecommendationsWithScore(axiosMockFunc)).then(() => {
      expect(store.getActions()[1].payload.recommendations[0]).toEqual({
        associatedPersonalityType: 'ESTP',
        careerTitle: 'Test Career 2',
        careerDescription: 'This is a test career description',
        extraversionScore: 10,
        sensingScore: 10,
        thinkingScore: 10,
        perceivingScore: 10,
        avgSalary: 20000,
        associatedImage: '/images/testImage.png',
        associatedSector: 1,
        matchScore: 20,
      });
    });
  });

  /* Test that ensures get recommendation raises the correct error*/
  it('test correct failure of get recommendation action is handled', () => {
    const axiosMockFunc = axiosMock.get.mockRejectedValueOnce(
      new Error('this test should fail')
    );

    store.dispatch(loadRecommendationsWithScore(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_CAREER_RECOMMENDATIONS_REQUEST },
        {
          type: GET_CAREER_RECOMMENDATIONS_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });
});

/* Test suite for the load recommendations action*/
describe('LoadRecommendations test #2 #5', () => {
  let store;
  let functionData;
  beforeEach(() => {
    store = mockStore({});
    functionData = [
      {
        associatedPersonalityType: 'ESTP',
        careerTitle: 'Test Career',
        careerDescription: 'This is a test career description',
        extraversionScore: 10,
        sensingScore: 10,
        thinkingScore: 10,
        perceivingScore: 10,
        avgSalary: 20000,
        associatedImage: '/images/testImage.png',
        associatedSector: 1,
      },
    ];
  });

  /* Test for the successful dispatch of the load career recommendation action*/
  it('test successful get get career recommendations action #2 #3', () => {
    const axiosMockFunc = axiosMock.get.mockResolvedValueOnce(
      {
        data: functionData,
      },
      'ESTP'
    );

    store.dispatch(loadRecommendations(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_CAREER_RECOMMENDATIONS_REQUEST },
        {
          type: GET_CAREER_RECOMMENDATIONS_SUCCESS,
          payload: { filter: 'NA', recommendations: functionData },
        },
      ]);
    });
  });

  /* Test that ensures get recommendation raises the correct error*/
  it('test correct failure of get recommendation action is handled', () => {
    const axiosMockFunc = axiosMock.get.mockRejectedValueOnce(
      new Error('this test should fail')
    );

    store.dispatch(loadRecommendations(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_CAREER_RECOMMENDATIONS_REQUEST },
        {
          type: GET_CAREER_RECOMMENDATIONS_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });
});

/*  Test suite for the load recommendations by component action */
describe('Test Suite for the load recommendations by component action #25', () => {
  let store;
  let functionData;

  beforeEach(() => {
    store = mockStore({});
    functionData = [
      {
        associatedPersonalityType: 'ESTP',
        careerTitle: 'Test Career',
        careerDescription: 'This is a test career description',
        extraversionScore: 10,
        sensingScore: 10,
        thinkingScore: 10,
        perceivingScore: 10,
        avgSalary: 20000,
        associatedImage: '/images/testImage.png',
        associatedSector: 1,
      },
      {
        associatedPersonalityType: 'ENTP',
        careerTitle: 'Test Career',
        careerDescription: 'This is a test career description',
        extraversionScore: 10,
        sensingScore: 10,
        thinkingScore: 10,
        perceivingScore: 10,
        avgSalary: 20000,
        associatedImage: '/images/testImage.png',
        associatedSector: 1,
      },
    ];
  });

  /* Test for the successful dispatch of the load career recommendation by personality component*/
  it('test successful get get career recommendations by personality component #25', () => {
    const axiosMockFunc = axiosMock.get.mockResolvedValueOnce({
      data: functionData,
    });

    store
      .dispatch(loadRecommendationsByComponent('E', axiosMockFunc))
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: GET_CAREER_RECOMMENDATIONS_REQUEST },
          {
            type: GET_CAREER_RECOMMENDATIONS_SUCCESS,
            payload: { filter: 'E', recommendations: functionData },
          },
        ]);
      });
  });

  /* Test that ensures get recommendation by component  raises the correct error*/
  it('test correct failure of get recommendation by component action is handled', () => {
    const axiosMockFunc = axiosMock.get.mockRejectedValueOnce(
      new Error('this test should fail')
    );

    store.dispatch(loadRecommendationsByComponent(axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: GET_CAREER_RECOMMENDATIONS_REQUEST },
        {
          type: GET_CAREER_RECOMMENDATIONS_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });
});

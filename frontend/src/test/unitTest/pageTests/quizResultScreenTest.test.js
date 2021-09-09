import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { BrowserRouter, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import QuizResultScreen from '../../../pages/QuizResultScreen';
import { GET_CAREER_RECOMMENDATIONS_REQUEST } from '../../../constants/careerConstants';
import { GET_PERSONALITY_INFO_REQUEST } from '../../../constants/personalityConstants';

const mockStore = configureStore([thunk]);

afterEach(cleanup);

/* Test for the correct rendering of the result screen */
describe('Quiz Result Screen Render', () => {
  let store;

  /* Unlogged user tested here*/
  it('successful render of result screen #1 #2 #10 #12', () => {
    store = mockStore({
      personalityResults: {
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
      },
      user: {
        personalityCode: 'ESTP',
      },
      recommendedCareers: {
        recommendations: [
          {
            careerTitle: 'Example Title',
            careerDescription: 'Example career description',
            avgSalary: 1,
            matchScore: 10,
          },
        ],
      },
      loggedUser: {},
    });

    const { getByTestId, getByText, queryByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizResultScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Your Personality Type:'));
    expect(getByText('example title'));
    expect(getByText('example description'));
    expect(getByText('(Please click each career item to expand)'));
    expect(getByTestId('personality-information-component'));
    expect(getByTestId('career-recommendation-component'));
    expect(getByText('Results'));
    expect(getByText('Home'));
    expect(
      getByText(
        'In order to see the strength of each of your matches, please create an account'
      )
    );
    expect(getByText('here'));
    expect(queryByTestId('filter-bar'));
  });

  /* Successfully redirects away if the quiz has not been taken*/
  it('successful redirection if test has not been taken', () => {
    store = mockStore({
      personalityResults: {},
      user: {
        personalityCode: false,
      },
      recommendedCareers: {},
      loggedUser: { userInfo: {} },
    });

    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizResultScreen />
          <Route path="/">HomePage</Route>
        </Provider>
      </BrowserRouter>
    );

    expect(container).toHaveTextContent('HomePage');
  });

  /* Test that correct error messages are displayed when backend service return an error response*/
  it('test error messages are displayed when no career results are present or personality types are present', () => {
    store = mockStore({
      personalityResults: {
        error: 'No personality type passed to server',
      },
      user: {
        personalityCode: 'ESTP',
      },
      recommendedCareers: {
        error: 'No Careers for that type are stored',
      },
      loggedUser: {},
    });
    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizResultScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('No Careers for that type are stored'));
    expect(getByText('No personality type passed to server'));
  });

  /* Test that correct error messages are displayed when backend service return an error response*/
  it('test loaders are present when action is being executed', () => {
    store = mockStore({
      personalityResults: {
        loading: true,
      },
      user: {
        personalityCode: 'ESTP',
      },
      recommendedCareers: {
        loading: true,
      },
      loggedUser: {},
    });
    const { getAllByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizResultScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getAllByTestId('loader')).toHaveLength(2);
  });

  /*Test that the match score is shown in the career display component when the match score is present */
  it('test that match score and filter bar is present when the user is logged in to an account #3', () => {
    store = mockStore({
      personalityResults: {
        personalityType: {
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
      },
      user: {
        personalityCode: 'ESTP',
      },
      recommendedCareers: {
        recommendations: [
          {
            careerTitle: 'Example Title',
            careerDescription: 'Example career description',
            avgSalary: 1,
            matchScore: 10,
          },
        ],
      },
      loggedUser: { userInfo: { _id: 1 } },
    });

    const { getByText, getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizResultScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('10'));
    expect(getByTestId('filter-bar'));
  });
});

/* Test suite for the hooks and events on the quiz result screen component.*/
describe('TestQuizResultScreenEvents', () => {
  let store;

  /* Test that redirection occurs when user presses home*/
  it('test breadcrumb redirects when user clicks home', () => {
    store = mockStore({
      personalityResults: {},
      user: { personalityCode: 'TEST' },
      recommendedCareers: {},
      loggedUser: {
        userInfo: {},
      },
    });
    const { container, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizResultScreen />
          <Route path="/">HomePage</Route>
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByText('Home'));
    expect(container).toHaveTextContent('HomePage');
  });

  /* Test re direction to the register screen occurs when user pressed 'here' link*/
  it('test link redirection to register page', () => {
    store = mockStore({
      personalityResults: {},
      user: { personalityCode: 'TEST' },
      recommendedCareers: {},
      loggedUser: {},
    });
    const { container, getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizResultScreen />
          <Route path="/register">Register</Route>
        </Provider>
      </BrowserRouter>
    );
    fireEvent.click(getByTestId('register-link'));
    expect(container).toHaveTextContent('Register');
  });

  /* Test that correct actions are fired when recommendations and personality type need to be loaded. Both actions dispatch the same updates and as such do not need to be tested individually*/
  it('test that dispatch actions are fired by use effect when the user has know recommendations or personality type but has a valid personality code', () => {
    store = mockStore({
      personalityResults: {},
      user: { personalityCode: '' },
      recommendedCareers: {},
      loggedUser: {
        userInfo: { _id: 1 },
      },
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizResultScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(store.getActions()).toEqual([
      { type: GET_PERSONALITY_INFO_REQUEST },
      { type: GET_CAREER_RECOMMENDATIONS_REQUEST },
    ]);
  });
});

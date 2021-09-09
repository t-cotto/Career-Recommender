import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Header from '../../../components/Header';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { USER_LOGOUT } from '../../../constants/userConstants';
import { GET_PERSONALITY_INFO_RESET } from '../../../constants/personalityConstants';
import { GET_CAREER_RECOMMENDATIONS_RESET } from '../../../constants/careerConstants';

afterEach(cleanup);
const mockStore = configureStore([thunk]);

/* Render test for the header component*/
describe('HeaderComponent render test', () => {
  /* Successful render test for the header component and each sub component when the user is signed in*/
  it('successful render test for the header component #19', () => {
    const store = mockStore({
      user: {
        personalityCode: 'ESTP',
      },
      loggedUser: {
        userInfo: {
          firstName: 'Example',
          personalityType: 'TEST',
        },
      },
    });

    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Career Recommender'));
    expect(getByText('Example'));
    expect(getByText('View Results'));
    fireEvent.click(getByText('Example'));
    expect(getByText('Log Out'));
  });

  /* Test that the view result option is not available when the user does not have a store personality type code but they are signed in*/
  it('test that view result nav is not rendered when signed in user has no personality type', () => {
    const store = mockStore({
      user: {
        personalityCode: 'TEST',
      },
      loggedUser: {
        userInfo: { firstName: 'Example' },
      },
    });

    const { getByText, queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
        </Provider>
      </BrowserRouter>
    );

    expect(queryByText('Views Results')).toBeFalsy();
  });

  /* Test that login is shown when no user info is present*/
  it('test full render of the header when no user info is present and they have completed the quiz #11 #35', () => {
    const store = mockStore({
      user: {
        personalityCode: 'TEST',
      },
      loggedUser: {},
    });

    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Login'));
    expect(getByText('Register'));
    expect(getByText('View Results'));
  });

  /* Test that view results is not present when the user isnt logged in and has no cached quiz data*/
  it('test that view results not present when user not logged in and has no cached quiz data', () => {
    const store = mockStore({
      user: {},
      loggedUser: {},
    });

    const { getByText, queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
        </Provider>
      </BrowserRouter>
    );

    expect(queryByText('View Results')).toBeFalsy();
  });
});

/* Tests for the events that occur on the header screen*/
describe('Header Events Test', () => {
  /* test that the correct actions are fired by the logout handler when the user presses logout*/
  it('Test that logout action is fired when the logout button is pressed', () => {
    const store = mockStore({
      user: {},
      loggedUser: {
        userInfo: {
          firstName: 'Example',
        },
      },
    });

    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
        </Provider>
      </BrowserRouter>
    );
    fireEvent.click(getByText('Example'));
    fireEvent.click(getByText('Log Out'));
    expect(store.getActions()).toEqual([
      { type: USER_LOGOUT },
      { type: GET_PERSONALITY_INFO_RESET },
      { type: GET_CAREER_RECOMMENDATIONS_RESET },
    ]);
  });

  /* Test that user is redirected to the results page when pressing view results*/
  it('test that user is moved to view results page on nav click', () => {
    const store = mockStore({
      user: { personalityCode: 'ESTP' },
      loggedUser: {
        userInfo: {
          firstName: 'Example',
        },
      },
    });

    const { container, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
          <Route path="/results">Results</Route>
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByText('View Results'));
    expect(container).toHaveTextContent('Results');
  });

  /* Test that user is moved to login page on login nav click*/
  it('test that user is moved to login page on login click', () => {
    const store = mockStore({
      user: { personalityCode: 'ESTP' },
      loggedUser: {},
    });

    const { container, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
          <Route path="/login">Login</Route>
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByText('Login'));
    expect(container).toHaveTextContent('Login');
  });

  /* Test that user is moved to register page when clicking registration nav*/
  it('test that user is moved to register page on register click', () => {
    const store = mockStore({
      user: { personalityCode: 'ESTP' },
      loggedUser: {},
    });

    const { container, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
          <Route path="/register">Register</Route>
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByText('Register'));
    expect(container).toHaveTextContent('Login');
  });

  /* That that user is moved to the homepage on brand click*/
  it('test that user is moved to home page on login click', () => {
    const store = mockStore({
      user: { personalityCode: 'ESTP' },
      loggedUser: {},
    });

    const { container, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Header></Header>
          <Route path="/">Home</Route>
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByText('Career Recommender'));
    expect(container).toHaveTextContent('Home');
  });
});

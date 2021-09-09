import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import RegisterScreen from '../../../pages/RegisterScreen';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { USER_REGISTER_REQUEST } from '../../../constants/userConstants';

afterEach(cleanup);
const mockStore = configureStore([thunk]);

/* Render test for the user register screen and form*/
describe('RegisterScreenRenderTest', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      registration: {},
      loggedUser: {},
      user: { personalityCode: 'TEST' },
      userAnswers: {},
    });
  });

  /* Successful render of the register screen*/
  it('sucessful render of the register screen #33', () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    expect(getByText('Register Here'));
    expect(getByTestId('register-form'));
  });

  /* Test that error message is displayed when invalid email is sent to the databse*/
  it('test that error message is displayed when error response is sent from the backend', () => {
    store = mockStore({
      registration: { error: 'Email already matches existing user' },
      loggedUser: {},
      user: { personalityCode: 'TEST' },
      userAnswers: {},
    });

    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <RegisterScreen history={history} />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Email already matches existing user'));
  });
});

/* Test suite for the events and hooks for the register page*/
describe('RegisterScreen Event Tests', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      registration: {},
      loggedUser: {},
      user: { personalityCode: 'TEST' },
      userAnswers: {},
    });
  });

  /* Test that redirection occurs when the user moves to the register screen and already has user login information */
  it('test that history is called when user info is present so the screen redirects', () => {
    const history = { push: jest.fn() };
    store = mockStore({
      registration: {},
      loggedUser: { userInfo: {} },
      user: { personalityCode: 'TEST' },
      userAnswers: {},
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <RegisterScreen history={history} />
        </Provider>
      </BrowserRouter>
    );

    expect(history.push).toHaveBeenCalledTimes(1);
  });

  /* Test correct action is fired when user presses submit*/
  it('test store is called with correct action when user presses submit', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    fireEvent.change(getByTestId('register-screen-first-name-control'), {
      target: { value: 'name' },
    });

    fireEvent.change(getByTestId('register-screen-last-name-control'), {
      target: { value: 'name' },
    });

    fireEvent.change(getByTestId('register-screen-email-control'), {
      target: { value: 'name@email.com' },
    });

    fireEvent.change(getByTestId('register-screen-password-control'), {
      target: { value: 'password' },
    });

    fireEvent.change(getByTestId('register-screen-confirm-password-control'), {
      target: { value: 'password' },
    });

    fireEvent.change(getByTestId('register-screen-dob-control'), {
      target: { value: '2020-08-09' },
    });

    fireEvent.click(getByTestId('register-button-register-form'));

    expect(store.getActions()).toEqual([{ type: USER_REGISTER_REQUEST }]);
  });

  /* Test that when button is enabled by email and password the submit handler fails validation with other fields missing*/
  it('test that submit handler does not work when form fails validation', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    fireEvent.change(getByTestId('register-screen-email-control'), {
      target: { value: 'name@email.com' },
    });
    fireEvent.change(getByTestId('register-screen-password-control'), {
      target: { value: 'password' },
    });

    fireEvent.change(getByTestId('register-screen-confirm-password-control'), {
      target: { value: 'password' },
    });

    fireEvent.click(getByTestId('register-button-register-form'));

    expect(store.getActions()).toEqual([]);
  });

  /* Test that form validation fails when only one field is missing*/
  it('test submit handler fails with one field missing', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterScreen />
      </Provider>
    );

    fireEvent.change(getByTestId('register-screen-first-name-control'), {
      target: { value: 'name' },
    });

    fireEvent.change(getByTestId('register-screen-email-control'), {
      target: { value: 'name@email.com' },
    });

    fireEvent.change(getByTestId('register-screen-password-control'), {
      target: { value: 'password' },
    });

    fireEvent.change(getByTestId('register-screen-confirm-password-control'), {
      target: { value: 'password' },
    });

    fireEvent.change(getByTestId('register-screen-dob-control'), {
      target: { value: '2020-08-09' },
    });

    fireEvent.click(getByTestId('register-button-register-form'));

    expect(store.getActions()).toEqual([]);
  });
});

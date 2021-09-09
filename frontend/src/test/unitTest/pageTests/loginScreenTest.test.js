import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import LoginScreen from '../../../pages/LoginScreen';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { USER_LOGIN_REQUEST } from '../../../constants/userConstants';

afterEach(cleanup);
const mockStore = configureStore([thunk]);

/* Render test for the user register screen and form*/
describe('LoginScreenRenderTest', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      loggedUser: {},
    });
  });

  /* Successful render of the login screen*/
  it('sucessful render of the login screen #35', () => {
    const { getByText, getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Login Here'));
    expect(getByText('Email Address'));
    expect(getByText('Password'));
    expect(getByText('Login'));
    expect(getByTestId('login-screen-email-control'));
    expect(getByTestId('login-screen-password-control'));
  });

  /* Test that the correct error is shown if there is the presence of an error in the reducer*/
  it('test that error message is shown when there is a problem with the user login actions', () => {
    store = mockStore({
      loggedUser: {
        error: 'Test Error Message',
      },
    });

    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Test Error Message'));
  });
});

/* Test suite for the events and hooks for the login page*/
describe('Login Screen Event Tests', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      loggedUser: {},
    });

    jest.clearAllMocks();
  });

  /* Test that the user is redirected when they already have account information present in their system*/
  it('test that use effect is called and history.push is called when user info is present', () => {
    store = mockStore({
      loggedUser: { userInfo: { _id: 1 } },
    });

    const history = { push: jest.fn() };

    render(
      <BrowserRouter>
        <Provider store={store}>
          <LoginScreen history={history} />
        </Provider>
      </BrowserRouter>
    );

    expect(history.push).toHaveBeenCalledTimes(1);
  });

  /* Test that the login button is disabled until the user inputs both an email and password*/
  it('test that button is disabled until user has provided both an email and password', () => {
    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Login').disabled).toEqual(true);

    fireEvent.change(getByTestId('login-screen-email-control'), {
      target: { value: 'test@email.com' },
    });

    expect(getByText('Login').disabled).toEqual(true);

    fireEvent.change(getByTestId('login-screen-password-control'), {
      target: { value: 'test' },
    });

    expect(getByText('Login').disabled).toEqual(false);
  });

  /* Test the correct action is fired when user attempts to login*/
  it('test that the correct action is fired when user attempts to login', () => {
    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      </BrowserRouter>
    );

    fireEvent.change(getByTestId('login-screen-email-control'), {
      target: { value: 'test@email.com' },
    });
    fireEvent.change(getByTestId('login-screen-password-control'), {
      target: { value: 'test' },
    });
    fireEvent.click(getByText('Login'));
    expect(store.getActions()).toEqual([{ type: USER_LOGIN_REQUEST }]);
  });

  /* Test that set state is called when email form is changed */
  it('test set state is called when email form is changed #35', () => {
    let setSomeState = jest.fn();
    let useStateMock = jest.spyOn(React, 'useState');

    useStateMock.mockImplementation((someState) => [someState, setSomeState]);

    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      </BrowserRouter>
    );
    fireEvent.change(getByTestId('login-screen-email-control'), {
      target: { value: 'test' },
    });
    fireEvent.change(getByTestId('login-screen-password-control'), {
      target: { value: 'test' },
    });

    expect(setSomeState).toHaveBeenCalledTimes(2);
  });
});

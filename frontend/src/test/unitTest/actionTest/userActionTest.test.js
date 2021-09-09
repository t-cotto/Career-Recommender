import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axiosMock from 'axios';
import { cleanup } from '@testing-library/react';
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  UPDATE_CURRENT_USER,
  USER_REGISTER_RESET,
} from '../../../constants/userConstants';
import { register, login, logout } from '../../../actions/userActions';
import { GET_PERSONALITY_INFO_RESET } from '../../../constants/personalityConstants';
import { GET_CAREER_RECOMMENDATIONS_RESET } from '../../../constants/careerConstants';

afterEach(cleanup);
jest.mock('axios');
const mockStore = configureMockStore([thunk]);

/* Test suite for the registration action*/
describe('RegisterAction Test', () => {
  let store;
  let mockPostData;
  let returnData;
  let mockPostDataWithResults;

  beforeEach(() => {
    store = mockStore({ registration: {} });

    mockPostData = {
      firstName: 'example',
      lastName: 'user',
      email: 'example@email.com',
      password: 'examplepass',
      dob: Date(2021, 7, 13).toString,
    };

    mockPostDataWithResults = {
      firstName: 'example',
      lastName: 'user',
      email: 'example@email.com',
      password: 'examplepass',
      dob: Date(2021, 7, 13).toString,
      personalityCode: 'TEST',
      userAnswers: {},
    };

    returnData = {
      userInfo: {
        _id: 1,
        email: 'example@email.com',
        firstName: 'example',
        lastName: 'user',
        dob: '2021-07-13',
        token: 'example token',
      },
    };
  });

  /* Test for the successful completion of the action*/
  it('user account details are dispatched after succesful api connection and account creation #33', () => {
    const axiosMockFunc = axiosMock.post.mockResolvedValueOnce({
      data: returnData,
    });

    store.dispatch(register(mockPostData, axiosMockFunc)).then(() =>
      expect(store.getActions()).toEqual([
        { type: USER_REGISTER_REQUEST },
        {
          payload: true,
          type: USER_REGISTER_SUCCESS,
        },
        {
          payload: returnData,
          type: USER_LOGIN_SUCCESS,
        },
        { type: GET_PERSONALITY_INFO_RESET },
        { type: GET_CAREER_RECOMMENDATIONS_RESET },
        {
          payload: {
            userInfo: {
              _id: 1,
              dob: '2021-07-13',
              email: 'example@email.com',
              firstName: 'example',
              lastName: 'user',
              token: 'example token',
            },
          },
          type: UPDATE_CURRENT_USER,
        },
        { type: USER_REGISTER_RESET },
      ])
    );
  });

  /* Test that error is handled correctly when api response returns an error.*/
  it('Testing unsuccessful submission of user registration details', () => {
    const axiosMockFunc = axiosMock.post.mockRejectedValueOnce(
      new Error('this test should fail')
    );

    store.dispatch(register(mockPostData, axiosMockFunc)).then(() => {
      expect(store.getActions()).toEqual([
        { type: USER_REGISTER_REQUEST },
        {
          type: USER_REGISTER_FAIL,
          payload: 'this test should fail',
        },
      ]);
    });
  });

  /* Test that the necessary locally stored data has now been deleted when the user registers.*/
  it('Test that all locally stored data for the now registered user is deleted', () => {
    const axiosMockFunc = axiosMock.post.mockResolvedValueOnce({
      data: returnData,
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });
    store
      .dispatch(register(mockPostDataWithResults, axiosMockFunc))
      .then(() => {
        expect(window.localStorage.removeItem).toHaveBeenCalledTimes(3);
      });
  });

  /* Test that set items are called when the user successfully registers in*/
  it('Test that local storage set is called when registrations are successful', () => {
    const axiosMockFunc = axiosMock.post.mockResolvedValueOnce({
      data: returnData,
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });
    store.dispatch(register(mockPostData, axiosMockFunc)).then(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });
});

/* Test suite for the login action*/
describe('LoginAction Test', () => {
  let store;
  let mockPostData;

  beforeEach(() => {
    store = mockStore({ loggedUser: {} });

    mockPostData = {
      email: 'example@email.com',
      password: 'examplepass',
    };
  });

  /* Test for the successful completion of the action*/
  it('user account details are dispatched after succesful api connection and login achieved #35', () => {
    const returnData = {
      userInfo: {
        refresh: 'example refresh token',
        access: 'example access token',
        _id: 1,
        email: 'example@email.com',
        firstName: 'example',
        lastName: 'user',
        dob: '2021-07-13',
        token: 'example token',
      },
    };

    const axiosMockFunc = axiosMock.post.mockResolvedValueOnce(
      {
        data: returnData,
      },
      mockPostData
    );

    store
      .dispatch(login('example@email.com', 'examplepass', axiosMockFunc))
      .then(() =>
        expect(store.getActions()).toEqual([
          { type: USER_LOGIN_REQUEST },
          {
            payload: returnData,
            type: USER_LOGIN_SUCCESS,
          },
          { type: GET_PERSONALITY_INFO_RESET },
          { type: GET_CAREER_RECOMMENDATIONS_RESET },
          {
            payload: {
              userInfo: {
                _id: 1,
                access: 'example access token',
                dob: '2021-07-13',
                email: 'example@email.com',
                firstName: 'example',
                lastName: 'user',
                refresh: 'example refresh token',
                token: 'example token',
              },
            },
            type: UPDATE_CURRENT_USER,
          },
        ])
      );
  });

  /* Test that error is handled correctly when api response returns an error.*/
  it('Testing unsuccessful submission of user login details', () => {
    const axiosMockFunc = axiosMock.post.mockRejectedValueOnce(
      new Error('this test should fail'),
      mockPostData
    );

    store
      .dispatch(login('example@email.com', 'examplepass', axiosMockFunc))
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: USER_LOGIN_REQUEST },
          {
            type: USER_LOGIN_FAIL,
            payload: 'this test should fail',
          },
        ]);
      });
  });
});

/* Test for the logout action */
describe('LogoutTest', () => {
  let store;

  /* Test that the necessary dispatch actions are fired in order to log the user out and remove their personality details from the reducer*/
  it('test that user is logged out when log out action is fired', () => {
    store = mockStore({});

    store.dispatch(logout());
    expect(store.getActions()).toEqual([
      { type: USER_LOGOUT },
      { type: GET_PERSONALITY_INFO_RESET },
      { type: GET_CAREER_RECOMMENDATIONS_RESET },
    ]);
  });

  /* Test that local storage is called and the user info is successfully deleted */
  it('test that local storage is called and user info is deleted when user logs out', () => {
    store = mockStore({});
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: jest.fn(),
      },
      writable: true,
    });
    store.dispatch(logout());
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import HomeScreen from '../../../pages/HomeScreen';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import {
  EXTRAVERSION_HOME_SCREEN_DESCRIPTION,
  SENSING_HOME_SCREEN_DESCRIPTION,
  THINKING_HOME_SCREEN_DESCRIPTION,
  PERCEIVING_HOME_SCREEN_DESCRIPTION,
  QUIZ_EXPLANATION_HOME_SCREEN,
} from '../../../constants/stringConstants';

const mockStore = configureStore([thunk]);

afterEach(cleanup);

/* Unit test collection to ensure the home screen renders correctly */
describe('HomeScreen Render', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      questionSet: {
        questionSet: [],
      },
      user: {},
    });
  });

  /* Test to ensure the home screen renders correctly using mock state */
  it('check home screen item render #9 #1', () => {
    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <HomeScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId('home-screen-quiz-button').disabled).toEqual(false);
    expect(getByText('How It Works'));
    expect(getByText(QUIZ_EXPLANATION_HOME_SCREEN));
    expect(getByText(EXTRAVERSION_HOME_SCREEN_DESCRIPTION));
    expect(getByText(PERCEIVING_HOME_SCREEN_DESCRIPTION));
    expect(getByText(THINKING_HOME_SCREEN_DESCRIPTION));
    expect(getByText(SENSING_HOME_SCREEN_DESCRIPTION));
  });
});

/* Tests for the functionality of each of the home screen components. */
describe('HomeScreen functionality ', () => {
  let noUserStore;
  let userStore;
  let date;
  let history;

  beforeEach(() => {
    noUserStore = mockStore({
      questionSet: {
        questionSet: [],
      },
      user: {},
    });

    userStore = mockStore({
      questionSet: {
        questionSet: [],
      },
      user: { quizDate: date - 86400000 },
    });

    date = new Date();
    date = date.getTime();
    history = { push: jest.fn() };
  });

  /*Test to ensure the quiz button is clicked and history.push is called when there is no previously taken quiz date */
  it('check home screen quiz button click #1', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={noUserStore}>
          <HomeScreen history={history} />
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('home-screen-quiz-button'));
    expect(history.push).toHaveBeenCalledTimes(1);
  });

  /* Test that the button click handler dispatches the window function when the logged user has taken the test in the last 6 months */
  it('Test onClickHandler for quiz when logged user taken test in past 6 months #20', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementationOnce(jest.fn());

    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={userStore}>
          <HomeScreen history={history} />
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('home-screen-quiz-button'));
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledTimes(0);
  });

  /* Test that window function is called when the local user has taken the test in the last six months*/
  it('test onclickHandler for quiz button when local user has taken test in last 6 months #20', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementationOnce(jest.fn());

    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={userStore}>
          <HomeScreen history={history} />
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('home-screen-quiz-button'));
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledTimes(0);
  });

  /* Test to ensure the button is disabled when the quiz time for logged user is within the one day boundary of quiz taken*/
  it('check button is disabled when logged user quizDate is inside the boundary #13', () => {
    const store = mockStore({
      questionSet: {
        questionSet: [],
      },
      user: { quizDate: date },
    });

    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <HomeScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId('home-screen-quiz-button').disabled).toEqual(true);
    expect(getByText('You Can only take the quiz once every 24hr period'));
  });

  /* Test to ensure the button is disabled when the quiz time for locally stored user is within the boundary */
  it('check button is disabled when local storage user quizDate is inside the boundary #13', () => {
    const store = mockStore({
      questionSet: {
        questionSet: [],
      },
      user: { quizDate: date },
    });

    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <HomeScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId('home-screen-quiz-button').disabled).toEqual(true);
    expect(getByText('You Can only take the quiz once every 24hr period'));
  });

  /* Test to ensure quiz button is enabled when the quiz time is outside the boundary of a single day, - 8.64e7 is the millisecond representation of a single day*/
  it('check button is enabled when quiz date is outside the boundary #13', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={userStore}>
          <HomeScreen />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId('home-screen-quiz-button').disabled).toEqual(false);
  });
});

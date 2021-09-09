import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import QuizScreen from '../../../../pages/QuizScreen';
import configureStore from 'redux-mock-store';
import { BrowserRouter, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import {
  QUIZ_QUESTION_SET_REQUEST,
  USER_ANSWER_CHANGE,
} from '../../../../constants/quizConstants';
import { USER_PERSONALITY_REQUEST } from '../../../../constants/userConstants';

const mockQuestionStore = configureStore([thunk]);
afterEach(cleanup);

/* Test suite for testing events and hooks in the quiz screen.*/
describe('QuizScreen Events', () => {
  /* Test that store is has correct action dispatched when question set is not present*/
  it('test that dispatch is called when questions are not present #1', () => {
    const store = mockQuestionStore({
      questionSet: {
        questionSet: [],
      },
      user: {
        personalityCode: '',
        quizDate: new Date().getTime() - 86400000,
      },
      loggedUser: {},
    });
    const match = { params: { factor: 'extraversion' } };

    render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
        </Provider>
      </BrowserRouter>
    );

    expect(store.getActions()).toEqual([{ type: QUIZ_QUESTION_SET_REQUEST }]);
  });

  /* Test that history.push is called when the user is finished and has a valid personality type*/
  it('test that history.push is called when user has completed the quiz #1', () => {
    const store = mockQuestionStore({
      questionSet: {
        questionSet: [
          {
            _questionId: 1,
            personalityFactor: 'perceiving',
            multiplier: 1,
            questionContent: 'this is an example perceiving question',
            questionSetNumber: 1,
          },
        ],
      },
      user: {
        personalityCode: 'TEST',
        quizDate: new Date().getTime() - 86400000,
      },
      loggedUser: {},
    });
    const match = { params: { factor: 'perceiving' } };
    const history = { push: jest.fn() };

    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} history={history} />
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('question-item-strongagree-button-1'));
    fireEvent.click(getByText('Finish'));
    expect(history.push).toHaveBeenCalledTimes(1);
  });

  /* Test that the correct action is fired when the user is finished quiz and presses finish button, updating their answers then calling post action*/
  it('test corect action is dispatched when finish is clicked', () => {
    const store = mockQuestionStore({
      questionSet: {
        questionSet: [
          {
            _questionId: 1,
            personalityFactor: 'perceiving',
            multiplier: 1,
            questionContent: 'this is an example perceiving question',
            questionSetNumber: 1,
          },
        ],
      },
      user: {
        personalityCode: 'TEST',
        quizDate: new Date().getTime() - 86400000,
      },
      loggedUser: {},
    });
    const match = { params: { factor: 'perceiving' } };
    const history = { push: jest.fn() };

    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} history={history} />
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('question-item-strongagree-button-1'));
    fireEvent.click(getByText('Finish'));
    expect(store.getActions()).toEqual([
      {
        type: USER_ANSWER_CHANGE,
        payload: { factor: 'perceiving', value: 2 },
      },
      { type: USER_PERSONALITY_REQUEST },
    ]);
  });

  /* Test that the correct update user answers action is called when the user presses the next button*/
  it('test correct action is dispatch when next is clicked', () => {
    const store = mockQuestionStore({
      questionSet: {
        questionSet: [
          {
            _questionId: 1,
            personalityFactor: 'extraversion',
            multiplier: 1,
            questionContent: 'this is an example extraversion question',
            questionSetNumber: 1,
          },
        ],
      },
      user: {
        personalityCode: '',
        quizDate: new Date().getTime() - 86400000,
      },
      loggedUser: {},
    });
    const match = { params: { factor: 'extraversion' } };
    const history = { push: jest.fn() };

    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} history={history} />
        </Provider>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('question-item-strongagree-button-1'));
    fireEvent.click(getByText('Next'));
    expect(store.getActions()).toEqual([
      {
        type: USER_ANSWER_CHANGE,
        payload: { factor: 'extraversion', value: 2 },
      },
    ]);
  });
});

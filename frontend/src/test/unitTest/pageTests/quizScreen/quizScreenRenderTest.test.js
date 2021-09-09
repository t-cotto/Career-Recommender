import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import QuizScreen from '../../../../pages/QuizScreen';
import configureStore from 'redux-mock-store';
import { BrowserRouter, Route } from 'react-router-dom';
import thunk from 'redux-thunk';

const mockQuestionStore = configureStore([thunk]);

afterEach(cleanup);

/* Test suite for the rendering of the Quiz Screen component.*/
describe('QuizScreen Render', () => {
  let store;

  beforeEach(() => {
    store = mockQuestionStore({
      questionSet: {
        questionSet: [
          {
            _questionId: 1,
            personalityFactor: 'extraversion',
            multiplier: 1,
            questionContent: 'this is an example question extraversion ',
            questionSetNumber: 1,
          },
          {
            _questionId: 2,
            personalityFactor: 'sensing',
            multiplier: 1,
            questionContent: 'this is an example sensing question',
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
  });

  /* Test to ensure the successful render of the quiz screen before anything has been clicked*/
  it('check successful render of page with data #1', () => {
    const match = { params: { factor: 'extraversion' } };

    const { getByText, queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Quiz'));
    expect(getByText('Home'));
    expect(getByText('Please answer all of the following questions'));
    expect(getByText('this is an example question extraversion'));
    expect(getByText('Please fill out all the questions'));

    /* Personality factor under test should be extraversion so a sensing question should not appear */
    expect(queryByText('this is an example sensing question')).toBeNull();
  });

  /* Test render using a different personality type*/
  it('Test render with different personality factor', () => {
    const match = { params: { factor: 'sensing' } };

    const { getByText, queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('Quiz'));
    expect(getByText('Home'));
    expect(getByText('Please answer all of the following questions'));
    expect(getByText('this is an example sensing question'));
    expect(getByText('Please fill out all the questions'));

    /* Personality factor under test should be extraversion so a sensing question should not appear */
    expect(queryByText('this is an example question extraversion')).toBeNull();
  });

  /* Test the error message appears when the component renders with error in redux state*/
  it('quiz screen render test when question error occurs', () => {
    const match = { params: { factor: 'extraversion' } };
    store = mockQuestionStore({
      questionSet: {
        questionSet: [],
        loading: false,
        error: 'This test should fail',
      },
      user: { personalityCode: '', quizDate: new Date().getTime() - 86600000 },
      loggedUser: {},
    });

    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('This test should fail'));
  });

  /* Test to ensure the loader appears when loading question state is true*/
  it('Test that loader appears when questions are rendering', () => {
    const match = { params: { factor: 'extraversion' } };
    store = mockQuestionStore({
      questionSet: {
        questionSet: [],
        loading: true,
        error: 'This should not appear as loading is true',
      },
      user: { code: '' },
      loggedUser: {},
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId('loader'));
  });

  /* Test the error message appears when the component renders with error in redux state for personality calculation*/
  it('quiz screen render test when personality calculation error occurs', () => {
    const match = { params: { factor: 'extraversion' } };
    store = mockQuestionStore({
      questionSet: {
        questionSet: [],
        loading: false,
      },
      user: {
        error: 'This test should fail',
        quizDate: new Date().getTime() - 86400000,
      },
      loggedUser: {},
    });

    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
        </Provider>
      </BrowserRouter>
    );

    expect(getByText('This test should fail'));
  });

  /* Test that the loader appears when results are being calculated*/
  it('test loader render when personality type being calculated', () => {
    const match = { params: { factor: 'extraversion' } };
    store = mockQuestionStore({
      questionSet: {
        questionSet: [],
        loading: false,
      },
      user: {
        loading: true,
        quizDate: new Date().getTime() - 86400000,
      },
      loggedUser: {},
    });

    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId('loader'));
  });

  /* Test that redirection occurs when user has taken the quiz in the last 24 hours*/
  it('test redirection occurs when user has taken quiz in 25 hours', () => {
    const match = { params: { factor: 'extraversion' } };
    store = mockQuestionStore({
      questionSet: {
        questionSet: [],
      },
      user: {
        personalityCode: '',
        quizDate: new Date().getTime(),
      },
      loggedUser: {},
    });

    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
          <Route to="/">Home</Route>
        </Provider>
      </BrowserRouter>
    );

    expect(container).toHaveTextContent('Home');
  });

  /* Test that next button renders when user has completed all answers */
  it('test button display', () => {
    const match = { params: { factor: 'extraversion' } };
    const { getByText, getByTestId, queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <QuizScreen match={match} />
        </Provider>
      </BrowserRouter>
    );

    expect(queryByText('Next')).toBeFalsy();
    fireEvent.click(getByTestId('question-item-strongagree-button-1'));
    expect(getByText('Next'));
  });
});

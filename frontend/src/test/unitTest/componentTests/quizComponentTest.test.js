import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { BrowserRouter, Route } from 'react-router-dom';
import QuizComponent from '../../../components/QuizComponent';

afterEach(cleanup);

/* Test suite for the quiz component render.
 */
describe('Quiz Component Render Test', () => {
  let questionAnswers;
  let setQuestionAnswer;
  let factorQuestions;

  beforeEach(() => {
    setQuestionAnswer = jest.fn();
    questionAnswers = [];
    factorQuestions = [
      {
        _questionId: 1,
        personalityFactor: 'extraversion',
        multiplier: 1,
        questionContent: 'Example Question',
        questionSetNumber: 1,
      },
    ];
  });

  /* Test that the example question item has loaded*/
  it('test successful render of the quiz component', () => {
    const { getByText, getByTestId } = render(
      <BrowserRouter>
        <QuizComponent
          factorQuestions={factorQuestions}
          questionAnswers={questionAnswers}
          setQuestionAnswer={setQuestionAnswer}
        ></QuizComponent>
      </BrowserRouter>
    );

    expect(getByText('Example Question'));
    expect(getByTestId('question-item-strongagree-button-1'));
    expect(getByTestId('question-item-agree-button-1'));
    expect(getByTestId('question-item-neutral-button-1'));
    expect(getByTestId('question-item-disagree-button-1'));
    expect(getByTestId('question-item-strongdisagree-button-1'));
  });

  /* Test that multiple question items are rendered*/
  it('test render of multiple question items', () => {
    factorQuestions = [
      {
        _questionId: 1,
        personalityFactor: 'extraversion',
        multiplier: 1,
        questionContent: 'Example Question',
        questionSetNumber: 1,
      },
      {
        _questionId: 2,
        personalityFactor: 'extraversion',
        multiplier: 1,
        questionContent: 'Example Question 2',
        questionSetNumber: 1,
      },
    ];

    const { getByText, getByTestId } = render(
      <BrowserRouter>
        <QuizComponent
          factorQuestions={factorQuestions}
          questionAnswers={questionAnswers}
          setQuestionAnswer={setQuestionAnswer}
        ></QuizComponent>
      </BrowserRouter>
    );

    expect(getByText('Example Question'));
    expect(getByTestId('question-item-strongagree-button-1'));
    expect(getByTestId('question-item-agree-button-1'));
    expect(getByTestId('question-item-neutral-button-1'));
    expect(getByTestId('question-item-disagree-button-1'));
    expect(getByTestId('question-item-strongdisagree-button-1'));
    expect(getByText('Example Question 2'));

    expect(getByTestId('question-item-strongagree-button-2'));
    expect(getByTestId('question-item-agree-button-2'));
    expect(getByTestId('question-item-neutral-button-2'));
    expect(getByTestId('question-item-disagree-button-2'));
    expect(getByTestId('question-item-strongdisagree-button-2'));
  });
});

/* Test suite for the quiz component events*/
describe('Quiz Component Event Test', () => {
  let questionAnswers;
  let setQuestionAnswer;
  let factorQuestions;

  beforeEach(() => {
    factorQuestions = [
      {
        _questionId: 1,
        personalityFactor: 'extraversion',
        multiplier: 1,
        questionContent: 'Example Question',
        questionSetNumber: 1,
      },
    ];
    setQuestionAnswer = jest.fn();
    questionAnswers = [];
  });

  /* Test that question answer is correctly updated when user selects a button on the question item*/
  it('test that question answers is updated when user selects an answer button', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <QuizComponent
          factorQuestions={factorQuestions}
          questionAnswers={questionAnswers}
          setQuestionAnswer={setQuestionAnswer}
        ></QuizComponent>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('question-item-strongagree-button-1'));
    expect(questionAnswers).toEqual(['2']);
  });

  /* Test that question answer is correctly updated*/
  it('test that question answer is updated when the user changes their mind', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <QuizComponent
          factorQuestions={factorQuestions}
          questionAnswers={questionAnswers}
          setQuestionAnswer={setQuestionAnswer}
        ></QuizComponent>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('question-item-strongagree-button-1'));
    expect(questionAnswers).toEqual(['2']);

    fireEvent.click(getByTestId('question-item-agree-button-1'));
    expect(questionAnswers).toEqual(['1']);
  });

  /* Test that correct array position is updated if the user does not select an answer in order.*/
  it('Test that correct array index is updated if user does not answer in order', () => {
    factorQuestions = [
      {
        _questionId: 1,
        personalityFactor: 'extraversion',
        multiplier: 1,
        questionContent: 'Example Question',
        questionSetNumber: 1,
      },
      {
        _questionId: 2,
        personalityFactor: 'extraversion',
        multiplier: 1,
        questionContent: 'Example Question 2',
        questionSetNumber: 1,
      },
      {
        _questionId: 3,
        personalityFactor: 'extraversion',
        multiplier: 1,
        questionContent: 'Example Question 3',
        questionSetNumber: 1,
      },
    ];

    const { getByTestId } = render(
      <BrowserRouter>
        <QuizComponent
          factorQuestions={factorQuestions}
          questionAnswers={questionAnswers}
          setQuestionAnswer={setQuestionAnswer}
        ></QuizComponent>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('question-item-strongagree-button-3'));
    expect(questionAnswers).toEqual([0, 0, '2']);
  });
});

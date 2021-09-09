import {
  seperateQuestionArray,
  checkAnswersValidity,
  userAnswerChangeHandler,
  totalAnswers,
} from '../../../utils/quizScreenUtils';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

/* Test suite for the seperate question utility function in the quiz screen*/
describe('SeperateQuestionArray Util Tests', () => {
  /* Test that question objects are correctly filtered out when passed in factor does not match personality factor*/
  it('Test that questions are correctly seperated', () => {
    const questionSet = [
      { personalityFactor: 'Extraversion' },
      { personalityFactor: 'Extraversion' },
      { personalityFactor: 'Thinking' },
    ];
    const factorQuestions = [];

    seperateQuestionArray(questionSet, 'Extraversion', factorQuestions);

    expect(factorQuestions.length).toEqual(2);
    expect(factorQuestions).toEqual([
      { personalityFactor: 'Extraversion' },
      { personalityFactor: 'Extraversion' },
    ]);
    expect({ personalityFactor: 'Thinking' }).not.toEqual(
      expect.arrayContaining(factorQuestions)
    );
  });
});

/* Test suite for the check answer validity function*/
describe('CheckAnswersValidity Test Suite', () => {
  /* Test false is returned and validation failed when values outside allowed array are present*/
  it('Test false returned when intital 0 value is present', () => {
    const questionsAnswers = ['1', 1, 0];
    expect(checkAnswersValidity(questionsAnswers)).toBeFalsy();
  });

  /* Test false is returned when undefined is present in the check answer validity array*/
  it('Test false returned when undefined question answer initial value is present', () => {
    const questionsAnswers = ['1', '1', undefined];
    expect(checkAnswersValidity(questionsAnswers)).toBeFalsy();
  });

  /* Test that true is returned when all values in the answer array are in the allowed constant arrary */
  it('Test true returned when all correct values are present', () => {
    const questionsAnswers = ['1', '1', '2'];
    expect(checkAnswersValidity(questionsAnswers)).toBeTruthy();
  });
});

/* Test suite for the quiz screen answer change handler*/
describe('UserAnswerChangeHandler Test Suite', () => {
  /* Test that question answer is appened to the correct position in the answers array*/
  it('Test set question answer is appeneded when question number is same as answer array length', () => {
    const questionAnswers = [0, 0, 0];
    const setQuestionAnswer = jest.fn();
    const e = {
      answerValue: '2',
      questionNumber: 1,
    };
    userAnswerChangeHandler(e, questionAnswers, setQuestionAnswer);
    expect(questionAnswers[1]).toEqual('2');
    expect(setQuestionAnswer).toHaveBeenCalledTimes(1);
  });
});

/* Test for the handle answer submission Event handler*/
describe('TotalAnswer Test', () => {
  /* Test total answers using both positive value and negative multiplier*/
  it('Test total answer using positive values', () => {
    const questionAnswers = [2, 1, 1];
    const factorQuestions = [
      { multiplier: 1 },
      { multiplier: 1 },
      { multiplier: 1 },
    ];

    expect(totalAnswers(questionAnswers, factorQuestions)).toEqual(4);
  });

  /* Test total answer using negative values*/
  it('Test total answer using negative values', () => {
    const questionAnswers = [-2, 1, 1];
    const factorQuestions = [
      { multiplier: 1 },
      { multiplier: 1 },
      { multiplier: 1 },
    ];

    expect(totalAnswers(questionAnswers, factorQuestions)).toEqual(0);
  });

  /* Test total answer using negative question multiplier*/
  it('Test total answer using negative multiplier', () => {
    const questionAnswers = [2, 1, 1];
    const factorQuestions = [
      { multiplier: 1 },
      { multiplier: -1 },
      { multiplier: 1 },
    ];

    expect(totalAnswers(questionAnswers, factorQuestions)).toEqual(2);
  });

  /* Test total answer using both negative answer and negative multiplier*/
  it('Test total answer using positive values', () => {
    const questionAnswers = [-2, 1, 1];
    const factorQuestions = [
      { multiplier: -1 },
      { multiplier: 1 },
      { multiplier: 1 },
    ];

    expect(totalAnswers(questionAnswers, factorQuestions)).toEqual(4);
  });
});

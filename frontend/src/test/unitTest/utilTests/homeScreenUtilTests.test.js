import {
  checkQuizTime,
  checkQuizRetakeWarning,
} from '../../../utils/homeScreenUtils';
import { cleanup } from '@testing-library/react';
import { USER_ANSWER_RESET } from '../../../constants/quizConstants';

afterEach(cleanup);

describe('CheckQuizTime Test Suite', () => {
  /* Test to ensure that false is returned when times are outwith the given boundary*/
  it('Test false returned when two dates are greater than the boundry', () => {
    const answer = checkQuizTime('2021-07-18 12:00:00', 1);
    expect(answer).toEqual(false);
  });

  /* Test to ensure true is returned when the two dates are the same*/
  it('Test true returned when dates are the same', () => {
    const date = new Date();
    const answer = checkQuizTime(date.toString(), 1);
    expect(answer).toEqual(true);
  });

  /* Test to ensure true is returned when the dates are half way between the boundary apart*/
  it('test true is returned when date difference is inside the boundry', () => {
    let date = new Date();
    date = date.getTime() - 43200000;
    expect(checkQuizTime(date.toString(), 1)).toEqual(true);
  });
});

/* Test suite for the check quiz retake warning utility function*/
describe('Test CheckQuizRetakeWarning', () => {
  let confirmSpy;
  let history;
  let dispatch;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm');
    history = { push: jest.fn() };
    dispatch = jest.fn();
  });

  /* Test that window appears when users last taken test is inside the 1 month boundary*/
  it('test confirm window appears when quiz results are within the 6 month boundary #20', () => {
    confirmSpy.mockImplementationOnce(jest.fn());
    checkQuizRetakeWarning(history, new Date().getTime() - 86400000, dispatch);
    expect(confirmSpy).toHaveBeenCalledTimes(1);
  });

  /* Test that the confirm window does not appear when the last taken test is outwith the 6 month boundary*/
  it('test confirm window does not appear when quiz results are outwith the 6 month boundary  and history is automatically fired #17', () => {
    confirmSpy.mockImplementationOnce(jest.fn());
    checkQuizRetakeWarning(
      history,
      new Date().getTime() - 86400000 * 31 * 6,
      dispatch
    );
    expect(confirmSpy).toHaveBeenCalledTimes(0);
    expect(history.push).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: USER_ANSWER_RESET });
  });

  /* Test that history is called when the user clicks confirm on the pop window*/
  it('test that history is called when user presses confirm button with correct constant #20', () => {
    confirmSpy.mockImplementationOnce(jest.fn(() => true));

    checkQuizRetakeWarning(history, new Date().getTime() - 86400000, dispatch);
    expect(dispatch).toHaveBeenCalledWith({ type: USER_ANSWER_RESET });
  });

  /* Test that history is not called when the user presses cancel on the pop window*/
  it('test that history is not called when user presses cancel button', () => {
    confirmSpy.mockImplementationOnce(jest.fn(() => false));

    checkQuizRetakeWarning(history, new Date().getTime() - 86400000, dispatch);
    expect(dispatch).toHaveBeenCalledTimes(0);
  });
});

import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import QuestionItem from '../../../components/QuestionItem';

afterEach(cleanup);

/*Test suite for the question item render */
describe('QuestionItem Render', () => {
  const data = {
    questionContent: 'test case 1',
    multiplier: 1,
    _questionId: 1,
    personalityFactor: 'example personality',
  };

  /* Test to ensure that the question item renders in correctly when given data */
  it('Check Question Item Render #1', () => {
    const { getByText, getByTestId } = render(
      <QuestionItem question={data} questionNumber={1} />
    );

    expect(getByText('test case 1'));
    expect(getByTestId('question-item-strongagree-button-1'));
    expect(getByTestId('question-item-agree-button-1'));
    expect(getByTestId('question-item-neutral-button-1'));
    expect(getByTestId('question-item-disagree-button-1'));
    expect(getByTestId('question-item-strongdisagree-button-1'));
  });
});

/* Test suite for the functionality of the question item component*/
describe('QuestionItem Event', () => {
  const data = {
    questionContent: 'test case 1',
    multiplier: 1,
    _questionId: 1,
    personalityFactor: 'example personality',
  };

  /* Unit test to test the functionality of each of the radio buttons in the question item form */
  it('check question item form radio buttons can be clicked #6', () => {
    const { getByTestId } = render(
      <QuestionItem question={data} questionNumber={1} />
    );
    expect(
      getByTestId('question-item-strongagree-button-1').checked
    ).toBeFalsy();
    fireEvent.click(getByTestId('question-item-strongagree-button-1'));
    expect(
      getByTestId('question-item-strongagree-button-1').checked
    ).toBeTruthy();

    expect(getByTestId('question-item-agree-button-1').checked).toBeFalsy();
    fireEvent.click(getByTestId('question-item-agree-button-1'));
    expect(getByTestId('question-item-agree-button-1').checked).toBeTruthy();

    expect(getByTestId('question-item-neutral-button-1').checked).toBeFalsy();
    fireEvent.click(getByTestId('question-item-neutral-button-1'));
    expect(getByTestId('question-item-neutral-button-1').checked).toBeTruthy();

    expect(getByTestId('question-item-disagree-button-1').checked).toBeFalsy();
    fireEvent.click(getByTestId('question-item-disagree-button-1'));
    expect(getByTestId('question-item-disagree-button-1').checked).toBeTruthy();

    expect(
      getByTestId('question-item-strongdisagree-button-1').checked
    ).toBeFalsy();

    fireEvent.click(getByTestId('question-item-strongdisagree-button-1'));
    expect(
      getByTestId('question-item-strongdisagree-button-1').checked
    ).toBeTruthy();
  });

  /* Test to ensure that radio button becomes deslected when another is clicked*/
  it('check that question item selected radio button is unchecked when new one is selected #6', () => {
    const { getByTestId } = render(
      <QuestionItem question={data} questionNumber={1} />
    );
    fireEvent.click(getByTestId('question-item-agree-button-1'));
    expect(getByTestId('question-item-agree-button-1').checked).toBeTruthy();
    fireEvent.click(getByTestId('question-item-neutral-button-1'));
    expect(getByTestId('question-item-agree-button-1').checked).toBeFalsy();
  });

  /* Test that onChange is called with the new state for the question item, useState also*/
  it('test that onchange and useState are called with the new state for the question item', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <QuestionItem question={data} questionNumber={1} onChange={onChange} />
    );

    fireEvent.click(getByTestId('question-item-agree-button-1'));
    expect(onChange).toHaveBeenCalledWith({
      questionNumber: 1,
      answerValue: '1',
    });
  });
});

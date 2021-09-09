import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import QuizButton from '../../../components/QuizButton';
import { BrowserRouter, Route } from 'react-router-dom';

afterEach(cleanup);

describe('Quiz Button Render', () => {
  let finishClick;
  let nextClick;

  beforeEach(() => {
    finishClick = jest.fn();
    nextClick = jest.fn();
  });

  /* Test that the next button is rendered when factor is not perceiving*/
  it('Test succesful render of the next button when factor is not preceiving', () => {
    const { getByText, queryByText } = render(
      <BrowserRouter>
        <QuizButton
          personalityFactor="extraversion"
          handleNextClick={nextClick}
          handleFinishClick={finishClick}
        ></QuizButton>
      </BrowserRouter>
    );

    expect(getByText('Next'));
    expect(queryByText('Finish')).toBeFalsy();
  });

  /* Test that the finish button is rendered when factor is perceiving*/
  it('Test succesful render of the finish button when factor is perceiving', () => {
    const { getByText, queryByText } = render(
      <BrowserRouter>
        <QuizButton
          personalityFactor="perceiving"
          handleNextClick={nextClick}
          handleFinishClick={finishClick}
        ></QuizButton>
      </BrowserRouter>
    );

    expect(getByText('Finish'));
    expect(queryByText('Next')).toBeFalsy();
  });

  /* Test suite for the quiz button events*/
  describe('Quiz Button Event Tests', () => {
    let finishClick;
    let nextClick;

    beforeEach(() => {
      finishClick = jest.fn();
      nextClick = jest.fn();
    });

    /* Test that the redirection occures to the next set of questions and that the nextClick is called*/
    it('test that link is fired when next is clicked and click handler is triggered', () => {
      const { getByText, container } = render(
        <BrowserRouter>
          <QuizButton
            personalityFactor="extraversion"
            handleNextClick={nextClick}
            handleFinishClick={finishClick}
          ></QuizButton>
          <Route path="/quiz/sensing/question">SensingQuestions</Route>
        </BrowserRouter>
      );

      fireEvent.click(getByText('Next'));
      expect(nextClick).toHaveBeenCalledTimes(1);
      expect(container).toHaveTextContent('SensingQuestions');
    });

    /* test that the finish click handler is called when finish is clicked*/
    it('test that the finish click handler is called when finish is clicked', () => {
      const { getByText, container } = render(
        <BrowserRouter>
          <QuizButton
            personalityFactor="perceiving"
            handleNextClick={nextClick}
            handleFinishClick={finishClick}
          ></QuizButton>
        </BrowserRouter>
      );

      fireEvent.click(getByText('Finish'));
      expect(finishClick).toHaveBeenCalledTimes(1);
    });
  });
});

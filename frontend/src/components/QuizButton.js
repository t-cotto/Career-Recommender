import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PERSONALITY_FACTORS } from '../constants/quizConstants';

/* Quiz button component for use in the quiz screen*/
function QuizButton({ personalityFactor, handleNextClick, handleFinishClick }) {
  return personalityFactor === 'perceiving' ? (
    <Button onClick={handleFinishClick}>Finish</Button>
  ) : (
    /* Link loads in the next personality factor in the personality factor constant array*/
    <Link
      to={`/quiz/${
        PERSONALITY_FACTORS[PERSONALITY_FACTORS.indexOf(personalityFactor) + 1]
      }/question`}
    >
      <Button onClick={handleNextClick}>Next</Button>
    </Link>
  );
}

export default QuizButton;

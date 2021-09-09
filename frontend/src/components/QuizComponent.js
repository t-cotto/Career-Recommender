import React from 'react';
import QuestionItem from '../components/QuestionItem';
import { userAnswerChangeHandler } from '../utils/quizScreenUtils';

/* Quiz component to manage the base components in the quiz screen*/
function QuizComponent({
  factorQuestions,
  questionAnswers,
  setQuestionAnswer,
}) {
  return (
    <div>
      {factorQuestions.map((question, questionNumber) => (
        <QuestionItem
          key={question._questionId}
          question={question}
          questionNumber={questionNumber}
          onChange={(e) =>
            userAnswerChangeHandler(e, questionAnswers, setQuestionAnswer)
          }
        ></QuestionItem>
      ))}
    </div>
  );
}

export default QuizComponent;

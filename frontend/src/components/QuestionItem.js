import React, { useEffect } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';

/* Question Component to hold the questions that the user will answer,
Question parameter holds all the data that is relevant for this particular question*/
function QuestionItem({ question, questionNumber, onChange }) {
  const [questionData, setQuestionData] = React.useState({
    answerValue: 0,
    questionNumber: questionNumber,
  });

  /* Function to handle when the user selects a radio button, will update the state with a new value everytime a radio
  button is selected.*/
  const answerChangeHandler = (e) => {
    setQuestionData((prevState) => ({
      ...prevState,
      answerValue: e.target.value,
    }));
  };

  useEffect(() => {
    if (onChange) {
      onChange(questionData);
    }
  }, [questionData]);

  return (
    <Card className="py-3 px-3 my-2">
      <Form>
        <Row>
          <Col className="my-auto text-center" xs={12} sm={12}>
            <h5>{question.questionContent}</h5>
            <Form.Check
              type="radio"
              id="Strongly Agree"
              name={`Question${question.number}`}
              label="Strongly Agree"
              value={2}
              onChange={answerChangeHandler}
              inline
              data-testid={`question-item-strongagree-button-${question._questionId}`}
            />
            <Form.Check
              type="radio"
              id="Agree"
              name={`Question${question.number}`}
              label="Agree"
              value={1}
              onChange={answerChangeHandler}
              inline
              data-testid={`question-item-agree-button-${question._questionId}`}
            />
            <Form.Check
              type="radio"
              id="Neutral"
              name={`Question${question.number}`}
              label="Neutral"
              value={0}
              onChange={answerChangeHandler}
              inline
              data-testid={`question-item-neutral-button-${question._questionId}`}
            />
            <Form.Check
              type="radio"
              id="Disagree"
              name={`Question${question.number}`}
              label="Disagree"
              value={-1}
              onChange={answerChangeHandler}
              inline
              data-testid={`question-item-disagree-button-${question._questionId}`}
            />
            <Form.Check
              type="radio"
              id="Strongly Disagree"
              name={`Question${question.number}`}
              label="Strongly Disagree"
              value={-2}
              onChange={answerChangeHandler}
              inline
              data-testid={`question-item-strongdisagree-button-${question._questionId}`}
            />
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default QuestionItem;

import React, { useEffect } from 'react';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Col, Breadcrumb } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadQuestionSet,
  updateUserAnswers,
  calculatePersonalityResults,
  calculateLoggedUserQuizResults,
} from '../actions/quizActions';
import {
  seperateQuestionArray,
  checkAnswersValidity,
  totalAnswers,
} from '../utils/quizScreenUtils';
import { checkQuizTime } from '../utils/homeScreenUtils';
import { Redirect } from 'react-router';
import QuizComponent from '../components/QuizComponent';
import QuizButton from '../components/QuizButton';

/* The main visual component for the quiz screen.
Different Question components will load in based off the personality factor passed in the params*/
function QuizScreen({ match, history }) {
  const personalityFactor = match.params.factor;
  const factorQuestions = [];

  const dispatch = useDispatch();

  const quizQuestions = useSelector((state) => state.questionSet);
  const { error, loading, questionSet } = quizQuestions;

  const loggedUser = useSelector((state) => state.loggedUser);
  const { userInfo } = loggedUser;

  const userAnswers = useSelector((state) => state.userAnswers);

  const user = useSelector((state) => state.user);
  const {
    personalityCode,
    error: personalityQuizError,
    quizDate,
    loading: personalityTypeLoading,
  } = user;

  const [questionAnswers, setQuestionAnswer] = React.useState([]);
  const [quizComplete, setQuizComplete] = React.useState(false);

  /* Click handler for the next button*/
  const handleNextClick = () => {
    const total = totalAnswers(questionAnswers, factorQuestions);
    dispatch(updateUserAnswers(personalityFactor, total));
    setQuestionAnswer([]);
  };

  /* Click handler for the finish button*/
  const handleFinishClick = () => {
    handleNextClick();

    setQuizComplete(true);

    if (userInfo) {
      dispatch(calculateLoggedUserQuizResults(userAnswers));
    } else {
      dispatch(calculatePersonalityResults(userAnswers));
    }
  };

  /* Updates the question set for questions matching the factor passed in the parameters.*/
  if (!error && !loading) {
    seperateQuestionArray(questionSet, personalityFactor, factorQuestions);
  }

  useEffect(() => {
    if (questionSet.length === 0) {
      dispatch(loadQuestionSet());
    }
    if (personalityCode && quizComplete) {
      history.push('/quiz/results');
    }
  }, [dispatch, personalityCode, quizComplete]);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Quiz</Breadcrumb.Item>
      </Breadcrumb>
      {loading || personalityTypeLoading ? (
        <Loader data-testid="quiz-screen-loader" />
      ) : error ? (
        <Message variant="danger" data-testid="quiz-screen-error-message">
          {error}
        </Message>
      ) : checkQuizTime(quizDate, 1) && !quizComplete ? (
        <Redirect to="/"></Redirect>
      ) : (
        <Col>
          {personalityQuizError && (
            <Message
              variant="danger"
              data-testid="quiz-screen-error-message"
              style={{ marginTop: 20 }}
            >
              {personalityQuizError}
            </Message>
          )}
          <h3 style={{ marginBottom: 40 }}>
            Please answer all of the following questions
          </h3>
          <QuizComponent
            factorQuestions={factorQuestions}
            questionAnswers={questionAnswers}
            setQuestionAnswer={setQuestionAnswer}
          />
          <div style={{ textAlign: 'center' }}>
            {!checkAnswersValidity(questionAnswers) ? (
              <Message variant="danger" className="my-4">
                Please fill out all the questions
              </Message>
            ) : (
              <QuizButton
                personalityFactor={personalityFactor}
                handleNextClick={handleNextClick}
                handleFinishClick={handleFinishClick}
              ></QuizButton>
            )}
          </div>
        </Col>
      )}
    </div>
  );
}

export default QuizScreen;

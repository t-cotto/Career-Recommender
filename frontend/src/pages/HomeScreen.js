import React from 'react';
import { Col, Button, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import HomePageIntro from '../components/HomePageIntro';
import PersonalityFactorInfo from '../components/PersonalityFactorInfo';
import {
  EXTRAVERSION_HOME_SCREEN_DESCRIPTION,
  SENSING_HOME_SCREEN_DESCRIPTION,
  THINKING_HOME_SCREEN_DESCRIPTION,
  PERCEIVING_HOME_SCREEN_DESCRIPTION,
  QUIZ_EXPLANATION_HOME_SCREEN,
} from '../constants/stringConstants';
import {
  checkQuizTime,
  checkQuizRetakeWarning,
} from '../utils/homeScreenUtils';

/* Main Home Screen component*/
function HomeScreen({ history }) {
  const user = useSelector((state) => state.user);
  const { quizDate } = user;

  const [quizDisabled, setQuizDisabled] = React.useState();

  const dispatch = useDispatch();

  /* On click handler to handle the start quiz button click. */
  const quizButtonOnClickHandler = () => {
    if (quizDate) {
      checkQuizRetakeWarning(history, quizDate, dispatch);
    } else {
      history.push('/quiz/extraversion/question');
    }
  };

  React.useEffect(() => {
    if (quizDate) {
      setQuizDisabled(checkQuizTime(quizDate, 1));
    } else {
      setQuizDisabled(false);
    }
  }, [user]);

  return (
    <div>
      <Col className="text-center">
        <HomePageIntro> </HomePageIntro>
        <Button
          className="btn-success"
          size="lg"
          onClick={quizButtonOnClickHandler}
          data-testid="home-screen-quiz-button"
          style={{ marginBottom: 40 }}
          disabled={quizDisabled}
        >
          Take The Quiz
        </Button>
        {quizDisabled && (
          <p style={{ color: 'grey' }}>
            You Can only take the quiz once every 24hr period
          </p>
        )}

        <div style={{ textAlign: 'left' }}>
          <h2 style={{ marginBottom: 40, marginTop: 240 }}>How It Works</h2>
          <div style={{ textAlign: 'center' }}>
            <h5 style={{ marginBottom: 100 }}>
              {QUIZ_EXPLANATION_HOME_SCREEN}
            </h5>
          </div>
          <Row>
            <Col md={6} className="text-center">
              <PersonalityFactorInfo
                icon="fas fa-bullhorn"
                description={EXTRAVERSION_HOME_SCREEN_DESCRIPTION}
                factor="Extraversion"
              />
              <PersonalityFactorInfo
                icon="far fa-meh"
                description={THINKING_HOME_SCREEN_DESCRIPTION}
                factor="Thinking"
              />
            </Col>
            <Col md={6} className="text-center">
              <PersonalityFactorInfo
                factor={'Sensing'}
                description={SENSING_HOME_SCREEN_DESCRIPTION}
                icon={'far fa-compass'}
              />
              <PersonalityFactorInfo
                description={PERCEIVING_HOME_SCREEN_DESCRIPTION}
                factor={'Judging'}
                icon={'fas fa-gavel'}
              />
            </Col>
          </Row>
        </div>
      </Col>
    </div>
  );
}

export default HomeScreen;

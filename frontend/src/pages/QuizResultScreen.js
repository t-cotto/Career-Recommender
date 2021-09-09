import React from 'react';
import { Col, Row, Breadcrumb } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import Loader from '../components/Loader';
import {
  loadPersonalityType,
  loadPersonalityTypeByUserId,
} from '../actions/personalityActions';
import PersonalityInformation from '../components/PersonalityInformation';
import Message from '../components/Message';
import CareerRecommendations from '../components/CareerRecommendations';
import {
  loadRecommendationsWithScore,
  loadRecommendations,
} from '../actions/careerActions';
import FilterBar from '../components/FilterBar';
import { Link } from 'react-router-dom';
/* Quiz Result screen parent component*/
function QuizResultScreen() {
  const user = useSelector((state) => state.user);
  const { personalityCode, loading, error: userError } = user;

  const personalityResults = useSelector((state) => state.personalityResults);
  const { personalityType, error } = personalityResults;

  const recommendedCareers = useSelector((state) => state.recommendedCareers);
  const { error: recommendationError, recommendations } = recommendedCareers;

  const loggedUser = useSelector((state) => state.loggedUser);
  const { userInfo } = loggedUser;

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!personalityType) {
      if (userInfo) {
        dispatch(loadPersonalityTypeByUserId());
      } else {
        dispatch(loadPersonalityType(personalityCode));
      }
    }

    if (!recommendations) {
      if (userInfo) {
        dispatch(loadRecommendationsWithScore());
      } else {
        dispatch(loadRecommendations(personalityCode));
      }
    }
  }, [dispatch, userInfo]);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Results</Breadcrumb.Item>
      </Breadcrumb>
      {loading ? (
        <Loader></Loader>
      ) : userError ? (
        <Message variant="danger" data-testid="quiz-screen-user-error-message">
          {userError}
        </Message>
      ) : personalityCode ? (
        <Row>
          <Col md={3}></Col>
          <Col className="text-center" md={6}>
            <h3 style={{ marginBottom: 20 }}>Your Recommendations</h3>
            <h6
              style={{ color: 'grey', fontWeight: 'normal', marginBottom: 40 }}
            >
              (Please click each career item to expand)
            </h6>
            {userInfo && personalityType && (
              <FilterBar
                userId={userInfo._id}
                personalityType={personalityType}
                data-testid={'filter-bar'}
              />
            )}
            {recommendations ? (
              recommendations.map((career) => (
                <CareerRecommendations
                  career={career}
                  key={career.careerTitle}
                />
              ))
            ) : recommendationError ? (
              <Message variant="danger">{recommendationError}</Message>
            ) : (
              <Loader></Loader>
            )}
            {!userInfo && (
              <h6 style={{ marginTop: 20 }}>
                In order to see the strength of each of your matches, please
                create an account{' '}
                <Link to={'/register'} data-testid={'register-link'}>
                  here
                </Link>
              </h6>
            )}
            <div style={{ marginTop: 80 }}>
              {personalityType ? (
                <PersonalityInformation
                  personalityType={personalityType}
                ></PersonalityInformation>
              ) : error ? (
                <Message
                  variant="danger"
                  data-testid="quiz-screen-error-message"
                >
                  {error}
                </Message>
              ) : (
                <Loader></Loader>
              )}
            </div>
          </Col>
          <Col md={3}></Col>
        </Row>
      ) : (
        <Redirect to="/"></Redirect>
      )}
    </div>
  );
}

export default QuizResultScreen;

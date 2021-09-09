import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import RegisterForm from '../components/RegisterForm';
/* Register component allowing users to input their details and create their account*/
function RegisterScreen({ history }) {
  const [message, setMessage] = React.useState('');

  const dispatch = useDispatch();

  const registration = useSelector((state) => state.registration);
  const { error } = registration;

  const loggedInUser = useSelector((state) => state.loggedUser);
  const { userInfo } = loggedInUser;

  const user = useSelector((state) => state.user);
  const { personalityCode, quizDate } = user;

  const userAnswers = useSelector((state) => state.userAnswers);

  const submitHandler = (useResults, registerFormData, e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    if (form.checkValidity() !== false) {
      if (useResults) {
        registerFormData.personalityCode = personalityCode;
        registerFormData.userAnswers = userAnswers;
        registerFormData.quizDate = quizDate;
      }
      dispatch(register(registerFormData));
      setMessage('');
    }
  };

  React.useEffect(() => {
    if (userInfo) {
      history.push('/');
    }
  }, [history, userInfo, error]);

  return (
    <Container>
      <Row style={{ justifyContent: 'center' }}>
        <Col xs={12} md={6}>
          <h1 style={{ textAlign: 'center' }}>Register Here</h1>
          {error && <Message variant="danger">{error}</Message>}
          {message && <Message variant="danger">{message}</Message>}
          <RegisterForm
            submitHandler={submitHandler}
            allowUserSaveData={personalityCode && userAnswers}
          ></RegisterForm>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterScreen;

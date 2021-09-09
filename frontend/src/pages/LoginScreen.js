import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';

import { login } from '../actions/userActions';

/* Quiz Login screen component*/
function LoginScreen({ history }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const loggedInUser = useSelector((state) => state.loggedUser);
  const { error, userInfo } = loggedInUser;

  const dispatch = useDispatch();

  const submitHandler = function (e) {
    e.preventDefault();
    dispatch(login(email, password));
  };

  React.useEffect(() => {
    if (userInfo) {
      history.push('/');
    }
  }, [history, userInfo]);

  return (
    <Container>
      <Row style={{ justifyContent: 'center' }}>
        <Col xs={12} md={6}>
          {error && <Message variant="danger">{error}</Message>}
          <h1 style={{ textAlign: 'center' }}>Login Here</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email" style={{ marginTop: 20 }}>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="login-screen-email-control"
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" style={{ marginTop: 20 }}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="login-screen-password-control"
              ></Form.Control>
            </Form.Group>
            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                className="mt-3"
                disabled={!email || !password}
              >
                Login
              </Button>
            </div>
          </Form>

          <Row className="py-3">
            <Col>
              New User ? <Link to={'/register'}>Sign Up</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginScreen;

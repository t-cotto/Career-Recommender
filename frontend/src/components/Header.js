import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';

/* The Top level header component for the application. */
function Header() {
  const user = useSelector((state) => state.user);
  const { personalityCode } = user;

  const loggedUser = useSelector((state) => state.loggedUser);
  const { userInfo } = loggedUser;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar
        className="mainNavBar"
        variant="dark"
        collapseOnSelect
        expand="lg"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Career Recommender</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {userInfo ? (
              <Nav>
                <NavDropdown title={userInfo.firstName} id="username">
                  <NavDropdown.Item onClick={logoutHandler}>
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                <LinkContainer to="/login" style={{ color: 'white' }}>
                  <Nav.Link>
                    <i className="fas fa-user"></i> Login
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register" style={{ color: 'white' }}>
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </Nav>
            )}
            {personalityCode && (
              <LinkContainer to="/quiz/results" style={{ color: 'white' }}>
                <Nav.Link>View Results</Nav.Link>
              </LinkContainer>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;

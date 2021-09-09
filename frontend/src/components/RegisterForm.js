import React from 'react';
import { Form, Button } from 'react-bootstrap';

/* Register form component to allow users to input registration details*/
function RegisterForm({ submitHandler, allowUserSaveData }) {
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [validated, setValidated] = React.useState(false);
  const [registerDetails, setRegisterDetails] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dob: '',
  });
  const [useResults, setUseResults] = React.useState(false);

  const checkPasswords = () => confirmPassword === registerDetails.password;

  const checkEmail = () =>
    registerDetails.email.includes('@') && registerDetails.email.includes('.');

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={(e) => submitHandler(useResults, registerDetails, e)}
      data-testid={'register-form'}
    >
      <Form.Group controlId="validationCustom01" style={{ marginTop: 20 }}>
        <Form.Label>First Name*</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter First Name"
          value={registerDetails.firstName}
          onChange={(e) =>
            setRegisterDetails({
              ...registerDetails,
              firstName: e.target.value,
            })
          }
          data-testid="register-screen-first-name-control"
          isInvalid={!registerDetails.firstName}
        />
        <Form.Control.Feedback type="invalid">
          Please Provide a First Name
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="validationCustom02" style={{ marginTop: 20 }}>
        <Form.Label>Last Name*</Form.Label>
        <Form.Control
          required
          type="name"
          placeholder="Enter Last Name"
          value={registerDetails.lastName}
          onChange={(e) =>
            setRegisterDetails({
              ...registerDetails,
              lastName: e.target.value,
            })
          }
          data-testid="register-screen-last-name-control"
          isInvalid={!registerDetails.lastName}
        />
        <Form.Control.Feedback type="invalid">
          Please Provide a Last Name
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="validationCustom03" style={{ marginTop: 20 }}>
        <Form.Label>Email Address*</Form.Label>
        <Form.Control
          required
          type="email"
          placeholder="Enter Email"
          value={registerDetails.email}
          onChange={(e) =>
            setRegisterDetails({
              ...registerDetails,
              email: e.target.value,
            })
          }
          data-testid="register-screen-email-control"
          isInvalid={!registerDetails.email || !checkEmail()}
        />
        <Form.Control.Feedback type="invalid">
          Please Provide a Valid Email
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="validationCustom04" style={{ marginTop: 20 }}>
        <Form.Label>Password*</Form.Label>
        <Form.Control
          required
          type="password"
          placeholder="Enter Password"
          value={registerDetails.password}
          onChange={(e) =>
            setRegisterDetails({
              ...registerDetails,
              password: e.target.value,
            })
          }
          data-testid="register-screen-password-control"
          isInvalid={!registerDetails.password || !checkPasswords()}
        />
        <Form.Control.Feedback type="invalid">
          {!checkPasswords()
            ? 'Passwords do not match'
            : 'Please enter a password'}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="password-confirm" style={{ marginTop: 20 }}>
        <Form.Label>Confirm Password*</Form.Label>
        <Form.Control
          required
          type="password"
          placeholder="Re Enter Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          data-testid="register-screen-confirm-password-control"
          isInvalid={!confirmPassword || !checkPasswords()}
        />
        <Form.Control.Feedback type="invalid">
          Please confirm your password
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="validationCustom05" style={{ marginTop: 20 }}>
        <Form.Label>Date of Birth*</Form.Label>
        <Form.Control
          required
          type="date"
          value={registerDetails.dob}
          onChange={(e) =>
            setRegisterDetails({
              ...registerDetails,
              dob: e.target.value,
            })
          }
          data-testid="register-screen-dob-control"
          isInvalid={!registerDetails.dob}
        />
        <Form.Control.Feedback type="invalid">
          Please provide your date of birth
        </Form.Control.Feedback>
      </Form.Group>
      {allowUserSaveData && (
        <Form.Check
          style={{ marginTop: 20 }}
          type={'checkbox'}
          id={'include-answers-check'}
          label={'Store Current Answers'}
          onChange={(e) => setUseResults(!useResults)}
          data-testid="register-screen-use-answers-control"
        ></Form.Check>
      )}
      <div style={{ textAlign: 'center' }}>
        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: 20 }}
          data-testid={'register-button-register-form'}
          disabled={!checkPasswords() || !checkEmail()}
        >
          Register
        </Button>
      </div>
    </Form>
  );
}

export default RegisterForm;

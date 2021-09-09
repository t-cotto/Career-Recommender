import React from 'react';
import { render, cleanup, fireEvent, getByText } from '@testing-library/react';
import RegisterForm from '../../../components/RegisterForm';

afterEach(cleanup);

/* Test sweet for the register form renders*/
describe('Register Form Render Test', () => {
  let allowUserSaveData;
  let submitHandler;

  beforeEach(() => {
    allowUserSaveData = true;
    submitHandler = jest.fn();
  });

  /* Successful render of the register form*/
  it('sucessful render of the register form #33', () => {
    const { getByText, getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    expect(getByText('First Name*'));
    expect(getByText('Last Name*'));
    expect(getByText('Email Address*'));
    expect(getByText('Password*'));
    expect(getByText('Confirm Password*'));
    expect(getByText('Date of Birth*'));
    expect(getByText('Register'));
    expect(getByText('Please Provide a First Name'));
    expect(getByText('Please Provide a Last Name'));
    expect(getByText('Please Provide a Valid Email'));
    expect(getByText('Please enter a password'));
    expect(getByText('Please confirm your password'));
    expect(getByText('Please provide your date of birth'));
    expect(getByText('Store Current Answers'));
    expect(getByTestId('register-button-register-form').disabled).toEqual(true);
    expect(getByTestId('register-screen-first-name-control'));
    expect(getByTestId('register-screen-last-name-control'));
    expect(getByTestId('register-screen-email-control'));
    expect(getByTestId('register-screen-password-control'));
    expect(getByTestId('register-screen-confirm-password-control'));
    expect(getByTestId('register-screen-dob-control'));
    expect(getByTestId('register-screen-use-answers-control'));
  });

  /* Test that the option to have a user save their results is not present when their is none present and show check is false*/
  it('test register form save all answers option does not appear when passed false show check', () => {
    allowUserSaveData = false;
    const { queryByText } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    expect(queryByText('Store Current Answers')).toBeFalsy();
  });
});

/* Test suite for the register form events*/
describe('Register Form event tests', () => {
  let allowUserSaveData;
  let submitHandler;

  beforeEach(() => {
    allowUserSaveData = true;
    submitHandler = jest.fn();
  });

  /* Check that first name value is updated. */
  it('test that first name value is updated', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    fireEvent.change(getByTestId('register-screen-first-name-control'), {
      target: { value: 'name' },
    });

    expect(getByTestId('register-screen-first-name-control').value).toEqual(
      'name'
    );
  });

  /* Check that last name value is updated when user inputs data. */
  it('test that last name value is updated on user input', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    fireEvent.change(getByTestId('register-screen-last-name-control'), {
      target: { value: 'name' },
    });

    expect(getByTestId('register-screen-last-name-control').value).toEqual(
      'name'
    );
  });

  /* Check that email value is updated when user inputs data. */
  it('test that email value is updated on user input', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    fireEvent.change(getByTestId('register-screen-email-control'), {
      target: { value: 'name@email.com' },
    });

    expect(getByTestId('register-screen-email-control').value).toEqual(
      'name@email.com'
    );
  });

  /* Check that password value is updated when user inputs data. */
  it('test that password value is updated on user input', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    fireEvent.change(getByTestId('register-screen-password-control'), {
      target: { value: 'password' },
    });

    expect(getByTestId('register-screen-password-control').value).toEqual(
      'password'
    );
  });

  /* Check that confirm password value is updated when user inputs data. */
  it('test that confirm password value is updated on user input', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    fireEvent.change(getByTestId('register-screen-confirm-password-control'), {
      target: { value: 'password' },
    });

    expect(
      getByTestId('register-screen-confirm-password-control').value
    ).toEqual('password');
  });

  /* Check that dob value is updated when user inputs data. */
  it('test that dob value is updated on user input', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    fireEvent.change(getByTestId('register-screen-dob-control'), {
      target: { value: '2020-08-09' },
    });

    expect(getByTestId('register-screen-dob-control').value).toEqual(
      '2020-08-09'
    );
  });

  /* Check that use results is updated when user clicks use results checkbox. */
  it('test that use results is updated when user clicks use results checkbox', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    fireEvent.click(getByTestId('register-screen-use-answers-control'));

    expect(
      getByTestId('register-screen-use-answers-control').checked
    ).toBeTruthy();
  });

  /* Test that the button is enabled when a valid email and both passwords match */
  it('test button is enabled when a valid email is present and both passwords match', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    expect(getByTestId('register-button-register-form').disabled).toBeTruthy();

    fireEvent.change(getByTestId('register-screen-email-control'), {
      target: { value: 'name@email.com' },
    });
    fireEvent.change(getByTestId('register-screen-password-control'), {
      target: { value: 'password' },
    });
    fireEvent.change(getByTestId('register-screen-confirm-password-control'), {
      target: { value: 'password' },
    });

    expect(getByTestId('register-button-register-form').disabled).toBeFalsy();
  });

  /* All the previous tests involving user input do not fully cover the validation process, this has been noted, in order to test this it would require the implementation of the 
  Formik package in the registration form in order to track the validation status of each element without creating an excess of state hooks for each form control. The validation
  has been manually tested in integration testing, and these tests would be updated after the inclusion of Formik package to manage form validation. Unfortunately this was not possible
  before the 16th of august. */

  /* Test that the button is enabled when a valid email and both passwords match */
  it('test button is enabled when a valid email is present and both passwords match', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );

    expect(getByTestId('register-button-register-form').disabled).toBeTruthy();

    fireEvent.change(getByTestId('register-screen-email-control'), {
      target: { value: 'name@email.com' },
    });
    fireEvent.change(getByTestId('register-screen-password-control'), {
      target: { value: 'password' },
    });
    fireEvent.change(getByTestId('register-screen-confirm-password-control'), {
      target: { value: 'password' },
    });

    expect(getByTestId('register-button-register-form').disabled).toBeFalsy();
  });

  /* Test that the passed in submit handler is called when user presses submit, this should work as form validation occurs in the parent component.*/
  it('test that submit handler is called when user presses submit button', () => {
    const { getByTestId } = render(
      <RegisterForm
        allowUserSaveData={allowUserSaveData}
        submitHandler={submitHandler}
      />
    );
    fireEvent.change(getByTestId('register-screen-email-control'), {
      target: { value: 'name@email.com' },
    });
    fireEvent.change(getByTestId('register-screen-password-control'), {
      target: { value: 'password' },
    });
    fireEvent.change(getByTestId('register-screen-confirm-password-control'), {
      target: { value: 'password' },
    });

    fireEvent.click(getByTestId('register-button-register-form'));

    expect(submitHandler).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import PersonalityFactorInfo from '../../../components/PersonalityFactorInfo';

afterEach(cleanup);
/* Test suite for the rendering of the personality factor component*/
describe('PersonalityFactorInfoRenderTest', () => {
  it('Test Successful Render #9', () => {
    const { getByText, getByTestId } = render(
      <PersonalityFactorInfo
        factor="test factor"
        description="test description"
        icon="fas fa-cube"
      ></PersonalityFactorInfo>
    );

    expect(getByText('test factor'));
    expect(getByText('test description'));
    expect(getByTestId('factor-info-icon'));
  });
});

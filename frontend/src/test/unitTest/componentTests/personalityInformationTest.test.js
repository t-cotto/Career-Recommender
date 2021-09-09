import React from 'react';
import { render, cleanup, getByText } from '@testing-library/react';
import PersonalityInformation from '../../../components/PersonalityInformation';

afterEach(cleanup);

/* Test suite for the personality information component. */
describe('test successful render of the personality information component', () => {
  it('test render of personality component #1 #12', () => {
    const personalityType = {
        typeCode: 'ESTP',
        personalityTitle: 'example title',
        personalityDescription: 'example description',
        associatedComponents: [
          {
            letterCode: 'E',
            description: 'Extraversion',
            title: 'Extrovert',
          },
          {
            letterCode: 'S',
            description: 'Sensing',
            title: 'Sensing',
          },
          {
            letterCode: 'T',
            description: 'Thinking',
            title: 'Thinking',
          },
          {
            letterCode: 'P',
            description: 'Perceiving',
            title: 'Perceptive',
          },
        ],
      },
      { getByText } = render(
        <PersonalityInformation
          personalityType={personalityType}
        ></PersonalityInformation>
      );

    expect(getByText('Your Personality Type:'));
    expect(getByText('example title'));
    expect(getByText('example title'));
    expect(getByText('example description'));
    expect(getByText('P - Perceptive'));
    expect(getByText('Perceiving'));
    expect(getByText('T - Thinking'));
    expect(getByText('Thinking'));
    expect(getByText('S - Sensing'));
    expect(getByText('Sensing'));
    expect(getByText('E - Extrovert'));
    expect(getByText('Extraversion'));
  });
});

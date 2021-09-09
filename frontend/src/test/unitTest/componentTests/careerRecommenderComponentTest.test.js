import React from 'react';
import { cleanup, render } from '@testing-library/react';
import CareerRecommendations from '../../../components/CareerRecommendations';

afterEach(cleanup);
/* Render test for the career recommendation component */
describe('render test for the career recommendation component', () => {
  /* Succesful render test for the component*/
  it('test for succesful render of component #2 #5 #3', () => {
    const data = {
      careerTitle: 'example title',
      careerDescription: 'example description',
      avgSalary: 28000,
      associatedImage: 'frontend/src/test/testAssets/placeholder.png',
      matchScore: 200,
      associatedPersonalityType: 'TEST',
    };

    const { getByText } = render(<CareerRecommendations career={data} />);

    expect(getByText('example title'));
    expect(getByText('example description'));
    expect(getByText('Avg Salary: £ 28000'));
    expect(getByText('200'));
    expect(getByText('Personality Type: TEST'));

    const displayedImage = document.querySelector('img');
    expect(displayedImage.src).toContain('placeholder.png');
  });

  /* Successful render test for the component without avg salary and image, permitted null values in the backend alongisde no match score if user is not logged in*/
  /* This is relevant with the intention of moving to a document database, in that case the values may not be present and as such the component needs to render without them.*/
  it('test for sucessful render when image, avg salary and matchscore not present #2 #5', () => {
    const data = {
      careerTitle: 'example title',
      careerDescription: 'example description',
      associatedPersonalityType: 'TEST',
    };
    const { getByText } = render(<CareerRecommendations career={data} />);

    expect(getByText('example title'));
    expect(getByText('example description'));
    expect(getByText('Personality Type: TEST'));
  });
});

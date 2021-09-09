import React from 'react';
import { render, cleanup } from '@testing-library/react';
import HomePageIntro from '../../../components/HomePageIntro';

afterEach(cleanup);
// Render test for the home page intro component
describe('home page intro component render test', () => {
  /* Successful render test for the home page intro component*/
  it('test successful render of home page intro component #9', () => {
    const { getByText } = render(<HomePageIntro></HomePageIntro>);

    expect(getByText('Know Your Personality'));
    expect(getByText('Find Your Career'));
    expect(
      getByText(
        'The purpose of this quiz is to determing your personality via the test and use'
      )
    );
    expect(
      getByText(
        'that with a little mathematics to match you with your ideal career'
      )
    );
  });
});

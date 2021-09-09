import React from 'react';

/* Home page intro component*/
function HomePageIntro() {
  return (
    <div className="text-center">
      <h1 style={{ marginBottom: 10, marginTop: 30, color: 'grey' }}>
        Know Your Personality
      </h1>
      <h2 style={{ marginBottom: 60, color: 'grey' }}>Find Your Career</h2>
      <h5 style={{ marginBottom: 20 }}>
        The purpose of this quiz is to determing your personality via the test
        and use
      </h5>
      <h5 style={{ marginBottom: 100 }}>
        that with a little mathematics to match you with your ideal career
      </h5>
    </div>
  );
}

export default HomePageIntro;

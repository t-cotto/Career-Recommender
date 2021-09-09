import React from 'react';

/* Component for displaying the personality type of a user and all the relevant information*/
function PersonalityInformation({ personalityType }) {
  return (
    <div data-testid="personality-information-component">
      <h3 style={{ marginBottom: 10 }}>Your Personality Type:</h3>
      <h4 style={{ color: 'grey' }}>{personalityType.personalityTitle}</h4>
      <h5 style={{ marginBottom: 20, color: 'grey' }}>
        ({personalityType.typeCode})
      </h5>
      <h6 style={{ color: 'grey', marginBottom: 60 }}>
        {personalityType.personalityDescription}
      </h6>
      {personalityType.associatedComponents.map((component, index) => (
        <div
          style={{ marginBottom: 20, textAlign: 'left' }}
          key={component.letterCode}
        >
          <h5
            /* Index position is used to determine which personality factor colour coding to use, each colour class defined in index.css */
            className={
              index === 0
                ? 'ExtraversionColor'
                : index === 1
                ? 'SensingColor'
                : index === 2
                ? 'ThinkingColor'
                : 'JudgingColor'
            }
          >
            {component.letterCode} - {component.title}
          </h5>
          <strong>{component.description}</strong>
        </div>
      ))}
    </div>
  );
}

export default PersonalityInformation;

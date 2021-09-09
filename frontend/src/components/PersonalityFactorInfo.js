import React from 'react';

/* Functional component to display information on a personality factor*/
function PersonalityFactorInfo({ icon, factor, description }) {
  return (
    <div>
      <i
        className={`${icon} ${factor}Color`}
        style={{ fontSize: '92px', marginBottom: 30 }}
        data-testid="factor-info-icon"
      ></i>
      <h3 style={{ marginBottom: 30 }}>{factor}</h3>
      <h5 style={{ marginBottom: 60 }}>{description}</h5>
    </div>
  );
}

export default PersonalityFactorInfo;

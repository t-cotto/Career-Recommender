import React from 'react';
import { Spinner } from 'react-bootstrap';

/* Standard loader component to display when data is loading from web service*/
function Loader() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        height: '100px',
        width: '100px',
        margin: 'auto',
        display: 'block',
      }}
      data-testid="loader"
    ></Spinner>
  );
}

export default Loader;

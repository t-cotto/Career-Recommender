import React from 'react';
import { Alert } from 'react-bootstrap';

/* Standard message component to display on screen*/
function Message({ variant, children }) {
  return <Alert variant={variant}>{children}</Alert>;
}

export default Message;

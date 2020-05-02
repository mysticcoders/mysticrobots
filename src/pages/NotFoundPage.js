import React from "react";

import { Message } from "rbx";

export const NotFoundPage = () => {
  return (
    <Message color="danger" size="medium">
      <Message.Header>
        <h2>404</h2>
      </Message.Header>
      <Message.Body>This is not the page you were looking for!</Message.Body>
    </Message>
  );
};

export default NotFoundPage;

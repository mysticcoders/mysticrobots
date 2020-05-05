import React from "react";

import { Message } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'
import { FooterContainer } from '../containers/FooterContainer'

export const NotFoundPage = () => {
  return (
    <>
    <HeaderContainer />
    <Message color="danger" size="medium">
      <Message.Header>
        <h2>404</h2>
      </Message.Header>
      <Message.Body>This is not the page you were looking for!</Message.Body>
    </Message>
    <FooterContainer />
    </>
  );
};

export default NotFoundPage;

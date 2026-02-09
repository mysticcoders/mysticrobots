import React from "react";

import { HeaderContainer } from '../containers/HeaderContainer'
import { FooterContainer } from '../containers/FooterContainer'

export const NotFoundPage = () => {
  return (
    <>
    <HeaderContainer />
    <article className="message is-danger is-medium">
      <div className="message-header">
        <h2>404</h2>
      </div>
      <div className="message-body">This is not the page you were looking for!</div>
    </article>
    <FooterContainer />
    </>
  );
};

export default NotFoundPage;

import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.sass';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import configureStore from './store/configureStore';
import App from './pages/App';

import ReactGA from 'react-ga4'
import {
  GOOGLE_ANALYTICS_KEY,
} from './constants'

const store = configureStore();
const root = document.getElementById('root');

ReactGA.initialize(GOOGLE_ANALYTICS_KEY)

if (root instanceof Element) {
  createRoot(root).render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  );
}

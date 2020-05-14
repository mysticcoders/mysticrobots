import React from 'react';
import ReactDOM from 'react-dom';

import './index.sass';

import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';

import configureStore from './store/configureStore';
import App from './pages/App';

import * as serviceWorker from './serviceWorker';

import ReactGA from 'react-ga'
import {
  GOOGLE_ANALYTICS_KEY,
} from './constants'

import { common } from 'common'

const history = createBrowserHistory();
const store = configureStore({}, history);
const root = document.getElementById('root');

ReactGA.initialize(GOOGLE_ANALYTICS_KEY)
common()

if (root instanceof Element) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    root,
  );
}


serviceWorker.unregister();

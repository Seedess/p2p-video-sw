import React from 'react';
import { render } from 'react-dom';
import App from './App';

const renderApp = (NextApp) => {
  render(
    <NextApp />,
    document.querySelector('[data-js="app"]'),
  );
};

renderApp(App);

/**
 * Enable hot loader if are in DEV mode
*/
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    renderApp(NextApp);
  });
}

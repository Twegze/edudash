import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';
import React from 'react';

try {
  renderToString(React.createElement(App));
  console.log("Render successful");
} catch (e) {
  console.error("Render failed:");
  console.error(e);
}

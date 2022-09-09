import React from 'react';
import ReactDOM from 'react-dom';
import App from './jsx/App.jsx';

let eventHandlers = {
  onMount: (name, element, yleVisualisation) => {
    if (name !== '2021_digiprofiilitesti') return;
    const wrapper = document.getElementById('app-root');
    if (!element.contains(wrapper)) return;
    wrapper ? ReactDOM.render(<App />, wrapper) : false;
  },
  onUnmount: () => {
  }
};
window.yleVisualisationEmbeds = window.yleVisualisationEmbeds || {};
window.yleVisualisationEmbeds['2021_digiprofiilitesti'] = eventHandlers;

const wrapper = document.getElementById('app-root');
wrapper ? ReactDOM.render(<App />, wrapper) : false;
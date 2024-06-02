import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { CustomerProvider } from './CustomerContext';


ReactDOM.render(
  <Provider store={store}>
  
    <CustomerProvider>
   
    <App />
   
    </CustomerProvider>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { CustomerProvider } from './CustomerContext';
import { AuthProvider } from './AuthContext';
import { BuyerProvider } from './components/Buyercontext.js';
import { MinOrderProvider } from "./components/MinOrderContext.js";

ReactDOM.render(
  <Provider store={store}>
    <MinOrderProvider>
    <BuyerProvider>
        <AuthProvider>
    <CustomerProvider>
    <App /> 
    </CustomerProvider>
    </AuthProvider>
    </BuyerProvider>
    </MinOrderProvider>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();

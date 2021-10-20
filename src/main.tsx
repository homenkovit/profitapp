import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import { initializeApp } from 'firebase/app';
import { AuthProvider } from './contexts/auth-context';
import { OrderProvider } from './contexts/order-context';

const firebaseConfig = {
  apiKey: 'AIzaSyCr6hkPOB_QlXsuaed8ENXFwFBjpHEBvOE',
  authDomain: 'profitapp-519b8.firebaseapp.com',
  projectId: 'profitapp-519b8',
  storageBucket: 'profitapp-519b8.appspot.com',
  messagingSenderId: '1023128594610',
  appId: '1:1023128594610:web:3302016163febd5cbf81ab',
  measurementId: 'G-V305676PD7',
};

initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

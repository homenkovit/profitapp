import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/auth-context';
import { OrderProvider } from './contexts/order-context';
import App from './app';
import { Login } from './components/login/login';

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

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.user === undefined) return null;

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RequireAuth><App /></RequireAuth>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <OrderProvider>
        <RouterProvider router={router} />
      </OrderProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

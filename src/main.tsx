import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/auth-context';
import { OrderProvider } from './contexts/order-context';
import App from './app';
import { Login } from './components/login/login';

const firebaseConfig = {
  apiKey: "AIzaSyBuJvNVlN8mZQhI3MLlP7bbw0erP7LXUIY",
  authDomain: "app-getprofit.firebaseapp.com",
  projectId: "app-getprofit",
  storageBucket: "app-getprofit.appspot.com",
  messagingSenderId: "472910799216",
  appId: "1:472910799216:web:89da688add178e9490efb5"
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

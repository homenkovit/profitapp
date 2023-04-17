import React from 'react'
import { createRoot } from 'react-dom/client'
import { initializeApp } from 'firebase/app'
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom'

import { AuthProvider, useAuth } from './contexts/auth-context'
import { OrderProvider } from './contexts/order-context'
import { Login } from './components/login'
import { OrderList } from './components/order-list'
import { HistoryList } from './components/history-list'
import { App } from './components/app'

const firebaseConfig = {
  apiKey: 'AIzaSyBuJvNVlN8mZQhI3MLlP7bbw0erP7LXUIY',
  authDomain: 'app-getprofit.firebaseapp.com',
  projectId: 'app-getprofit',
  storageBucket: 'app-getprofit.appspot.com',
  messagingSenderId: '472910799216',
  appId: '1:472910799216:web:89da688add178e9490efb5',
}

initializeApp(firebaseConfig)

const RequireAuth = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const auth = useAuth()
  const location = useLocation()

  if (auth.user === undefined) return null

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    children: [
      {
        path: '',
        element: <OrderList />,
      },
      {
        path: 'history',
        element: <HistoryList />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

const container = document.querySelector('#root')
if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <AuthProvider>
        <OrderProvider>
          <RouterProvider router={router} />
        </OrderProvider>
      </AuthProvider>
    </React.StrictMode>,
  )
}

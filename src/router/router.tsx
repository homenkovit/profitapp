import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { App } from 'components/app'

import RequireAuth from './components/require-auth/require-auth'
import PageLoader from './components/page-loader/page-loader'

const Login = lazy(() => import('components/login').then((component) => ({ default: component.Login })))
const OrderList = lazy(() => import('components/order-list').then((component) => ({ default: component.OrderList })))
const HistoryList = lazy(() =>
  import('components/history-list').then((component) => ({ default: component.HistoryList })),
)

const Router = createBrowserRouter([
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
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrderList />
          </Suspense>
        ),
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HistoryList />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default Router

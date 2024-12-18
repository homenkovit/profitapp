import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { App } from 'components/app'
import { PageTitle } from 'components/page-title'

import { RequireAuth } from './components/require-auth'
import { PageLoader } from './components/page-loader'

const Login = lazy(() => import('components/login').then((component) => ({ default: component.Login })))
const OrderList = lazy(() => import('components/order-list').then((component) => ({ default: component.OrderList })))
const HistoryList = lazy(() =>
  import('components/history-list').then((component) => ({ default: component.HistoryList })),
)
const UserSettings = lazy(() =>
  import('components/user-settings').then((component) => ({ default: component.UserSettings })),
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
            <PageTitle title="Главная" />
            <OrderList />
          </Suspense>
        ),
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageTitle title="История заказов" />
            <HistoryList />
          </Suspense>
        ),
      },
      {
        path: 'user',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageTitle title="Мой аккаунт" />
            <UserSettings />
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
        <PageTitle title="Логин" />
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

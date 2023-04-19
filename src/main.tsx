import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { initializeApp } from 'firebase/app'

import { AuthProvider } from './contexts/auth-context'
import { OrderProvider } from './contexts/order-context'
import { Router } from './router'

import 'styles/modules.scss'
import 'styles/base.css'

const firebaseConfig = {
  apiKey: 'AIzaSyBuJvNVlN8mZQhI3MLlP7bbw0erP7LXUIY',
  authDomain: 'app-getprofit.firebaseapp.com',
  projectId: 'app-getprofit',
  storageBucket: 'app-getprofit.appspot.com',
  messagingSenderId: '472910799216',
  appId: '1:472910799216:web:89da688add178e9490efb5',
}

initializeApp(firebaseConfig)

const container = document.querySelector('#root')
if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <AuthProvider>
        <OrderProvider>
          <RouterProvider router={Router} />
        </OrderProvider>
      </AuthProvider>
    </StrictMode>,
  )
}

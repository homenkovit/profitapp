import { useLocation, Navigate } from 'react-router-dom'

import { useAuth } from 'contexts/auth-context'

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

export default RequireAuth

/* eslint-disable max-lines */
import React, { FC, useEffect, useState, createContext, useContext, useCallback, useMemo } from 'react'
import {
  getAuth,
  signInAnonymously as firebaseSignInAnonymously,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  AuthErrorCodes,
} from 'firebase/auth'

type AuthErrorCode = (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes]

const AuthErrorMap = {
  [AuthErrorCodes.USER_DELETED]: 'Пользователь не найден',
  [AuthErrorCodes.INVALID_PASSWORD]: 'Неверный пароль',
  [AuthErrorCodes.EMAIL_EXISTS]: 'Пользователь уже существует',
} as Record<AuthErrorCode, string>

interface AuthStore {
  user: User | null | undefined
  authError?: string
  signUpWithGoogle: () => void
  signInWithGoogle: () => void
  signUpWithEmail: (email: string, password: string, name: string) => void
  signInWithEmail: (email: string, password: string) => void
  signInAnonymously: () => void
  signOut: () => void
  resetPassword: (email: string) => void
}

const AuthContext = createContext<AuthStore | null>(null)

export const useAuth = (): AuthStore => {
  const store = useContext(AuthContext)

  if (!store) {
    throw new Error("Auth store isn't initialized yet")
  }

  return store
}

export const AuthProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const auth = getAuth()

  const [user, setUser] = useState<AuthStore['user']>()
  const [authError, setAuthError] = useState<string>()

  useEffect(() => {
    return onAuthStateChanged(auth, (changedUser) => {
      if (changedUser) {
        setAuthError(undefined)
      }

      setUser(changedUser)
    })
  }, [auth])

  const signUpWithEmail = useCallback(
    (email: string, password: string, name: string) => {
      if (user) {
        linkWithCredential(user, EmailAuthProvider.credential(email, password))
          .then((result) => {
            sendEmailVerification(result.user)
            setUser({ ...result.user, displayName: name })
            updateProfile(result.user, { displayName: name })
          })
          .catch((error) => {
            const errorCode = error.code as AuthErrorCode
            setAuthError(AuthErrorMap[errorCode])
            console.error('Error while signing up with email and password', error)
          })
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((result) => {
            sendEmailVerification(result.user)
            setUser({ ...result.user, displayName: name })
            updateProfile(result.user, { displayName: name })
          })
          .catch((error) => {
            const errorCode = error.code as AuthErrorCode
            setAuthError(AuthErrorMap[errorCode])
            console.error('Error while creating new user with email and password', error)
          })
      }
    },
    [auth, user],
  )

  const signInWithEmail = useCallback(
    (email: string, password: string) => {
      signInWithEmailAndPassword(auth, email, password).catch((error) => {
        const errorCode = error.code as AuthErrorCode
        setAuthError(AuthErrorMap[errorCode])
        console.error('Error while signing in with email and password', error)
      })
    },
    [auth],
  )

  const signInWithGoogle = useCallback(() => {
    signInWithPopup(auth, new GoogleAuthProvider()).catch((error) => {
      const errorCode = error.code as AuthErrorCode
      setAuthError(AuthErrorMap[errorCode])
      console.error('Error while signing in', error)
    })
  }, [auth])

  const signUpWithGoogle = useCallback(() => {
    if (user) {
      linkWithPopup(user, new GoogleAuthProvider())
        .then((result) => {
          const { displayName } = result.user.providerData[0]
          setUser({ ...result.user, displayName })
          updateProfile(result.user, { displayName })
        })
        .catch((error) => {
          const errorCode = error.code as AuthErrorCode
          setAuthError(AuthErrorMap[errorCode])
        })
    } else {
      signInWithGoogle()
    }
  }, [user, signInWithGoogle])

  const signOut = useCallback(() => {
    firebaseSignOut(auth).catch((error) => {
      const errorCode = error.code as AuthErrorCode
      setAuthError(AuthErrorMap[errorCode])
      console.error('Error while signing out', error)
    })
  }, [auth])

  const signInAnonymously = useCallback(() => {
    firebaseSignInAnonymously(auth).catch((error) => {
      const errorCode = error.code as AuthErrorCode
      setAuthError(AuthErrorMap[errorCode])
      console.error('Error while signing in anonymously', error)
    })
  }, [auth])

  const resetPassword = useCallback(
    (email: string) => {
      sendPasswordResetEmail(auth, email).catch((error) => {
        const errorCode = error.code as AuthErrorCode
        setAuthError(AuthErrorMap[errorCode])
        console.error('Error while sending reset password email', error)
      })
    },
    [auth],
  )

  const value: AuthStore = useMemo(
    () => ({
      user,
      authError,
      signUpWithGoogle,
      signInWithGoogle,
      signUpWithEmail,
      signInWithEmail,
      signInAnonymously,
      signOut,
      resetPassword,
    }),
    [
      authError,
      resetPassword,
      signInAnonymously,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      signUpWithEmail,
      signUpWithGoogle,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

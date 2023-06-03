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
  updatePassword,
  deleteUser as firebaseDeleteUser,
} from 'firebase/auth'
import { collection, deleteDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'

type AuthErrorCode = (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes]
type AuthStoreUser = User | null | undefined

const AuthErrorMap = {
  [AuthErrorCodes.USER_DELETED]: 'Пользователь не найден',
  [AuthErrorCodes.INVALID_PASSWORD]: 'Неверный пароль',
  [AuthErrorCodes.EMAIL_EXISTS]: 'Пользователь уже существует',
} as Record<AuthErrorCode, string>

interface AuthStore {
  user: AuthStoreUser
  authError?: string
  signUpWithGoogle: () => void
  signInWithGoogle: () => void
  signUpWithEmail: (email: string, password: string, name?: string) => void
  signInWithEmail: (email: string, password: string) => void
  signInAnonymously: () => void
  signOut: () => void
  resetPassword: (email: string) => void
  changeName: (name: string) => void
  changePassword: (password: string) => void
  deleteUser: () => void
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

  const [user, setUser] = useState<AuthStoreUser>()
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
    (email: string, password: string, name?: string) => {
      if (user) {
        linkWithCredential(user, EmailAuthProvider.credential(email, password))
          .then((result) => {
            sendEmailVerification(result.user)
            if (name) {
              setUser({ ...result.user, displayName: name })
              updateProfile(result.user, { displayName: name })
            }
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
            if (name) {
              setUser({ ...result.user, displayName: name })
              updateProfile(result.user, { displayName: name })
            }
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
          if (!user.displayName) {
            const { displayName } = result.user.providerData[0]
            setUser({ ...result.user, displayName })
            updateProfile(result.user, { displayName })
          }
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

  const changeName = useCallback(
    (newName: string) => {
      if (!auth.currentUser) return

      updateProfile(auth.currentUser, { displayName: newName })
        .then(() => {
          setUser((previous) => ({ ...(previous as User), displayName: newName }))
        })
        .catch((error) => {
          console.error('Error while changing user name', error)
        })
    },
    [auth.currentUser],
  )

  const changePassword = useCallback(
    (newPassword: string) => {
      if (!auth.currentUser) return

      updatePassword(auth.currentUser, newPassword).catch((error) => {
        console.error('Error while changing password', error)
      })
    },
    [auth.currentUser],
  )

  const deleteUser = useCallback(() => {
    if (!auth.currentUser) return

    const { uid } = auth.currentUser
    const ordersCollection = collection(getFirestore(), 'orders')
    const ordersQuery = query(ordersCollection, where('uid', '==', uid))

    getDocs(ordersQuery).then((querySnapshot) => {
      querySnapshot.forEach((document_) => {
        deleteDoc(document_.ref).catch((error) => {
          console.error('Error while deleting document', error)
        })
      })
    })

    firebaseDeleteUser(auth.currentUser).catch((error) => {
      console.error('Error while deleting user', error)
    })
  }, [auth.currentUser])

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
      changeName,
      changePassword,
      deleteUser,
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
      changeName,
      changePassword,
      deleteUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

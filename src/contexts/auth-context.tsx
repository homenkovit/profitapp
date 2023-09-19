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
  reauthenticateWithCredential,
  AuthCredential,
  reauthenticateWithPopup,
} from 'firebase/auth'
import { collection, deleteDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'

type AuthErrorCode = (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes]
type AuthStoreUser = User | null | undefined

const AuthErrorMap = {
  [AuthErrorCodes.USER_DELETED]: 'Пользователь не найден',
  [AuthErrorCodes.INVALID_PASSWORD]: 'Неверный пароль',
  [AuthErrorCodes.EMAIL_EXISTS]: 'Пользователь уже существует',
  [AuthErrorCodes.WEAK_PASSWORD]: 'Пароль должен содержать минимум 6 символов',
} as Record<AuthErrorCode, string>

interface AuthStore {
  user: AuthStoreUser
  errorMessage?: string
  errorCode?: AuthErrorCode
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
  const [errorMessage, setErrorMessage] = useState<string>()
  const [errorCode, setErrorCode] = useState<AuthErrorCode>()

  const clearError = useCallback(() => {
    setErrorCode(undefined)
    setErrorMessage(undefined)
  }, [])

  useEffect(() => {
    return onAuthStateChanged(auth, (changedUser) => {
      if (changedUser) {
        clearError()
      }

      setUser(changedUser)
    })
  }, [auth, clearError])

  const signUpWithEmail = useCallback(
    (email: string, password: string, name?: string) => {
      clearError()

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
            const code = error.code as AuthErrorCode
            setErrorCode(code)
            setErrorMessage(AuthErrorMap[code])
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
            const code = error.code as AuthErrorCode
            setErrorCode(code)
            setErrorMessage(AuthErrorMap[code])
            console.error('Error while creating new user with email and password', error)
          })
      }
    },
    [auth, user, clearError],
  )

  const signInWithEmail = useCallback(
    (email: string, password: string) => {
      if (
        auth.currentUser &&
        (errorCode === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN || errorCode === AuthErrorCodes.TOKEN_EXPIRED)
      ) {
        reauthenticateWithCredential(auth.currentUser, new AuthCredential())
        return
      }

      clearError()

      signInWithEmailAndPassword(auth, email, password).catch((error) => {
        const code = error.code as AuthErrorCode
        setErrorCode(code)
        setErrorMessage(AuthErrorMap[code])
        console.error('Error while signing in with email and password', error)
      })
    },
    [auth, errorCode, clearError],
  )

  const signInWithGoogle = useCallback(() => {
    if (
      auth.currentUser &&
      (errorCode === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN || errorCode === AuthErrorCodes.TOKEN_EXPIRED)
    ) {
      reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider())
      return
    }

    clearError()

    signInWithPopup(auth, new GoogleAuthProvider()).catch((error) => {
      const code = error.code as AuthErrorCode
      setErrorCode(code)
      setErrorMessage(AuthErrorMap[code])
      console.error('Error while signing in with Google', error)
    })
  }, [auth, errorCode, clearError])

  const signUpWithGoogle = useCallback(() => {
    clearError()

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
          const code = error.code as AuthErrorCode
          setErrorCode(code)
          setErrorMessage(AuthErrorMap[code])
          console.error('Error while signing up with Google', error)
        })
    } else {
      signInWithGoogle()
    }
  }, [user, signInWithGoogle, clearError])

  const signOut = useCallback(() => {
    clearError()

    firebaseSignOut(auth).catch((error) => {
      const code = error.code as AuthErrorCode
      setErrorCode(code)
      setErrorMessage(AuthErrorMap[code])
      console.error('Error while signing out', error)
    })
  }, [auth, clearError])

  const signInAnonymously = useCallback(() => {
    clearError()

    firebaseSignInAnonymously(auth).catch((error) => {
      const code = error.code as AuthErrorCode
      setErrorCode(code)
      setErrorMessage(AuthErrorMap[code])
      console.error('Error while signing in anonymously', error)
    })
  }, [auth, clearError])

  const resetPassword = useCallback(
    (email: string) => {
      clearError()

      sendPasswordResetEmail(auth, email).catch((error) => {
        const code = error.code as AuthErrorCode
        setErrorCode(code)
        setErrorMessage(AuthErrorMap[code])
        console.error('Error while sending reset password email', error)
      })
    },
    [auth, clearError],
  )

  const changeName = useCallback(
    (newName: string) => {
      clearError()

      if (!auth.currentUser) return

      updateProfile(auth.currentUser, { displayName: newName })
        .then(() => {
          setUser((previous) => ({ ...(previous as User), displayName: newName }))
        })
        .catch((error) => {
          const code = error.code as AuthErrorCode
          setErrorCode(code)
          setErrorMessage(AuthErrorMap[code])
          console.error('Error while changing user name', error)
        })
    },
    [auth.currentUser, clearError],
  )

  const changePassword = useCallback(
    (newPassword: string) => {
      clearError()

      if (!auth.currentUser) return

      updatePassword(auth.currentUser, newPassword).catch((error) => {
        const code = error.code as AuthErrorCode
        setErrorCode(code)
        setErrorMessage(AuthErrorMap[code])
        console.error('Error while changing password', error)
      })
    },
    [auth.currentUser, clearError],
  )

  const deleteUser = useCallback(() => {
    clearError()

    if (!auth.currentUser) return

    const { uid } = auth.currentUser
    const ordersCollection = collection(getFirestore(), 'orders')
    const ordersQuery = query(ordersCollection, where('uid', '==', uid))

    getDocs(ordersQuery).then((querySnapshot) => {
      querySnapshot.forEach((document_) => {
        deleteDoc(document_.ref).catch((error) => {
          const code = error.code as AuthErrorCode
          setErrorCode(code)
          setErrorMessage(AuthErrorMap[code])
          console.error('Error while deleting document', error)
        })
      })
    })

    firebaseDeleteUser(auth.currentUser).catch((error) => {
      const code = error.code as AuthErrorCode
      setErrorCode(code)
      setErrorMessage(AuthErrorMap[code])
      console.error('Error while deleting user', error)
    })
  }, [auth.currentUser, clearError])

  const value: AuthStore = useMemo(
    () => ({
      user,
      errorMessage,
      errorCode,
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
      errorMessage,
      errorCode,
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

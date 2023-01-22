import React, { FC, useEffect, useState, createContext, useContext } from 'react';
import { getAuth, signInAnonymously, User, onAuthStateChanged, createUserWithEmailAndPassword, EmailAuthProvider, GoogleAuthProvider, linkWithCredential, linkWithPopup, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';

interface AuthStore {
  user: User | null | undefined;
  signUpWithGoogle: () => void;
  signInWithGoogle: () => void;
  signUpWithEmail: (email: string, password: string, name: string) => void;
  signInWithEmail: (email: string, password: string) => void;
  signInAnonymously: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthStore | null>(null);

export const useAuth = (): AuthStore => {
  const store = useContext(AuthContext);

  if (!store) {
    throw new Error('Auth store isn\'t initialized yet');
  }

  return store;
}

export const AuthProvider: FC = ({ children }) => {
  const auth = getAuth();
  console.log('auth', auth, auth.currentUser);

  const [user, setUser] = useState<AuthStore['user']>();

  useEffect(() => {
    return onAuthStateChanged(auth, (changedUser) => {
      console.log('Set user');
      console.log(changedUser);
      setUser(changedUser);
    });
  }, [auth]);

  useEffect(() => console.log(user), [user]);

  const signUpWithEmail = (email: string, password: string, name: string) => {
    if (user) {
      linkWithCredential(user, EmailAuthProvider.credential(email, password))
        .then((userCredential) => {
          console.log('Anonymous account successfully upgraded with email and password', userCredential.user, user);
          sendEmailVerification(userCredential.user);
          setUser({...userCredential.user, displayName: name});
          updateProfile(userCredential.user, { displayName: name });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          console.error('Error while signing up with email and password', error);
        });
    }
  };

  const signInWithEmail = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Signed in with email and password', userCredential.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error while signing in with email and password', error);
      });
  };

  const signUpWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    if (user) {
      linkWithPopup(user, provider)
        .then((usercred) => {
          console.log('Anonymous account successfully upgraded with google', usercred.user);
        }).catch((error) => {
          console.log("Error upgrading anonymous account", error);
        });
    }
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Signed in successfully with google', result.user);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('Error while signing in', error);
      });
  };

  const signOut = () => {
    firebaseSignOut(auth).then(() => {
      console.log('signed out');
    }).catch((error) => {
      // An error happened.
    });
  };

  const value: AuthStore = {
    user,
    signUpWithGoogle,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signInAnonymously: () => signInAnonymously(auth),
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

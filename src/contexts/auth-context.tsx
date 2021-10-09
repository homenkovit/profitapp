import React, { FC, useEffect, useState, createContext, useContext, useMemo } from 'react';
import { getAuth, signInAnonymously, User, onAuthStateChanged } from '@firebase/auth';

interface Auth {
  user?: User;
}

const AuthContext = createContext<Auth>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const auth = useMemo(() => getAuth(), []);

  signInAnonymously(auth);

  const [user, setUser] = useState<User>();

  const value: Auth = {
    user,
  };

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

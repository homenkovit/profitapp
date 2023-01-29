import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anonymous } from './anonymous/anonymous';
import styles from './login.module.scss';
import { Tabs } from './tabs/tabs';

export const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Tabs />
        <Anonymous />
      </div>
    </div>
  );
};

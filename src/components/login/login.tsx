import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from './tabs/tabs';
import { Anonymous } from './anonymous/anonymous';
import styles from './login.module.scss';
import { useAuth } from '../../contexts/auth-context';

export const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log(user);
      navigate('/');
    }
  }, [user]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Tabs />
        <Anonymous />
      </div>
    </div>
  );
};

import React, { FC } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { InfoBlock } from '../info-block/info-block';

export const UnverifiedEmailMessage: FC = () => {
  const { user } = useAuth();

  if (!user || (user.isAnonymous || user.emailVerified)) {
    return null;
  }

  return (
    <InfoBlock text="Пожалуйста, подтвердите ваш email. Мы выслали письмо с ссылкой на вашу почту." />
  );
};


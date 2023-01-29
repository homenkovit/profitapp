import React, { FC, useCallback, useEffect, useState } from 'react';
import { AuthorizationPopup } from '../popup/authorization-popup/authorization-popup';
import { AuthorizationType } from '../authorization/authorization';
import { InfoBlock } from '../info-block/info-block';

const LOCAL_STORAGE_IS_GREETING_COLLAPSED = 'isGreetingCollapsed';

export const GreetingMessage: FC = () => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [popupType, setPopupType] = useState<AuthorizationType | undefined>();

  useEffect(() => {
    const collapsedFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED);
    
    if (collapsedFromLocalStorage) {
      setExpanded(false);
    } else {
      setExpanded(true);
      localStorage.removeItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED);
    }

    return () => {
      localStorage.removeItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED);
    };
  }, []);

  const handleExpandToggle = useCallback((isExpanded: boolean) => {
    setExpanded(isExpanded)
    if (isExpanded) {
      localStorage.removeItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED);
    } else {
      localStorage.setItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED, 'true');
    }
  }, []);

  const openSignInPopup = useCallback(() => setPopupType(AuthorizationType.SIGN_IN), []);
  const openSignUpPopup = useCallback(() => setPopupType(AuthorizationType.SIGN_UP), []);
  const closeSignInUpPopup = useCallback(() => setPopupType(undefined), []);

  const text = "Если ты находишься в данном режиме - значит еще не до конца представляешь, чем может помочь тебе данное приложение. Ничего сверхествественного мы не написали. Это просто удобный сервис, помогающей тебе держать в одном месте информацию о своих клиентах с возможностью оценивать свой ежемесячный доход. Некий ToDo лист для фрилансера.";

  return (
    <InfoBlock
      title="Добро пожаловать, коллега!"
      text={text}
      expandable
      expanded={expanded}
      onExpandToggle={handleExpandToggle}
      actions={(
        <>
          <button className="btn btn-primary" onClick={openSignInPopup}>Войти</button>
          <button className="btn btn-default" onClick={openSignUpPopup}>Зарегистрироваться</button>
          {popupType !== undefined && <AuthorizationPopup type={popupType} onClose={closeSignInUpPopup} />}
        </>
      )}
    />
  );
};

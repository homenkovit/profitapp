import { FC, memo, useCallback, useEffect, useState } from 'react'

import { AuthorizationPopup } from '../popup/authorization-popup'
import { AuthorizationType } from '../authorization/authorization'
import { InfoBlock } from '../info-block'

const LOCAL_STORAGE_IS_GREETING_COLLAPSED = 'isGreetingCollapsed'

const GreetingMessage: FC = () => {
  const [expanded, setExpanded] = useState<boolean>(true)
  const [popupType, setPopupType] = useState<AuthorizationType | undefined>()

  useEffect(() => {
    const collapsedFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED)

    if (collapsedFromLocalStorage) {
      setExpanded(false)
    } else {
      setExpanded(true)
      localStorage.removeItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED)
    }

    return (): void => {
      localStorage.removeItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED)
    }
  }, [])

  const handleExpandToggle = useCallback((isExpanded: boolean) => {
    setExpanded(isExpanded)
    if (isExpanded) {
      localStorage.removeItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED)
    } else {
      localStorage.setItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED, 'true')
    }
  }, [])

  const openSignInPopup = useCallback(() => setPopupType(AuthorizationType.SIGN_IN), [])
  const openSignUpPopup = useCallback(() => setPopupType(AuthorizationType.SIGN_UP), [])
  const closeSignInUpPopup = useCallback(() => setPopupType(undefined), [])

  const text =
    'Если ты находишься в данном режиме - значит еще не до конца представляешь, чем может помочь тебе данное приложение. Это просто удобный сервис, помогающей тебе держать в одном месте информацию о своих клиентах с возможностью оценивать и планировать свой ежемесячный доход.'

  return (
    <InfoBlock
      title="Добро пожаловать, коллега!"
      text={text}
      expandable
      expanded={expanded}
      onExpandToggle={handleExpandToggle}
      actions={
        <>
          <button type="button" className="btn btn-primary" onClick={openSignInPopup}>
            Войти
          </button>
          <button type="button" className="btn btn-default" onClick={openSignUpPopup}>
            Зарегистрироваться
          </button>
          {popupType !== undefined && <AuthorizationPopup type={popupType} onClose={closeSignInUpPopup} />}
        </>
      }
    />
  )
}

export default memo(GreetingMessage)

import { FC, FormEvent, memo, useState } from 'react'

import { useAuth } from 'contexts/auth-context'
import { TopBarPortal } from 'components/top-bar'
import { BackToOrdersLink } from 'components/back-to-orders-link'

import styles from './user-settings.module.scss'

const UserSettings: FC = () => {
  const { user, changeName, changePassword, deleteUser, signUpWithGoogle } = useAuth()
  const providers = user?.providerData.map(({ providerId }) => providerId).filter((provider) => provider !== 'password')

  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const newName = name.trim()
    const newPassword = password.trim()

    if (newName && newName !== user?.displayName) {
      changeName(newName)
    }

    if (newPassword) {
      changePassword(newPassword)
    }

    setName('')
    setPassword('')
  }

  return (
    <>
      <TopBarPortal>
        <BackToOrdersLink />
      </TopBarPortal>
      <div>
        <h1>Настройки пользователя</h1>
        <form method="post" onSubmit={onSubmit} className={styles.form}>
          <label htmlFor="name">
            Изменить имя
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(event): void => setName(event.currentTarget.value)}
            />
          </label>
          <label htmlFor="password">
            Сменить пароль
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event): void => setPassword(event.currentTarget.value)}
            />
          </label>
          <button type="submit">Сохранить</button>
        </form>
      </div>
      {providers && providers?.length === 0 && (
        <>
          <h2>Подключить провайдеры</h2>
          <ul>
            <li>
              <button type="button" onClick={signUpWithGoogle}>
                Google
              </button>
            </li>
          </ul>
        </>
      )}
      <br />
      <button type="button" onClick={deleteUser}>
        Удалить пользователя
      </button>
    </>
  )
}

export default memo(UserSettings)

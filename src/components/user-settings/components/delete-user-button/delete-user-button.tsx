import { FC, memo, useCallback, useState } from 'react'

import { useAuth } from 'contexts/auth-context'
import { ConfirmationPopup } from 'components/popup/confirmation-popup'

const DeleteUserButton: FC = () => {
  const { deleteUser } = useAuth()
  const [isModalVisible, setModalVisible] = useState<boolean>(false)

  const openModal = useCallback(() => setModalVisible(true), [])
  const closeModal = useCallback(() => setModalVisible(false), [])

  const onDelete = useCallback(() => deleteUser(), [deleteUser])

  return (
    <>
      <button type="button" className="btn btn-danger" onClick={openModal}>
        Удалить аккаунт
      </button>

      <ConfirmationPopup
        isVisible={isModalVisible}
        onClose={closeModal}
        message="Вы уверены, что хотите удалить аккаунт?"
        emoji="😢"
        actionsList={[
          <button type="button" className="btn btn-danger" onClick={onDelete} key="delete">
            Удалить
          </button>,
          <button type="button" className="btn btn-default" onClick={closeModal} key="cancel">
            Я передумал
          </button>,
        ]}
      />
    </>
  )
}

export default memo(DeleteUserButton)

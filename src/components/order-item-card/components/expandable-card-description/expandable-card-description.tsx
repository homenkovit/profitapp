import { FC, memo, useState } from 'react'

import { ReactComponent as IconExpand } from 'assets/images/expand.svg'
import { ReactComponent as IconOverdue } from 'assets/images/overdue.svg'

import { decodeText } from 'global/helpers'

import cardStyles from '../../order-item-card.module.scss'

import styles from './expandable-card-description.module.scss'

interface ExpandableCardDescriptionProperties {
  description: string
  isOrderOverdue: boolean
}

const ExpandableCardDescription: FC<ExpandableCardDescriptionProperties> = ({ description, isOrderOverdue }) => {
  const [isDescriptionExpand, setIsDescriptionExpand] = useState<boolean>(false)

  return (
    <button
      type="button"
      aria-label="expand"
      className={styles['expand-button']}
      onClick={(): void => setIsDescriptionExpand(!isDescriptionExpand)}
    >
      <div className={`${cardStyles.description} ${isDescriptionExpand ? styles['full-text'] : ''}`}>
        {isOrderOverdue && <IconOverdue className={cardStyles['overdue-icon']} />}
        {decodeText(description)}
      </div>
      <IconExpand className={`${styles['expand-icon']} ${isDescriptionExpand ? styles.expanded : ''}`} aria-hidden />
    </button>
  )
}

export default memo(ExpandableCardDescription)

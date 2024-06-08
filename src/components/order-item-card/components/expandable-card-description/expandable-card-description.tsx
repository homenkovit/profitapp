import { FC, memo, useLayoutEffect, useRef, useState } from 'react'

import IconExpand from 'assets/images/expand.svg?react'
import IconOverdue from 'assets/images/overdue.svg?react'

import { decodeText } from 'global/helpers'
import { useIsMobile } from 'hooks/use-is-mobile'

import cardStyles from '../../order-item-card.module.scss'

import styles from './expandable-card-description.module.scss'

const collapsedDescHeight = '20px'
const collapsedDescHeightMobile = '16px'

interface ExpandableCardDescriptionProperties {
  description: string
  isOrderOverdue: boolean
}

const ExpandableCardDescription: FC<ExpandableCardDescriptionProperties> = ({ description, isOrderOverdue }) => {
  const [isDescriptionExpand, setIsDescriptionExpand] = useState<boolean>(false)
  const descriptionReference = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  useLayoutEffect(() => {
    const { current } = descriptionReference

    if (current) {
      current.style.height = isDescriptionExpand
        ? `${current.scrollHeight}px`
        : `${isMobile ? collapsedDescHeightMobile : collapsedDescHeight}`
    }
  }, [isDescriptionExpand, isMobile])

  return (
    <button
      type="button"
      aria-label="expand"
      className={styles['expand-button']}
      onClick={(): void => setIsDescriptionExpand(!isDescriptionExpand)}
    >
      <div
        ref={descriptionReference}
        className={`${cardStyles.description} ${isDescriptionExpand ? styles['full-text'] : ''}`}
      >
        {isOrderOverdue && <IconOverdue className={cardStyles['overdue-icon']} />}
        {decodeText(description)}
      </div>
      <IconExpand className={`${styles['expand-icon']} ${isDescriptionExpand ? styles.expanded : ''}`} aria-hidden />
    </button>
  )
}

export default memo(ExpandableCardDescription)

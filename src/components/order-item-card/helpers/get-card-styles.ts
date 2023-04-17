import type { Order } from 'contexts/order-context'

export const getCardStyles = (styles: CSSModuleClasses, data: Order): string => {
  let additionalStyles = styles.single

  if (data.isPermanent) {
    additionalStyles = styles.permanent
  }

  if (data.isOverdue) {
    additionalStyles = styles.overdue
  }

  if (data.isCompleted) {
    additionalStyles += ` ${styles.completed}`
  }

  return `${styles.card} ${additionalStyles}`
}

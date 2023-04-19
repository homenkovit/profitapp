import { FC, useState, memo, useCallback } from 'react'

import type { Order } from 'contexts/order-context'
import { OrderItemForm } from 'components/order-item-form'
import { OrderItemCard } from 'components/order-item-card'

interface OrderItemProperties {
  data: Order
}

const OrderItem: FC<OrderItemProperties> = ({ data }) => {
  const [isForm, setIsForm] = useState<boolean>(false)

  const openForm = useCallback(() => setIsForm(true), [])
  const closeForm = useCallback(() => setIsForm(false), [])

  if (isForm) {
    return <OrderItemForm data={data} onClose={closeForm} />
  }

  return <OrderItemCard data={data} onClickEdit={openForm} />
}

export default memo(OrderItem)

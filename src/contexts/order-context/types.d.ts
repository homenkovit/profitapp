export interface Order {
  id: string
  description: string
  price: number
  isPermanent: boolean
  year?: number
  month?: number
  isOverdue?: boolean
  originalYear?: number
  originalMonth?: number
  isCompleted?: boolean
  completedYear?: number
  completedMonth?: number
  createdAt: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface StoreOrder extends Omit<Order, 'id'> {
  uid: string
}

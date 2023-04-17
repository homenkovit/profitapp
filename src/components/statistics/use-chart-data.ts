import { useEffect, useMemo, useState, useCallback } from 'react'

import { useOrder } from 'contexts/order-context'
import { ChartItem } from 'components/chart/types'
import { MONTHS } from 'utils'

interface UseChartData {
  plansAndFacts: ChartItem[]
  currentPlanAndFact: ChartItem
  currentMonthIndex: number
  definePlanColumnHeight: (planValue: number) => string
}

const getInitialPlansAndFact = (): Array<ChartItem> => MONTHS.map(() => ({ plan: 0, fact: 0 }))

export const useChartData = (): UseChartData => {
  const { orders, currentYearCompletedOrders } = useOrder()
  const [plansAndFacts, setPlansAndFacts] = useState<ChartItem[]>(getInitialPlansAndFact())
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const currentMonthIndex = useMemo(() => new Date().getMonth(), [])
  const currentPlanAndFact = plansAndFacts[currentMonthIndex]

  const planArray: number[] = useMemo(() => {
    return plansAndFacts.map((item: ChartItem) => item.plan)
  }, [plansAndFacts])

  const maxPlan: number = useMemo(() => {
    return Math.max.apply(null, planArray)
  }, [planArray])

  const definePlanColumnHeight = useCallback(
    (planValue: number): string => {
      return planValue === 0 ? 'initial' : `${(planValue * 100) / maxPlan}%`
    },
    [maxPlan],
  )

  useEffect(() => {
    const newPlansAndFacts = getInitialPlansAndFact()

    const combinedOrders = [...orders, ...currentYearCompletedOrders]

    combinedOrders.forEach((order) => {
      if (order.isPermanent && order.createdAt) {
        const orderCreatedYear = order.createdAt.toDate().getFullYear()
        const orderCreatedMonthIndex = order.createdAt.toDate().getMonth()

        // TODO: refactor this
        // eslint-disable-next-line no-restricted-syntax
        for (const [monthIndex, item] of newPlansAndFacts.entries()) {
          if (order.isCompleted && order.completedYear && order.completedMonth !== undefined) {
            const orderCompletedMonthIndex = order.completedMonth
            if (
              (orderCreatedYear === order.completedYear &&
                monthIndex >= orderCreatedMonthIndex &&
                monthIndex <= orderCompletedMonthIndex) ||
              (orderCreatedYear < order.completedYear && monthIndex <= orderCompletedMonthIndex)
            ) {
              item.plan += order.price
              item.fact += order.price
            }
          } else if (
            orderCreatedYear < currentYear ||
            (orderCreatedYear === currentYear && monthIndex >= orderCreatedMonthIndex)
          ) {
            item.plan += order.price
            if (monthIndex < currentMonthIndex) {
              item.fact += order.price
            }
          }
        }
      } else if (order.year === currentYear && order.month !== undefined) {
        const orderMonthIndex = order.month
        newPlansAndFacts[orderMonthIndex].plan += order.price
        if (order.isCompleted) {
          newPlansAndFacts[orderMonthIndex].fact += order.price
        }
      }
    })

    setPlansAndFacts(newPlansAndFacts)
  }, [orders, currentYearCompletedOrders, currentYear, currentMonthIndex])

  return {
    plansAndFacts,
    currentPlanAndFact,
    currentMonthIndex,
    definePlanColumnHeight,
  }
}

import { useEffect, useMemo, useState } from 'react';
import { ChartItem } from '../chart/types';
import { useOrder } from '../../contexts/order-context';
import { MONTHS } from '../../utils';

interface UseChartData {
  plansAndFacts: ChartItem[];
  currentPlanAndFact: ChartItem;
}

const getInitialPlansAndFact = () => MONTHS.map(() => ({ plan: 0, fact: 0 }));

export const useChartData = (): UseChartData => {
  const { orders, currentYearCompletedOrders } = useOrder();
  const [plansAndFacts, setPlansAndFacts] = useState<ChartItem[]>(getInitialPlansAndFact());
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const currentMonthIndex = useMemo(() => new Date().getMonth(), []);
  const currentPlanAndFact = plansAndFacts[currentMonthIndex];

  useEffect(() => {
    const newPlansAndFacts = getInitialPlansAndFact();

    [...orders, ...currentYearCompletedOrders]
      .forEach((order) => {
        if (order.isPermanent && order.createdAt) {
          const orderCreatedYear = order.createdAt.toDate().getFullYear();
          const orderCreatedMonthIndex = order.createdAt.toDate().getMonth();
          for (let monthIndex = 0; monthIndex < newPlansAndFacts.length; monthIndex++) {
            const item = newPlansAndFacts[monthIndex];
            if (order.isCompleted && order.completedYear && order.completedMonth !== undefined) {
              const orderCompletedMonthIndex = order.completedMonth;
              if ((orderCreatedYear === order.completedYear
                    && monthIndex >= orderCreatedMonthIndex
                    && monthIndex <= orderCompletedMonthIndex)
                  || (orderCreatedYear < order.completedYear && monthIndex <= orderCompletedMonthIndex)
              ) {
                item.plan += order.price;
                item.fact += order.price;
              }
            } else if (orderCreatedYear < currentYear || (orderCreatedYear === currentYear && monthIndex >= orderCreatedMonthIndex)) {
              item.plan += order.price;
              if (monthIndex < currentMonthIndex) {
                item.fact += order.price;
              }
            }
          }
        } else if (order.year === currentYear && order.month !== undefined) {
          const orderMonthIndex = order.month;
          newPlansAndFacts[orderMonthIndex].plan += order.price;
          if (order.isCompleted) {
            newPlansAndFacts[orderMonthIndex].fact += order.price;
          }
        }
      });

    setPlansAndFacts(newPlansAndFacts);
  }, [orders, currentYearCompletedOrders]);

  return { plansAndFacts, currentPlanAndFact }; 
};
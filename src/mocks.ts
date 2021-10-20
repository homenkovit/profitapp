interface ChartItem {
  plan: number,
  fact: number,
}

const chartData = [
  {plan: 50000, fact: 40000},
  {plan: 45000, fact: 43000},
  {plan: 30000, fact: 29000},
  {plan: 50000, fact: 40000},
  {plan: 55000, fact: 50000},
  {plan: 45000, fact: 43000},
  {plan: 32000, fact: 32000},
  {plan: 15000, fact: 0},
  {plan: 0, fact: 0},
  {plan: 0, fact: 0},
  {plan: 0, fact: 0},
  {plan: 0, fact: 0},
];

export { chartData };
export type { ChartItem };

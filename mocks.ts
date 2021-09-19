interface Job {
  id: string;
  description: string;
  price: number;
  isPermanent: boolean;
  month?: string;
}

interface User {
  name: string;
  jobs: Array<Job>;
}

interface ChartItem {
  plan: number,
  fact: number,
}

const user: User = {
  name: 'Sergey',
  jobs: [
    // {
    //   id: '1',
    //   description: '',
    //   price: 0,
    //   isPermanent: true,
    //   month: undefined
    // },
    {
      id: '2',
      description: 'some loooooooooooooooooooooooooongloooooooooooooooooooooooooongloooooooooooooooooooooooooong job description',
      price: 10500,
      isPermanent: true,
      month: undefined
    },
    {
      id: '3',
      description: 'some other job description',
      price: 18000,
      isPermanent: false,
      month: 'Апрель'
    }
  ]
};

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

export { user, chartData };
export type { User, Job, ChartItem };

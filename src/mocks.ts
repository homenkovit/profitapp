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

const user: User = {
  name: 'Sergey',
  jobs: [
    {
      id: '1',
      description: '',
      price: 0,
      isPermanent: true,
      month: undefined
    },
    {
      id: '2',
      description: 'some job description',
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

export { user };
export type { User, Job };

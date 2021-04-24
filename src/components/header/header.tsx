import React, { FC } from 'react';

interface HeaderProps {
  user: {
    name: string;
  };
}

export const Header: FC<HeaderProps> = ({ user }) => {
  return (
    <header>
      <h1>ProfitApp</h1>
      <div>logo</div>
      <p>Привет, {user.name}</p>
      <p>Хорошего тебе дня!</p>
      <button type='button'>Новый клиент</button>
      <div>
        <ul>
          <li>
            <a href='#profit-section'>rub icon</a>
          </li>
          <li>
            <a href='#chart-section'>chart icon</a>
          </li>
        </ul>
        <section id='profit-section'>
          <p>доход в текущем месяце</p>
          <p>54 500</p>
          <p>из них</p>
          <span>10 500</span>
          <span>44 500</span>
        </section>
        <section id='chart-section'>
          <div>column chart stub</div>
        </section>
      </div>
    </header>
  );
};

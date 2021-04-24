import React from 'react';

export const SortBar = () => {
  return (
    <div>
      <span>сортировать по: </span>
      <ul>
        <li><button type="button">цене проекта</button></li>
        <li><button type="button">постоянным</button></li>
        <li><button type="button">разовым</button></li>
        <li><button type="button">порядку</button></li>
      </ul>
    </div>
  );
};

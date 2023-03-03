import React, { FC } from 'react';
import { ChartItem } from "../types";

interface ChartMobileProps {
  data: ChartItem[];
}

export const ChartMobile: FC<ChartMobileProps> = (props) => {
  return (
    <div>Mobile chart</div>
  );
}
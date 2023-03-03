import React, { FC } from 'react';
import { ChartItem } from "../types";

interface ChartMobileProps {
  data: ChartItem[];
}

export const ChartMobile: FC<ChartMobileProps> = ({ data }) => {
  return (
    <div>Mobile chart</div>
  );
}

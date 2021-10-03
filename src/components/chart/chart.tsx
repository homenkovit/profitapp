import React, { FC, useCallback, useMemo } from 'react';
import { ChartItem } from '../../mocks';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { MONTHS } from '../../utils';
import styles from './chart.module.scss';

export interface ChartProps {
	data: ChartItem[];
}

export const Chart: FC<ChartProps> = (props) => {
	const planArray: number[] = useMemo(() => {
		return props.data.map((item: ChartItem) => item.plan);
	}, [props.data]);

	const maxPlan: number = useMemo(() => {
		return Math.max.apply(null, planArray);
	}, [planArray]);

	const tooltipContent = (plan: number, fact: number, index: number) => (
		<>
			<span className={styles['month']}>{MONTHS[index]}</span>
			<div><span className={styles['label']}>План:</span> {plan.toLocaleString()} ₽</div>
			<div><span className={styles['label']}>Факт:</span> {fact.toLocaleString()} ₽</div>
		</>
	);

	const definePlanColumnHeight = useCallback((planValue: number): string => {
		return planValue !== 0 ? `${planValue*100/maxPlan}%` : '3%';
	}, [props.data]);

	return (
		<div className={styles.chart}>
			<ul className={styles['chart-list']}>
				{props.data.map((month, index) => (
					<Tippy
						content={tooltipContent(month.plan, month.fact, index)}
						className={styles.tooltip}
						key={`${month.fact}-${index}`}
					>
						<li
							className={styles['column-plan']}
							style={{height: definePlanColumnHeight(month.plan)}}
						>
							<div
								className={styles['column-fact']}
								style={{height: `${month.fact*100/month.plan}%`}}
							>
								<div className="visually-hidden">
									{tooltipContent(month.plan, month.fact, index)}
								</div>
							</div>
						</li>
					</Tippy>
				))}
			</ul>
		</div>
	);
};

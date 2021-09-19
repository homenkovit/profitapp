import React, { FC } from 'react';
import { ChartItem } from '../../mocks';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { MONTHS } from '../../utils';
import styles from './chart.module.scss';

export interface ChartProps {
	data: ChartItem[];
}

export const Chart: FC<ChartProps> = (props) => {
	const planArray = props.data.map((item) => {
		return item.plan;
	});

	const maxPlan: number = Math.max.apply(null, planArray);

	const tooltipContent = (plan: number, fact: number, index: number) => (
		<>
			<div><span className={styles['month']}>{MONTHS[index]}</span></div>
			<div><span className={styles['label']}>План:</span> {plan.toLocaleString()} ₽</div>
			<div><span className={styles['label']}>Факт:</span> {fact.toLocaleString()} ₽</div>
		</>
	);

	const definePlanColumnHeight = (planValue: number): string => planValue !== 0 ? `${planValue*100/maxPlan}%` : '3%';

	return (
		<div className={styles.chart}>
			<ul className={styles['chart-list']}>
				{props.data.map((month, index) => (
					<Tippy
						content={tooltipContent(month.plan, month.fact, index)}
						className={styles.tooltip}
					>
						<li
							className={styles['column-plan']}
							style={{height: definePlanColumnHeight(month.plan)}}
						>
							<div
								className={styles['column-fact']}
								style={{height: `${month.fact*100/month.plan}%`}}
							/>
						</li>
					</Tippy>
				))}
			</ul>
		</div>
	);
};

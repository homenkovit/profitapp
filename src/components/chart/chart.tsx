import React, { FC } from 'react';
import { ChartItem } from '../../mocks';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import styles from './chart.module.scss';

export interface ChartProps {
	data: ChartItem[];
}

export const Chart: FC<ChartProps> = (props) => {
	const planArray = props.data.map((item) => {
		return item.plan;
	});

	const maxPlan: number = Math.max.apply(null, planArray);

	const tooltipContent = (plan: number, fact: number) => (
		<>
			<div>План: {plan.toLocaleString()} ₽</div>
			<div>Факт: {fact.toLocaleString()} ₽</div>
		</>
	);

	return (
		<div className={styles.chart}>
			<ul className={styles['chart-list']}>
				{props.data.map((month) => (
					<Tippy
						content={tooltipContent(month.plan, month.fact)}
						className={styles.tooltip}
					>
						<li
							className={styles['income-plan']}
							style={{height: `${month.plan*100/maxPlan}%`}}
						>
							<div
								className={styles['income-fact']}
								style={{height: `${month.fact*100/month.plan}%`}}
							/>
						</li>
					</Tippy>
				))}
			</ul>
		</div>
	);
};

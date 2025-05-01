import type { ChartOptions, ResolvedChartOptions } from "./ChartOptions";

export interface PieChartOptions extends ChartOptions {
	doughnut?: boolean;
	doughnutRatio?: number; // Ratio of inner circle to outer circle for doughnut charts
	startAngle?: number; // Starting angle in degrees
	showPercentages?: boolean; // Whether to show percentages on slices
}

export interface ResolvedPieChartOptions extends ResolvedChartOptions {
	doughnut: boolean;
	doughnutRatio: number;
	startAngle: number;
	showPercentages: boolean;
}

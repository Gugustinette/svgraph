import type { ChartOptions, ResolvedChartOptions } from "./ChartOptions";

export interface LineChartOptions extends ChartOptions {
	lineWidth?: number;
	pointRadius?: number;
	showPoints?: boolean;
	areaFill?: boolean;
	areaOpacity?: number;
	curveSmoothing?: boolean;
	maxValue?: number;
	minValue?: number;
}

export interface ResolvedLineChartOptions extends ResolvedChartOptions {
	lineWidth: number;
	pointRadius: number;
	showPoints: boolean;
	areaFill: boolean;
	areaOpacity: number;
	curveSmoothing: boolean;
	maxValue: number;
	minValue: number;
}

import type { ChartOptions, ResolvedChartOptions } from "./ChartOptions";

export interface BarChartOptions extends ChartOptions {
	barPadding?: number;
	barGroupPadding?: number;
	maxValue?: number;
}

export interface ResolvedBarChartOptions extends ResolvedChartOptions {
	barPadding: number;
	barGroupPadding: number;
	maxValue: number;
}

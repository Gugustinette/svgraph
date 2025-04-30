import type { ChartOptions, ResolvedChartOptions } from "./types/ChartOptions";

/**
 * Default options for a chart
 */
export const DEFAULT_CHART_OPTIONS: ChartOptions = {
	width: 800,
	height: 500,
	margin: { top: 60, right: 120, bottom: 60, left: 80 },
	colors: [
		"#4285F4",
		"#34A853",
		"#FBBC05",
		"#EA4335",
		"#8AB4F8",
		"#CEEAD6",
		"#FDE293",
		"#F28B82",
	],
	fontFamily: "Arial, sans-serif",
	fontSize: 12,
	title: "Bar Chart",
	yAxisLabel: "Value",
	legendTitle: "Items:",
	showValues: true,
	formatValue: (value: number) => value.toString(),
	decimalPlaces: 0,
};

/**
 * Resolves the chart options by merging user-defined options with default options
 * and validating the values.
 * @param options User-defined chart options
 * @returns Resolved chart options
 */
export const resolveChartOptions = <T extends ChartOptions>(
	options: ChartOptions,
): ResolvedChartOptions & T => {
	const resolvedOptions = {
		...DEFAULT_CHART_OPTIONS,
		...options,
	};

	// Validate and set default values
	resolvedOptions.width = options.width ?? DEFAULT_CHART_OPTIONS.width;
	resolvedOptions.height = options.height ?? DEFAULT_CHART_OPTIONS.height;
	resolvedOptions.margin = options.margin ?? DEFAULT_CHART_OPTIONS.margin;
	resolvedOptions.margin = {
		...DEFAULT_CHART_OPTIONS.margin,
		...resolvedOptions.margin,
	};
	resolvedOptions.colors = options.colors ?? DEFAULT_CHART_OPTIONS.colors;
	resolvedOptions.fontFamily =
		options.fontFamily ?? DEFAULT_CHART_OPTIONS.fontFamily;
	resolvedOptions.fontSize = options.fontSize ?? DEFAULT_CHART_OPTIONS.fontSize;
	resolvedOptions.title = options.title ?? DEFAULT_CHART_OPTIONS.title;
	resolvedOptions.yAxisLabel =
		options.yAxisLabel ?? DEFAULT_CHART_OPTIONS.yAxisLabel;
	resolvedOptions.legendTitle =
		options.legendTitle ?? DEFAULT_CHART_OPTIONS.legendTitle;
	resolvedOptions.showValues =
		options.showValues ?? DEFAULT_CHART_OPTIONS.showValues;
	resolvedOptions.formatValue =
		options.formatValue ?? DEFAULT_CHART_OPTIONS.formatValue;
	resolvedOptions.decimalPlaces =
		options.decimalPlaces ?? DEFAULT_CHART_OPTIONS.decimalPlaces;

	// Return and cast to the resolved type
	return resolvedOptions as ResolvedChartOptions & T;
};

import { DEFAULT_LINE_CHART_OPTIONS } from "../line-chart";
import { resolveChartOptions } from "../options";
import type { LineChartMetrics } from "../types/LineChartMetrics";
import type {
	LineChartOptions,
	ResolvedLineChartOptions,
} from "../types/LineChartOptions";
import { roundMaxValue } from "./MathUtil";

/**
 * Validates metrics data structure for line charts
 */
export const validateLineChartMetrics = (metrics: LineChartMetrics): void => {
	if (
		!metrics ||
		typeof metrics !== "object" ||
		Object.keys(metrics).length === 0
	) {
		throw new Error(
			"Invalid metrics data: object with at least one series is required",
		);
	}

	Object.entries(metrics).forEach(([series, points]) => {
		if (typeof points !== "object") {
			throw new Error(
				`Invalid metrics data for series "${series}": object expected`,
			);
		}

		Object.entries(points).forEach(([x, y]) => {
			if (typeof y !== "number" || Number.isNaN(y)) {
				throw new Error(
					`Invalid y-value for x="${x}" in series "${series}": number expected`,
				);
			}
		});
	});
};

/**
 * Resolves the line chart options by merging user-defined options with default options
 * and validating the values.
 * @param options - User-defined line chart options
 * @param metrics - The data for the line chart
 * @returns Resolved line chart options
 */
export const resolveLineChartOptions = (
	options: LineChartOptions,
	metrics: LineChartMetrics,
): ResolvedLineChartOptions => {
	const resolvedOptions = {
		...DEFAULT_LINE_CHART_OPTIONS,
		...resolveChartOptions<LineChartOptions>(options),
	};

	// Validate and set default values
	resolvedOptions.lineWidth =
		options.lineWidth ?? DEFAULT_LINE_CHART_OPTIONS.lineWidth;
	resolvedOptions.pointRadius =
		options.pointRadius ?? DEFAULT_LINE_CHART_OPTIONS.pointRadius;
	resolvedOptions.showPoints =
		options.showPoints ?? DEFAULT_LINE_CHART_OPTIONS.showPoints;
	resolvedOptions.areaFill =
		options.areaFill ?? DEFAULT_LINE_CHART_OPTIONS.areaFill;
	resolvedOptions.areaOpacity =
		options.areaOpacity ?? DEFAULT_LINE_CHART_OPTIONS.areaOpacity;
	resolvedOptions.curveSmoothing =
		options.curveSmoothing ?? DEFAULT_LINE_CHART_OPTIONS.curveSmoothing;

	// Calculate min and max values
	const { maxValue, minValue } = getValueBounds(metrics);
	resolvedOptions.maxValue = options.maxValue ?? roundMaxValue(maxValue);
	resolvedOptions.minValue = options.minValue ?? minValue;

	// Return and cast to the resolved type
	return resolvedOptions as ResolvedLineChartOptions;
};

/**
 * Gets all x values across all series
 */
export const getAllXValues = (
	metrics: LineChartMetrics,
): (string | number)[] => {
	const xValues = new Set<string | number>();

	Object.values(metrics).forEach((points) => {
		Object.keys(points).forEach((x) => xValues.add(x));
	});

	return Array.from(xValues).sort((a, b) => {
		const numA = Number(a);
		const numB = Number(b);
		if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
			return numA - numB;
		}
		return String(a).localeCompare(String(b));
	});
};

/**
 * Finds the minimum and maximum values in metrics
 */
export const getValueBounds = (
	metrics: LineChartMetrics,
): { minValue: number; maxValue: number } => {
	let minValue = Number.POSITIVE_INFINITY;
	let maxValue = Number.NEGATIVE_INFINITY;

	Object.values(metrics).forEach((points) => {
		Object.values(points).forEach((y) => {
			minValue = Math.min(minValue, y);
			maxValue = Math.max(maxValue, y);
		});
	});

	// If there are no data points, default to 0
	if (minValue === Number.POSITIVE_INFINITY) minValue = 0;
	if (maxValue === Number.NEGATIVE_INFINITY) maxValue = 0;

	// Ensure min is less than max
	if (minValue === maxValue) {
		if (minValue === 0) {
			maxValue = 10;
		} else {
			minValue = maxValue > 0 ? 0 : maxValue * 1.1;
		}
	}

	return { minValue, maxValue };
};

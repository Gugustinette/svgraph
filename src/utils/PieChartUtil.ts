import { DEFAULT_PIE_CHART_OPTIONS } from "../pie-chart";
import { resolveChartOptions } from "../options";
import type { PieChartMetrics } from "../types/PieChartMetrics";
import type {
	PieChartOptions,
	ResolvedPieChartOptions,
} from "../types/PieChartOptions";

/**
 * Validates metrics data structure for pie charts
 */
export const validatePieChartMetrics = (metrics: PieChartMetrics): void => {
	if (
		!metrics ||
		typeof metrics !== "object" ||
		Object.keys(metrics).length === 0
	) {
		throw new Error(
			"Invalid metrics data: object with at least one segment is required",
		);
	}

	Object.entries(metrics).forEach(([segment, value]) => {
		if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
			throw new Error(
				`Invalid data for segment "${segment}": positive number expected`,
			);
		}
	});
};

/**
 * Resolves the pie chart options by merging user-defined options with default options
 * and validating the values.
 * @param options - User-defined pie chart options
 * @returns Resolved pie chart options
 */
export const resolvePieChartOptions = (
	options: Partial<PieChartOptions>,
): ResolvedPieChartOptions => {
	const resolvedOptions = {
		...DEFAULT_PIE_CHART_OPTIONS,
		...resolveChartOptions<PieChartOptions>(options),
	};

	// Validate and set default values
	resolvedOptions.doughnut =
		options.doughnut ?? DEFAULT_PIE_CHART_OPTIONS.doughnut;
	resolvedOptions.doughnutRatio =
		options.doughnutRatio ?? DEFAULT_PIE_CHART_OPTIONS.doughnutRatio;
	resolvedOptions.startAngle =
		options.startAngle ?? DEFAULT_PIE_CHART_OPTIONS.startAngle;
	resolvedOptions.showPercentages =
		options.showPercentages ?? DEFAULT_PIE_CHART_OPTIONS.showPercentages;

	// Return and cast to the resolved type
	return resolvedOptions as ResolvedPieChartOptions;
};

/**
 * Calculates the total value of all segments
 */
export const calculateTotal = (metrics: PieChartMetrics): number => {
	return Object.values(metrics).reduce((sum, value) => sum + value, 0);
};

/**
 * Converts a value to a percentage based on the total
 */
export const calculatePercentage = (value: number, total: number): number => {
	return (value / total) * 100;
};

/**
 * Converts degrees to radians
 */
export const degreesToRadians = (degrees: number): number => {
	return (degrees * Math.PI) / 180;
};

/**
 * Calculates coordinates on a circle given center, radius and angle
 */
export const polarToCartesian = (
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number,
): { x: number; y: number } => {
	const angleInRadians = degreesToRadians(angleInDegrees - 90); // -90 to start at 12 o'clock
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
};

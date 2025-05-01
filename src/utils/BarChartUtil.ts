import { DEFAULT_BAR_CHART_OPTIONS } from "../bar-chart";
import { resolveChartOptions } from "../options";
import type { BarChartMetrics } from "../types/BarChartMetrics";
import type {
	BarChartOptions,
	ResolvedBarChartOptions,
} from "../types/BarChartOptions";
import { roundMaxValue } from "./MathUtil";

/**
 * Validates metrics data structure
 */
export const validateBarChartMetrics = (metrics: BarChartMetrics): void => {
	if (
		!metrics ||
		typeof metrics !== "object" ||
		Object.keys(metrics).length === 0
	) {
		throw new Error(
			"Invalid metrics data: object with at least one group is required",
		);
	}

	Object.entries(metrics).forEach(([group, items]) => {
		if (typeof items !== "object") {
			throw new Error(
				`Invalid metrics data for group "${group}": object expected`,
			);
		}

		Object.entries(items).forEach(([item, value]) => {
			if (typeof value !== "number" || Number.isNaN(value)) {
				throw new Error(
					`Invalid data for item "${item}" in group "${group}": number expected`,
				);
			}
		});
	});
};

/**
 * Resolves the bar chart options by merging user-defined options with default options
 * and validating the values.
 * @param options - User-defined bar chart options
 * @param metrics - The data for the bar chart
 * @returns Resolved bar chart options
 */
export const resolveBarChartOptions = (
	options: BarChartOptions,
	metrics: BarChartMetrics,
): ResolvedBarChartOptions => {
	const resolvedOptions = {
		...DEFAULT_BAR_CHART_OPTIONS,
		...resolveChartOptions<BarChartOptions>(options),
	};

	// Validate and set default values
	resolvedOptions.barPadding =
		options.barPadding ?? DEFAULT_BAR_CHART_OPTIONS.barPadding;
	resolvedOptions.barGroupPadding =
		options.barGroupPadding ?? DEFAULT_BAR_CHART_OPTIONS.barGroupPadding;
	resolvedOptions.maxValue = roundMaxValue(getMaxValue(metrics));

	// Return and cast to the resolved type
	return resolvedOptions as ResolvedBarChartOptions;
};

/**
 * Extracts unique item names from metrics
 */
export const getItemNames = (metrics: BarChartMetrics): string[] => {
	const itemNames = new Set<string>();

	Object.values(metrics).forEach((items) => {
		Object.keys(items).forEach((item) => itemNames.add(item));
	});

	return Array.from(itemNames);
};

/**
 * Finds the maximum value in metrics
 */
export const getMaxValue = (metrics: BarChartMetrics): number => {
	let maxValue = 0;

	Object.values(metrics).forEach((items) => {
		Object.values(items).forEach((value) => {
			maxValue = Math.max(maxValue, value);
		});
	});

	return maxValue;
};

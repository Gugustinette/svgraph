import type { BarChartMetrics } from "../types/BarChartMetrics";

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

import { DEFAULT_CHART_OPTIONS } from "./options";
import type { PieChartMetrics } from "./types/PieChartMetrics";
import type {
	PieChartOptions,
	ResolvedPieChartOptions,
} from "./types/PieChartOptions";
import {
	calculatePercentage,
	calculateTotal,
	polarToCartesian,
	resolvePieChartOptions,
	validatePieChartMetrics,
} from "./utils/PieChartUtil";
import { createLegend, createTitle } from "./utils/ChartUtil";

/**
 * Default pie chart options
 */
export const DEFAULT_PIE_CHART_OPTIONS: PieChartOptions = {
	...DEFAULT_CHART_OPTIONS,
	doughnut: false,
	doughnutRatio: 0.6, // Inner circle is 60% of outer circle
	startAngle: 0,
	showPercentages: true,
};

/**
 * Creates the SVG segments for the pie chart
 * @param metrics - The data for the pie chart
 * @param config - Resolved pie chart options
 * @returns SVG string for the pie segments
 */
const createPieSegments = (
	metrics: PieChartMetrics,
	config: ResolvedPieChartOptions,
): string => {
	// Initialize SVG string
	let svg = "";

	// Calculate total and prepare for drawing
	const total = calculateTotal(metrics);
	const segments = Object.entries(metrics);

	// Determine chart dimensions
	const chartWidth = config.width - config.margin.left - config.margin.right;
	const chartHeight = config.height - config.margin.top - config.margin.bottom;
	const radius = Math.min(chartWidth, chartHeight) / 2;
	const innerRadius = config.doughnut ? radius * config.doughnutRatio : 0;
	const centerX = chartWidth / 2;
	const centerY = chartHeight / 2;

	// Start drawing from the specified angle
	let currentAngle = config.startAngle;

	// Draw each segment
	segments.forEach(([label, value], index) => {
		const percentage = calculatePercentage(value, total);
		const angleSize = (percentage / 100) * 360;
		const endAngle = currentAngle + angleSize;
		const colorIndex = index % config.colors.length;

		// Calculate arc path
		const startOuter = polarToCartesian(centerX, centerY, radius, currentAngle);
		const endOuter = polarToCartesian(centerX, centerY, radius, endAngle);
		const startInner = polarToCartesian(
			centerX,
			centerY,
			innerRadius,
			currentAngle,
		);
		const endInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);

		// Determine if the arc is more than 180 degrees (for large-arc-flag)
		const largeArcFlag = angleSize > 180 ? 1 : 0;

		// Create path for the segment
		let path: string;

		if (config.doughnut) {
			// Path for doughnut segment (with inner circle cutout)
			path = [
				`M ${startOuter.x} ${startOuter.y}`, // Move to start of outer arc
				`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`, // Draw outer arc
				`L ${endInner.x} ${endInner.y}`, // Line to inner circle
				`A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`, // Draw inner arc (in opposite direction)
				"Z", // Close the path
			].join(" ");
		} else {
			// Path for regular pie segment
			path = [
				`M ${centerX} ${centerY}`, // Move to center
				`L ${startOuter.x} ${startOuter.y}`, // Line to start of arc
				`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`, // Draw arc
				"Z", // Close the path back to center
			].join(" ");
		}

		// Add segment to SVG
		svg += `    <path d="${path}" fill="${config.colors[colorIndex]}" stroke="white" stroke-width="1" />\n`;

		// Calculate position for the percentage text
		if (config.showValues || config.showPercentages) {
			// Position text at middle of segment arc
			const midAngle = currentAngle + angleSize / 2;
			// Place text at 2/3 distance from center to edge for better visibility
			const textRadius = config.doughnut
				? innerRadius + (radius - innerRadius) / 2
				: radius * 0.67;
			const textPos = polarToCartesian(centerX, centerY, textRadius, midAngle);

			// Only show percentage/value if the segment is large enough
			if (angleSize > 10) {
				const formattedValue = config.showPercentages
					? `${Math.round(percentage)}%`
					: config.formatValue(value);

				svg += `    <text x="${textPos.x}" y="${textPos.y}" font-family="${config.fontFamily}" font-size="${config.fontSize}" text-anchor="middle" fill="#fff" dominant-baseline="middle">${formattedValue}</text>\n`;
			}
		}

		// Update current angle for next segment
		currentAngle = endAngle;
	});

	return svg;
};

/**
 * Generates an SVG pie chart from given metrics
 * @param metrics - The data for the pie chart
 * @param options - Optional configuration for the chart
 * @returns SVG string representing the pie chart
 */
export const generatePieChart = (
	metrics: PieChartMetrics,
	options: Partial<PieChartOptions> = {},
): string => {
	// Validate input
	validatePieChartMetrics(metrics);

	// Resolve options
	const config = resolvePieChartOptions(options);

	// Create the SVG content
	let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">\n`;

	// Add a white background rectangle
	svg += `  <rect width="${config.width}" height="${config.height}" fill="white" />\n`;

	// Add a title
	svg += createTitle(config);

	// Create a group for the chart content with a transform to account for margins
	svg += `  <g transform="translate(${config.margin.left}, ${config.margin.top})">\n`;

	// Draw the pie segments
	svg += createPieSegments(metrics, config);

	// Draw the legend
	const items = Object.keys(metrics);
	svg += createLegend(config, items);

	// Close the group and SVG
	svg += "  </g>\n</svg>";

	return svg;
};

/**
 * Generates an SVG doughnut chart from given metrics
 * This is a convenience function that sets the doughnut option to true
 * @param metrics - The data for the doughnut chart
 * @param options - Optional configuration for the chart
 * @returns SVG string representing the doughnut chart
 */
export const generateDoughnutChart = (
	metrics: PieChartMetrics,
	options: Partial<PieChartOptions> = {},
): string => {
	return generatePieChart(metrics, { ...options, doughnut: true });
};

import { DEFAULT_CHART_OPTIONS } from "./options";
import type { LineChartMetrics } from "./types/LineChartMetrics";
import type {
	LineChartOptions,
	ResolvedLineChartOptions,
} from "./types/LineChartOptions";
import {
	getAllXValues,
	resolveLineChartOptions,
	validateLineChartMetrics,
} from "./utils/LineChartUtil";
import { createLegend, createTitle, createYAxis } from "./utils/ChartUtil";

/**
 * Default line chart options
 */
export const DEFAULT_LINE_CHART_OPTIONS: LineChartOptions = {
	...DEFAULT_CHART_OPTIONS,
	lineWidth: 2,
	pointRadius: 4,
	showPoints: true,
	areaFill: false,
	areaOpacity: 0.2,
	curveSmoothing: false,
};

/**
 * Creates the SVG paths for the line chart
 */
const createLines = (
	metrics: LineChartMetrics,
	config: ResolvedLineChartOptions,
): string => {
	let svg = "";
	const xValues = getAllXValues(metrics);
	const seriesNames = Object.keys(metrics);
	const chartWidth = config.width - config.margin.left - config.margin.right;
	const chartHeight = config.height - config.margin.top - config.margin.bottom;
	const valueRange = config.maxValue - config.minValue;

	seriesNames.forEach((series, seriesIndex) => {
		const colorIndex = seriesIndex % config.colors.length;
		const color = config.colors[colorIndex];
		let pathData = "";
		let areaPathData = "";
		const points: [number, number][] = [];

		// Create array of points that exist for this series
		xValues.forEach((x, xIndex) => {
			if (x in metrics[series]) {
				const xPos = (xIndex / (xValues.length - 1)) * chartWidth;
				const yValue = metrics[series][x];
				const yPos =
					chartHeight - ((yValue - config.minValue) / valueRange) * chartHeight;
				points.push([xPos, yPos]);
			}
		});

		// Create path data from points
		if (points.length > 0) {
			// Start path
			pathData = `M ${points[0][0]} ${points[0][1]}`;

			// Create line segments
			for (let i = 1; i < points.length; i++) {
				if (config.curveSmoothing && i < points.length) {
					// Add curved path using cubic Bezier curve
					const cp1x = points[i - 1][0] + (points[i][0] - points[i - 1][0]) / 3;
					const cp1y = points[i - 1][1];
					const cp2x = points[i][0] - (points[i][0] - points[i - 1][0]) / 3;
					const cp2y = points[i][1];
					pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i][0]} ${points[i][1]}`;
				} else {
					// Simple straight line
					pathData += ` L ${points[i][0]} ${points[i][1]}`;
				}
			}

			// Area fill path data (similar to line path but closes to baseline)
			if (config.areaFill && points.length > 0) {
				areaPathData = `${pathData} L ${points[points.length - 1][0]} ${chartHeight} L ${points[0][0]} ${chartHeight} Z`;
			}

			// Draw area if enabled
			if (config.areaFill) {
				svg += `    <path d="${areaPathData}" fill="${color}" opacity="${config.areaOpacity}" />\n`;
			}

			// Draw the line
			svg += `    <path d="${pathData}" fill="none" stroke="${color}" stroke-width="${config.lineWidth}" />\n`;

			// Draw points if enabled
			if (config.showPoints) {
				points.forEach(([x, y]) => {
					svg += `    <circle cx="${x}" cy="${y}" r="${config.pointRadius}" fill="${color}" stroke="white" stroke-width="1" />\n`;
				});
			}
		}
	});

	return svg;
};

/**
 * Generates an SVG line chart from given metrics
 * @param metrics - The data for the line chart (series -> x -> y)
 * @param options - Optional configuration for the chart
 * @returns SVG string representing the line chart
 */
export const generateLineChart = (
	metrics: LineChartMetrics,
	options: Partial<LineChartOptions> = {},
): string => {
	// Validate input
	validateLineChartMetrics(metrics);

	// Resolve options
	const config = resolveLineChartOptions(options, metrics);

	// Create the SVG content
	let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">\n`;

	// Add a white background rectangle
	svg += `  <rect width="${config.width}" height="${config.height}" fill="white" />\n`;

	// Add a title
	svg += createTitle(config);

	// Create a group for the chart content with a transform to account for margins
	svg += `  <g transform="translate(${config.margin.left}, ${config.margin.top})">\n`;

	// Draw the y-axis and grid lines
	svg += createYAxis(config, config.maxValue);

	// Draw the lines
	svg += createLines(metrics, config);

	// Draw the legend
	const seriesNames = Object.keys(metrics);
	svg += createLegend(config, seriesNames);

	// Close the group and SVG
	svg += "  </g>\n</svg>";

	return svg;
};

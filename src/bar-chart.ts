import { DEFAULT_CHART_OPTIONS, resolveChartOptions } from "./options";
import type { BarChartMetrics } from "./types/BarChartMetrics";
import type {
	BarChartOptions,
	ResolvedBarChartOptions,
} from "./types/BarChartOptions";
import {
	getItemNames,
	getMaxValue,
	validateBarChartMetrics,
} from "./utils/BarChartUtil";
import { createTitleElement } from "./utils/ChartUtil";
import { roundMaxValue } from "./utils/MathUtil";

/**
 * Default bar chart options
 */
export const DEFAULT_BAR_CHART_OPTIONS: BarChartOptions = {
	...DEFAULT_CHART_OPTIONS,
	barPadding: 0.2,
	barGroupPadding: 0.4,
};

export const resolveBarChartOptions = (
	metrics: BarChartMetrics,
	options: BarChartOptions,
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
 * Creates SVG y-axis elements
 */
const createYAxis = (config: ResolvedBarChartOptions): string => {
	// Initialize SVG string
	let svg = "";

	// Number of steps for the y-axis
	const yAxisSteps = 10;

	// Pre-compute values
	const { width, height, margin } = config;
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;

	for (let i = 0; i <= yAxisSteps; i++) {
		const y = chartHeight - (i / yAxisSteps) * chartHeight;
		const value = (i / yAxisSteps) * config.maxValue;
		const formattedValue = value.toFixed(config.decimalPlaces);

		// Grid line
		svg += `    <line x1="0" y1="${y}" x2="${chartWidth}" y2="${y}" stroke="#ddd" stroke-width="1" />\n`;

		// Y-axis label
		svg += `    <text x="-10" y="${y}" font-family="${
			config.fontFamily
		}" font-size="${
			config.fontSize
		}" text-anchor="end" dominant-baseline="middle">${formattedValue}</text>\n`;
	}

	// Y-axis title
	svg += `    <text x="-${config.margin.left / 2}" y="${
		chartHeight / 2
	}" font-family="${config.fontFamily}" font-size="${
		config.fontSize
	}" text-anchor="middle" transform="rotate(-90, -${config.margin.left / 2}, ${
		chartHeight / 2
	})">${config.yAxisLabel}</text>\n`;

	// X-axis line
	svg += `    <line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="#000" stroke-width="1" />\n`;

	return svg;
};

/**
 * Creates SVG bars
 */
const generateBars = (
	metrics: BarChartMetrics,
	config: ResolvedBarChartOptions,
): string => {
	// Initialize SVG string
	let svg = "";

	// Pre-compute values
	const itemsArray = getItemNames(metrics);
	const groupNames = Object.keys(metrics);
	const maxValue = config.maxValue;
	const chartWidth = config.width - config.margin.left - config.margin.right;
	const chartHeight = config.height - config.margin.top - config.margin.bottom;
	const groupWidth = chartWidth / groupNames.length;
	const barWidth =
		(groupWidth * (1 - config.barGroupPadding)) / itemsArray.length;

	groupNames.forEach((group, groupIndex) => {
		const groupX = groupIndex * groupWidth;

		// Add group name below the x-axis
		svg += `    <text x="${groupX + groupWidth / 2}" y="${
			chartHeight + 30
		}" font-family="${config.fontFamily}" font-size="${
			config.fontSize
		}" text-anchor="middle">${group}</text>\n`;

		itemsArray.forEach((item, itemIndex) => {
			const value = metrics[group][item] || 0;
			const barHeight = (value / maxValue) * chartHeight;
			const barX =
				groupX +
				(config.barGroupPadding * groupWidth) / 2 +
				itemIndex * barWidth;
			const barY = chartHeight - barHeight;
			const colorIndex = itemIndex % config.colors.length;

			// Draw the bar
			svg += `    <rect x="${barX}" y="${barY}" width="${
				barWidth * (1 - config.barPadding)
			}" height="${barHeight}" fill="${config.colors[colorIndex]}" />\n`;

			// Add the value on top of or inside the bar
			if (config.showValues) {
				const formattedValue = config.formatValue(value);
				if (barHeight > config.fontSize * 2) {
					svg += `    <text x="${
						barX + (barWidth / 2) * (1 - config.barPadding)
					}" y="${
						barY + barHeight / 2
					}" font-family="${config.fontFamily}" font-size="${
						config.fontSize
					}" text-anchor="middle" fill="#fff" dominant-baseline="middle">${formattedValue}</text>\n`;
				} else {
					svg += `    <text x="${
						barX + (barWidth / 2) * (1 - config.barPadding)
					}" y="${barY - 5}" font-family="${config.fontFamily}" font-size="${
						config.fontSize
					}" text-anchor="middle">${formattedValue}</text>\n`;
				}
			}
		});
	});

	return svg;
};

/**
 * Creates SVG legend elements
 */
const createLegend = (
	metrics: BarChartMetrics,
	config: ResolvedBarChartOptions,
): string => {
	// Initialize SVG string
	let svg = "";

	// Pre-compute values
	const itemsArray = getItemNames(metrics);
	const chartWidth = config.width - config.margin.left - config.margin.right;
	const legendX = chartWidth + 10;
	let legendY = 0;

	// Legend title
	svg += `    <text x="${legendX}" y="${legendY}" font-family="${
		config.fontFamily
	}" font-size="${config.fontSize}" font-weight="bold" text-anchor="start">${
		config.legendTitle
	}</text>\n`;

	legendY += 25;

	itemsArray.forEach((item, index) => {
		const y = legendY + index * 25;
		const colorIndex = index % config.colors.length;

		// Legend color box
		svg += `    <rect x="${legendX}" y="${y}" width="15" height="15" fill="${
			config.colors[colorIndex]
		}" />\n`;

		// Legend text
		svg += `    <text x="${legendX + 25}" y="${
			y + 12
		}" font-family="${config.fontFamily}" font-size="${
			config.fontSize
		}" text-anchor="start">${item}</text>\n`;
	});

	return svg;
};

/**
 * Generates an SVG bar chart from given metrics
 * @param metrics - The data for the bar chart
 * @param options - Optional configuration for the chart
 * @returns SVG string representing the bar chart
 */
export const generateBarChart = (
	metrics: BarChartMetrics,
	options: Partial<BarChartOptions> = {},
): string => {
	// Validate input
	validateBarChartMetrics(metrics);

	// Resolve options
	const config = resolveBarChartOptions(metrics, options);

	// Create the SVG content
	let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">\n`;

	// Add a white background rectangle
	svg += `  <rect width="${config.width}" height="${config.height}" fill="white" />\n`;

	// Add a title
	svg += createTitleElement(config);

	// Create a group for the chart content with a transform to account for margins
	svg += `  <g transform="translate(${config.margin.left}, ${config.margin.top})">\n`;

	// Draw the y-axis and grid lines
	svg += createYAxis(config);

	// Draw the bars
	svg += generateBars(metrics, config);

	// Draw the legend
	svg += createLegend(metrics, config);

	svg += "  </g>\n</svg>";

	return svg;
};

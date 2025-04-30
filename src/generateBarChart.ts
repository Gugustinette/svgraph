import type { BarChartMetrics } from "./types/BarChartMetrics";
import type { BarChartOptions } from "./types/BarChartOptions";
import {
	getItemNames,
	getMaxValue,
	validateBarChartMetrics,
} from "./utils/BarChartUtil";
import { roundMaxValue } from "./utils/MathUtil";

// Default configuration as a constant
export const DEFAULT_BAR_CHART_OPTIONS: BarChartOptions = {
	width: 800,
	height: 500,
	margin: { top: 60, right: 120, bottom: 60, left: 80 },
	barPadding: 0.2,
	barGroupPadding: 0.4,
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
 * Creates SVG title element
 */
const createTitleElement = (config: BarChartOptions, width: number): string => {
	return `  <text x="${width / 2}" y="${
		config.margin.top / 2
	}" font-family="${config.fontFamily}" font-size="${
		config.fontSize + 6
	}" font-weight="bold" text-anchor="middle">${config.title}</text>\n`;
};

/**
 * Creates SVG y-axis elements
 */
const createYAxis = (
	config: BarChartOptions,
	chartHeight: number,
	chartWidth: number,
	maxValue: number,
): string => {
	const yAxisSteps = 10;
	let svg = "";

	for (let i = 0; i <= yAxisSteps; i++) {
		const y = chartHeight - (i / yAxisSteps) * chartHeight;
		const value = (i / yAxisSteps) * maxValue;
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
 * Creates SVG bars for a specific group
 */
const createGroupBars = (
	group: string,
	groupIndex: number,
	itemsArray: string[],
	metrics: BarChartMetrics,
	config: BarChartOptions,
	chartHeight: number,
	groupWidth: number,
	barWidth: number,
	maxValue: number,
): string => {
	let svg = "";
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
			groupX + (config.barGroupPadding * groupWidth) / 2 + itemIndex * barWidth;
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

	return svg;
};

/**
 * Creates SVG legend elements
 */
const createLegend = (
	config: BarChartOptions,
	chartWidth: number,
	itemsArray: string[],
): string => {
	let svg = "";
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

	// Merge default options with provided options
	const config = { ...DEFAULT_BAR_CHART_OPTIONS, ...options };

	// Extract all group names and item names
	const groupNames = Object.keys(metrics);
	const itemsArray = getItemNames(metrics);

	// Calculate maximum value and round it
	const rawMaxValue = getMaxValue(metrics);
	const maxValue = roundMaxValue(rawMaxValue);

	// Calculate chart dimensions
	const { width, height, margin } = config;
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;

	// Calculate bar width and spacing
	const totalGroups = groupNames.length;
	const groupWidth = chartWidth / totalGroups;
	const barWidth =
		(groupWidth * (1 - config.barGroupPadding)) / itemsArray.length;

	// Create the SVG content
	let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;

	// Add a white background rectangle
	svg += `  <rect width="${width}" height="${height}" fill="white" />\n`;

	// Add a title
	svg += createTitleElement(config, width);

	// Create a group for the chart content with a transform to account for margins
	svg += `  <g transform="translate(${margin.left}, ${margin.top})">\n`;

	// Draw the y-axis and grid lines
	svg += createYAxis(config, chartHeight, chartWidth, maxValue);

	// Draw the bars for each group
	groupNames.forEach((group, groupIndex) => {
		svg += createGroupBars(
			group,
			groupIndex,
			itemsArray,
			metrics,
			config,
			chartHeight,
			groupWidth,
			barWidth,
			maxValue,
		);
	});

	// Add a legend
	svg += createLegend(config, chartWidth, itemsArray);

	// Close the chart group and SVG tag
	svg += "  </g>\n</svg>";

	return svg;
};

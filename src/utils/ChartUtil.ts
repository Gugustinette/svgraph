import type { ResolvedChartOptions } from "../types/ChartOptions";

/**
 * Creates SVG title element
 * @param config - Resolved chart options
 * @returns SVG string for the title
 */
export const createTitle = (config: ResolvedChartOptions): string => {
	return `  <text x="${config.width / 2}" y="${
		config.margin.top / 2
	}" font-family="${config.fontFamily}" font-size="${
		config.fontSize + 6
	}" font-weight="bold" text-anchor="middle">${config.title}</text>\n`;
};

/**
 * Create the Y-axis and grid lines for the chart
 * @param config - Resolved chart options
 * @param maxValue - Maximum value for the Y-axis
 * @returns SVG string for the Y-axis and grid lines
 */
export const createYAxis = (
	config: ResolvedChartOptions,
	maxValue: number,
): string => {
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
 * Create the legend for the chart
 * @param config - Resolved chart options
 * @param items - Array of item names for the legend
 * @returns SVG string for the legend
 */
export const createLegend = (
	config: ResolvedChartOptions,
	items: string[],
): string => {
	// Initialize SVG string
	let svg = "";

	// Pre-compute values
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

	items.forEach((item, index) => {
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

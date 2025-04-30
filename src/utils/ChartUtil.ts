import type { ResolvedChartOptions } from "../types/ChartOptions";

/**
 * Creates SVG title element
 */
export const createTitleElement = (config: ResolvedChartOptions): string => {
	return `  <text x="${config.width / 2}" y="${
		config.margin.top / 2
	}" font-family="${config.fontFamily}" font-size="${
		config.fontSize + 6
	}" font-weight="bold" text-anchor="middle">${config.title}</text>\n`;
};

import { generateBarChart, generateLineChart } from "../src";
import fs from "node:fs";

/**
 * Bar chart
 */
const barMetrics = {
	groupA: {
		item1: 100,
		item2: 200,
		item3: 150,
	},
	groupB: {
		item1: 120,
		item2: 180,
		item3: 160,
	},
	groupC: {
		item1: 130,
		item2: 190,
		item3: 170,
	},
};
const svgBarChart = generateBarChart(barMetrics);
fs.writeFileSync("playground/svgBarChart.svg", svgBarChart, "utf-8");

/**
 * Line chart
 */
const lineMetrics = {
	groupA: {
		2020: 10,
		2021: 25,
		2022: 15,
		2023: 30,
		2024: 22,
	},
	groupB: {
		2020: 5,
		2021: 15,
		2022: 25,
		2023: 20,
		2024: 35,
	},
};

const svgLineChart = generateLineChart(lineMetrics, {
	areaFill: true,
	curveSmoothing: true,
});
fs.writeFileSync("playground/svgLineChart.svg", svgLineChart, "utf-8");

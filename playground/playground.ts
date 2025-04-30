import { generateBarChart } from "../src";
import fs from "node:fs";

const metrics = {
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
const svgBarChart = generateBarChart(metrics);
fs.writeFileSync("playground/svgBarChart.svg", svgBarChart, "utf-8");

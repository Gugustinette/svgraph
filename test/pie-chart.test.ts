import { expect, test, describe } from "vitest";
import { generatePieChart, generateDoughnutChart } from "../src";

describe("generatePieChart", () => {
	test("should generate a pie chart SVG with default options", () => {
		const metrics = {
			segment1: 30,
			segment2: 15,
			segment3: 25,
			segment4: 20,
			segment5: 10,
		};

		const svg = generatePieChart(metrics);

		expect(svg).toMatchSnapshot();
	});

	test("should generate a doughnut chart SVG", () => {
		const metrics = {
			segment1: 30,
			segment2: 15,
			segment3: 25,
			segment4: 20,
			segment5: 10,
		};

		const svg = generateDoughnutChart(metrics);

		expect(svg).toMatchSnapshot();
	});
});

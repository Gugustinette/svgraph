import { expect, test, describe } from "vitest";
import { generateBarChart, generateLineChart } from "../src";

describe("generateBarChart", () => {
	test("should generate a bar chart SVG with default options", () => {
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

		const svg = generateBarChart(metrics);

		expect(svg).toMatchSnapshot();
	});
});

describe("generateLineChart", () => {
	test("should generate a line chart SVG with default options", () => {
		const metrics = {
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

		const svg = generateLineChart(metrics);

		expect(svg).toMatchSnapshot();
	});
});

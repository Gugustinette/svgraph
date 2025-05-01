import { expect, test, describe } from "vitest";
import { generateLineChart } from "../src";

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

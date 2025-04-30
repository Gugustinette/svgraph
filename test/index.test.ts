import { expect, test, describe } from "vitest";
import { generateBarChart } from "../src";

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

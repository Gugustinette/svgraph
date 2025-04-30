export interface BarChartOptions {
	width: number;
	height: number;
	margin: { top: number; right: number; bottom: number; left: number };
	barPadding: number;
	barGroupPadding: number;
	colors: string[];
	fontFamily: string;
	fontSize: number;
	title: string;
	yAxisLabel: string;
	legendTitle: string;
	showValues: boolean;
	formatValue: (value: number) => string;
	decimalPlaces: number;
}

export interface ChartOptions {
	width?: number;
	height?: number;
	margin?: { top?: number; right?: number; bottom?: number; left?: number };
	colors?: string[];
	fontFamily?: string;
	fontSize?: number;
	title?: string;
	yAxisLabel?: string;
	legendTitle?: string;
	showValues?: boolean;
	formatValue?: (value: number) => string;
	decimalPlaces?: number;
}

export interface ResolvedChartOptions {
	width: number;
	height: number;
	margin: { top: number; right: number; bottom: number; left: number };
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

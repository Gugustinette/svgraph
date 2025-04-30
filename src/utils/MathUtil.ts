/**
 * Rounds a value up to a nice number for the y-axis
 */
export const roundMaxValue = (value: number): number => {
	const magnitude = 10 ** Math.floor(Math.log10(value));
	return Math.ceil(value / magnitude) * magnitude;
};

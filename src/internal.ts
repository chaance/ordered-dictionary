export function at<T>(array: ArrayLike<T>, index: number): T | undefined {
	if ("at" in Array.prototype) {
		return Array.prototype.at.call(array, index);
	}
	const actualIndex = toSafeIndex(array, index);
	return actualIndex === -1 ? undefined : array[actualIndex];
}

export function toSafeIndex(array: ArrayLike<any>, index: number) {
	const length = array.length;
	const relativeIndex = toSafeInteger(index);
	const actualIndex =
		relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
	return actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
}

export function toSafeInteger(number: number) {
	// eslint-disable-next-line no-self-compare
	return number !== number || number === 0 ? 0 : Math.trunc(number);
}

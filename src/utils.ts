import { type OrderedDict } from "./ordered-dictionary.ts";

export function every<K, V, D extends OrderedDict<K, V> = OrderedDict<K, V>>(
	dictionary: D,
	predicate: (entry: [K, V], index: number, dict: D) => unknown,
	thisArg?: any,
) {
	let index = 0;
	for (const entry of dictionary) {
		if (!Reflect.apply(predicate, thisArg, [entry, index, dictionary])) {
			return false;
		}
		index++;
	}
	return true;
}

export function some<K, V, D extends OrderedDict<K, V> = OrderedDict<K, V>>(
	dictionary: D,
	predicate: (entry: [K, V], index: number, dict: D) => unknown,
	thisArg?: any,
) {
	let index = 0;
	for (const entry of dictionary) {
		if (Reflect.apply(predicate, thisArg, [entry, index, dictionary])) {
			return true;
		}
		index++;
	}
	return false;
}

import { type OrderedDict } from "./ordered-dictionary.ts";

export type KeyOf<D extends OrderedDict<any, any>> =
	D extends OrderedDict<infer K, any> ? K : never;

export type ValueOf<D extends OrderedDict<any, any>> =
	D extends OrderedDict<any, infer V> ? V : never;

export function every<D extends OrderedDict<any, any>>(
	dictionary: D,
	predicate: (entry: [KeyOf<D>, ValueOf<D>], index: number, dict: D) => unknown,
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

export function some<D extends OrderedDict<any, any>>(
	dictionary: D,
	predicate: (entry: [KeyOf<D>, ValueOf<D>], index: number, dict: D) => unknown,
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

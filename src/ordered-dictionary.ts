// Not a real member because it shouldn't be accessible, but the super class
// calls `set` which needs to read the instanciation state, so it can't be a
// private member.
const __instanciated = new WeakMap<OrderedDict<any, any>, boolean>();

export class OrderedDict<K, V> extends Map<K, V> {
	#keys: K[];

	constructor(iterable?: Iterable<readonly [K, V]> | null | undefined);
	constructor(entries?: readonly (readonly [K, V])[] | null) {
		super(entries);
		this.#keys = [...super.keys()];
		__instanciated.set(this, true);
	}

	set(key: K, value: V) {
		if (__instanciated.get(this)) {
			if (this.has(key)) {
				this.#keys[this.#keys.indexOf(key)] = key;
			} else {
				this.#keys.push(key);
			}
		}
		super.set(key, value);
		return this;
	}

	insert(index: number, key: K, value: V) {
		if (this.has(key)) {
			this.delete(key);
		}
		let safeIndex = toSafeIndex(this.#keys, index);
		if (safeIndex === -1) {
			// Unsure
			this.set(key, value);
			return this;
		}

		// If you insert at, say, -2, without this bit you'd replace the
		// second-to-last item and push the rest up one, which means the new item is
		// 3rd to last. This isn't very intuitive; inserting at -2 is more like
		// saying "make this item the second to last".
		if (index < 0) {
			safeIndex++;
		}

		if (safeIndex === this.size) {
			this.set(key, value);
			return this;
		}

		// May not be the most efficient way to do this, but we want to ensure that
		// a new reference is not created. Clear + re-set all keys makes sense to
		// me, but this is not going to be great for large datasets, and we should
		// be able to just skip items earlier in the object. If you are an algorithm
		// whiz and you're reading this in disgust, PRs are very welcome.
		const entries = [...this.entries()];
		this.clear();
		for (let i = 0; i < entries.length + 1; i++) {
			if (safeIndex === i) {
				this.set(key, value);
			} else {
				const j = i > safeIndex ? i - 1 : i;
				this.set(entries[j]![0], entries[j]![1]);
			}
		}
		return this;
	}

	with(index: number, key: K, value: V) {
		const copy = new OrderedDict(this);
		copy.insert(index, key, value);
		return copy;
	}

	before(key: K) {
		const index = this.#keys.indexOf(key) - 1;
		if (index < 0) {
			return undefined;
		}
		return this.entryAt(index);
	}

	// TODO
	// setBefore(key: K, newKey: K, value: V) {
	// 	throw new Error("Not implemented");
	// }

	after(key: K) {
		let index = this.#keys.indexOf(key);
		index = index === -1 || index === this.size - 1 ? -1 : index + 1;
		if (index === -1) {
			return undefined;
		}
		return this.entryAt(index);
	}

	// TODO
	// setAfter(key: K, newKey: K, value: V) {
	// 	throw new Error("Not implemented");
	// }

	first() {
		return this.entryAt(0);
	}

	last() {
		return this.entryAt(-1);
	}

	clear() {
		this.#keys = [];
		return super.clear();
	}

	delete(key: K) {
		const deleted = super.delete(key);
		if (deleted) {
			this.#keys.splice(this.#keys.indexOf(key), 1);
		}
		return deleted;
	}

	deleteAt(index: number) {
		const key = this.keyAt(index);
		if (key !== undefined) {
			return this.delete(key);
		}
		return false;
	}

	at(index: number) {
		let key = at(this.#keys, index);
		if (key !== undefined) {
			return this.get(key);
		}
	}

	entryAt(index: number): [K, V] | undefined {
		let key = at(this.#keys, index);
		if (key !== undefined) {
			return [key, this.get(key)!];
		}
	}

	indexOf(key: K) {
		return this.#keys.indexOf(key);
	}

	keyAt(index: number) {
		return at(this.#keys, index);
	}

	find(
		predicate: (
			entry: [K, V],
			index: number,
			dict: OrderedDict<K, V>,
		) => boolean,
		thisArg?: any,
	) {
		let index = 0;
		for (const entry of this) {
			if (Reflect.apply(predicate, thisArg, [entry, index, this])) {
				return entry;
			}
			index++;
		}
		return undefined;
	}

	findIndex(
		predicate: (
			entry: [K, V],
			index: number,
			dict: OrderedDict<K, V>,
		) => boolean,
		thisArg?: any,
	) {
		let index = 0;
		for (const entry of this) {
			if (Reflect.apply(predicate, thisArg, [entry, index, this])) {
				return index;
			}
			index++;
		}
		return -1;
	}

	filter<KK extends K, VV extends V>(
		predicate: (
			entry: [K, V],
			index: number,
			dict: OrderedDict<K, V>,
		) => entry is [KK, VV],
		thisArg?: any,
	): OrderedDict<KK, VV>;

	filter(
		predicate: (
			entry: [K, V],
			index: number,
			dict: OrderedDict<K, V>,
		) => unknown,
		thisArg?: any,
	): OrderedDict<K, V>;

	filter(
		predicate: (
			entry: [K, V],
			index: number,
			dict: OrderedDict<K, V>,
		) => unknown,
		thisArg?: any,
	) {
		const entries: Array<[K, V]> = [];
		let index = 0;
		for (const entry of this) {
			if (Reflect.apply(predicate, thisArg, [entry, index, this])) {
				entries.push(entry);
			}
			index++;
		}
		return new OrderedDict(entries);
	}

	map<U>(
		callbackfn: (entry: [K, V], index: number, dict: OrderedDict<K, V>) => U,
		thisArg?: any,
	) {
		const entries: [K, U][] = [];
		let index = 0;
		for (const entry of this) {
			entries.push([
				entry[0],
				Reflect.apply(callbackfn, thisArg, [entry, index, this]),
			]);
			index++;
		}
		return new OrderedDict(entries);
	}

	reduce(
		callbackfn: (
			previousValue: [K, V],
			currentEntry: [K, V],
			currentIndex: number,
			dict: OrderedDict<K, V>,
		) => [K, V],
	): [K, V];
	reduce(
		callbackfn: (
			previousValue: [K, V],
			currentEntry: [K, V],
			currentIndex: number,
			dict: OrderedDict<K, V>,
		) => [K, V],
		initialValue: [K, V],
	): [K, V];
	reduce<U>(
		callbackfn: (
			previousValue: U,
			currentEntry: [K, V],
			currentIndex: number,
			dict: OrderedDict<K, V>,
		) => U,
		initialValue: U,
	): U;

	reduce<U>(
		...args: [
			(
				previousValue: U,
				currentEntry: [K, V],
				currentIndex: number,
				dict: OrderedDict<K, V>,
			) => U,
			U?,
		]
	) {
		const [callbackfn, initialValue] = args;
		let index = 0;
		let accumulator = initialValue ?? this.at(0)!;
		for (const entry of this) {
			if (index === 0 && args.length === 1) {
				accumulator = entry as any;
			} else {
				accumulator = Reflect.apply(callbackfn, this, [
					accumulator,
					entry,
					index,
					this,
				]);
			}
			index++;
		}
		return accumulator;
	}

	reduceRight(
		callbackfn: (
			previousValue: [K, V],
			currentEntry: [K, V],
			currentIndex: number,
			dict: OrderedDict<K, V>,
		) => [K, V],
	): [K, V];
	reduceRight(
		callbackfn: (
			previousValue: [K, V],
			currentEntry: [K, V],
			currentIndex: number,
			dict: OrderedDict<K, V>,
		) => [K, V],
		initialValue: [K, V],
	): [K, V];
	reduceRight<U>(
		callbackfn: (
			previousValue: [K, V],
			currentValue: U,
			currentIndex: number,
			dict: OrderedDict<K, V>,
		) => U,
		initialValue: U,
	): U;

	reduceRight<U>(
		...args: [
			(
				previousValue: U,
				currentEntry: [K, V],
				currentIndex: number,
				dict: OrderedDict<K, V>,
			) => U,
			U?,
		]
	) {
		const [callbackfn, initialValue] = args;
		let accumulator = initialValue ?? this.at(-1)!;
		for (let index = this.size - 1; index >= 0; index--) {
			const entry = this.at(index)!;
			if (index === this.size - 1 && args.length === 1) {
				accumulator = entry as any;
			} else {
				accumulator = Reflect.apply(callbackfn, this, [
					accumulator,
					entry,
					index,
					this,
				]);
			}
		}
		return accumulator;
	}

	toSorted(compareFn?: (a: [K, V], b: [K, V]) => number): OrderedDict<K, V> {
		const entries = [...this.entries()].sort(compareFn);
		return new OrderedDict(entries);
	}

	toReversed(): OrderedDict<K, V> {
		const entries = [...this.entries()].reverse();
		return new OrderedDict(entries);
	}

	toSpliced(start: number, deleteCount?: number): OrderedDict<K, V>;
	toSpliced(
		start: number,
		deleteCount: number,
		...items: [K, V][]
	): OrderedDict<K, V>;

	toSpliced(...args: [start: number, deleteCount: number, ...items: [K, V][]]) {
		const entries = [...this.entries()];
		entries.splice(...args);
		return new OrderedDict(entries);
	}

	slice(start?: number, end?: number) {
		const result = new OrderedDict<K, V>();
		let stop = this.size - 1;

		if (start === undefined) {
			return result;
		}

		if (start < 0) {
			start = start + this.size;
		}

		if (end !== undefined && end > 0) {
			stop = end - 1;
		}

		for (let index = start; index <= stop; index++) {
			const key = this.keyAt(index)!;
			const element = this.get(key)!;
			result.set(key, element);
		}
		return result;
	}

	every(
		predicate: (
			entry: [K, V],
			index: number,
			dict: OrderedDict<K, V>,
		) => unknown,
		thisArg?: any,
	) {
		let index = 0;
		for (const entry of this) {
			if (!Reflect.apply(predicate, thisArg, [entry, index, this])) {
				return false;
			}
			index++;
		}
		return true;
	}

	some(
		predicate: (
			entry: [K, V],
			index: number,
			dict: OrderedDict<K, V>,
		) => unknown,
		thisArg?: any,
	) {
		let index = 0;
		for (const entry of this) {
			if (Reflect.apply(predicate, thisArg, [entry, index, this])) {
				return true;
			}
			index++;
		}
		return false;
	}
}

function at<T>(array: ArrayLike<T>, index: number): T | undefined {
	if ("at" in Array.prototype) {
		return Array.prototype.at.call(array, index);
	}
	const actualIndex = toSafeIndex(array, index);
	return actualIndex === -1 ? undefined : array[actualIndex];
}

function toSafeIndex(array: ArrayLike<any>, index: number) {
	const length = array.length;
	const relativeIndex = toSafeInteger(index);
	const actualIndex =
		relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
	return actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
}

function toSafeInteger(number: number) {
	// eslint-disable-next-line no-self-compare
	return number !== number || number === 0 ? 0 : Math.trunc(number);
}

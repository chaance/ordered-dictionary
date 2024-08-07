import { describe, expect, test } from "vitest";
import { OrderedDict } from "./ordered-dictionary.ts";
import * as OrderedDictUtils from "./utils.ts";

describe("OrderedDict utils", () => {
	test("some", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		const result = OrderedDictUtils.some(dict, ([key]) => key === "b");
		expect(result).toBe(true);

		const result2 = OrderedDictUtils.some(dict, ([key]) => key === "d");
		expect(result2).toBe(false);

		const result3 = OrderedDictUtils.some(dict, ([, value]) => value === 3);
		expect(result3).toBe(true);

		const result4 = OrderedDictUtils.some(dict, ([, value]) => value === 4);
		expect(result4).toBe(false);
	});

	test("every", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		const result = OrderedDictUtils.every(dict, ([key]) => key.length === 1);
		expect(result).toBe(true);

		const result2 = OrderedDictUtils.every(dict, ([key]) => key === "a");
		expect(result2).toBe(false);

		const result3 = OrderedDictUtils.every(dict, ([, value]) => value > 0);
		expect(result3).toBe(true);

		const result4 = OrderedDictUtils.every(dict, ([, value]) => value > 1);
		expect(result4).toBe(false);
	});
});

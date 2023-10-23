import { describe, expect, test } from "vitest";
import { OrderedDict } from "./ordered-dictionary";

describe("OrderedDict", () => {
	test("size", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		expect(dict.size).toBe(3);
		dict.delete("b");
		expect(dict.size).toBe(2);
		dict.set("d", 4);
		expect(dict.size).toBe(3);
		dict.clear();
		expect(dict.size).toBe(0);
	});

	test("get()", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		expect(dict.get("a")).toBe(1);
		expect(dict.get("b")).toBe(2);
		expect(dict.get("d")).toBeUndefined();
	});

	test("set()", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		dict.set("b", 4);
		expect(dict.get("b")).toBe(4);
		dict.set("d", 5);
		expect(dict.get("d")).toBe(5);
	});

	test("insert(): existing key at its current index", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		dict.insert(1, "b", 4);
		expect(dict.get("b")).toBe(4);
	});

	test("insert(): existing key at a new index", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		dict.insert(0, "b", 1);
		// sets the correct value
		expect(dict.get("b")).toBe(1);

		// moves to the inserted index
		expect(dict.at(0)).toBe(1);
		expect(dict.keyAt(0)).toBe("b");

		// previous item at the inserted index is moved up by one
		expect(dict.keyAt(1)).toBe("a");
		expect(dict.get("a")).toBe(1);
	});

	test("insert(): existing key at out-of-range index", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		dict.insert(20, "d", 4);
		expect(dict.keyAt(3)).toBe("d");
		expect(dict.at(3)).toBe(4);
	});

	test("insert(): existing key at 0 index", () => {
		let dict = new OrderedDict([
			["a", 0],
			["b", 2],
			["c", 3],
			["e", 5],
		]);
		dict.insert(0, "a", 1);
		expect(dict.keyAt(0)).toBe("a");
		expect(dict.at(0)).toBe(1);
		expect(dict.keyAt(1)).toBe("b");
		expect(dict.at(1)).toBe(2);
		expect(dict.size).toBe(4);
	});

	test("insert(): new key at 0 index", () => {
		let dict = new OrderedDict([
			["b", 2],
			["c", 3],
			["e", 5],
		]);
		dict.insert(0, "a", 1);
		expect(dict.keyAt(0)).toBe("a");
		expect(dict.at(0)).toBe(1);
		expect(dict.keyAt(1)).toBe("b");
		expect(dict.at(1)).toBe(2);
		expect(dict.size).toBe(4);
	});

	test("insert(): existing key at relative negative index", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
			["e", 5],
			["f", 4],
		]);
		dict.insert(-1, "f", 6);
		expect(dict.keyAt(-1)).toBe("f");
		expect(dict.at(-1)).toBe(6);
		expect(dict.size).toBe(5);
	});

	test("insert(): new key at relative negative index", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
			["e", 5],
		]);
		dict.insert(-1, "f", 6);
		expect(dict.keyAt(-1)).toBe("f");
		expect(dict.at(0)).toBe(1);
		expect(dict.at(-1)).toBe(6);

		dict.insert(-3, "d", 4);
		expect(dict.keyAt(3)).toBe("d");
		expect(dict.at(3)).toBe(4);
	});

	test("insert(): existing key at a new index", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		dict.insert(0, "b", 1);
		expect(dict.get("b")).toBe(1);
		expect(dict.at(0)).toBe(1);
		expect(dict.keyAt(0)).toBe("b");
	});

	test("insert(): adds item to existing object", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		const next = dict.insert(0, "b", 1);
		expect(next).toBe(dict);
	});

	test("with(): returns a new reference", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		const next = dict.with(0, "b", 1);
		expect(next).not.toBe(dict);
	});

	test("with(): does not update copied object", () => {
		let dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
		]);
		dict.with(0, "b", 1);
		expect(dict.get("b")).toBe(2);
		expect(dict.keyAt(1)).toBe("b");
	});

	test("first()", () => {
		expect(
			new OrderedDict([
				["a", 1],
				["b", 2],
				["c", 3],
				["d", 4],
			]).first(),
		).toEqual(["a", 1]);
		expect(new OrderedDict().first()).toBeUndefined();
	});

	test("last()", () => {
		expect(
			new OrderedDict([
				["a", 1],
				["b", 2],
				["c", 3],
				["d", 4],
			]).last(),
		).toEqual(["d", 4]);
		expect(new OrderedDict().last()).toBeUndefined();
	});

	test("before()", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
			["d", 4],
		]);
		expect(dict.before("b")).toEqual(["a", 1]);
		expect(dict.before("a")).toBeUndefined();
	});

	test("after()", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
			["d", 4],
		]);
		expect(dict.after("b")).toEqual(["c", 3]);
		expect(dict.after("d")).toBeUndefined();
	});

	test("clear()", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
		]);
		dict.clear();
		expect(dict.size).toBe(0);
		expect(dict.get("a")).toBeUndefined();
		expect(dict.get("b")).toBeUndefined();
		expect(dict.at(0)).toBeUndefined();
	});

	test("delete(): existing key", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
		]);
		const status = dict.delete("a");
		expect(status).toBe(true);
		expect(dict.size).toBe(1);
		expect(dict.get("a")).toBeUndefined();
		expect(dict.at(0)).toBe(2);
	});

	test("delete(): non-existing key", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
		]);
		const status = dict.delete("c");
		expect(status).toBe(false);
		expect(dict.size).toBe(2);
		expect(dict.at(0)).toBe(1);
	});

	test("deleteAt(): standard indices", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
			["d", 4],
		]);
		const status = dict.deleteAt(0);
		expect(status).toBe(true);
		expect(dict.size).toBe(3);
		expect(dict.get("a")).toBeUndefined();

		dict.deleteAt(1);
		expect(dict.size).toBe(2);
		expect(dict.get("c")).toBeUndefined();
	});

	test("deleteAt(): negative indices", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
			["d", 4],
		]);
		const status = dict.deleteAt(-1);
		expect(status).toBe(true);
		expect(dict.size).toBe(3);
		expect(dict.get("d")).toBeUndefined();

		dict.deleteAt(-2);
		expect(dict.size).toBe(2);
		expect(dict.get("b")).toBeUndefined();
	});

	test("deleteAt(): out-of-range indices", () => {
		const dict = new OrderedDict([
			["a", 1],
			["b", 2],
			["c", 3],
			["d", 4],
		]);
		let status = dict.deleteAt(20);
		expect(status).toBe(false);
		expect(dict.size).toBe(4);
		status = dict.deleteAt(-20);
		expect(status).toBe(false);
		expect(dict.size).toBe(4);
	});
});

<h1 align="center"><code>ordered-dictionary</code></h1>

> NOTE: This is very much a WIP. Some heuristics I'm still not 100% sure of, and
> there certainly optimizations to be made. Contributions welcome!

A class for creating ordered dictionary data structures in JavaScript.

An ordered dictionary is essentially a `Map`: a collection of key-value pairs
that maintains a stable and guaranteed insertion order. But sometimes you may
need to access the value of a `Map` based on its position in the map (like
accessing an array value by its index). You also may need to add or remove items
at a given position rather than by key.

Enter the `OrderedDict` class.

```ts
import { OrderedDict } from "ordered-dictionary";

const dictionary = OrderedDict([
	["a", 1],
	["b", 2],
	["d", 4],
]);
// OrderedDict(3) {'a' => 1, 'b' => 2, 'd' => 4}

// inherits methods and properties from Map
assert(dictionary.get("a") === 1);
dictionary.set("e", 5);
assert(dictionary.get("e") === 5);
dictionary.entries();
// MapIterator {"a" => 1, "b" => 2, "d" => 4, "e" => 5}

// access values by index
assert(dictionary.at(0) === 1);
assert(dictionary.at(1) === 2);
assert(dictionary.at(-1) === 5);

// insert items by index
dictionary.insert(2, "c", 3);
assert(dictionary.at(2) === 3);

// remove items by index
dictionary.deleteAt(0);
assert(dictionary.at(0) === 2);
dictionary.deleteAt(-1);
assert(dictionary.at(-1) === 4);
```

Full documentation coming soon.

## Prior art

- [`OrderedDictionary` in C#](https://learn.microsoft.com/en-us/dotnet/api/system.collections.specialized.ordereddictionary?view=net-7.0)
- [`OrderedDictionary` in Swift](https://github.com/apple/swift-collections/blob/main/Documentation/OrderedDictionary.md)
- [`ordered-dict` by Forbes Lindesay](https://github.com/ForbesLindesay/ordered-dict/tree/master)

## Contributing

PRs welcome! Any help on algorithmic optimization would be greatly appreciated,
as this is not at all my area of expertise.

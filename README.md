<h1 align="center"><code>ordered-dictionary</code></h1>

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

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [tsup](https://tsup.egoist.dev/)
- [Vitest](https://vitest.dev/)

## Getting Started

Author your package in `src/`. By default, the entrypoint is `src/index.ts`. Multiple entrypoints can be configured in `tsup.config.ts`.

Build your package with `npm run build`. This will output the compiled package to `dist/` and ... you're done! Your package is ready to publish. Kick back and enjoy your new OSS package.

## Bundling

Vite is installed because it is a peer dependency of Vitest. I still use `tsup` for bundling by default, as it has a simpler interface. While Vite is a great bundler, it is only really useful for browser packages where you might want a testing page for development.

Vite and tsup are both powered by esbuild and Rollup under the hood, so a) the added dependency overhead is minimal, and b) switching should be relatively simple and result in similar output if you want Vite's features.

In the future I may turn this project into a CLI script that allows you to choose Vite for browser packages.

## Contributing

PRs welcome!

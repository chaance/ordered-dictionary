import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// use to 'jsdom' or 'happy-dom' if building a browser package
		// https://vitest.dev/config/#environment
		environment: "node",
	},
});

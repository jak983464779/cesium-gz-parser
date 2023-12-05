import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	splitting: false,
	clean: true,
	dts: {
		entry: ["src/index.ts"],
		// resolve: ['localforage']
	},
	platform: "browser",
	// 自动生成 shims
	// 为 cjs 生成 import.meta.url shims
	// 为 esm 生成 __dirname 和 __filename
	shims: true,
	minify: true,
	treeshake: true,
	sourcemap: false,
	// 为 esm 文件补充文件头 浏览器环境不可用
	// banner: ({ format }) => {
	// 	if (format === "esm") {
	// 		return {
	// 			js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import\.meta.url);`,
	// 		};
	// 	}
	// },
	// 为 cjs 文件补充文件尾
	footer: ({ format }) => {
		if (format === "cjs") {
			return {
				js: `if (module.exports.default) module.exports = module.exports.default;`,
			};
		}
	},
});

import path from "path";
import { rollup } from "rollup";
import rollupPluginPostcss from "rollup-plugin-postcss";
import rollupPluginSvelte from "rollup-plugin-svelte";
import rollupPluginCommonJS from "@rollup/plugin-commonjs";
import rollupPluginResolve from "@rollup/plugin-node-resolve";
import { terser as rollupPluginTerser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import cli from "../cli";

export default () => {
  cli
    .command("build")
    .describe("Create the server/worker production build")
    .action(async () => {
      // await rollup({
      //   input: fn,
      //   output: {
      //     format: "esm",
      //     sourcemap: true,
      //   },
      //   plugins: [
      //     rollupPluginSvelte({
      //       emitCss: true,
      //       preprocess: sveltePreprocess({
      //         postcss: true,
      //       }),
      //       compilerOptions: {
      //         css: false,
      //         filename: path.basename(fn),
      //         format: "esm",
      //         generate: "ssr",
      //         hydratable: true,
      //       },
      //     }),
      //     rollupPluginPostcss({
      //       extract: path.basename(fn).replace(".svelte", ".css"),
      //       modules: true,
      //     }),
      //     rollupPluginResolve({
      //       browser: true,
      //       dedupe: ["svelte"],
      //     }),
      //     rollupPluginCommonJS(),
      //     rollupPluginTerser(),
      //   ],
      //   onwarn: (warning) => {
      //     if (warning.code === "THIS_IS_UNDEFINED") return;
      //     console.warn(warning);
      //   },
      // });
      // await bundle.write({
      //   dir: "dist",
      // });
    });
};

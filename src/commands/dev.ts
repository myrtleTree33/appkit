import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import cli from "../cli";

export default () => {
  cli
    .command("dev")
    .describe("Start the server/worker in development mode")
    .action(async () => {
      // await esbuild.build({
      //   entryPoints: [],
      //   bundle: true,
      //   incremental: true,
      //   outdir: `${process.cwd()}/dist`,
      //   plugins: [
      //     esbuildSvelte({
      //       preprocess: sveltePreprocess({
      //         postcss: true,
      //       }),
      //       compileOptions: {
      //         css: false,
      //         format: "esm",
      //         generate: "ssr",
      //         hydratable: true,
      //       },
      //     }),
      //   ],
      // });
    });
};

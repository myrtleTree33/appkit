import { basename, dirname } from "path";
import tinyGlob from "tiny-glob";
import { fileURLToPath } from "url";
import { config, logger } from "..";

export async function loadAppCommands(): Promise<void> {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const builtinFiles = await tinyGlob(`${__dirname}/**/*.{js}`, {
      absolute: true,
      filesOnly: true,
    });

    const NON_PROD_CMDS = ["build", "db-migrate-new", "gen-secret", "lint-staged", "lint", "start", "test-unit"];

    for (const f of builtinFiles) {
      if (
        (config.nodeEnv === "production" && NON_PROD_CMDS.indexOf(basename(f.replace(/\.(js|ts)/, ""))) > -1) ||
        f.endsWith("cmd.js") ||
        f.endsWith("index.js")
      )
        continue;

      await import(f);
    }

    const appFiles = await tinyGlob(
      `${process.cwd()}/${config.entryRoot}/commands/**/*.${config.nodeEnv === "development" ? "ts" : "js"}`,
      {
        absolute: true,
        filesOnly: true,
      }
    );

    for (const f of appFiles) {
      await import(f);
    }
  } catch (err) {
    logger.warn(err.message);
  }
}

export { getCmd } from "./cmd";
export type { Cmd } from "./cmd";

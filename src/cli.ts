import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import sade from "sade";
import { fileURLToPath } from "url";
import { default as dev } from "./commands/dev";
import { default as build } from "./commands/build";

export interface Cli extends sade.Sade {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf-8"));
const cli = sade("appkit").version(pkg.version);
export default cli;

// Attach all the commands.
dev();
build();

// Attach all the commands from the app dynamically.
const cmdPath = `${process.cwd()}/dist/commands`;
if (existsSync(cmdPath)) {
  readdirSync(cmdPath).forEach(async (f) => {
    if (f.endsWith(".js")) {
      const mod = (await import(`${cmdPath}/${f}`)).default;
      if (mod) {
        await mod(cli);
      }
    }
  });
}

// TODO: Find a better way to synchronouly load the commands from the app.
setTimeout(() => cli.parse(process.argv), 100);

export type { Cmd } from "./cmd";
export type { DB } from "./core";

export { default as cmd } from "./cmd";
export { config, logger } from "./core";

import { default as cmd, loadAppCommands } from "./cmd";

export async function bootstrap(): Promise<void> {
  await loadAppCommands();

  cmd.parse(process.argv);
}

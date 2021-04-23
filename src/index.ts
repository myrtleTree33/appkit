export type { Cmd } from "./cmd";
export type { DB, Logger } from "./core";

export { cmd } from "./cmd";
export { db, config, logger } from "./core";

import { cmd, loadAppCommands } from "./cmd";

export async function bootstrap(): Promise<void> {
  await loadAppCommands();
  cmd.parse(process.argv);
}

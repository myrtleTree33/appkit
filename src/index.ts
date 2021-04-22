export type { Cmd } from "./cmd";
export type { DB, DBConfig } from "./record";

export * as cmd from "./cmd";
export * as record from "./record";
export * as pack from "./pack";
export * as support from "./support";

import { default as cmd, loadAppCommands } from "./cmd";

export async function bootstrap(): Promise<void> {
  await loadAppCommands();

  cmd.parse(process.argv);
}

export type { DB } from "./core/db";
export type { Logger } from "./core/logger";
export type { HttpRequest, HttpResponse, Server } from "./core/server";

export { config, db, logger } from "./globals";

import { getCmd, loadAppCommands } from "./cmd";
export type { Cmd } from "./cmd";
export const cmd = getCmd();

export async function bootstrap(): Promise<void> {
  await loadAppCommands();
  cmd.parse(process.argv);
}

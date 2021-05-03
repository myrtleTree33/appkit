import { getConfig } from "./core/config";
export const config = getConfig();

import { getLogger } from "./core/logger";
export type { Logger } from "./core/logger";
export const logger = getLogger();

import { getDB } from "./core/db";
export type { DB } from "./core/db";
export const db = getDB();

export type { HttpRequest, HttpResponse, Server } from "./core/http/server";

import { getCmd, loadAppCommands } from "./cmd";
export type { Cmd } from "./cmd";
export const cmd = getCmd();

export async function bootstrap(): Promise<void> {
  await loadAppCommands();
  cmd.parse(process.argv);
}

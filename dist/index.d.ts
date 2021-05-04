/// <reference types="sade" />
export type { DB } from "./core/db";
export type { Logger } from "./core/logger";
export type { HttpRequest, HttpResponse, Server } from "./core/server";
export { config, db, logger } from "./globals";
export type { Cmd } from "./cmd";
export declare const cmd: import("sade").Sade;
export declare function bootstrap(): Promise<void>;

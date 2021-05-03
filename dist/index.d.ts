/// <reference types="pino" />
/// <reference types="sade" />
export declare const config: import("./core/config").Config;
export type { Logger } from "./core/logger";
export declare const logger: import("pino").Logger;
export type { DB } from "./core/db";
export declare const db: import("./core/db").DB;
export type { HttpRequest, HttpResponse, Server } from "./core/http/server";
export type { Cmd } from "./cmd";
export declare const cmd: import("sade").Sade;
export declare function bootstrap(): Promise<void>;

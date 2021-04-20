export { default as config } from "./config";
export { default as logger } from "./logger";
import { default as cli } from "./cli";
import type { Cli } from "./cli";
export { cli };
export type { Cli };
export declare function initApp(cli: Cli): void;
export { default as db, config as dbConfig } from "./db";

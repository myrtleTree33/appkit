export type { Cmd } from "./cmd";
export type { DB, Logger } from "./core";
export { cmd } from "./cmd";
export { db, config, logger } from "./core";
export declare function bootstrap(): Promise<void>;

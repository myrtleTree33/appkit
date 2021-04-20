export { default as config } from "./config";
export { default as logger } from "./logger";
export { default as server } from "./server";

import { default as cli } from "./cli";
import type { Cli } from "./cli";
import { default as dbMigrate } from "./commands/db-migrate";
import { default as dbMigrateNew } from "./commands/db-migrate-new";
import { default as dbMigrateStatus } from "./commands/db-migrate-status";
import { default as dbRollback } from "./commands/db-rollback";
import { default as dbSeed } from "./commands/db-seed";
import { default as down } from "./commands/down";
import { default as up } from "./commands/up";
import { default as dev } from "./commands/dev";
import { default as server } from "./commands/server";
import { default as worker } from "./commands/worker";

dbMigrate(cli);
dbMigrateNew(cli);
dbMigrateStatus(cli);
dbRollback(cli);
dbSeed(cli);
down(cli);
up(cli);
dev(cli);
server(cli);
worker(cli);

export { cli };
export type { Cli };

export function initApp(cli: Cli) {
  cli.parse(process.argv);
}

export { default as db, config as dbConfig } from "./db";

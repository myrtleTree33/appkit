export { default as config } from "./config";
export { default as logger } from "./logger";

import { default as cli, Cli } from "./cli";
import { default as dbMigrate } from "./commands/db-migrate";
import { default as dbMigrateNew } from "./commands/db-migrate-new";
import { default as dbMigrateStatus } from "./commands/db-migrate-status";
import { default as dbRollback } from "./commands/db-rollback";
import { default as dcDown } from "./commands/dc-down";
import { default as dcUp } from "./commands/dc-up";
import { default as dev } from "./commands/dev";
import { default as server } from "./commands/server";
import { default as worker } from "./commands/worker";

dbMigrate(cli);
dbMigrateNew(cli);
dbMigrateStatus(cli);
dbRollback(cli);
dcDown(cli);
dcUp(cli);
dev(cli);
server(cli);
worker(cli);

export { cli, Cli };

export function initApp(cli: Cli) {
  cli.parse(process.argv);
}

export { default as db, config as dbConfig } from "./db";

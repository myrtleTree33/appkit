export { default as config } from "./config";
export { default as logger } from "./logger";

import { default as cli, Cli } from "./cli";
import { default as dbMigrateNew } from "./commands/dbMigrateNew";
import { default as dev } from "./commands/dev";
import { default as server } from "./commands/server";
import { default as worker } from "./commands/worker";

dbMigrateNew(cli);
dev(cli);
server(cli);
worker(cli);

export { cli, Cli };

export function initApp(cli: Cli) {
  cli.parse(process.argv);
}

export { default as db } from "./db";

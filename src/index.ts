export { default as config } from "./config";
export { default as logger } from "./logger";

import { default as cli, Cli } from "./cli";
import { default as dbMigrateNew } from "./commands/dbMigrateNew";
import { default as dev } from "./commands/dev";

dbMigrateNew(cli);
dev(cli);

export { cli, Cli };

export function initApp(cli: Cli) {
  cli.parse(process.argv);
}

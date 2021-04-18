import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli
    .command("db:migrate:status", "Show the list of completed and pending migrations.")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (opts) => {
      try {
        const migrations = await db[opts.target]?.migrate.list();

        if (migrations[0] && migrations[0].length > 0) {
          console.log("\nMigrated");
          console.log("========");
          migrations[0].forEach((m: string) => {
            console.log(`${m}\n`);
          });
        }

        if (migrations[1] && migrations[1].length > 0) {
          console.log("Pending");
          console.log("=======");
          migrations[1].forEach((m: { [key: string]: string }) => {
            console.log(`${m.file}\n`);
          });
          console.log();
        }
      } catch (err) {
        logger.error(err);
        process.exit(1);
      } finally {
        db[opts.target]?.destroy();
      }
    });
};

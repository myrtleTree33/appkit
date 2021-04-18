import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli
    .command("db:migrate", "Run all the pending database migrations.")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (opts) => {
      try {
        logger.info("Started running the pending database migrations...");
        await db[opts.target]?.migrate.latest();
        logger.info("Started running the pending database migrations... SUCCESS");
      } catch (err) {
        logger.error(err);
        process.exit(1);
      } finally {
        db[opts.target]?.destroy();
      }
    });
};

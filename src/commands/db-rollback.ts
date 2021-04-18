import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";

export default (cli: Cli): void => {
  cli
    .command("db:rollback", "Rollback the database schema to previous version.")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (opts) => {
      try {
        logger.info("Started rolling back the database schema to previous version...");
        await db[opts.target]?.migrate.rollback();
        logger.info("Started rolling back the database schema to previous version... SUCCESS");
      } catch (err) {
        logger.error(err);
        process.exit(1);
      } finally {
        db[opts.target]?.destroy();
      }
    });
};

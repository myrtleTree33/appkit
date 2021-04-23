import { db, logger } from "../core";
import { default as cmd } from "./cmd";

cmd
  .command("db:rollback", "Rollback the database schema to previous version.")
  .option("-t, --target", "The target database to work with.", "primary")
  .action(async (opts) => {
    try {
      if (!db[opts.target]) {
        throw new Error(`The '${opts.target}' database doesn't exist.`);
      }

      logger.info(
        `Started rolling back the '${opts.target}' database schema to previous version...`
      );
      await db[opts.target]?.migrate.rollback();
      logger.info(
        `Started rolling back the '${opts.target}' database schema to previous version... SUCCESS`
      );
    } catch (err) {
      logger.error(err);
      process.exit(1);
    } finally {
      db[opts.target]?.destroy();
    }
  });

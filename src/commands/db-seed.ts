import knex from "knex";
import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";
import { default as Seeder } from "../utils/db-seeder";

export default (cli: Cli): void => {
  cli
    .command("db:seed", "Seed the database with minimal data to start the local development work.")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (opts) => {
      try {
        if (!db[opts.target]) {
          throw new Error(`The '${opts.target}' database doesn't exist.`);
        }

        logger.info("Started seeding the database......");
        const seeder = new Seeder(db[opts.target] || knex({}));
        await seeder.run();
        logger.info("Started seeding the database...... SUCCESS");
      } catch (err) {
        logger.error(err);
        process.exit(1);
      } finally {
        db[opts.target]?.destroy();
      }
    });
};

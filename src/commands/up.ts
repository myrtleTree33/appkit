import dockerCompose from "docker-compose";
import knex from "knex";
import db from "../db";
import logger from "../logger";
import { Cli } from "../cli";
import { default as Seeder } from "../utils/db-seeder";

async function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export default (cli: Cli): void => {
  cli
    .command("up", "Setup the `docker-compose` cluster with the databases migrated/seeded.")
    .action(async () => {
      await dockerCompose.upAll({ cwd: process.cwd(), log: true });

      try {
        for (let dbName in db) {
          // TODO: Find a better way to ping the database readiness.
          logger.info(`Wait 30s for '${dbName}' database to be ready...`);
          await sleep(15000);

          logger.info(`Started migrating the '${dbName}' database...`);
          await db[dbName]?.migrate.latest();
          logger.info(`Started migrating the '${dbName}' database... SUCCESS`);

          logger.info(`Started seeding the '${dbName}' database...`);
          const seeder = new Seeder(db[dbName] || knex({}));
          await seeder.run();
          logger.info(`Started seeding the '${dbName}' database... SUCCESS`);
        }
      } catch (err) {
        logger.error(err);
        process.exit(1);
      } finally {
        for (let dbName in db) {
          await db[dbName]?.destroy();
        }
      }
    });
};

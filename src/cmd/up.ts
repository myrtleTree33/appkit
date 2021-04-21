import dockerCompose from "docker-compose";

import { db } from "../db";
import { logger } from "../support";
import type { Cmd } from "./cmd";

async function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export default (cmd: Cmd): void => {
  cmd
    .command("up", "Setup the `docker-compose` cluster with the databases migrated/seeded.")
    .action(async () => {
      await dockerCompose.upAll({ cwd: process.cwd(), log: true });

      try {
        for (let dbName in db) {
          const timeout = 30;
          // TODO: Find a better way to ping the database readiness.
          logger.info(`Wait ${timeout}s for '${dbName}' database to be ready...`);
          await sleep(timeout * 1000);

          logger.info(`Started migrating the '${dbName}' database...`);
          await db[dbName]?.migrate.latest();
          logger.info(`Started migrating the '${dbName}' database... SUCCESS`);

          logger.info(`Started seeding the '${dbName}' database...`);
          await db[dbName]?.seed.run();
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

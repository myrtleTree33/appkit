import { execSync } from "child_process";
import { cmd, db, logger } from "..";

async function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

cmd
  .command(
    "setup",
    "Setup the `docker-compose` cluster with the migrated/seeded databases. (only for NODE_ENV=development)"
  )
  .action(async () => {
    execSync("docker compose up -d", { stdio: "inherit" });

    try {
      for (const dbName in db) {
        if (!db[dbName]) continue;

        const timeout = 3;
        const dbReady = false;

        while (!dbReady) {
          try {
            const result = await db[dbName]?.raw("select 1+1 as result");

            if (result) break;
            logger.info(`Wait ${timeout}s for '${dbName}' database to be ready...`);
            await sleep(timeout * 1000);
          } catch (err) {
            logger.info(`Wait ${timeout}s for '${dbName}' database to be ready...`);
            await sleep(timeout * 1000);
          }
        }

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
      for (const dbName in db) {
        await db[dbName]?.destroy();
      }
    }
  });

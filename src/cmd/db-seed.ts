import { db } from "../record";
import { logger } from "../support";

import type { Cmd } from "./cmd";

export default (cmd: Cmd): void => {
  cmd
    .command("db:seed", "Seed the database with minimal data to start the local development work.")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (opts) => {
      try {
        if (!db[opts.target]) {
          throw new Error(`The '${opts.target}' database doesn't exist.`);
        }

        logger.info("Started seeding the database......");
        await db[opts.target]?.seed.run();
        logger.info("Started seeding the database...... SUCCESS");
      } catch (err) {
        logger.error(err);
        process.exit(1);
      } finally {
        db[opts.target]?.destroy();
      }
    });
};

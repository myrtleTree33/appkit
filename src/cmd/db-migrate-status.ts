import { db } from "../db";
import { logger } from "../support";
import type { Cmd } from "./cmd";

export default (cmd: Cmd): void => {
  cmd
    .command("db:migrate:status", "Show the list of completed and pending migrations.")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (opts) => {
      try {
        if (!db[opts.target]) {
          throw new Error(`The '${opts.target}' database doesn't exist.`);
        }

        let message = "";
        const migrations = await db[opts.target]?.migrate.list();

        if (migrations[0] && migrations[0].length > 0) {
          message += "\nMigrated\n";
          message += "========\n";

          migrations[0].forEach((m: string) => {
            message += `${m}\n`;
          });
        }

        if (migrations[1] && migrations[1].length > 0) {
          message += "\nPending\n";
          message += "=======\n";

          migrations[1].forEach((m: { [key: string]: string }) => {
            message += `${m.file}\n`;
          });
        }

        console.log(message);
      } catch (err) {
        logger.error(err);
        process.exit(1);
      } finally {
        db[opts.target]?.destroy();
      }
    });
};
